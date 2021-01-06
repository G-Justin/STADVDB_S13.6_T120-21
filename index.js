const express = require("express");
const exphbs = require("express-handlebars");
const hbs = require("hbs");
const path = require("path");
const routes = require("./routes/routes.js");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("views"));

app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultView: "main",
    layoutsDir: path.join(__dirname, "/views/layouts"),
    partialsDir: path.join(__dirname, "/views/partials"),
  })
);
hbs.registerPartials(__dirname + "/views/partials");

app.use("/", routes);

let port = process.env.PORT;

if (port == null || port == "") {
  port = 3030;
}

//database.connect();

app.listen(port, function () {
  console.log("STADVDB listening at port " + port + ".");
});
