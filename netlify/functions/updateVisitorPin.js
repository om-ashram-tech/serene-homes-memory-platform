// netlify/functions/updateVisitorPin.js
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
        body: JSON.stringify({
          success: false,
          message: "PIN must be 4 digits",
        }),
      };
    }

    await VisitorPin.deleteMany({});
    await VisitorPin.create({ pin });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Update PIN error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Server error",
      }),
    };
  }
};
