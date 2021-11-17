import express from 'express';
import { Contenedor } from "../contenedor.js";
import mysqlOpt from "../options/mysql.js"

const { Router } = express;

const mysql = new Contenedor(mysqlOpt, 'products')
const router = new Router();

router.get('/', async (req, res) => {
  const data = await mysql.getAll();
  res.json(data);
});

router.post('/', async (req, res) => {
  try {
    await mysql.save(req.body);
    res.status(200).json({success: 'ok'});
  } catch (error) {
    res.status(500).json({error: 'cannot insert into db'});
  }
});

export default router;