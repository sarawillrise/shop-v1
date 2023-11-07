const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const app = express();
const PORT = 3000;

let cart = []
let users = [{
  email: "humbert@gmail.com",
  username: "dolores",
  password: "1212",
  userId: 1697971059751,
}];
let categories = require("./categories.json");
let products = require("./products.json");
let imagesPrefix = {
  categories: "/images/categories",
  products: "images/products",
};

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/user", (req, res) => {
  res.send("Hello Sara!");
});

app.post("/cart", (req, res) => {
  const postData = req.body;
  let productId = postData.productId
  let userId = parseInt(req.header("userid"))

  if (!userId || !users.find(u => u.userId === userId)) {
    res.status(403).send("Unauthorized");
    return;
  }
  if (!productId || !products.find(p => p.id === productId)) {
    res.status(400).send("Product not found");
    return;
  }

  let existingItem = cart.find(c => c.userId === userId && productId === c.productId)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({userId, productId, quantity: 1})
  }
  res.send(cart.find(c => c.productId === productId));
});

app.get("/cart", (req, res) => {
  let userId = parseInt(req.header("userid"))
  if (!userId || !users.find(u => u.userId === userId)) {
    res.status(403).send("Unauthorized");
    return;
  }
  res.send(cart.filter(c => c.userId === userId));
});

app.post("/register", (req, res) => {
  const postData = req.body;
  console.log(postData);
  // res.send(postData)

  if (!postData.username || !postData.username.length) {
    res.status(400).send("Username cannot be empty");
    return;
  }

  let userAlreadyExists = users.find(function (user) {
    return user.username === postData.username;
  });
  if (userAlreadyExists) {
    res.status(400).send("User already exists");
    return;
  }

  let userId = new Date().getTime();
  let user = {
    email: postData.email,
    username: postData.username,
    password: postData.password,
    userId: userId,
  };
  users.push(user);

  res.send(user);
});

app.post("/login", (req, res) => {
  const postData = req.body;
  console.log(postData);

  if (!postData.username || !postData.username.length) {
    res.status(401).send("User not found");
    return;
  }

  let user = users.find(function (user) {
    return (
      user.username === postData.username && user.password === postData.password
    );
  });
  if (user) {
    res.send(user);
  } else {
    res.status(401).send("User not found");
  }
});

app.get("/categories", (req, res) => {
  let type = req.query.type;
  res.send(categories.filter((category) => category.type === type));
});

app.get("/products", (req, res) => {
  let category = req.query.category !== undefined ? parseInt(req.query.category) : undefined;
  res.send(
    products
      .filter(product => product.category === category || category === undefined)
      .map((g) => ({
        ...g,
        images: g.images.map((i) => `${imagesPrefix.products}/${g.id}/${i}`),
      }))
  );  
});

app.use((req, res) => {
  res.status(404).send("This is Sara's computer");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
