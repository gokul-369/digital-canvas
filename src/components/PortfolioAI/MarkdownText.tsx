import React from "react";

function renderInline(text: string, depth = 0): React.ReactNode[] {
  if (depth > 3) return [text];

  // Match **bold**, *italic*, `code`, <code...>...</code>, and [label](url)
  const tokenRegex =
    /(\*\*(?:(?!\*\*).)+\*\*|\*[^*\n]+\*|`[^`]+`|<code[^>]*>[^<]+<\/code>|\[[^\]]+\]\([^)]+\))/gi;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong
          key={idx}
          className="font-semibold text-slate-950 dark:text-white"
        >
          {renderInline(part.slice(2, -2), depth + 1)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={idx} className="italic text-slate-700 dark:text-slate-300">
          {renderInline(part.slice(1, -1), depth + 1)}
        </em>
      );
    }
    const htmlCodeMatch = /^<code[^>]*>([^<]+)<\/code>$/i.exec(part);
    if (htmlCodeMatch) {
      return (
        <code
          key={idx}
          className="rounded-md border border-indigo-200/80 bg-indigo-50/80 px-1.5 py-0.5 font-mono text-[11.5px] text-indigo-700 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300"
        >
          {htmlCodeMatch[1]}
        </code>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="rounded-md border border-indigo-200/80 bg-indigo-50/80 px-1.5 py-0.5 font-mono text-[11.5px] text-indigo-700 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (linkMatch) {
      const href = linkMatch[2];
      const isExternal = /^https?:\/\//i.test(href);
      return (
        <a
          key={idx}
          href={href}
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="font-medium text-indigo-600 underline decoration-indigo-400/50 underline-offset-2 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-sky-300"
        >
          {renderInline(linkMatch[1], depth + 1)}
        </a>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export function MarkdownText({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = (keyPrefix: string) => {
    if (listItems.length === 0) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    blocks.push(
      <Tag
        key={`${keyPrefix}-list`}
        className={`my-2.5 space-y-2.5 pl-5 ${
          listType === "ol" ? "list-decimal" : "list-disc"
        } marker:text-indigo-500 dark:marker:text-indigo-400`}
      >
        {listItems.map((item, i) => (
          <li key={i} className="leading-[1.7]">
            {renderInline(item)}
          </li>
        ))}
      </Tag>,
    );
    listItems = [];
    listType = null;
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(`b-${idx}`);
      return;
    }

    const headingMatch = /^#{1,3}\s+(.+)$/.exec(line);
    if (headingMatch) {
      flushList(`h-${idx}`);
      blocks.push(
        <h4
          key={`h-${idx}`}
          className="mt-4 mb-1.5 text-[15px] font-semibold tracking-tight text-slate-950 dark:text-white"
        >
          {renderInline(headingMatch[1])}
        </h4>,
      );
      return;
    }

    const ulMatch = /^[-*•]\s+(.+)$/.exec(line);
    if (ulMatch) {
      if (listType === "ol") flushList(`ul-${idx}`);
      listType = "ul";
      listItems.push(ulMatch[1]);
      return;
    }

    const olMatch = /^\d+\.\s+(.+)$/.exec(line);
    if (olMatch) {
      if (listType === "ul") flushList(`ol-${idx}`);
      listType = "ol";
      listItems.push(olMatch[1]);
      return;
    }

    flushList(`p-${idx}`);
    blocks.push(
      <p key={`p-${idx}`} className="leading-[1.7]">
        {renderInline(line)}
      </p>,
    );
  });

  flushList("end");

  return (
    <div className="space-y-3 text-[14.5px] text-slate-800 dark:text-slate-100">
      {blocks}
    </div>
  );
}
