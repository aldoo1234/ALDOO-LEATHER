window.firebaseProducts = [];

async function loadFirebaseProducts(){

const snapshot = await getDocs(collection(db, "products"));

snapshot.forEach((doc)=>{

window.firebaseProducts.push(doc.data());

});


window.products.push(...window.firebaseProducts);


console.log("Firebase products:", window.firebaseProducts);

}

loadFirebaseProducts();