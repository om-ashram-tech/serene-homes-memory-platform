// netlify/functions/visitorLogin.js
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const VisitorPin = require("./models/VisitorPin");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    await connectDB();

    const { pin } = JSON.parse(event.body || "{}");

    if (!pin || !/^\d{4}$/.test(pin)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Invalid PIN format" }),
      };
    }

    const record = await VisitorPin.findOne();

    if (!record) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "PIN not set" }),
      };
    }

    const isValid = await bcrypt.compare(pin, record.pinHash);

    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Invalid PIN" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Visitor login error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" }),
    };
  }
};
