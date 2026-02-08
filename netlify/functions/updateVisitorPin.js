// netlify/functions/updateVisitorPin.js
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
        body: JSON.stringify({ success: false, message: "PIN must be 4 digits" }),
      };
    }

    const hash = await bcrypt.hash(pin, 10);

    // Ensure only one active PIN exists
    await VisitorPin.deleteMany({});
    await VisitorPin.create({ pinHash: hash });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Update Visitor PIN error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" }),
    };
  }
};
