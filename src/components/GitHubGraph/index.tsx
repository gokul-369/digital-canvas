/**
 * GitHub Contribution Calendar Graph
 *
 * Fetches the past 52 weeks of contribution data from GitHub's public
 * contribution graph (SVG scrape via a CORS proxy) and renders a pixel-perfect
 * activity heatmap that blends with the dark/light theme.
 *
 * Layout: 53 columns × 7 rows = 371 cells, identical to the native GitHub UI.
 */

import {
  useEffect,
  useState,
  useCallback,
  memo,
  type FC,
} from "react";
import { motion } from "motion/react";

const GITHUB_USERNAME = "gokul-369";
const WEEKS = 53;
const DAYS = 7;
const TOTAL_DAYS = WEEKS * DAYS;

type ContribDay = {
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0=none, 4=max
  date: string;
};

type WeekData = ContribDay[];

// ─── Colour palette matched to GitHub's exact contribution levels ─────────
const DARK_PALETTE = [
  "#161b22", // 0 – empty
  "#0e4429", // 1 – low
  "#006d32", // 2 – medium-low
  "#26a641", // 3 – medium-high
  "#39d353", // 4 – high
];
const LIGHT_PALETTE = [
  "#ebedf0", // 0 – empty
  "#9be9a8", // 1
  "#40c463", // 2
  "#30a14e", // 3
  "#216e39", // 4
];

// ─── Build a full 52-week matrix from the parsed cells ────────────────────
function buildWeeks(cells: ContribDay[]): WeekData[] {
  const weeks: WeekData[] = [];
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(cells.slice(w * DAYS, w * DAYS + DAYS));
  }
  return weeks;
}

// ─── Parse GitHub's SVG contribution graph ───────────────────────────────
function parseGithubSvg(svg: string): ContribDay[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const rects = doc.querySelectorAll("rect[data-date]");

  const cells: ContribDay[] = [];
  rects.forEach((rect) => {
    const date = rect.getAttribute("data-date") ?? "";
    const count = parseInt(rect.getAttribute("data-count") ?? "0", 10);
    const level = (parseInt(rect.getAttribute("data-level") ?? "0", 10) as ContribDay["level"]) ?? 0;
    cells.push({ date, count, level });
  });

  // Pad to TOTAL_DAYS if fewer rects returned
  while (cells.length < TOTAL_DAYS) {
    cells.unshift({ date: "", count: 0, level: 0 });
  }
  return cells.slice(-TOTAL_DAYS);
}

// ─── Tooltip positioned on hover ─────────────────────────────────────────
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  count: number;
  date: string;
}

// Month label positions
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

function getMonthColumns(weeks: WeekData[]): { label: string; col: number }[] {
  const seen = new Set<string>();
  const result: { label: string; col: number }[] = [];
  weeks.forEach((week, col) => {
    week.forEach((day) => {
      if (!day.date) return;
      const month = new Date(day.date).getMonth();
      const label = MONTH_LABELS[month];
      if (!seen.has(label)) {
        seen.add(label);
        result.push({ label, col });
      }
    });
  });
  return result;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────
const GraphSkeleton: FC<{ isDark: boolean }> = ({ isDark }) => (
  <div className="w-full overflow-x-auto">
    <div className="flex gap-[3px]">
      {Array.from({ length: WEEKS }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: DAYS }).map((_, d) => (
            <div
              key={d}
              className="w-[10px] h-[10px] rounded-sm animate-pulse"
              style={{ backgroundColor: isDark ? "#21262d" : "#ebedf0" }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────
interface GitHubGraphProps {
  isDark?: boolean;
  className?: string;
}

const GitHubGraph: FC<GitHubGraphProps> = ({ isDark = true, className = "" }) => {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalContribs, setTotalContribs] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, count: 0, date: "",
  });

  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Use allorigins CORS proxy to scrape GitHub's SVG contribution graph
      const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        `https://github.com/users/${GITHUB_USERNAME}/contributions`
      )}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("fetch failed");
      const html = await res.text();

      // GitHub embeds the SVG inline; extract it
      const svgMatch = html.match(/<svg[^>]*class="[^"]*ContributionCalendar[^"]*"[\s\S]*?<\/svg>/i)
        ?? html.match(/<svg[^>]*aria-label="Contribution[^"]*"[\s\S]*?<\/svg>/i)
        ?? html.match(/<svg[\s\S]*?<\/svg>/i);

      if (!svgMatch) throw new Error("no SVG found");
      const cells = parseGithubSvg(svgMatch[0]);
      const built = buildWeeks(cells);
      setWeeks(built);
      setTotalContribs(cells.reduce((s, c) => s + c.count, 0));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGraph(); }, [fetchGraph]);

  const monthCols = weeks.length > 0 ? getMonthColumns(weeks) : [];

  const handleCellEnter = useCallback(
    (e: React.MouseEvent, day: ContribDay) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const container = (e.currentTarget as HTMLElement)
        .closest(".gh-graph-root")!
        .getBoundingClientRect();
      setTooltip({
        visible: true,
        x: rect.left - container.left + rect.width / 2,
        y: rect.top - container.top - 8,
        count: day.count,
        date: day.date,
      });
    },
    []
  );
  const handleCellLeave = useCallback(
    () => setTooltip((t) => ({ ...t, visible: false })),
    []
  );

  return (
    <div className={`gh-graph-root relative w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div>
          <h3 className="font-space text-lg font-bold text-slate-900 dark:text-white">
            Open Source Contributions
          </h3>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            github.com/{GITHUB_USERNAME} · All-time activity heatmap
          </p>
        </div>
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {totalContribs.toLocaleString()} contributions
          </motion.div>
        )}
      </div>

      {/* Graph area */}
      {loading ? (
        <GraphSkeleton isDark={isDark} />
      ) : error ? (
        <div className="w-full py-10 flex flex-col items-center gap-3 font-mono text-sm text-slate-400">
          <span>Could not load contribution data.</span>
          <button
            onClick={fetchGraph}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 hover:border-sky-400 hover:text-sky-500 transition-colors text-xs cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-2">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex gap-[3px] mb-1 ml-8">
              {weeks.map((_, w) => {
                const hit = monthCols.find((m) => m.col === w);
                return (
                  <div key={w} className="w-[10px] flex-shrink-0">
                    {hit && (
                      <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {hit.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Day rows × week columns */}
            <div className="flex gap-0">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-[3px] mr-2 mt-0">
                {DAY_LABELS.map((label, i) => (
                  <div key={i} className="h-[10px] flex items-center">
                    {label && (
                      <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 leading-none">
                        {label}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Actual heatmap cells */}
              <div className="flex gap-[3px]">
                {weeks.map((week, w) => (
                  <div key={w} className="flex flex-col gap-[3px]">
                    {week.map((day, d) => (
                      <motion.div
                        key={`${w}-${d}`}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: (w * DAYS + d) * 0.0008,
                          ease: "backOut",
                        }}
                        onMouseEnter={(e) => handleCellEnter(e, day)}
                        onMouseLeave={handleCellLeave}
                        className="w-[10px] h-[10px] rounded-sm cursor-pointer hover:ring-1 hover:ring-offset-1 hover:ring-sky-400/60 transition-shadow"
                        style={{
                          backgroundColor: palette[day.level] ?? palette[0],
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-3 justify-end pr-0.5">
              <span className="font-mono text-[9px] text-slate-400">Less</span>
              {palette.map((color, i) => (
                <div
                  key={i}
                  className="w-[10px] h-[10px] rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="font-mono text-[9px] text-slate-400">More</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-50 pointer-events-none px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-mono text-[11px] shadow-xl border border-white/10 whitespace-nowrap -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.count === 0 ? "No contributions" : `${tooltip.count} contribution${tooltip.count > 1 ? "s" : ""}`}
          {tooltip.date && (
            <span className="text-slate-400 ml-1">
              on {new Date(tooltip.date + "T00:00:00").toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(GitHubGraph);
