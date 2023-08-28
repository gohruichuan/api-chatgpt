require("dotenv").config();

const Joi = require("joi");
const express = require("express");
const { createClient } = require("pexels");

const router = new express.Router();

router.get("/", async (req, res) => {
  const payload = req.query;

  const schema = Joi.object({
    location: Joi.string().required(),
  }).required();

  try {
    const validData = await schema.validateAsync(payload);
    const query = validData.location;

    const client = createClient(process.env.PEXELS_API_KEY);

    const data = await client.photos
      .search({ query, per_page: 1 })
      .then((photos) => {
        return photos;
      });
    res.send(JSON.parse(JSON.stringify(data)));
  } catch (e) {
    res.status(400);
    res.send(e);
  }
});

module.exports = router;
