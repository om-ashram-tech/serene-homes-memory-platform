const connectDB = require("./db");
const Story = require("./models/Story");

exports.handler = async (event) => {
  await connectDB();

  const method = event.httpMethod;

  // ✅ GET STORIES
  if (method === "GET") {
    try {
      const residentId = event.queryStringParameters?.residentId;
      const data = await Story.find({ residentId }).sort({ createdAt: -1 });
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (err) {
      console.error("Story fetch error:", err);
      return { statusCode: 500, body: "Failed to fetch stories" };
    }
  }

  // ✅ ADD STORY
  if (method === "POST") {
    try {
      const data = JSON.parse(event.body);

      const story = await Story.create({
        residentId: data.residentId,
        title: data.title,
        content: data.content,
        authorName: data.authorName,
      });

      return {
        statusCode: 200,
        body: JSON.stringify(story),
      };
    } catch (err) {
      console.error("Story create error:", err);
      return { statusCode: 500, body: "Failed to add story" };
    }
  }
    if (method === "DELETE") {
    try {
        const { id } = JSON.parse(event.body);
        await Story.findByIdAndDelete(id);
        return { statusCode: 200, body: "Story deleted" };
    } catch (err) {
        return { statusCode: 500, body: "Delete failed" };
    }
}


  return { statusCode: 405, body: "Method Not Allowed" };
};
