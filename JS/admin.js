import { db, auth } from "./firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const loginButton = document.querySelector("#login-button");
const emailInput = document.querySelector("#admin-email");
const passwordInput = document.querySelector("#admin-password");

const adminLogin = document.querySelector("#admin-login");
const adminPanel = document.querySelector("#admin-panel");


if (loginButton) {

    loginButton.addEventListener("click", async () => {

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {

            await signInWithEmailAndPassword(auth, email, password);

            adminLogin.style.display = "none";
            adminPanel.style.display = "block";

        } catch (error) {

            console.log(error);

            alert("Wrong email or password");

        }

    });

}




const CLOUD_NAME = "wlbbmdj3";
const UPLOAD_PRESET = "aldoo_upload";

const saveButton = document.querySelector("#save-product-button");

async function uploadImage(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

   const response = await fetch(
    "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/image/upload",
    {
        method: "POST",
        body: formData
    }
);

    const data = await response.json();

    return data.secure_url;

}

async function uploadVideo(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

 const response = await fetch(
    "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/video/upload",
    {
        method: "POST",
        body: formData
    }
);

    const data = await response.json();

    return data.secure_url;

}
saveButton.addEventListener("click", async function () {

    const name = document.querySelector('input[placeholder="Product name"]').value;
    const price = document.querySelector('input[placeholder="Price"]').value;
    const description = document.querySelector("textarea").value;

    const category = document.querySelector("#category").value;
    const material = document.querySelector("#material").value;
    const dimensions = document.querySelector("#dimensions").value;

    const photoFiles = document.querySelector("#photos").files;
    const videoFile = document.querySelector("#video").files[0];

    const id = name
        .toLowerCase()
        .replaceAll(" ", "-");

    saveButton.disabled = true;
    saveButton.textContent = "Uploading...";

    try {

        const imageUrls = [];

        for (const file of photoFiles) {

            const url = await uploadImage(file);

            imageUrls.push(url);

        }

        let videoUrl = "";

        if (videoFile) {

            videoUrl = await uploadVideo(videoFile);

        }
        await addDoc(collection(db, "products"), {

            id: id,
            name: name,
            price: price,
            description: description,
            category: category,
            material: material,
            dimensions: dimensions,
            images: imageUrls,
            video: videoUrl

        });


        alert("Product saved successfully!");

        location.reload();


    } catch (error) {

        console.log(error);

        alert("Error saving product");

    }


    saveButton.disabled = false;
    saveButton.textContent = "Save Product";


});
const adminProductsList = document.querySelector("#admin-products-list");

async function loadAdminProducts() {

    if (!adminProductsList) return;

    const snapshot = await getDocs(collection(db, "products"));

    adminProductsList.innerHTML = "";

    snapshot.forEach((productDoc) => {

        const product = productDoc.data();

        const div = document.createElement("div");

        div.innerHTML = `
        <p><b>${product.name}</b></p>
        <p>${product.price}</p>
        <button>Delete</button>
        `;

        const deleteButton = div.querySelector("button");

        deleteButton.addEventListener("click", async () => {

            const confirmDelete = confirm("Delete this product?");

            if (!confirmDelete) return;

            await deleteDoc(doc(db, "products", productDoc.id));

            loadAdminProducts();

        });

        adminProductsList.appendChild(div);

    });

}

loadAdminProducts();