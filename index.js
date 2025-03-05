const { Telegraf } = require('telegraf');
const express = require('express');

// Ganti dengan token bot Telegram Anda
const bot = new Telegraf('6749124349:AAESm-NbU9wEw0Zy1aRO_7wM1VQJOKY5lA8');

// Ganti dengan ID chat Telegram yang ingin menerima pesan
const chatId = '6538388688';

// Set up server express
const app = express();

// Middleware untuk melayani file statis
app.use(express.static('public'));

// Endpoint untuk mengirim IP ke Telegram
app.get('/', (req, res) => {
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // Kirim IP ke Telegram
  bot.telegram.sendMessage(chatId, `IP yang mengakses: ${userIP}`);
  
  // Kirim halaman HTML ke browser
  res.sendFile(__dirname + '/public/index.html');
});

// Start bot
bot.launch();

// Jalankan server pada port tertentu (Vercel biasanya menggunakan port 3000)
app.listen(3000, () => {
  console.log('Server berjalan pada http://localhost:3000');
});