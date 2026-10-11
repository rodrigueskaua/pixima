import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const REPOSITORY = 'https://github.com/rodrigueskaua/pixima.git';
const BRANCH = 'gh-pages';

const root = resolve(import.meta.dirname, '..');
const output = join(root, '.output', 'public');

const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'inherit' });
const read = (command, args, cwd) => execFileSync(command, args, { cwd, encoding: 'utf8' }).trim();

execFileSync('npm', ['run', 'generate'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NUXT_APP_BASE_URL: '/pixima/' },
});

const work = mkdtempSync(join(tmpdir(), 'pixima-pages-'));

try {
  run('git', ['clone', '--quiet', '--branch', BRANCH, '--single-branch', REPOSITORY, work]);

  for (const entry of readdirSync(work)) {
    if (entry !== '.git') rmSync(join(work, entry), { recursive: true, force: true });
  }
  cpSync(output, work, { recursive: true });

  run('git', ['add', '-A'], work);
  if (!read('git', ['status', '--porcelain'], work)) {
    console.log('Nada mudou, o site já está atualizado.');
  } else {
    run('git', ['commit', '--quiet', '-m', 'feat: atualizar o site do Pixima'], work);
    run('git', ['push', '--quiet', 'origin', BRANCH], work);
    console.log('Site publicado em https://rodrigueskaua.github.io/pixima/');
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
