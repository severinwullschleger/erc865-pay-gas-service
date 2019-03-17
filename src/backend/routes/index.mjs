import express from 'express';
import {requestHandler} from "./requestHandler.mjs";
import {sendTransferPreSignedTransaction} from "../services/transfer.mjs";

const router = express.Router();

router.post(
  '/transfer',
  requestHandler(async req => {
    return sendTransferPreSignedTransaction(req.body);
  })
);


export default router;
