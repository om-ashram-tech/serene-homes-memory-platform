const connectDB = require("./db");
const Media = require("./models/Media");

const cloudinary = require("cloudinary").v2;

// ✅ Cloudinary config (reads from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary ENV:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING"
});


// ✅ Extract Cloudinary public_id from URL
const getPublicId = (url) => {
  // Example:
  // https://res.cloudinary.com/dqeoxo7mc/image/upload/v1234567890/folder/abc.jpg
  const parts = url.split("/");
  const fileWithExt = parts[parts.length - 1];
  const fileName = fileWithExt.split(".")[0];

  // if you use folders in cloudinary
  const uploadIndex = parts.findIndex((p) => p === "upload");
  if (uploadIndex !== -1) {
    const publicPath = parts.slice(uploadIndex + 1).join("/");
    return publicPath.split(".")[0];
  }

  return fileName;
};

exports.handler = async (event) => {
  await connectDB();

  const method = event.httpMethod;

  // ================= GET MEDIA =================
  if (method === "GET") {
    try {
      const residentId = event.queryStringParameters?.residentId;

      if (!residentId) {
        return { statusCode: 400, body: "residentId required" };
      }

      const data = await Media.find({ residentId }).sort({ uploadedAt: -1 });

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (err) {
      console.error("Media fetch error:", err);
      return { statusCode: 500, body: "Failed to fetch media" };
    }
  }

  // ================= ADD MEDIA =================
  if (method === "POST") {
    try {
      const data = JSON.parse(event.body);

      if (!data.residentId || !data.url || !data.type) {
        return { statusCode: 400, body: "Missing fields" };
      }

      const media = await Media.create({
        residentId: data.residentId,
        type: data.type,
        url: data.url,
        publicId: data.publicId,
        title: data.title || "",
        description: data.description || "",
    });


      return {
        statusCode: 200,
        body: JSON.stringify(media),
      };
    } catch (err) {
      console.error("Media create error:", err);
      return { statusCode: 500, body: "Failed to add media" };
    }
  }

  // ================= DELETE MEDIA + CLOUDINARY =================
// ================= DELETE MEDIA + CLOUDINARY =================
    if (method === "DELETE") {
    try {
        let id = null;

        if (event.body) {
        const body = JSON.parse(event.body);
        id = body.id;
        }

        if (!id) {
        id = event.queryStringParameters?.id;
        }

        if (!id) {
        return { statusCode: 400, body: "Media ID required" };
        }

        const media = await Media.findById(id);

        if (!media) {
        return { statusCode: 404, body: "Media not found" };
        }

        // ✅ delete from Cloudinary ONLY if publicId exists
        if (media.publicId) {
        await cloudinary.uploader.destroy(media.publicId, {
            resource_type: media.type === "video" ? "video" : "image",
        });
        } else {
        console.warn("⚠ No publicId found, skipping Cloudinary delete");
        }

        // ✅ always delete from MongoDB
        await Media.findByIdAndDelete(id);

        return {
        statusCode: 200,
        body: JSON.stringify({ message: "Media deleted" }),
        };
    } catch (err) {
        console.error("Media delete error:", err);
        return { statusCode: 500, body: "Failed to delete media" };
    }
    }


  return { statusCode: 405, body: "Method Not Allowed" };
};
