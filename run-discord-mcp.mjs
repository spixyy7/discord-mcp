#!/usr/bin/env node
// Pokrece @pasympa/discord-mcp sa kredencijalima iz TOKEN.txt.
// Token se ucitava direktno u env child procesa - ne pise se
// ni u jedan config fajl, ne prolazi kroz argumente komande.
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const env = { ...process.env };

let loaded = 0;
for (const name of ['TOKEN.txt', '.env']) {
  let raw;
  try { raw = readFileSync(join(here, name), 'utf8'); } catch { continue; }
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m || line.trimStart().startsWith('#')) continue;
    const value = m[2].trim().replace(/^(["'])(.*)\1$/, '$2');
    if (value) { env[m[1]] = value; loaded++; }
  }
  if (loaded) break;
}

if (!env.DISCORD_TOKEN) {
  process.stderr.write(
    `\n[discord-mcp] DISCORD_TOKEN nije postavljen.\n` +
    `Otvori ${join(here, 'TOKEN.txt')} i zalepi token iza DISCORD_TOKEN=\n\n`
  );
  process.exit(1);
}

const child = spawn('npx', ['-y', '@pasympa/discord-mcp'], {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
});
child.on('error', (e) => {
  process.stderr.write(`[discord-mcp] ne mogu da pokrenem npx: ${e.message}\n`);
  process.exit(1);
});
child.on('exit', (code, signal) => process.exit(signal ? 1 : code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
