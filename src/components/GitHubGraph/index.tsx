/**
 * GitHub Contribution Calendar Graph
 *
 * Uses the free github-contributions-api.jogruber.de API — no auth required,
 * no CORS proxy needed. Supports `y=last` (past 12 months) or `y=all` (all years).
 *
 * Layout: 53 columns × 7 rows — identical to native GitHub UI.
 */

import {
  useEffect,
  useState,
  useCallback,
  memo,
  useRef,
  type FC,
} from "react";
import { motion } from "motion/react";
import { FiRefreshCw } from "react-icons/fi";

const GITHUB_USERNAME = "gokul-369";
const API_BASE = "https://github-contributions-api.jogruber.de/v4";

type Level = 0 | 1 | 2 | 3 | 4;

type ContribDay = {
  date: string;   // "2026-11-25"
  count: number;
  level: Level;
};

type APIResponse = {
  total: Record<string, number>;
  contributions: ContribDay[];
};

// ─── Colour palettes matching GitHub exactly ───────────────────────────────
const DARK_PALETTE: Record<Level, string> = {
  0: "#161b22",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
};
const LIGHT_PALETTE: Record<Level, string> = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39",
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS  = ["Mon","","Wed","","Fri","",""];

/** Pad/slice into exactly 53 × 7 starting on Monday */
function buildWeeks(days: ContribDay[]): ContribDay[][] {
  // Sort ascending
  const sorted = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  // Pad front so week starts on Monday (day 1)
  const first = sorted[0] ? new Date(sorted[0].date) : new Date();
  const dow = first.getDay(); // 0=Sun
  const padBefore = (dow === 0 ? 6 : dow - 1); // Monday = 0 offset
  const padded: ContribDay[] = [
    ...Array.from({ length: padBefore }, (_, i) => {
      const d = new Date(first);
      d.setDate(d.getDate() - padBefore + i);
      return { date: d.toISOString().slice(0, 10), count: 0, level: 0 as Level };
    }),
    ...sorted,
  ];
  // Chunk into weeks of 7
  const weeks: ContribDay[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks.slice(-53); // last 53 weeks
}

/** Compute month label positions from weeks */
function monthLabels(weeks: ContribDay[][]): { label: string; col: number }[] {
  const seen = new Set<string>();
  const result: { label: string; col: number }[] = [];
  weeks.forEach((week, col) => {
    week.forEach((day) => {
      if (!day.date) return;
      const m = new Date(day.date + "T00:00:00").getMonth();
      const lbl = MONTH_NAMES[m];
      if (!seen.has(lbl)) {
        seen.add(lbl);
        result.push({ label: lbl, col });
      }
    });
  });
  return result;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────
const Skeleton: FC<{ isDark: boolean }> = ({ isDark }) => (
  <div className="w-full overflow-x-auto">
    <div className="flex gap-[3px]">
      {Array.from({ length: 53 }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }).map((_, d) => (
            <div
              key={d}
              className="w-[11px] h-[11px] rounded-sm animate-pulse"
              style={{ backgroundColor: isDark ? "#21262d" : "#e1e4e8" }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── Tooltip ──────────────────────────────────────────────────────────────
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  count: number;
  date: string;
}

// ─── Main Component ───────────────────────────────────────────────────────
interface GitHubGraphProps {
  isDark?: boolean;
  className?: string;
}

const GitHubGraph: FC<GitHubGraphProps> = ({ isDark = true, className = "" }) => {
  const [weeks, setWeeks] = useState<ContribDay[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalThisYear, setTotalThisYear] = useState(0);
  const [totalAllTime, setTotalAllTime] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, count: 0, date: "",
  });
  const rootRef = useRef<HTMLDivElement>(null);

  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Fetch last-year data for the heatmap
      const [lastRes, allRes] = await Promise.all([
        fetch(`${API_BASE}/${GITHUB_USERNAME}?y=last`),
        fetch(`${API_BASE}/${GITHUB_USERNAME}?y=all`),
      ]);
      if (!lastRes.ok) throw new Error("API error");

      const lastData: APIResponse = await lastRes.json();
      const allData: APIResponse = allRes.ok ? await allRes.json() : lastData;

      setWeeks(buildWeeks(lastData.contributions));
      setTotalThisYear(lastData.total?.lastYear ?? 0);
      const grand = Object.values(allData.total ?? {}).reduce((s, v) => s + v, 0);
      setTotalAllTime(grand);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGraph(); }, [fetchGraph]);

  const months = weeks.length > 0 ? monthLabels(weeks) : [];

  const handleEnter = useCallback((e: React.MouseEvent, day: ContribDay) => {
    const root = rootRef.current;
    if (!root) return;
    const cellRect = (e.target as HTMLElement).getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: cellRect.left - rootRect.left + cellRect.width / 2,
      y: cellRect.top - rootRect.top - 10,
      count: day.count,
      date: day.date,
    });
  }, []);

  const handleLeave = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  return (
    <div ref={rootRef} className={`gh-graph-root relative w-full ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="font-space text-lg font-bold text-slate-900 dark:text-white leading-tight">
            Open Source Activity
          </h3>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            github.com/{GITHUB_USERNAME} · past 12 months
          </p>
        </div>

        {!loading && !error && (
          <div className="flex flex-wrap items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3.5 py-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {totalThisYear.toLocaleString()} this year
            </motion.div>
            {totalAllTime > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="px-3.5 py-1.5 rounded-2xl border border-sky-500/30 bg-sky-500/10 font-mono text-xs font-bold text-sky-600 dark:text-sky-400"
              >
                {totalAllTime.toLocaleString()} all time
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Graph area */}
      {loading ? (
        <Skeleton isDark={isDark} />
      ) : error ? (
        <div className="w-full py-10 flex flex-col items-center gap-3">
          <p className="font-mono text-sm text-slate-400">Could not load contribution data.</p>
          <button
            onClick={fetchGraph}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 hover:border-sky-400 hover:text-sky-500 font-mono text-xs transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-1">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex gap-[3px] mb-1 ml-7">
              {weeks.map((_, w) => {
                const hit = months.find((m) => m.col === w);
                return (
                  <div key={w} className="w-[11px] flex-shrink-0 relative">
                    {hit && (
                      <span className="absolute left-0 top-0 font-mono text-[9px] text-slate-400 dark:text-slate-500 leading-none whitespace-nowrap">
                        {hit.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Grid */}
            <div className="flex gap-0">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-[3px] mr-2">
                {DAY_LABELS.map((lbl, i) => (
                  <div key={i} className="h-[11px] flex items-center justify-end pr-1">
                    {lbl && (
                      <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 leading-none">
                        {lbl}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Heatmap cells */}
              <div className="flex gap-[3px]">
                {weeks.map((week, w) => (
                  <div key={w} className="flex flex-col gap-[3px]">
                    {week.map((day, d) => (
                      <motion.div
                        key={`${w}-${d}`}
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.25,
                          delay: (w * 7 + d) * 0.0005,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        onMouseEnter={(e) => handleEnter(e, day)}
                        onMouseLeave={handleLeave}
                        className="w-[11px] h-[11px] rounded-sm cursor-pointer transition-transform hover:scale-125 hover:z-10"
                        style={{
                          backgroundColor: palette[day.level] ?? palette[0],
                          transformOrigin: "center",
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-3 justify-end">
              <span className="font-mono text-[9px] text-slate-400 mr-0.5">Less</span>
              {([0, 1, 2, 3, 4] as Level[]).map((lvl) => (
                <div
                  key={lvl}
                  className="w-[11px] h-[11px] rounded-sm"
                  style={{ backgroundColor: palette[lvl] }}
                />
              ))}
              <span className="font-mono text-[9px] text-slate-400 ml-0.5">More</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white font-mono text-[11px] shadow-xl border border-white/10 whitespace-nowrap backdrop-blur-sm">
            {tooltip.count === 0
              ? "No contributions"
              : `${tooltip.count} contribution${tooltip.count > 1 ? "s" : ""}`}
            {tooltip.date && (
              <span className="text-slate-400 ml-1.5">
                {new Date(tooltip.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </span>
            )}
          </div>
          {/* Arrow */}
          <div className="w-2 h-2 bg-slate-900/95 dark:bg-slate-800/95 border-r border-b border-white/10 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
};

export default memo(GitHubGraph);
