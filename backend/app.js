import express from "express";
import mongoose from "mongoose";
import {User} from "./src/models/db.js";
import bodyParser from "body-parser";
import router from "./src/routes/router.js";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import {requireAuth,checkUser,menuItems,fetchUserOrders} from "./src/middleware/authmiddleware.js";

const app = express();
const PORT = 3000;

// MongoDB Connection URI
const uri = "mongodb+srv://omsrivastava3466:6ezZ5npsRXPOCLw3@food.ab0jh.mongodb.net/Food?retryWrites=true&w=majority";

// Middleware for JSON parsing
app.set("views", path.join(path.resolve(), "src/views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Middleware
app.use(cors()); // Allows requests from all origins

// Routes
app.use(router);

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("*",checkUser);


app.get("/", (req, res) => {
  res.render("home");
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Serve signup page
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/adminsignup', (req, res) => {
  res.render('adminsignup');
});


app.get('/add_item', (req, res) => {
  res.render('add_item');
});

app.get('/secret',requireAuth,(req,res)=>{
  res.render('secret');
})


app.get("/order",menuItems);
app.get('/order',(req,res)=>{
  res.render('order');
})

app.get("/basket",fetchUserOrders);
app.get('/basket',(req,res)=>{
  res.render('basket');
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});