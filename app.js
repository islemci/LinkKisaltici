require("dotenv").config();
const express = require("express");
const apiRoutes = require("./routes/api");

const hbs = require("express-handlebars");

const app = express();

const PORT = "8080";

const db = require("./db_connect");

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "default",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/"
  })
);
app.set("view engine", "hbs");

app.use(express.json());
app.use("/static", express.static("public"));
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Sunucu portu dinliyor: ${PORT}`);
});
