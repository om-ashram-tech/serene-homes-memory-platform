const connectDB = require("./db");
const Resident = require("./models/Resident");

exports.handler = async (event) => {
  try {
    await connectDB();

    const qs = event.queryStringParameters || {};
    const token = qs.token;

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing token" }),
      };
    }

    // 🔑 Direct lookup using public_token
    const resident = await Resident.findOne({ public_token: token });

    if (!resident) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Invalid or expired link" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(resident),
    };
  } catch (err) {
    console.error("accessTemp error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error" }),
    };
  }
};
