import express from "express";
import session from "express-session";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

dotenv.config()

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }


export function useMiddlewares(app) {
  // static
  app.use(express.static("./public"))
  app.use(express.urlencoded({extended: true}))
  app.use(express.json())
  app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      mongoOptions: advancedOptions,
    }),
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
  }))
  app.use(cookieParser());
}