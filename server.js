const express = require("express");
const app = express();
app.use(express.static("./public"));

require("dotenv").config()

app.listen(process.env.PORT, () => {
    console.log(`Frontend is ready at localhost:${process.env.PORT}`)
})