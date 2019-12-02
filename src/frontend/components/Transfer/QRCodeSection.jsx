import React from 'react'
import QrReader from "react-qr-reader";

export const QRCodeSection = ({ handleScan, handleError, ...otherProps }) => {
  return (
    <QrReader
      delay={300}
      onError={handleError}
      onScan={handleScan}
      style={{ width: "100%" }}
    />
  );
};

const QRCodeContent = {
  pk: "95FE3783808009AFDA9A614D46511E304FD435C7E0ECE24A52E20D0A16C50C8F",
  tokenAddress: "0xB5C9Fad1b0b108116c3b35311480f3d77cA4A5aC",
    to: "0x8203DE77aaA67ae7fA79b332Cb15A7826B611999",
  methodName: "0xdd5c6fb9",
  value: 500,
};

// create qr code as json object not as string
const QRCodeContentStrifified = {"pk":"95FE3783808009AFDA9A614D46511E304FD435C7E0ECE24A52E20D0A16C50C8F","tokenAddress":"0xB5C9Fad1b0b108116c3b35311480f3d77cA4A5aC","to":"0x8203DE77aaA67ae7fA79b332Cb15A7826B611999","methodName":"0xdd5c6fb9","value":500};
const geth2 = {"pk":"0107CED9925C22ECD0CF4455A30C627058FD3FA169226572A1B6A18E80258426","tokenAddress":"0x4Ac8dA8F56ad0B330E088EAbA8b43785C31Ef103","to":"0xAE1b71dCFd5535BD13985719f73C34aF283f627a","methodName":"0xc1a2aba3","value":5000000};
const geth3 = {"pk":"812F0A3505E216D5CEBE3914E5F4F0537F77ED0317E5A79E8C9C255F8F428428","tokenAddress":"0x4Ac8dA8F56ad0B330E088EAbA8b43785C31Ef103","to":"0xAE1b71dCFd5535BD13985719f73C34aF283f627a","methodName":"0xc1a2aba3","value":5000000}
const geth4 = {"pk":"5CC7DF95EB5972550F149E03AB4472E32CE50D3A3C3CB766B0120D84DFF75547","tokenAddress":"0x4Ac8dA8F56ad0B330E088EAbA8b43785C31Ef103","to":"0xAE1b71dCFd5535BD13985719f73C34aF283f627a","methodName":"0xc1a2aba3","value":5000000}