let main = document.getElementById("main");
let optionsPage = document.getElementById("options");
let productPage = document.getElementById("products");
let bigPP = document.getElementById("showProducts");
let nextBtn = document.getElementById("nextBtn1");
let prevBtn = document.getElementById("prev");
let prevBtn2 = document.getElementById("prev2");
let blockBtnPage = document.getElementById("button-block2");
let girişPag = document.getElementById("giriş");
let kayitPag = document.getElementById("kayit");
let kayitBtn = document.getElementById("kayitBtn");
let girişBtn = document.getElementById("girişBtn");
let kayitName = document.getElementById("kayitNameInpt");
let kayitMail = document.getElementById("kayitMailInpt");
let kayitPass = document.getElementById("kayitPassInpt");
let girişName = document.getElementById("girişNameInpt");
let girişPass = document.getElementById("girişPassInpt");
let kayitLink = document.getElementById("kayitSayfasiL");
let girişLink = document.getElementById("girişSayfasiL");
let loggedInUser = null;
let cartItemList = [];
let cartPage = document.getElementById("cartPage");
let cartBtn = document.getElementById("cartBtn");
let productInfoDiv = document.createElement("div");
let mainCartDiv = document.getElementById("cart-productsD");

kayitLink.addEventListener("click", function () {
  kayitPag.style.display = "none";
  girişPag.style.display = "block";
});
girişLink.addEventListener("click", function () {
  kayitPag.style.display = "block";
  girişPag.style.display = "none";
});

kayitBtn.addEventListener("click", async function () {
  const bilgi = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: kayitName.value,
      email: kayitMail.value,
      password: kayitPass.value,
    }),
  };
  const kayitFetch = await fetch("http://localhost:3000/register", bilgi);
  const kayitFetchDone = await kayitFetch.json();
  kayitPag.style.display = "none";
  girişPag.style.display = "block";
});

girişBtn.addEventListener("click", async function () {
  const check = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: girişName.value,
      password: girişPass.value,
    }),
  };
  const myFetch = await fetch("http://localhost:3000/login", check);
  if (myFetch.status === 200) {
    const loginFetchDone = await myFetch.json();
    loggedInUser = loginFetchDone;
    main.style.display = "block";
    girişPag.style.display = "none";
    getCart();
  } else {
    alert("i don't know you");
  }
});

nextBtn.addEventListener("click", async function () {
  let fetchResponse = await fetch(
    "http://127.0.0.1:3000/categories?type=byGroup"
  );
  let categories = await fetchResponse.json();
  let buttonBlock2 = document.getElementById("button-block2");
  blockBtnPage.innerHTML = "";
  categories.forEach((category) => {
    let button = document.createElement("button");
    button.classList.add("img");
    let image = document.createElement("img");
    image.classList.add("img");
    image.src = category.image;
    button.appendChild(image);
    buttonBlock2.appendChild(button);
    button.onclick = clickCategory(category);
  });

  main.style.display = "none";
  optionsPage.style.display = "block";
});
prevBtn.addEventListener("click", function () {
  main.style.display = "block";
  optionsPage.style.display = "none";
});
prevBtn2.addEventListener("click", function () {
  main.style.display = "block";
  bigPP.style.display = "none";
});

function clickCategory(category) {
  return async function eventListenerFunction(event) {
    let productsFetch = await fetch(
      `http://127.0.0.1:3000/products?category=${category.id}`
    );
    let productsResponse = await productsFetch.json();
    showProducts(productsResponse);
  };
}

async function showProducts(productsList) {
  productPage.innerHTML = "";

  productsList.forEach((product) => {
    let mainProductDiv = document.createElement("div");
    let productImagesDiv = document.createElement("div");
    product.images.forEach((image) =>
      showProductImage(image, productImagesDiv)
    );

    const productName = document.createElement("div");
    productName.classList.add("product-name-class");
    // const productQuantityDiv = document.createElement("div");
    // productQuantityDiv.classList.add("product-quantity-class")

    let addBtn = document.createElement("button");
    addBtn.classList.add("add");
    addBtn.textContent = "add to card";
    mainProductDiv.appendChild(productImagesDiv);
    mainProductDiv.appendChild(addBtn);
    mainProductDiv.appendChild(productName);
    productPage.appendChild(mainProductDiv);
    productName.innerText = product.name;

    /*     let cartItemFound = cartItemList.find(function(cartItem) {
      return cartItem.productId === product.id
    })
    if (cartItemFound !== undefined) {
      productQuantityDiv.innerText = cartItemFound.quantity
    } */
    addBtn.addEventListener("click", () => addProductToCart(product));
  });
  main.style.display = "none";
  bigPP.style.display = "block";
  optionsPage.style.display = "none";
}

async function addProductToCart(product) {
  if (!loggedInUser) {
    alert("Login required");
    return;
  }
  const data = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: loggedInUser.userId,
    },
    body: JSON.stringify({ productId: product.id }),
  };
  const thisF = await fetch("http://127.0.0.1:3000/cart", data);
  const thisFetch = await thisF.json();

  /*
  await getCart()
  let cartItemFound = cartItemList.find(function(cartItem) {
    return cartItem.productId === product.id
  })
  if (cartItemFound !== undefined) {
    quantityInCart.innerText = "Quantity:"+""+ cartItemFound.quantity
  }
 */
}

async function getAllProducts() {
  let productsFetch1 = await fetch(`http://127.0.0.1:3000/products`);
  let products = await productsFetch1.json();
  return products;
}

cartBtn.addEventListener("click", function () {
  main.style.display = "none";
  optionsPage.style.display = "none";
  productPage.style.display = "none";
  cartPage.style.display = "block";
  showCartProducts();
});

async function showCartProducts() {
  await getCart();
  let products = await getAllProducts();
  const cartProductsDiv = document.getElementById("cart-productsD");
  cartProductsDiv.innerHTML = "";
  cartItemList.forEach((cartItem) => {
    let productImage = document.createElement("img");
    productImage.classList.add("img");
    productImage.src = cartItem.image;
    let productImgDiv = document.createElement("div");
    productImgDiv.appendChild(productImage);
    let ourProduct = products.find(
      (product) => product.id === cartItem.productId
    );
    let productPrice = ourProduct.price;
    let productQuantity = cartItem.quantity;
    let itemTotalPrice = productQuantity * productPrice + ourProduct.currency;
    let priceLine = document.createElement("p");
    let quantityLine = document.createElement("p");
    let totalLine = document.createElement("p");
    let productInfoDiv = document.createElement("div");
    productInfoDiv.classList.add("product-info");
    productInfoDiv.appendChild(priceLine)
    productInfoDiv.appendChild(quantityLine);
    productInfoDiv.appendChild(totalLine);
    cartProductsDiv.appendChild(productImgDiv)
    cartProductsDiv.appendChild(productInfoDiv)

    priceLine.innerText = "price:"+ productPrice + ourProduct.currency;
    quantityLine.innerText = "quantity:"+ productQuantity;
    totalLine.innerText = "total:" +itemTotalPrice

    console.log(itemTotalPrice);
  });
}


async function loadButtons() {
  let fetchResponse = await fetch(
    "http://127.0.0.1:3000/categories?type=byType"
  );
  let categories = await fetchResponse.json();
  let buttonBlock = document.getElementById("button-block");

  categories.forEach((category) => {
    let button = document.createElement("button");
    button.classList.add("img");
    let image = document.createElement("img");
    image.classList.add("img");
    image.src = category.image;
    button.appendChild(image);
    buttonBlock.appendChild(button);
    button.onclick = clickCategory(category);
  });
}

function showProductImage(image, productImagesDiv) {
  let productDiv = document.createElement("div");
  let productImg = document.createElement("img");
  productImg.src = image;
  productImg.classList.add("img");
  productDiv.appendChild(productImg);
  productImagesDiv.appendChild(productDiv);
}

async function getCart() {
  const item = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      userid: loggedInUser.userId,
    },
  };
  const thisItem = await fetch("http://127.0.0.1:3000/cart", item);
  cartItemList = await thisItem.json();
}

loadButtons();
