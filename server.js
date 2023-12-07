const express = require('express');
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();

const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
};

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use(routes);

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/TV-Tracker",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);


app.listen(PORT, () => {
  console.log('Server listening on http://localhost:8000');
});