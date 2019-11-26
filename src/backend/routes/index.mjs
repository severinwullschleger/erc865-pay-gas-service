import express from 'express';
import {requestHandler} from "./requestHandler.mjs";
import {sendTransferPreSignedTransaction} from "../services/transfer.mjs";
import {feeEstimation, sendTransferAndCallPreSignedTransaction} from "../services/transferAndCall.mjs";
import {getTransaction, getTransactions} from "../db/transactions-services.mjs";

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
    return feeEstimation(req.body);
  })
);

router.get(
  "/transactions",
  requestHandler(async req => {
    if (req.query.fromAddresses)
      return getTransactions(req.query.fromAddresses.split(","));
    else return getTransactions();
  })
);

router.get(
  '/transactions/:txHash',
  requestHandler(async req => {
    return getTransaction(req.params.txHash);
  })
);


export default router;
