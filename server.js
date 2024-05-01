const express = require("express");
const AdminFirebase = require("firebase-admin"); // firebase
const serviceAccount = require("./servicesAccountKey.json");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const store = new session.MemoryStore();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const categoryRoute = require("./routes/category");
const workerRoute = require("./routes/worker");
const orderRoute = require("./routes/order");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // is used to configure the Express application to parse data from incoming HTML forms. This line is setting up middleware for parsing URL-encoded data, typically submitted through HTML forms using the application/x-www-form-urlencoded content type.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, 
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

AdminFirebase.initializeApp({
  credential: AdminFirebase.credential.cert(serviceAccount),
});
const url = process.env.MONGO_URL;
const port = process.env.PORT;

mongoose.connect(url).then(() => {
  console.log("mongodb server connected");
});

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/", authRoute);
app.use("/api/users", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/worker", workerRoute);
app.use("/api/order", orderRoute);

app.listen(port, () => console.log(`Runing app listening on port ${port}!`));
