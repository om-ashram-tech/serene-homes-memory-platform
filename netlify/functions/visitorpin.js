// netlify/functions/visitorPin.js
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const VisitorPin = require("./models/VisitorPin");

exports.handler = async (event) => {
  await connectDB();

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { pin } = JSON.parse(event.body);

  const hash = await bcrypt.hash(pin, 10);

  // store single record (overwrite old)
  await VisitorPin.deleteMany({});
  await VisitorPin.create({ pinHash: hash });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
