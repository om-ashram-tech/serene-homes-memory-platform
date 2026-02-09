const connectDB = require("./db");
const Resident = require("./models/Resident");

exports.handler = async (event) => {
  // ✅ Safe DB connection (prevents 502 crashes)
  try {
    await connectDB();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Database connection failed" }),
    };
  }

  const method = event.httpMethod;
  const qs = event.queryStringParameters || {};

  // -------------------------------
  // CREATE RESIDENT
  // -------------------------------
  if (method === "POST") {
    try {
      const data = JSON.parse(event.body);

      // ✅ Simple Netlify-safe token (no uuid)
      const publicToken = Math.random().toString(36).substring(2, 10);

      const resident = await Resident.create({
        name: data.name,
        age: data.age,
        gender: data.gender,
        short_bio: data.shortBio,
        room_number: data.roomNumber,
        profile_photo_url: data.profilePhotoUrl || "",
        extra_photos: data.extraPhotos || [],
        public_token: publicToken,
      });

      return {
        statusCode: 200,
        body: JSON.stringify(resident),
      };
    } catch (err) {
      console.error("❌ Create error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to create resident" }),
      };
    }
  }

  // -------------------------------
  // GET ALL RESIDENTS
  // -------------------------------
  if (method === "GET" && !qs.id && !qs.token) {
    try {
      const all = await Resident.find().lean();
      return {
        statusCode: 200,
        body: JSON.stringify(all),
      };
    } catch (err) {
      console.error("❌ Fetch all error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to fetch residents" }),
      };
    }
  }

  // -------------------------------
  // GET RESIDENT BY ID
  // -------------------------------
  if (method === "GET" && qs.id) {
    try {
      const resident = await Resident.findById(qs.id).lean();

      if (!resident) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Resident not found" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(resident),
      };
    } catch (err) {
      console.error("❌ Fetch by ID error:", err);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid ID" }),
      };
    }
  }

  // -------------------------------
  // GET RESIDENT BY PUBLIC TOKEN (QR)
  // -------------------------------
  if (method === "GET" && qs.token) {
    try {
      const resident = await Resident.findOne({
        public_token: qs.token,
      }).lean();

      if (!resident) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Invalid QR token" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(resident),
      };
    } catch (err) {
      console.error("❌ Fetch by token error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to fetch resident" }),
      };
    }
  }

  // -------------------------------
  // DELETE RESIDENT
  // -------------------------------
  if (method === "DELETE" && qs.id) {
    try {
      const deleted = await Resident.findByIdAndDelete(qs.id);

      if (!deleted) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Resident not found" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Resident deleted" }),
      };
    } catch (err) {
      console.error("❌ Delete error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Delete failed" }),
      };
    }
  }

  // -------------------------------
  // UPDATE BIO + PROFILE PHOTO
  // -------------------------------
  if (method === "PUT") {
    try {
      const data = JSON.parse(event.body);

      const updated = await Resident.findByIdAndUpdate(
        data.id,
        {
          short_bio: data.shortBio,
          profile_photo_url: data.profilePhotoUrl,
        },
        { new: true }
      );

      if (!updated) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Resident not found" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(updated),
      };
    } catch (err) {
      console.error("❌ Update error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Update failed" }),
      };
    }
  }

  // -------------------------------
  // FALLBACK
  // -------------------------------
  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method Not Allowed" }),
  };
};
