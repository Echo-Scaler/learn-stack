const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== LearnStack Vercel Production Build Starting ===');

const rootDir = path.resolve(__dirname, '..');
const hubDir = path.join(rootDir, 'my-learning-hub');
const hubPkg = path.join(hubDir, 'package.json');

// Step 1: Ensure my-learning-hub content is present
if (!fs.existsSync(hubPkg)) {
  console.log('Submodule my-learning-hub is empty or missing. Cloning repository directly from GitHub...');
  fs.rmSync(hubDir, { recursive: true, force: true });
  execSync('git clone --depth=1 https://github.com/Echo-Scaler/my-learning-hub.git my-learning-hub', {
    stdio: 'inherit',
    cwd: rootDir,
  });
} else {
  console.log('Found my-learning-hub content locally.');
}

// Step 2: Install dependencies inside my-learning-hub
console.log('Installing dependencies in my-learning-hub...');
execSync('npm install --prefer-offline --no-audit', {
  stdio: 'inherit',
  cwd: hubDir,
});

// Step 3: Run production Astro build
console.log('Building Astro documentation hub...');
execSync('npm run build', {
  stdio: 'inherit',
  cwd: hubDir,
});

// Step 4: Mirror build output to root ./dist for Vercel
const rootDist = path.join(rootDir, 'dist');
const hubDist = path.join(hubDir, 'dist');

console.log(`Copying output from ${hubDist} to root ${rootDist}...`);
fs.rmSync(rootDist, { recursive: true, force: true });
fs.cpSync(hubDist, rootDist, { recursive: true });

console.log('=== LearnStack Vercel Production Build Completed Successfully! ===');
