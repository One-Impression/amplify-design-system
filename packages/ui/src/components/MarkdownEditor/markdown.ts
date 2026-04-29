/**
 * Minimal, dependency-free Markdown → HTML renderer.
 *
 * Intentionally small — covers the subset of syntax exposed by the editor
 * toolbar (headings, bold, italic, links, lists, blockquotes, code blocks,
 * inline code). Output is HTML-escaped before block transforms so user input
 * cannot inject script/HTML. For full CommonMark/GFM, swap this for a real
 * library at the integration layer (we keep the component dep-free here).
 *
 * TODO(phase-a): replace with shared MD pipeline once tokens/motion phases
 * land a sanctioned renderer dep.
 */

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * URL scheme allowlist — blocks `javascript:`, `data:`, `vbscript:`, etc.
 * Only `http://`, `https://`, `mailto:`, and root-relative `/...` paths are
 * allowed; everything else is rewritten to `#` so a malicious link still
 * renders but cannot navigate to a script-bearing URL.
 */
const sanitizeUrl = (raw: string): string => {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^mailto:/i.test(trimmed)) return trimmed;
  if (/^\/[^/]/.test(trimmed)) return trimmed; // root-relative path (not protocol-relative)
  return '#';
};

const renderInline = (line: string): string => {
  let out = escapeHtml(line);
  // inline code first so other patterns don't touch its contents
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  // bold: **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic: *text*  (not ** already handled)
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  // links: [label](url) — URL is run through sanitizeUrl to block javascript:/data: schemes
  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, label, url) => {
      const safeUrl = sanitizeUrl(url);
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    }
  );
  return out;
};

export function renderMarkdown(src: string): string {
  if (!src) return '';
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];

  let i = 0;
  let inUl = false;
  let inOl = false;
  const closeLists = () => {
    if (inUl) {
      out.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      out.push('</ol>');
      inOl = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // fenced code block: ```lang
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      closeLists();
      const lang = fence[1] ?? '';
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing ``` (or EOF)
      const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : '';
      out.push(`<pre><code${langAttr}>${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }

    // blank line — paragraph break
    if (/^\s*$/.test(line)) {
      closeLists();
      i++;
      continue;
    }

    // headings: # h1 … ###### h6
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeLists();
      const level = h[1].length;
      out.push(`<h${level}>${renderInline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // blockquote: > text
    if (/^>\s?/.test(line)) {
      closeLists();
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${renderInline(buf.join(' '))}</blockquote>`);
      continue;
    }

    // ordered list: 1. item
    if (/^\s*\d+\.\s+/.test(line)) {
      if (inUl) {
        out.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        out.push('<ol>');
        inOl = true;
      }
      out.push(`<li>${renderInline(line.replace(/^\s*\d+\.\s+/, ''))}</li>`);
      i++;
      continue;
    }

    // unordered list: - item or * item
    if (/^\s*[-*]\s+/.test(line)) {
      if (inOl) {
        out.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        out.push('<ul>');
        inUl = true;
      }
      out.push(`<li>${renderInline(line.replace(/^\s*[-*]\s+/, ''))}</li>`);
      i++;
      continue;
    }

    // default paragraph (gather contiguous non-empty lines)
    closeLists();
    const buf: string[] = [line];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s+/.test(lines[i]) && !/^>\s?/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i]) && !/^```/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${renderInline(buf.join(' '))}</p>`);
  }

  closeLists();
  return out.join('\n');
}
