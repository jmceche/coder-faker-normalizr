import express from 'express';
import Container from "../mongoContainer.js";
import product from "../models/product.js"

const { Router } = express;

const mongo = new Container(product)
const router = new Router();

router.get('/', async (req, res) => {
  const data = await mongo.findAll();
  res.json(data);
});

router.post('/', async (req, res) => {
  try {
    await mongo.create(req.body);
    res.status(200).json({success: 'ok'});
  } catch (error) {
    res.status(500).json({error: 'cannot insert into db'});
  }
});

export default router;