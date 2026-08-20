import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

    let firebaseSnapshot;

    try {
        firebaseSnapshot = await getDocs(
            collection(db, "products")
        );
    } catch (error) {
        console.log(error);
        return;
    }

    const products = [];

    firebaseSnapshot.forEach((productDoc) => {
        products.push(productDoc.data());
    });

    console.log(products);

    const grid = document.getElementById("collections-grid");


    // ==============================
    // COLLECTIONS PAGE
    // ==============================

    if (grid) {

        function showProducts(category = "all") {

            grid.innerHTML = "";

            const filteredProducts =
                category === "all"
                    ? products
                    : products.filter(product =>
                        product.category &&
                        product.category.toLowerCase() ===
                        category.toLowerCase()
                    );


            filteredProducts.forEach(product => {

                const card = document.createElement("div");

                card.className = "product-card";


                let imageHTML = "";

                if (
                    product.images &&
                    product.images.length > 0
                ) {

                    imageHTML = `
                        <img
                            src="${product.images[0]}"
                            alt="${product.name}"
                        >
                    `;

               } else if (product.video) {

    const videoThumbnail = product.video
        .replace("/video/upload/", "/video/upload/so_1/")
        .replace(".mov", ".jpg");

    imageHTML = `
        <img
            src="${videoThumbnail}"
            alt="${product.name}"
        >
    `;

} else {

                    imageHTML = `
                        <img
                            src="images/logo.png"
                            alt="${product.name}"
                        >
                    `;

                }


                card.innerHTML = `

                    ${imageHTML}

                    <h3>${product.name}</h3>

                    <p>${product.price}</p>

                    <a href="product-detail.html?id=${product.id}">
                        View Product
                    </a>

                `;


                grid.appendChild(card);

            });

        }


        showProducts();


        const filterButtons =
            document.querySelectorAll(".filter-btn");


        filterButtons.forEach(button => {

            button.addEventListener("click", () => {

                const category =
                    button.dataset.filter;

                showProducts(category);


                filterButtons.forEach(btn => {
                    btn.classList.remove("active");
                });


                button.classList.add("active");

            });

        });

    }


    // ==============================
    // PRODUCT DETAIL PAGE
    // ==============================

    const productId =
        new URLSearchParams(
            window.location.search
        ).get("id");


    if (productId) {

        const product =
            products.find(
                item => item.id === productId
            );


        if (product) {

            const name =
                document.getElementById("pd-name");

            const price =
                document.getElementById("pd-price");

            const desc =
                document.getElementById("pd-desc");

            const material =
                document.getElementById("pd-material");

            const dimensions =
                document.getElementById("pd-dimensions");

            const mainImage =
                document.getElementById(
                    "gallery-main-img"
                );

            const mainVideo =
                document.getElementById(
                    "gallery-main-video"
                );

            const thumbs =
                document.getElementById(
                    "gallery-thumbs"
                );

            const lightbox =
                document.getElementById(
                    "media-lightbox"
                );

            const lightboxImg =
                document.getElementById(
                    "lightbox-img"
                );

            const lightboxVideo =
                document.getElementById(
                    "lightbox-video"
                );

            const lightboxClose =
                document.getElementById(
                    "lightbox-close"
                );


            // PRODUCT INFORMATION

            if (name) {
                name.textContent = product.name;
            }

            if (price) {
                price.textContent = product.price;
            }

            if (desc) {
                desc.textContent =
                    product.description || "";
            }

            if (material) {
                material.textContent =
                    product.material || "";
            }

            if (dimensions) {
                dimensions.textContent =
                    product.dimensions || "";
            }


            // ==============================
            // MAIN IMAGE
            // ==============================

            if (mainImage) {

                if (
                    product.images &&
                    product.images.length > 0
                ) {

                    mainImage.src =
                        product.images[0];

                    mainImage.alt =
                        product.name;

                    mainImage.style.display =
                        "block";


                    if (mainVideo) {

                        mainVideo.pause();

                        mainVideo.style.display =
                            "none";

                    }

                } else if (product.video) {

                    mainImage.style.display =
                        "none";


                    if (mainVideo) {

                        mainVideo.src =
                            product.video;

                        mainVideo.style.display =
                            "block";

                        mainVideo.controls =
                            true;

                        mainVideo.playsInline =
                            true;

                    }

                }

            }


            // ==============================
            // THUMBNAILS
            // ==============================

            if (thumbs) {

                thumbs.innerHTML = "";


                if (
                    product.images &&
                    product.images.length > 0
                ) {

                    product.images.forEach(image => {

                        const img =
                            document.createElement(
                                "img"
                            );

                        img.src = image;

                        img.alt =
                            product.name;


                        img.onclick = () => {

                            if (mainVideo) {

                                mainVideo.pause();

                                mainVideo.style.display =
                                    "none";

                            }


                            if (mainImage) {

                                mainImage.style.display =
                                    "block";

                                mainImage.src =
                                    image;

                            }

                        };


                        thumbs.appendChild(img);

                    });

                }


                // VIDEO THUMBNAIL

                // VIDEO THUMBNAIL

if (product.video) {

    const videoThumb = document.createElement("div");
    videoThumb.className = "video-thumb";

    const video = document.createElement("video");

    video.src = product.video;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");

    const icon = document.createElement("span");
    icon.innerHTML = "▶️";

    videoThumb.appendChild(video);
    videoThumb.appendChild(icon);

    videoThumb.onclick = () => {

        if (mainImage) {
            mainImage.style.display = "none";
        }

        if (mainVideo) {
            mainVideo.src = product.video;
            mainVideo.style.display = "block";
            mainVideo.controls = true;
            mainVideo.playsInline = true;
        }

    };

    thumbs.appendChild(videoThumb);

}

            }


            // ==============================
            // LIGHTBOX
            // ==============================

            if (
                mainImage &&
                lightbox
            ) {

                mainImage.onclick = () => {

                    lightbox.style.display =
                        "flex";


                    if (
                        lightboxImg &&
                        mainImage.style.display !==
                            "none"
                    ) {

                        lightboxImg.src =
                            mainImage.src;

                        lightboxImg.style.display =
                            "block";

                    }


                    if (lightboxVideo) {

                        lightboxVideo.pause();

                        lightboxVideo.style.display =
                            "none";

                    }

                };

            }


            if (lightboxClose) {

                lightboxClose.onclick = () => {

                    if (lightbox) {

                        lightbox.style.display =
                            "none";

                    }


                    if (lightboxVideo) {

                        lightboxVideo.pause();

                    }

                };

            }

        }

    }


    // ==============================
    // LANGUAGE SWITCH
    // ==============================

    const langButtons =
        document.querySelectorAll(
            ".language-switch a"
        );


    langButtons.forEach(button => {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    this.innerText.trim() ===
                    "EN"
                ) {

                    localStorage.setItem(
                        "language",
                        "en"
                    );

                } else {

                    localStorage.setItem(
                        "language",
                        "sq"
                    );

                }


                location.reload();

            }
        );

    });


    console.log("MAIN JS LOADED");

});