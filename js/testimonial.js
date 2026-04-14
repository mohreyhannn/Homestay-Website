const slider = document.querySelector(".testimonial-slider");

let scrollAmount = 0;

setInterval(()=>{

scrollAmount += 320;

if(scrollAmount >= slider.scrollWidth){
scrollAmount = 0;
}

slider.scrollTo({
left: scrollAmount,
behavior: "smooth"
});

},3000);

