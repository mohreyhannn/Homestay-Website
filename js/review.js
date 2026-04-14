const btn = document.getElementById("kirimReview");

if (btn) {

btn.addEventListener("click", function(){

const nama = document.getElementById("namaReview").value;
const isi = document.getElementById("isiReview").value;

if(nama === "" || isi === ""){
alert("Isi nama dan tanggapan dulu");
return;
}

const slider = document.getElementById("testimonialSlider");

const card = document.createElement("div");
card.classList.add("testimonial-card");

card.innerHTML = `
<div class="testimonial-header">
<div class="avatar">${nama.charAt(0)}</div>
<div>
<h5>${nama}</h5>
<div class="stars">★★★★★</div>
</div>
</div>

<p>"${isi}"</p>
`;

slider.prepend(card);

document.getElementById("namaReview").value="";
document.getElementById("isiReview").value="";

});

}
const textarea = document.getElementById("isiReview");

textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

let rating = 0;

document.querySelectorAll(".rating-input i").forEach(star=>{
  star.addEventListener("click",function(){

    rating = this.dataset.value;

    document.querySelectorAll(".rating-input i").forEach(s=>{
      s.classList.remove("active");
    });

    for(let i=0;i<rating;i++){
      document.querySelectorAll(".rating-input i")[i].classList.add("active");
    }

  });
});

