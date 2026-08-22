#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

function printUsage() {
  console.error('Usage: npm run export:pdf -- <input.html> [output.pdf]');
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    'google-chrome',
    'chromium',
    'chromium-browser',
    'msedge',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (path.isAbsolute(candidate) && fs.existsSync(candidate)) {
      return candidate;
    }

    const probe = spawnSync(candidate, ['--version'], { stdio: 'ignore' });
    if (!probe.error && probe.status === 0) {
      return candidate;
    }
  }

  throw new Error(
    'Chrome or Chromium was not found. Install a Chromium-based browser or set CHROME_PATH.'
  );
}

function toFileUrl(filePath) {
  return `file://${encodeURI(path.resolve(filePath))}`;
}

function main() {
  const [, , inputArg, outputArg] = process.argv;
  if (!inputArg) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const inputPath = path.resolve(inputArg);
  const outputPath = path.resolve(outputArg || inputPath.replace(/\.html?$/i, '.pdf'));

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input HTML file does not exist: ${inputPath}`);
  }
  if (!/\.html?$/i.test(inputPath)) {
    throw new Error('The input file must have an .html or .htm extension.');
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const chrome = findChrome();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eli6-pdf-'));

  try {
    const result = spawnSync(
      chrome,
      [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--no-pdf-header-footer',
        `--user-data-dir=${profileDir}`,
        `--print-to-pdf=${outputPath}`,
        toFileUrl(inputPath),
      ],
      { encoding: 'utf8' }
    );

    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(result.stderr || `Chrome exited with status ${result.status}.`);
    }
    if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
      throw new Error('Chrome did not create a PDF file.');
    }

    console.log(`PDF created: ${outputPath}`);
  } finally {
    fs.rmSync(profileDir, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(`PDF export failed: ${error.message}`);
  process.exitCode = 1;
}
