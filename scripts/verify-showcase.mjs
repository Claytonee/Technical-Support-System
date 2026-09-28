import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readme = await readFile(path.join(root, 'README.md'), 'utf8');
const failures = [];

const required = [
  '# Technical Support System — Engineering Case Study', '**Software Engineer:**',
  '## The challenge it solves', '## Anatomy of a fault', '**Error Form**',
  '**Escalation**', '**AI Assistant**', '**Resource Library**',
  '## Diagnosis backed by knowledge', '## Engineering underneath', '## Verification'
];

for (const phrase of required) {
  if (!readme.includes(phrase)) failures.push(`missing required section/copy: ${phrase}`);
}

for (const stale of ['Partnership Network & Development Team', 'The product is not a WhatsApp bot',
  'LRS heartbeat', '## Showcase visuals', '## Repository', '## Contact',
  'Maintained implementation:', 'Visual source:']) {
  if (readme.includes(stale)) failures.push(`stale positioning returned: ${stale}`);
}

const visualPaths = [...readme.matchAll(/<img\s+src="([^"]+)"/g)]
  .map(match => match[1]).filter(src => !/^https?:/i.test(src));

if (visualPaths.length !== 4) failures.push(`expected 4 local visual plates, found ${visualPaths.length}`);

for (const relative of visualPaths) {
  const fullPath = path.resolve(root, relative);
  if (!fullPath.startsWith(root + path.sep)) {
    failures.push(`unsafe image path: ${relative}`);
    continue;
  }
  try {
    await access(fullPath);
    const svg = await readFile(fullPath, 'utf8');
    if (relative.endsWith('.svg') && (!svg.includes('<title') || !svg.includes('<desc'))) {
      failures.push(`SVG lacks title/description: ${relative}`);
    }
  } catch {
    failures.push(`missing image: ${relative}`);
  }
}

const wordCount = readme.trim().split(/\s+/).length;
if (wordCount > 1100) failures.push(`README is too long (${wordCount} words; limit 1100)`);

if (failures.length) {
  console.error(failures.map(failure => `FAIL ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`PASS showcase structure (${required.length} required concepts)`);
console.log(`PASS local visuals (${visualPaths.length} accessible assets)`);
console.log(`PASS compact README (${wordCount} words)`);
