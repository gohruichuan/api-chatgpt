const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

const chatGPTController = require("./services/chatgpt");
const imagesController = require("./services/image");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/prompt", chatGPTController);
app.use("/findImg", imagesController);

app.listen(process.env.PORT || 8080);
