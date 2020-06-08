const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const app = express();
const PORT = 3000;

// global middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// import routes
const routes = require("./routes");
app.use(routes);

db.sequelize
  .sync()
  .then(() =>
    app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))
  );
