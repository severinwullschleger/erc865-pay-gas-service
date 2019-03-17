import {isProduction} from "../helpers/isProduction.mjs";
import express from 'express';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cors from 'cors';
import router from "./routes/index.mjs";
import path from "path";

const __dirname = path.resolve();

const startApplication = () => {
  if (!isProduction()) {
    dotenv.config();  //import env variables from .env file
  }

  const app = express();

  // Serve static files from the React app
  if (isProduction()) {
    app.use(express.static(path.join(__dirname, '/build')));
  }

  //Parses the text as URL encoded data
  app.use(bodyParser.urlencoded({extended: true}));
  //Parses the text as JSON and exposes the resulting object on req.body.
  app.use(bodyParser.json());

  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://erc865-pay-gas-service.herokuapp.com'
    ]
  }));

  app.use('/api', router);

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  if (isProduction()) {
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '/build/index.html'));
    });
  }

  app.listen(process.env.PORT || 8080, () => {
    console.log('App started. Date: ' + new Date().toString()
      + '\nApp listens on port ' + process.env.PORT + '.');
  });
};

export default startApplication();