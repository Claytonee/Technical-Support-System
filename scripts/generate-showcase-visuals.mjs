import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'assets');

const C = {
  navy: '#050b24', navy2: '#08133b', panel: '#0a1742', panel2: '#0d1d50',
  white: '#f7f9ff', muted: '#91a6d8', dim: '#6074aa', blue: '#3478ff',
  cyan: '#21d4e8', amber: '#ffb229', green: '#39dfa0', red: '#ff5570'
};

const esc = value => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function base(width, height, title, description, body) {
  const stars = [[72, 42, 1.2], [188, 74, 1], [322, 31, 1.1], [449, 66, 1.3],
    [604, 35, 1], [761, 69, 1.2], [925, 37, 1], [1084, 76, 1.2]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${esc(title)}</title>
  <desc id="desc">${esc(description)}</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.navy}"/><stop offset="1" stop-color="${C.navy2}"/></linearGradient>
    <linearGradient id="signal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".22"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
    <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>
    <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0L9 4.5L0 9Z" fill="${C.cyan}"/></marker>
  </defs>
  <rect width="${width}" height="${height}" rx="22" fill="url(#background)"/>
  <g fill="${C.muted}" opacity=".34">${stars}</g>
${body.trim()}
</svg>`;
}

function text(x, y, value, options = {}) {
  const { size = 16, color = C.white, weight = 400, anchor = 'start',
    family = 'Segoe UI, Arial, sans-serif', spacing = 0, opacity = 1 } = options;
  return `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${spacing}" opacity="${opacity}">${esc(value)}</text>`;
}

function label(x, y, value, color = C.cyan, anchor = 'start') {
  return text(x, y, value.toUpperCase(), { size: 12, color, weight: 700, anchor, spacing: 2.1 });
}

function node({ x, y, w, h, eyebrow, title, detail, accent = C.blue, emphasized = false }) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="15" fill="${C.panel}" stroke="${emphasized ? C.cyan : C.blue}" stroke-width="${emphasized ? 2.2 : 1.1}"/>
    <rect x="${x + 1}" y="${y + 1}" width="4" height="${h - 2}" rx="2" fill="${accent}" opacity="${emphasized ? 1 : .72}"/>
    ${label(x + w / 2, y + 28, eyebrow, accent, 'middle')}
    ${text(x + w / 2, y + 61, title, { size: 20, weight: 750, anchor: 'middle' })}
    ${text(x + w / 2, y + 88, detail, { size: 13, color: C.muted, anchor: 'middle' })}
  </g>`;
}

function dotGrid(x, y, columns, rows, gap = 9) {
  let dots = '';
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      dots += `<circle cx="${x + column * gap}" cy="${y + row * gap}" r="2" fill="${C.blue}" opacity="${.26 + ((column + row) % 4) * .11}"/>`;
    }
  }
  return dots;
}

function connector(x1, y1, x2, y2, delay = '0s') {
  return `<path d="M${x1} ${y1}H${x2}" fill="none" stroke="${C.blue}" stroke-width="1.2" opacity=".52" marker-end="url(#arrow)"/>
    <circle r="3.5" fill="${C.cyan}"><animateMotion dur="3.6s" begin="${delay}" repeatCount="indefinite" path="M${x1} ${y1}H${x2}"/></circle>`;
}

function banner() {
  const body = `
    <circle cx="178" cy="145" r="132" fill="url(#glow)"/>
    <circle cx="178" cy="145" r="78" fill="none" stroke="${C.blue}" stroke-width="1.2" stroke-dasharray="5 10" opacity=".7"><animateTransform attributeName="transform" type="rotate" from="0 178 145" to="360 178 145" dur="60s" repeatCount="indefinite"/></circle>
    <path d="M178 73L240 109V181L178 217L116 181V109Z" fill="${C.panel}" stroke="url(#signal)" stroke-width="2.4"/>
    <path d="M178 103L214 124V166L178 187L142 166V124Z" fill="none" stroke="${C.cyan}" stroke-width="1" opacity=".6"/>
    <g stroke="${C.blue}" stroke-width="1.2" opacity=".82"><path d="M178 145V73"/><path d="M178 145L240 109"/><path d="M178 145L240 181"/><path d="M178 145V217"/><path d="M178 145L116 181"/><path d="M178 145L116 109"/></g>
    <circle cx="178" cy="145" r="19" fill="${C.amber}" opacity=".16" filter="url(#softGlow)"><animate attributeName="r" values="17;27;17" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="178" cy="145" r="9" fill="${C.amber}"/>
    <g fill="${C.cyan}"><circle cx="178" cy="73" r="5"/><circle cx="240" cy="109" r="5"/><circle cx="240" cy="181" r="5"/><circle cx="178" cy="217" r="5"/><circle cx="116" cy="181" r="5"/><circle cx="116" cy="109" r="5"/></g>
    <circle r="3" fill="${C.white}"><animateMotion dur="6s" repeatCount="indefinite" path="M178 73L240 109L240 181L178 217L116 181L116 109Z"/></circle>
    ${text(330, 95, 'TECHNICAL SUPPORT SYSTEM', { size: 38, weight: 750, spacing: .8 })}
    <rect x="332" y="111" width="138" height="4" rx="2" fill="url(#signal)"/>
    ${text(331, 145, 'Fault reporting, accountable ownership and field support for schools', { size: 17, color: C.muted })}
    ${text(331, 176, 'Offline-first PWA  ·  Express  ·  MySQL  ·  Scoped RBAC', { size: 15, color: C.cyan, weight: 650 })}
    <g><rect x="331" y="199" width="174" height="34" rx="17" fill="${C.navy}" stroke="${C.blue}"/><rect x="519" y="199" width="174" height="34" rx="17" fill="${C.navy}" stroke="${C.blue}"/><rect x="707" y="199" width="174" height="34" rx="17" fill="${C.navy}" stroke="${C.blue}"/>
      ${text(418, 221, 'ONE FAULT RECORD', { size: 12, color: C.cyan, weight: 750, anchor: 'middle', spacing: .8 })}${text(606, 221, 'SLA OWNERSHIP', { size: 12, color: C.cyan, weight: 750, anchor: 'middle', spacing: .8 })}${text(794, 221, 'OFFLINE-SAFE', { size: 12, color: C.cyan, weight: 750, anchor: 'middle', spacing: .8 })}</g>
    <path d="M925 63V229" stroke="${C.blue}" stroke-width="1" opacity=".42"/>
    ${label(963, 92, 'Outcome', C.amber)}${text(963, 127, 'A fault reaches', { size: 18, color: C.muted })}${text(963, 154, 'the right owner', { size: 24, weight: 750 })}${text(963, 181, 'with enough context', { size: 18, color: C.muted })}${text(963, 205, 'to act.', { size: 18, color: C.muted })}`;
  return base(1200, 280, 'Technical Support System', 'Offline-first fault reporting, routing, escalation and support knowledge for schools.', body);
}

function anatomy() {
  const y = 158;
  const body = `
    ${label(52, 57, 'Anatomy of a fault', C.blue)}${text(52, 88, 'One traceable record from classroom symptom to verified resolution', { size: 16, color: C.muted })}
    ${node({ x: 52, y, w: 190, h: 112, eyebrow: 'Error form', title: 'Context captured', detail: 'symptom · impact · evidence', accent: C.cyan })}
    ${connector(242, 214, 310, 214)}
    <g><path d="M356 165L405 214L356 263L307 214Z" fill="${C.panel}" stroke="${C.cyan}" stroke-width="2"/>${text(356, 207, 'OFFLINE', { size: 11, color: C.cyan, weight: 750, anchor: 'middle', spacing: 1.4 })}${text(356, 226, 'SAFE', { size: 14, weight: 750, anchor: 'middle' })}${text(356, 293, 'queue + idempotent replay', { size: 12, color: C.muted, anchor: 'middle' })}</g>
    ${connector(405, 214, 474, 214, '-.8s')}${node({ x: 474, y, w: 190, h: 112, eyebrow: 'Routing', title: 'Owner assigned', detail: 'school admin or engineer', accent: C.blue })}
    ${connector(664, 214, 733, 214, '-1.6s')}${node({ x: 733, y, w: 190, h: 112, eyebrow: 'SLA + escalation', title: 'Action enforced', detail: 'reason · due time · timeline', accent: C.amber, emphasized: true })}
    ${connector(923, 214, 992, 214, '-2.4s')}${node({ x: 992, y, w: 156, h: 112, eyebrow: 'Resolution', title: 'Fix verified', detail: 'proof + feedback', accent: C.green })}
    <path d="M1070 288V336H150V288" fill="none" stroke="${C.dim}" stroke-width="1.1" stroke-dasharray="5 7"/><circle r="3" fill="${C.green}"><animateMotion dur="7s" repeatCount="indefinite" path="M1070 288V336H150V288"/></circle>
    ${label(52, 374, 'Every transition is auditable', C.cyan)}${text(330, 374, 'fault code · actor · timestamp · owner · next action', { size: 14, color: C.muted })}${label(1148, 374, 'Knowledge returns to the next diagnosis', C.green, 'end')}<g>${dotGrid(52, 404, 20, 3, 9)}</g>`;
  return base(1200, 440, 'Anatomy of a fault', 'A structured error report is saved offline when needed, routed to an accountable owner, governed by escalation and SLA rules, and closed with evidence and feedback.', body);
}

function intelligence() {
  const body = `
    ${label(52, 57, 'Support intelligence', C.blue)}${text(52, 88, 'AI accelerates diagnosis; approved knowledge and the support workflow remain authoritative', { size: 16, color: C.muted })}
    <g><rect x="52" y="151" width="218" height="150" rx="17" fill="${C.panel}" stroke="${C.blue}"/>${label(79, 183, 'User signal', C.cyan)}${text(79, 222, '“The display turns on,', { size: 18, weight: 650 })}${text(79, 247, 'then loses signal.”', { size: 18, weight: 650 })}${text(79, 278, 'school + device + symptom', { size: 12, color: C.muted })}</g>
    <path d="M270 226H373" stroke="${C.blue}" opacity=".58" marker-end="url(#arrow)"/>
    <g><circle cx="486" cy="226" r="96" fill="url(#glow)"/><path d="M486 137L563 181V271L486 315L409 271V181Z" fill="${C.panel2}" stroke="url(#signal)" stroke-width="2.3"/><path d="M486 171L534 199V253L486 281L438 253V199Z" fill="none" stroke="${C.cyan}" opacity=".52"/>${label(486, 214, 'Support context', C.cyan, 'middle')}${text(486, 244, 'KNOWLEDGE', { size: 20, weight: 800, anchor: 'middle', spacing: 1 })}${text(486, 267, 'approved + searchable', { size: 12, color: C.muted, anchor: 'middle' })}<circle cx="486" cy="226" r="6" fill="${C.amber}"><animate attributeName="opacity" values=".45;1;.45" dur="2.8s" repeatCount="indefinite"/></circle></g>
    <path d="M563 190C620 140 655 137 707 137" fill="none" stroke="${C.blue}" marker-end="url(#arrow)"/><path d="M563 262C620 312 655 315 707 315" fill="none" stroke="${C.blue}" marker-end="url(#arrow)"/>
    <g><rect x="707" y="105" width="222" height="120" rx="16" fill="${C.panel}" stroke="${C.cyan}" stroke-width="1.6"/>${label(735, 138, 'AI assistant', C.cyan)}${text(735, 172, 'Explains the next', { size: 19, weight: 700 })}${text(735, 196, 'safe diagnostic step', { size: 19, weight: 700 })}</g>
    <g><rect x="707" y="255" width="222" height="120" rx="16" fill="${C.panel}" stroke="${C.green}" stroke-width="1.6"/>${label(735, 288, 'Resource library', C.green)}${text(735, 322, 'Returns manuals, guides', { size: 19, weight: 700 })}${text(735, 346, 'and approved media', { size: 19, weight: 700 })}</g>
    <path d="M929 165H997V239" fill="none" stroke="${C.blue}" opacity=".66"/><path d="M929 315H997V239" fill="none" stroke="${C.blue}" opacity=".66"/><path d="M997 239H1037" stroke="${C.blue}" marker-end="url(#arrow)"/>
    <g><rect x="1037" y="166" width="111" height="146" rx="15" fill="${C.panel2}" stroke="${C.amber}" stroke-width="1.6"/>${label(1092, 199, 'Decision', C.amber, 'middle')}${text(1092, 234, 'Continue', { size: 17, weight: 750, anchor: 'middle' })}${text(1092, 257, 'locally', { size: 17, weight: 750, anchor: 'middle' })}${text(1092, 281, 'or report', { size: 13, color: C.muted, anchor: 'middle' })}</g>
    <path d="M818 392V415H486V330" fill="none" stroke="${C.dim}" stroke-dasharray="5 7"/>${text(652, 409, 'resolved faults strengthen future support content', { size: 12, color: C.muted, anchor: 'middle' })}`;
  return base(1200, 440, 'Support intelligence', 'The AI assistant and Resource Library use approved support context to guide diagnosis, while users can always continue to the normal fault-reporting workflow.', body);
}

function architecture() {
  const body = `
    ${label(52, 57, 'System architecture', C.blue)}${text(52, 88, 'Reliability and access control live inside the core path', { size: 16, color: C.muted })}
    ${node({ x: 52, y: 148, w: 230, h: 118, eyebrow: 'Client', title: 'Offline-first PWA', detail: 'service worker · IndexedDB', accent: C.cyan })}${connector(282, 207, 367, 207)}
    ${node({ x: 367, y: 133, w: 274, h: 148, eyebrow: 'Application core', title: 'Express REST API', detail: 'fault lifecycle · SLA · search', accent: C.amber, emphasized: true })}${connector(641, 207, 726, 207, '-1.2s')}
    ${node({ x: 726, y: 148, w: 190, h: 118, eyebrow: 'Operational data', title: 'MySQL', detail: 'history · audit · scope', accent: C.blue })}${connector(916, 207, 1001, 207, '-2.4s')}${node({ x: 1001, y: 148, w: 147, h: 118, eyebrow: 'Evidence', title: 'Cloudinary', detail: 'files · media', accent: C.green })}
    <path d="M367 310H641" stroke="${C.blue}" opacity=".45"/>${label(367, 335, 'Security boundary', C.red)}${text(367, 362, 'JWT · MFA · role + school + assignment scope', { size: 14, color: C.muted })}${label(1148, 362, 'Additive schema · auditable transitions', C.cyan, 'end')}<g>${dotGrid(52, 370, 19, 3, 9)}</g>`;
  return base(1200, 405, 'System architecture', 'A service-worker and IndexedDB-enabled client connects to an Express application core, MySQL operational data and Cloudinary evidence storage, with scoped authorization across the path.', body);
}

await mkdir(outDir, { recursive: true });
const outputs = [['support-system-banner.svg', banner()], ['fault-anatomy.svg', anatomy()],
  ['support-intelligence.svg', intelligence()], ['system-architecture.svg', architecture()]];
for (const [name, svg] of outputs) {
  await writeFile(path.join(outDir, name), svg, 'utf8');
  console.log(`generated assets/${name}`);
}
