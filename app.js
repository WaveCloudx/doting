require("./assets/require");

let isRunning = false;

function start(file) {
  if (isRunning) return;
  isRunning = true;

  const args = [path.join(__dirname, file), ...process.argv.slice(2)];
  const p = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });

  p.on('exit', (code) => {
    isRunning = false;
    console.error(`${RED}🛑 Exited with code: ${code}${RESET}`);
    
    if (code !== 0) {
      console.log(`${YELLOW}🔄 Restarting ${file}...${RESET}`);
      start(file);
    }
  });

  p.on('error', (err) => {
    console.error(`${RED}❌ Error: ${err}${RESET}`);
    isRunning = false;
    start(file);
  });

  console.log(`${GREEN}🚀 Starting ${file}...${RESET}`);
}

start('index.js');

process.on('exit', () => {
  console.error(`${RED}❌ Script will restart...${RESET}`);
  start('index.js');
});