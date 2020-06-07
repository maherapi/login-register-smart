const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

// global middlewares
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

// import routes
const routes = require('./routes')
app.use(routes)

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
