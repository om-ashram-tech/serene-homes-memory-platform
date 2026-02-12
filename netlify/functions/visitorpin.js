// netlify/functions/visitorPin.js
const connectDB = require("./db");
const VisitorPin = require("./models/VisitorPin");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    await connectDB();

    const pinDoc = await VisitorPin.findOne({});

    return {
      statusCode: 200,
      body: JSON.stringify({
        pin: pinDoc ? pinDoc.pin : null,
      }),
    };
  } catch (err) {
    console.error("Error fetching PIN:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ pin: null }),
    };
  }
};
