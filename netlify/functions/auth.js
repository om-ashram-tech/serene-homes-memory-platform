const connectDB = require("./db");
const AdminUser = require("./models/AdminUser");
const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  try {
    await connectDB();

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password required" }),
      };
    }

    const admin = await AdminUser.findOne({ email });

    if (!admin) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    // ⚠ PLAIN PASSWORD COMPARISON (no bcrypt)
    if (admin.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login success",
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      }),
    };
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", error: error.toString() }),
    };
  }
};
