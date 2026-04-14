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

const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const totalMalam = document.getElementById("totalMalam");
const totalHarga = document.getElementById("totalHarga");

// ambil angka dari harga kamar
let hargaPerMalam = Number.parseInt(
kamarData.harga.replaceAll(/[^\d]/g,"")
);

function hitungBooking(){

const tglMasuk = new Date(checkin.value);
const tglKeluar = new Date(checkout.value);

if(checkin.value && checkout.value){

    if(tglKeluar <= tglMasuk){
alert("Tanggal checkout harus setelah checkin");
return;
}

const selisih = tglKeluar - tglMasuk;

const malam = selisih / (1000 * 60 * 60 * 24);

if(malam > 0){

totalMalam.innerText = malam;

const total = malam * hargaPerMalam;

totalHarga.innerText =
"Rp " + total.toLocaleString("id-ID");

}else{

totalMalam.innerText = 0;
totalHarga.innerText = "Rp 0";

}

}

}

// jalankan saat tanggal berubah
checkin.addEventListener("change", hitungBooking);
checkout.addEventListener("change", hitungBooking);

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

const checkin = document.getElementById("checkin").value;
const checkout = document.getElementById("checkout").value;
const kamar = document.getElementById("namaKamar").innerText;
const malam = document.getElementById("totalMalam").innerText;
const total = document.getElementById("totalHarga").innerText;

const payment = document.querySelector('input[name="payment"]:checked');


// VALIDASI

if (!checkin || !checkout) {

alert("⚠️ Silakan pilih tanggal Check-in dan Check-out terlebih dahulu.");

return;

}

if (!payment) {

alert("⚠️ Silakan pilih metode pembayaran.");

return;

}

let paymentDetail = "";

if(payment.value === "Transfer"){

const bank = document.querySelector('input[name="bank"]:checked');

if(!bank){
alert("⚠️ Silakan pilih bank atau e-wallet terlebih dahulu.");
return;
}

paymentDetail = bank.value;

}else{

paymentDetail = payment.value;

}


// PESAN WHATSAPP

const message = `
Halo, saya ingin memesan kamar.

🏨 Kamar : ${kamar}

📅 Check-in : ${checkin}
📅 Check-out : ${checkout}

🌙 Total Malam : ${malam}

💰 Total Harga : ${total}

💳 Metode Pembayaran : ${paymentDetail}
`;

const url = `https://wa.me/628558038659?text=${encodeURIComponent(message)}`;

window.open(url, "_blank");

});

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