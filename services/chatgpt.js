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
  const payload = req.query;

  const schema = Joi.object({
    location: Joi.string().required(),
    days: Joi.string().required(),
  }).required();

  try {
    const validData = await schema.validateAsync(payload);
    console.log("validData.location ", validData.location);

    console.log("validData.days ", validData.days);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        { role: "system", content: "AI Travel Planner" },
        {
          role: "user",
          content:
            // `best places to go in ${validData.location} for ${validData.days} Days with the following:

            // - Opening hours
            // - Sequence of visit
            // - description of the place
            // - Transport from place to place and its description

            // Format output to JSON`,
            `create a valid JSON array of objects for the best places to go in ${validData.location} for ${validData.days} Days in the Sequence of visits following this format:
            [{
            "introduction":"write an introduction of the day",
            "places": [{
              "name": "name of the place",
              "opening_hours": "Opening hours of the place",
              "description": "description of the place",
              "transport": "Transport from place to place and its description"}]
            }]`,
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
