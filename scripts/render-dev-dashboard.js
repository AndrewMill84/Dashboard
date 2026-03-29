const fs = require("fs");
const path = require("path");

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return html;
}

function stripWrapperFences(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  if (lines.length > 0 && /^`{3,}markdown\s*$/.test(lines[0])) {
    lines.shift();
  }

  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  if (lines.length > 0 && /^`{3,}\s*$/.test(lines[lines.length - 1])) {
    lines.pop();
  }

  return lines.join("\n");
}

function parseBlocks(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();

    if (trimmed === "") {
      index += 1;
      continue;
    }

    if (/^```/.test(trimmed)) {
      const language = trimmed.slice(3).trim();
      const content = [];
      index += 1;

      while (index < lines.length && !/^```+\s*$/.test(lines[index].trim())) {
        content.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push({
        type: language === "mermaid" ? "mermaid" : "code",
        language,
        text: content.join("\n"),
      });
      continue;
    }

    if (/^---+\s*$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      index += 1;
      continue;
    }

    const headingMatch = rawLine.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (/^\*\s+/.test(trimmed)) {
      const items = [];
      while (index < lines.length && /^\*\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\*\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraphLines = [];
    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !/^```/.test(lines[index].trim()) &&
      !/^---+\s*$/.test(lines[index].trim()) &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !/^\*\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({ type: "p", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function wrapLabel(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || current === "") {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function renderFlowchartSvg(mermaidText) {
  const edges = [];
  const labels = new Map();

  function parseNodeToken(token) {
    const match = token.trim().match(/^([A-Za-z0-9_]+)(?:\[(.+?)\])?$/);
    if (!match) {
      return null;
    }

    const [, id, label] = match;
    return { id, label };
  }

  for (const line of mermaidText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("flowchart ")) {
      continue;
    }

    const parts = trimmed.split(/\s*-->\s*/);
    if (parts.length !== 2) {
      continue;
    }

    const fromNode = parseNodeToken(parts[0]);
    const toNode = parseNodeToken(parts[1]);

    if (!fromNode || !toNode) {
      continue;
    }

    if (fromNode.label) {
      labels.set(fromNode.id, fromNode.label);
    }

    if (toNode.label) {
      labels.set(toNode.id, toNode.label);
    }

    edges.push({ fromId: fromNode.id, toId: toNode.id });
  }

  if (edges.length === 0) {

    return `<pre><code>${escapeHtml(mermaidText)}</code></pre>`;
  }

  const order = [];
  for (const edge of edges) {
    if (!order.includes(edge.fromId)) {
      order.push(edge.fromId);
    }
    if (!order.includes(edge.toId)) {
      order.push(edge.toId);
    }
  }

  const nodes = order.map((id) => {
    const label = labels.get(id) || id;
    const lines = wrapLabel(label, 20);
    const width =
      Math.max(...lines.map((line) => line.length), 14) * 8.6 + 36;
    const height = Math.max(64, lines.length * 22 + 28);
    return { id, label, lines, width, height };
  });

  const gap = 56;
  const marginX = 24;
  const marginY = 24;
  let currentX = marginX;
  let maxHeight = 0;

  for (const node of nodes) {
    node.x = currentX;
    node.y = marginY;
    currentX += node.width + gap;
    maxHeight = Math.max(maxHeight, node.height);
  }

  const totalWidth = currentX - gap + marginX;
  const totalHeight = maxHeight + marginY * 2;
  const boxRadius = 16;

  const arrows = edges
    .map((edge) => {
      const fromNode = nodes.find((node) => node.id === edge.fromId);
      const toNode = nodes.find((node) => node.id === edge.toId);
      const startX = fromNode.x + fromNode.width;
      const startY = fromNode.y + fromNode.height / 2;
      const endX = toNode.x;
      const endY = toNode.y + toNode.height / 2;
      return `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" marker-end="url(#arrowhead)" />`;
    })
    .join("");

  const boxMarkup = nodes
    .map((node) => {
      const textStartY =
        node.y +
        node.height / 2 -
        ((node.lines.length - 1) * 18) / 2;
      const tspans = node.lines
        .map((line, index) => {
          const dy = index === 0 ? 0 : 18;
          return `<tspan x="${node.x + node.width / 2}" dy="${dy}">${escapeHtml(
            line
          )}</tspan>`;
        })
        .join("");

      return `
        <g>
          <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="${boxRadius}" />
          <text x="${node.x + node.width / 2}" y="${textStartY}" text-anchor="middle">${tspans}</text>
        </g>`;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${totalWidth} ${totalHeight}" role="img" aria-label="Project startup flowchart">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>
      <g class="diagram-links">${arrows}</g>
      <g class="diagram-nodes">${boxMarkup}</g>
    </svg>
  `;
}

function renderBlock(block) {
  if (block.type === "heading") {
    return `<h${block.level}>${renderInline(block.text)}</h${block.level}>`;
  }

  if (block.type === "p") {
    return `<p>${renderInline(block.text)}</p>`;
  }

  if (block.type === "ul") {
    const items = block.items
      .map((item) => `<li>${renderInline(item)}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  if (block.type === "ol") {
    const items = block.items
      .map((item) => `<li>${renderInline(item)}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  }

  if (block.type === "hr") {
    return "<hr />";
  }

  if (block.type === "code") {
    const languageClass = block.language
      ? ` class="language-${escapeHtml(block.language)}"`
      : "";
    return `<pre><code${languageClass}>${escapeHtml(block.text)}</code></pre>`;
  }

  if (block.type === "mermaid") {
    return `<figure class="diagram">${renderFlowchartSvg(block.text)}</figure>`;
  }

  return "";
}

function renderHtml(title, blocks) {
  const body = blocks.map(renderBlock).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 20mm;
    }

    :root {
      color-scheme: light;
      --ink: #1d2433;
      --muted: #596477;
      --line: #d8deea;
      --panel: #f7f9fc;
      --accent: #0f6cbd;
      --accent-soft: #e6f1fb;
      --diagram-stroke: #2f6ebc;
      --diagram-fill: #eff5ff;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: "Segoe UI", Calibri, Arial, sans-serif;
      color: var(--ink);
      line-height: 1.55;
      font-size: 11pt;
      background: #ffffff;
    }

    main {
      width: 100%;
    }

    h1, h2, h3 {
      font-family: "Segoe UI Semibold", "Segoe UI", Calibri, Arial, sans-serif;
      color: #172033;
      line-height: 1.2;
      margin: 0 0 10px;
      break-after: avoid;
    }

    h1 {
      font-size: 24pt;
      margin-top: 0;
    }

    h2 {
      font-size: 16pt;
      margin-top: 22px;
    }

    h3 {
      font-size: 12.5pt;
      margin-top: 18px;
    }

    p, ul, ol, pre, figure {
      margin: 0 0 14px;
    }

    ul, ol {
      padding-left: 22px;
    }

    li {
      margin-bottom: 6px;
    }

    hr {
      border: 0;
      border-top: 1px solid var(--line);
      margin: 18px 0;
    }

    code {
      font-family: Consolas, "Cascadia Mono", "Courier New", monospace;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 5px;
      padding: 1px 5px;
      font-size: 0.96em;
    }

    pre {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 12px 14px;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
      break-inside: avoid;
    }

    pre code {
      border: 0;
      background: transparent;
      padding: 0;
      font-size: 0.95em;
    }

    strong {
      color: #111827;
    }

    .diagram {
      margin: 18px 0 22px;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: linear-gradient(180deg, #ffffff, #f9fbfe);
      break-inside: avoid;
    }

    .diagram svg {
      display: block;
      width: 100%;
      height: auto;
    }

    .diagram-links line {
      stroke: var(--diagram-stroke);
      stroke-width: 3;
    }

    .diagram-nodes rect {
      fill: var(--diagram-fill);
      stroke: var(--diagram-stroke);
      stroke-width: 2.5;
    }

    .diagram-nodes text {
      fill: #163456;
      font-family: "Segoe UI Semibold", "Segoe UI", Calibri, Arial, sans-serif;
      font-size: 17px;
    }

    marker polygon {
      fill: var(--diagram-stroke);
    }
  </style>
</head>
<body>
  <main>
${body}
  </main>
</body>
</html>`;
}

function main() {
  const inputArg = process.argv[2];
  const outputArg = process.argv[3];

  if (!inputArg || !outputArg) {
    console.error("Usage: node scripts/render-dev-dashboard.js <input.md> <output.html>");
    process.exit(1);
  }

  const inputPath = path.resolve(inputArg);
  const outputPath = path.resolve(outputArg);
  const raw = fs.readFileSync(inputPath, "utf8");
  const markdown = stripWrapperFences(raw);
  const blocks = parseBlocks(markdown);
  const titleBlock = blocks.find((block) => block.type === "heading" && block.level === 1);
  const title = titleBlock ? titleBlock.text.replace(/<[^>]+>/g, "") : path.basename(inputPath, path.extname(inputPath));
  const html = renderHtml(title, blocks);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, "utf8");
}

main();
