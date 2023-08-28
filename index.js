const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

const chatGPTController = require("./services/chatgpt");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/prompt", chatGPTController);

app.listen(process.env.PORT || 8080);
