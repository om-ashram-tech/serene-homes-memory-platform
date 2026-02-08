const QRCode = require("qrcode");

exports.handler = async (event) => {
  try {
    const { token } = event.queryStringParameters;

    if (!token) {
      return {
        statusCode: 400,
        body: "Missing token"
      };
    }

    // This is the EXACT link visitors scan
    const visitorURL = `https://yourdomain.com/qr/${token}`;

    const pngBuffer = await QRCode.toBuffer(visitorURL);

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: pngBuffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error("QR GENERATION ERROR:", error);

    return {
      statusCode: 500,
      body: "Failed to generate QR"
    };
  }
};
