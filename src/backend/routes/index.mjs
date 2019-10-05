import express from 'express';
import {requestHandler} from "./requestHandler.mjs";
import {sendTransferPreSignedTransaction} from "../services/transfer.mjs";
import {sendTransferAndCallPreSignedTransaction} from "../services/transferAndCall.mjs";

const router = express.Router();

router.post(
  '/transfer',
  requestHandler(async req => {
    return sendTransferPreSignedTransaction(req.body);
  })
);


router.post(
  '/transferAndCall',
  requestHandler(async req => {
    return sendTransferAndCallPreSignedTransaction(req.body);
  })
);

router.post(
  '/transferAndCall/gasEstimation',
  requestHandler(async req => {
    return gasEstimation(req.body);
  })
);


export default router;
