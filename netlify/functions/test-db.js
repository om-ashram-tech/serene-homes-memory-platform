const connectDB = require("./db");

exports.handler = async () => {
  try {
    await connectDB();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "DB connection OK" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "DB failed", error: err.toString() })
    };
  }
};
