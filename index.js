const mineflayer = require('mineflayer');

const config = {
  host: 'chabiba-server.aternos.me',
  port: 44672,
  username: 'ChabibaBot212',
  version: '1.20.4', // علامات التنصيص ضرورية هنا
  auth: 'offline'
};

let bot = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function createBot() {
  console.log(`🚀 Connecting to ${config.host}:${config.port} as ${config.username}...`);

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    auth: config.auth,
    checkTimeoutInterval: 60000
  });

  bot.once('login', () => {
    console.log(`✅ Joined successfully as ${bot.username}!`);
    reconnectAttempts = 0;
  });

  bot.on('spawn', () => {
    console.log('✅ Spawned in the world!');
    bot.chat('Hello! Bot is online.');
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`💬 ${username}: ${message}`);
  });

  bot.on('kicked', (reason) => {
    console.log(`❌ Kicked: ${JSON.stringify(reason)}`);
  });

  bot.on('error', (err) => {
    console.error(`❌ Bot error: ${err.message}`);
  });

  bot.on('end', (reason) => {
    console.log(`🔌 Connection ended: ${reason}`);
    handleReconnect();
  });
}

function handleReconnect() {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error('❌ Max reconnection attempts reached. Exiting...');
    process.exit(1);
  }

  reconnectAttempts++;
  const delay = 15000;

  console.log(`⏳ Reconnecting in ${delay / 1000}s... (Attempt ${reconnectAttempts}/${maxReconnectAttempts})`);

  bot = null;
  setTimeout(createBot, delay);
}

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down bot...');
  if (bot) bot.quit();
  process.exit(0);
});

createBot();