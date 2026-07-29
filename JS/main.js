import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
document.addEventListener("DOMContentLoaded", async () => {

let firebaseSnapshot;

try {

    firebaseSnapshot = await getDocs(collection(db, "products"));

} catch(error) {

    console.log(error);

}

const products = [];

firebaseSnapshot.forEach((doc) => {

products.push(doc.data());

});

console.log(products);

const grid = document.getElementById("collections-grid");


// SHOW PRODUCTS + FILTERS
if (grid) {

function showProducts(category = "all") {

grid.innerHTML = "";

const filteredProducts = category === "all"
? products
: products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
);


filteredProducts.forEach(product => {

const card = document.createElement("div");

card.className = "product-card";

card.innerHTML = `
<img src="${product.images && product.images[0] ? product.images[0] : 'images/logo.png'}" alt="${product.name}">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="product-detail.html?id=${product.id}">
View Product
</a>
`;

grid.appendChild(card);

});


}


// FIRST LOAD
showProducts();


// FILTER BUTTONS
const filterButtons = document.querySelectorAll(".filter-btn");


filterButtons.forEach(button => {

button.addEventListener("click", () => {

const category = button.dataset.filter;

showProducts(category);


filterButtons.forEach(btn => btn.classList.remove("active"));

button.classList.add("active");

});

});

}



// PRODUCT DETAIL PAGE

const productId = new URLSearchParams(window.location.search).get("id");


if (productId) {

const product = products.find(p => p.id === productId);


if (product) {


const name = document.getElementById("pd-name");
const price = document.getElementById("pd-price");
const desc = document.getElementById("pd-desc");
const material = document.getElementById("pd-material");
const dimensions = document.getElementById("pd-dimensions");
const mainImage = document.getElementById("gallery-main-img");
const mainVideo = document.getElementById("gallery-main-video");
const thumbs = document.getElementById("gallery-thumbs");
const lightbox = document.getElementById("media-lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxVideo = document.getElementById("lightbox-video");
const lightboxClose = document.getElementById("lightbox-close");


if (name) name.textContent = product.name;
if (price) price.textContent = product.price;
if (desc) desc.textContent = product.description;
if (material) material.textContent = product.material;
if (dimensions) dimensions.textContent = product.dimensions;


if (mainImage) {

mainImage.src = product.images[0];
mainImage.alt = product.name;
mainImage.style.display = "block";

if(product.video){

    mainVideo.src = product.video;
    mainVideo.style.display = "none";

}else{

    mainVideo.style.display = "none";

}

}


if (thumbs) { if (mainImage) {

mainImage.onclick = () => {

lightbox.style.display = "flex";

lightboxImg.src = mainImage.src;
lightboxImg.style.display = "block";

lightboxVideo.style.display = "none";

};

}





if (lightboxClose) {

lightboxClose.onclick = () => {

lightbox.style.display = "none";

lightboxVideo.pause();

};

}

product.images.forEach(image => {

let img;

if(image.endsWith(".mp4")){

img = document.createElement("div");
img.className = "video-thumb";

const video = document.createElement("video");

video.src = product.video;
video.muted = true;
video.preload = "metadata";
video.playsInline = true;
video.setAttribute("playsinline", "");

const icon = document.createElement("span");
icon.innerHTML = "▶";

img.appendChild(video);
img.appendChild(icon);

}else{

img = document.createElement("img");
img.src = image;

}

img.onclick = () => {

if(image.endsWith(".mp4")){

mainImage.style.display = "none";
mainVideo.style.display = "block";
mainVideo.src = image;

}else{

mainVideo.pause();
mainVideo.style.display = "none";
mainImage.style.display = "block";
mainImage.src = image;

}

};

thumbs.appendChild(img);

});
if(product.video){

let videoThumb = document.createElement("div");
videoThumb.className = "video-thumb";


const img = document.createElement("img");

let thumbnail = product.video
.replace("/video/upload/", "/video/upload/so_1/")
.replace(".mov", ".jpg");

img.src = thumbnail;
img.className = "video-thumb-image";


const icon = document.createElement("span");
icon.innerHTML = "▶";


videoThumb.appendChild(img);
videoThumb.appendChild(icon);

videoThumb.onclick = () => {

mainImage.style.display = "none";
mainVideo.style.display = "block";
mainVideo.src = product.video;

};

thumbs.appendChild(videoThumb);

}

}


}

}


});
const langButtons = document.querySelectorAll(".language-switch a");

langButtons.forEach(button => {

button.addEventListener("click", function(e){

e.preventDefault();

if(this.innerText === "EN"){

localStorage.setItem("language", "en");

}else{

localStorage.setItem("language", "sq");

}

location.reload();

});

});
console.log("MAIN JS LOADED");