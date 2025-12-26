import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST: create a draft
export async function POST(request: Request) {
  const user = await getAuth();
  const { topic, content } = await request.json();

  // Use parameterized query instead of string interpolation
  await db.query(
    `INSERT INTO post_drafts (user_id, provider, topic, content, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [user.userId, "linkedin", topic?.trim(), content, "draft"]
  );

  return new Response(JSON.stringify({ message: "Draft saved successfully" }), {
    status: 201,
  });
}

// PUT: update draft title + content
export async function PUT(request: Request) {
  const user = await getAuth();
  const { topicId, updatedTopic, updatedContent } = await request.json();

  if (!topicId || !updatedTopic || !updatedContent) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400 }
    );
  }

  await db.query(
    `
    UPDATE post_drafts
    SET topic = ?, content = ?
    WHERE user_id = ? AND provider = ? AND id = ?
    `,
    [updatedTopic.trim(), updatedContent, user.userId, "linkedin", topicId]
  );

  return new Response(
    JSON.stringify({ message: "Draft updated successfully" }),
    { status: 200 }
  );
}

// GET: fetch all titles OR content of a specific title
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const user = await getAuth();

  if (id) {
    // Return content for a specific id
    const [rows] = await db.query(
      `SELECT content FROM post_drafts WHERE id = ? LIMIT 1`,
      [id]
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } else {
    // Return all topics
    const [rows] = await db.query(`SELECT id, topic FROM post_drafts WHERE user_id = ?`,[user.userId]);
    return new Response(JSON.stringify(rows), { status: 200 });
  }
}

// PUT: update draft title + content
export async function DELETE(request: Request) {
  const user = await getAuth();
  const { topicId } = await request.json();

  if (!topicId) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400 }
    );
  }

  await db.query(
    `
    DELETE FROM post_drafts
    WHERE user_id = ? AND provider = ? AND id = ?
    `,
    [user.userId, "linkedin", topicId]
  );

  return new Response(
    JSON.stringify({ message: "Draft updated successfully" }),
    { status: 200 }
  );
}