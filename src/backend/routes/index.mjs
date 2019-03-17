import express from 'express';
import {requestHandler} from "./requestHandler.mjs";

const router = express.Router();

router.get(
  '/transfer',
  requestHandler(async req => {
    console.log("hi");
    // return sendTransferPreSignedTransaction(req.body);
  })
);


export default router;
