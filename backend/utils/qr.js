import QRCode from "qrcode";

export const generateQR = async (itemId) => {
  return await QRCode.toDataURL(`claim-item-${itemId}`);
};

export const generateQRCode = async (itemId) => {
  try {
    const qrDataUrl = await generateQR(itemId);
    return qrDataUrl;
    } catch (err) {
        console.error("QR code generation error:", err);
        throw new Error("Failed to generate QR code");
    }
};

export default generateQRCode;