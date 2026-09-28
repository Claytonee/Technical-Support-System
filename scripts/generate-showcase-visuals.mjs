import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'assets');

const C = {
  bg: '#0b0f16', panel: '#121925', panel2: '#172131', line: '#2b3a4e',
  text: '#f5f7fb', muted: '#9aa9bc', amber: '#ffae00', blue: '#5d87ff',
  cyan: '#36d9cc', green: '#2dd98a', purple: '#a88bff', red: '#ff6577'
};

const esc = value => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function shell(width, height, title, subtitle, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${esc(title)}</title>
  <desc id="desc">${esc(subtitle)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0f16"/><stop offset="1" stop-color="#111b2a"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#000" flood-opacity=".28"/>
    </filter>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0 0L10 5L0 10Z" fill="${C.muted}"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" rx="28" fill="url(#bg)"/>
  <circle cx="${width - 110}" cy="80" r="180" fill="${C.blue}" opacity=".06"/>
  <circle cx="70" cy="${height - 35}" r="150" fill="${C.amber}" opacity=".05"/>
  <text x="64" y="68" fill="${C.text}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="31" font-weight="700">${esc(title)}</text>
  <text x="64" y="101" fill="${C.muted}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="17">${esc(subtitle)}</text>
  ${body}
</svg>`;
}

function lines(x, y, values, { size = 17, color = C.muted, weight = 400, gap = 27, anchor = 'start' } = {}) {
  return `<text x="${x}" y="${y}" fill="${color}" text-anchor="${anchor}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="${size}" font-weight="${weight}">${values.map((value, index) => `<tspan x="${x}" dy="${index ? gap : 0}">${esc(value)}</tspan>`).join('')}</text>`;
}

function card({ x, y, w, h, number, title, copy, accent }) {
  return `<g filter="url(#shadow)">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${C.panel}" stroke="${C.line}"/>
    <rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="${accent}"/>
    <circle cx="${x + 38}" cy="${y + 38}" r="18" fill="${accent}" opacity=".17"/>
    <text x="${x + 38}" y="${y + 44}" text-anchor="middle" fill="${accent}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="15" font-weight="800">${number}</text>
    <text x="${x + 68}" y="${y + 44}" fill="${C.text}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="20" font-weight="700">${esc(title)}</text>
    ${lines(x + 28, y + 84, copy, { size: 15, gap: 23 })}
  </g>`;
}

function arrow(x1, y1, x2, y2, label = '') {
  const mid = (x1 + x2) / 2;
  return `<path d="M${x1} ${y1}H${x2}" fill="none" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 7" marker-end="url(#arrow)"/>
  ${label ? `<text x="${mid}" y="${y1 - 10}" text-anchor="middle" fill="${C.muted}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12">${esc(label)}</text>` : ''}`;
}

function supportJourney() {
  const items = [
    ['1', 'Diagnose', ['Guided checks', 'approved resources'], C.cyan],
    ['2', 'Report', ['Structured symptoms', 'impact + evidence'], C.blue],
    ['3', 'Own', ['School triage or', 'field assignment'], C.amber],
    ['4', 'Escalate', ['Reason + timestamp', 'SLA + notification'], C.red],
    ['5', 'Resolve', ['Timeline + proof', 'reporter feedback'], C.green],
    ['6', 'Learn', ['Trends + guides', 'prevent recurrence'], C.purple]
  ];
  const w = 224, h = 186, gap = 24, start = 64, y = 174;
  let body = '';
  items.forEach((item, index) => {
    const x = start + index * (w + gap);
    body += card({ x, y, w, h, number: item[0], title: item[1], copy: item[2], accent: item[3] });
    if (index < items.length - 1) body += arrow(x + w + 6, y + h / 2, x + w + gap - 8, y + h / 2);
  });
  body += `<rect x="64" y="405" width="1472" height="132" rx="20" fill="${C.panel2}" stroke="${C.line}"/>
    <text x="94" y="449" fill="${C.amber}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="15" font-weight="800" letter-spacing="1.5">SUCCESS MEANS</text>
    ${lines(94, 486, ['The user gets the right next step, the fault gets one accountable owner,', 'and every completed fix leaves evidence the support team can reuse.'], { size: 21, color: C.text, gap: 31, weight: 600 })}`;
  return shell(1600, 600, 'From classroom fault to accountable resolution', 'One workflow connects self-help, reporting, ownership, escalation and learning.', body);
}

function capabilityMap() {
  const features = [
    { x: 64, y: 164, title: 'Error Form', accent: C.blue,
      action: 'User provides', a: ['symptoms, impact, location,', 'affected equipment and evidence'],
      effect: 'System creates', b: ['a deduplicated fault, SLA due time,', 'school scope and initial owner'] },
    { x: 824, y: 164, title: 'Escalation', accent: C.red,
      action: 'School admin provides', a: ['a reason and operational context'],
      effect: 'System records', b: ['platform ownership, engineer assignment,', 'timestamps, timeline and notifications'] },
    { x: 64, y: 500, title: 'AI Assistant', accent: C.purple,
      action: 'User asks', a: ['a support question in their own words'],
      effect: 'System returns', b: ['resource-grounded diagnostic steps', 'while preserving normal support access'] },
    { x: 824, y: 500, title: 'Resource Library', accent: C.green,
      action: 'Support team publishes', a: ['approved manuals, guides and media'],
      effect: 'Users get', b: ['searchable, reusable knowledge linked', 'to diagnosis and future reports'] }
  ];
  let body = '';
  for (const feature of features) {
    body += `<g filter="url(#shadow)">
      <rect x="${feature.x}" y="${feature.y}" width="712" height="284" rx="22" fill="${C.panel}" stroke="${C.line}"/>
      <rect x="${feature.x}" y="${feature.y}" width="712" height="7" rx="4" fill="${feature.accent}"/>
      <text x="${feature.x + 32}" y="${feature.y + 55}" fill="${C.text}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="25" font-weight="750">${feature.title}</text>
      <text x="${feature.x + 32}" y="${feature.y + 98}" fill="${feature.accent}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="800" letter-spacing="1.2">${feature.action.toUpperCase()}</text>
      ${lines(feature.x + 32, feature.y + 130, feature.a, { size: 17, color: C.text, gap: 25 })}
      <line x1="${feature.x + 32}" y1="${feature.y + 184}" x2="${feature.x + 680}" y2="${feature.y + 184}" stroke="${C.line}"/>
      <text x="${feature.x + 32}" y="${feature.y + 218}" fill="${feature.accent}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="800" letter-spacing="1.2">${feature.effect.toUpperCase()}</text>
      ${lines(feature.x + 32, feature.y + 250, feature.b, { size: 17, color: C.muted, gap: 25 })}
    </g>`;
  }
  return shell(1600, 840, 'What each core capability does', 'Every feature starts with a user need and ends with an observable system outcome.', body);
}

function architecture() {
  const layer = (x, y, w, h, label, title, items, accent) => `<g filter="url(#shadow)">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${C.panel}" stroke="${C.line}"/>
    <text x="${x + 28}" y="${y + 35}" fill="${accent}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="800" letter-spacing="1.3">${label}</text>
    <text x="${x + 28}" y="${y + 73}" fill="${C.text}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="23" font-weight="750">${title}</text>
    ${lines(x + 28, y + 112, items, { size: 16, gap: 25 })}
  </g>`;
  let body = '';
  body += layer(64, 170, 420, 250, 'SCHOOL EXPERIENCE', 'Vanilla JS SPA / PWA', ['Guided resolution + error form', 'Service worker + IndexedDB queue', 'Role-aware dashboards'], C.cyan);
  body += layer(590, 150, 420, 290, 'APPLICATION CORE', 'Node.js / Express API', ['JWT + MFA + scoped RBAC', 'Fault lifecycle + SLA sweep', 'Search, analytics + audit'], C.amber);
  body += layer(1116, 170, 420, 250, 'OPERATIONS', 'MySQL + Cloudinary', ['Operational records + history', 'Evidence + approved resources', 'Additive schema extensions'], C.blue);
  body += arrow(490, 295, 572, 295, 'HTTPS / JWT');
  body += arrow(1016, 295, 1098, 295, 'queries + files');
  body += `<rect x="202" y="505" width="1196" height="150" rx="22" fill="${C.panel2}" stroke="${C.line}"/>
    <text x="800" y="548" text-anchor="middle" fill="${C.purple}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="800" letter-spacing="1.2">OPTIONAL ADAPTERS</text>
    ${lines(800, 590, ['AI answers · email alerts · WhatsApp / SMS / USSD intake · LRS heartbeat', 'The core web workflow remains complete when any adapter is not configured.'], { size: 19, color: C.text, gap: 31, anchor: 'middle', weight: 600 })}`;
  return shell(1600, 720, 'Architecture shaped by the operating environment', 'Offline reliability and access control are part of the design, not add-ons.', body);
}

await mkdir(outDir, { recursive: true });
const outputs = [
  ['support-journey.svg', supportJourney()],
  ['capability-map.svg', capabilityMap()],
  ['system-architecture-v2.svg', architecture()]
];
for (const [name, svg] of outputs) {
  await writeFile(path.join(outDir, name), svg, 'utf8');
  console.log(`generated assets/${name}`);
}
