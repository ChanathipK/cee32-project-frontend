const express = require("express");
const app = express();
app.use(express.static("./public"));

require("dotenv").config()
app.get('/maingame', (req, res) => {
    res.sendFile('/Users/saritpasiphol/Desktop/cee32-project-frontend/public/maingame.html')
  })
app.listen(process.env.PORT, () => {
    console.log(`Frontend is ready at localhost:${process.env.PORT}`)
})