import express from 'express';
import { Contenedor } from "../contenedor.js";
import mysqlOpt from "../options/mysql.js"

import productFaker from "../helpers/faker.js"

const { Router } = express;

const mysql = new Contenedor(mysqlOpt, 'products')
const router = new Router();

router.get('/', async (req, res) => {
  res.json(productFaker());
});


export default router;