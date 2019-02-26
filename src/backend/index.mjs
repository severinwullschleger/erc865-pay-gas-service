import {isProduction} from "../helpers/isProduction.mjs";
import express from 'express';
import dotenv from "dotenv";

const startApplication = () => {
  if (!isProduction()) {
    dotenv.config();  //import env variables from .env file
  }

  const app = express();

  app.listen(process.env.PORT || 8080, () => {
    console.log('App started. Date: ' + new Date().toString());
  });
};

export default startApplication();