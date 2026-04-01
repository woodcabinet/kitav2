process.chdir(__dirname);
const { execSync } = require('child_process');
require('child_process').spawn('node', ['node_modules/vite/bin/vite.js', '--port', '5174'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});
