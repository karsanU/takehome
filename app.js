// create server
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const globalVariables = require('./globalVariables');

// CROSS
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type ,  Authorization,");
    next();
};
app.use(allowCrossDomain);

// setup 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// start server 
app.use(require('./routes/orders'));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


