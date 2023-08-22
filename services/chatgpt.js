require("dotenv").config();

const Joi = require("joi");
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const router = new express.Router();

router.get("/", async (req, res) => {
  const payload = req.body;

  const schema = Joi.object({
    location: Joi.string().required(),
    days: Joi.number().required(),
  }).required();

  try {
    const validData = await schema.validateAsync(payload);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        { role: "system", content: "AI Travel Planner" },
        {
          role: "user",
          content: `best places to go in ${validData.location} for ${validData.days} Days with the following:
  
          - Opening hours
          - Sequence of visit
          - Transport from place to place and its description
          
          Format output to JSON`,
        },
      ],
    });
    // console.log(
    //   JSON.parse(JSON.stringify(completion.data.choices[0].message.content))
    // );
    res.send(
      JSON.parse(JSON.stringify(completion.data.choices[0].message.content))
    );
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
