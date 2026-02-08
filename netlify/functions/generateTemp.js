const connectDB = require("./db");
const Resident = require("./models/Resident");
const TempAccessToken = require("./models/TempAccessToken");
const crypto = require("crypto");

exports.handler = async (event) => {
  try {
    await connectDB();

    const { token } = event.queryStringParameters || {};

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing resident token" })
      };
    }

    // 1️⃣ Verify resident exists
    const resident = await Resident.findOne({ public_token: token });
    if (!resident) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Invalid QR code" })
      };
    }

    // 2️⃣ Create a short-lived temp token
    const tempToken = crypto.randomBytes(24).toString("hex");

    // 3️⃣ Set expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 4️⃣ Store in DB (using correct schema field names)
    await TempAccessToken.create({
      residentToken: token,
      tempToken: tempToken,
      expiresAt: expiresAt
    });

    // 5️⃣ Return ONLY the tempToken
    return {
      statusCode: 200,
      body: JSON.stringify({ tempToken })
    };

  } catch (err) {
    console.error("Error generating temp token:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Server error while generating access link"
      })
    };
  }
};
