const params = new URLSearchParams(globalThis.location.search);
const kamar = params.get("kamar");

const data = {

standard: {
nama: "Kamar Standard",
harga: "Rp 250.000",
gambar: "images/kamar1.jpeg",
fasilitas:[
"WiFi Gratis",
"AC",
"Kamar Mandi",
"TV"
]
},

"1kamar":{
nama:"Kamar 1 Bedroom",
harga:"Rp 300.000",
gambar:"images/kamar2.jpeg",
fasilitas:[
"WiFi Gratis",
"AC",
"TV",
"Air Panas",
"Parkir"
]
},

"2kamar":{
nama:"Kamar 2 Bedroom",
harga:"Rp 350.000",
gambar:"images/kamar3.jpeg",
fasilitas:[
"WiFi Gratis",
"AC",
"TV",
"Dapur",

]
}

};

const kamarData = data[kamar];

document.getElementById("namaKamar").innerText = kamarData.nama;
document.getElementById("hargaKamar").innerText = kamarData.harga;
document.getElementById("gambarKamar").src = kamarData.gambar;

const fasilitasList = document.getElementById("fasilitasKamar");

kamarData.fasilitas.forEach(f => {

const li = document.createElement("li");

li.innerHTML = "✔️ " + f;

fasilitasList.appendChild(li);

});

const thumbnails = document.querySelectorAll(".gallery-thumb img");

thumbnails.forEach(img => {

img.addEventListener("click", function(){

document.getElementById("gambarKamar").src = this.src;

});

});

const tanggal = document.getElementById("tanggal");
const totalMalam = document.getElementById("totalMalam");
const totalHarga = document.getElementById("totalHarga");

// ambil angka dari harga kamar
let hargaPerMalam = Number.parseInt(
kamarData.harga.replaceAll(/[^\d]/g,"")
);

function getTanggal(){
  const dates = tanggal.value.split(" to ");

  if(dates.length < 2) return null;

  return {
    checkin: dates[0],
    checkout: dates[1]
  };
}

function hitungBooking(){

  const dataTanggal = getTanggal();

  if(!dataTanggal) return;

  const tglMasuk = new Date(dataTanggal.checkin);
  const tglKeluar = new Date(dataTanggal.checkout);

  if(tglKeluar <= tglMasuk){
    alert("Tanggal checkout harus setelah checkin");
    return;
  }

  const selisih = tglKeluar - tglMasuk;
  const malam = selisih / (1000 * 60 * 60 * 24);

  totalMalam.innerText = malam;

  const total = malam * hargaPerMalam;

  totalHarga.innerText =
    "Rp " + total.toLocaleString("id-ID");
}

tanggal.addEventListener("change", hitungBooking);

// jalankan saat tanggal berubah


const btnPesan = document.getElementById("btnPesan");

const paymentRadios = document.querySelectorAll('input[name="payment"]');
const transferOptions = document.getElementById("transferOptions");

paymentRadios.forEach(radio => {
radio.addEventListener("change", function(){

if(this.value === "Transfer"){
transferOptions.style.display = "block";
}else{
transferOptions.style.display = "none";
}

});
});

btnPesan.addEventListener("click", function () {

  // ambil tanggal dari function (BUKAN split manual lagi)
  const dataTanggal = getTanggal();

  if (!dataTanggal) {
    alert("⚠️ Silakan pilih tanggal terlebih dahulu.");
    return;
  }

  const checkin = dataTanggal.checkin;
  const checkout = dataTanggal.checkout;

  // ambil kamar
  const kamar = document.getElementById("namaKamar").innerText;

  // ambil payment
  const payment = document.querySelector('input[name="payment"]:checked');

  if (!payment) {
    alert("⚠️ Silakan pilih metode pembayaran.");
    return;
  }

  let paymentDetail = "";

  if (payment.value === "Transfer") {
    const bank = document.querySelector('input[name="bank"]:checked');

    if (!bank) {
      alert("⚠️ Pilih bank dulu");
      return;
    }

    paymentDetail = bank.value;
  } else {
    paymentDetail = payment.value;
  }

  // 🚀 kirim ke backend
  fetch("http://localhost:5000/api/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      room_id: kamar,
      check_in: checkin,
      check_out: checkout
    })
  })
  .then(res => res.json())
  .then(data => {

  if(data.error){
    alert("❌ " + data.error);
    return;
  }

  alert("✅ Booking berhasil, lanjut pembayaran");

  // 🔥 INI KUNCI NYA
  pay(data.order_id);

})
  .catch(err => {
    console.error(err);
    alert("❌ Gagal booking");
  });

});



// PESAN WHATSAPP


const btnReview = document.getElementById("kirimReview");

btnReview.addEventListener("click", function(){

const nama = document.getElementById("namaReview").value;
const isi = document.getElementById("isiReview").value;

if(!nama || !isi){
alert("Isi nama dan review terlebih dahulu");
return;
}

const reviewGrid = document.querySelector(".review-section .row");

const reviewHTML = `
<div class="col-md-4">
  <div class="review-card">
    <div class="review-header">
      <div class="avatar">${nama[0]}</div>
      <div>
        <b>${nama}</b>
        <div class="stars">★★★★★</div>
      </div>
    </div>
    <p>${isi}</p>
  </div>
</div>
`;

reviewGrid.innerHTML += reviewHTML;

document.getElementById("namaReview").value="";
document.getElementById("isiReview").value="";

});

fetch(`http://localhost:5000/api/booked/${kamar}`)
  .then(res => {
    if (!res.ok) {
      throw new Error("Gagal ambil data tanggal");
    }
    return res.json();
  })
  .then(data => {

    flatpickr("#tanggal", {
      mode: "range",
      dateFormat: "Y-m-d",
      disable: data,

      onChange: function(){
        hitungBooking();
      }

    });

  })
  .catch(err => {
    console.error("ERROR:", err);

    // 🔥 fallback kalau API mati
    flatpickr("#tanggal", {
      mode: "range",
      dateFormat: "Y-m-d",

      onChange: function(){
        hitungBooking();
      }

    });

  });

  function pay(order_id){

fetch("http://localhost:5000/api/pay", {
method: "POST",
headers: {"Content-Type":"application/json"},
body: JSON.stringify({
  order_id: order_id,
  amount: hargaPerMalam   // bisa lu upgrade nanti
})
})
.then(res => res.json())
.then(data => {
  snap.pay(data.token);
});

}
