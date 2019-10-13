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