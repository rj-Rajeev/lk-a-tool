import { db } from "@/lib/db";

type SavePublishInput = {
  draftId: number;
  provider: string;
  platformPostId: string | null;
};

export async function saveToPublish(input: SavePublishInput) {
  const { draftId, provider, platformPostId } = input;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insert into published_posts
    await connection.query(
      `
      INSERT INTO published_posts 
      (draft_id, provider, platform_post_id, published_at)
      VALUES (?, ?, ?, NOW())
      `,
      [draftId, provider, platformPostId]
    );

    // 2. Update draft status
    await connection.query(
      `
      UPDATE post_drafts
      SET status = 'published'
      WHERE id = ?
      `,
      [draftId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getPostPublishedById(
  draftId: number
) {
  const [rows]: any = await db.query(
    `SELECT 
       p.id,
       p.draft_id,
       p.provider,
       p.platform_post_id,
       p.published_at,
       p.created_at,
       d.topic,
       d.content
     FROM published_posts p
     JOIN post_drafts d ON p.draft_id = d.id
     WHERE p.draft_id = ?
     LIMIT 1`,
    [draftId]
  );

  return rows.length ? rows[0] : null;
}

export async function getAllPostPublishedTopics(userId: number) {
  const [rows]: any = await db.query(
    `SELECT 
       p.id,
       p.draft_id,
       p.provider,
       p.platform_post_id,
       p.published_at,
       p.created_at,
       d.topic,
       d.content
     FROM published_posts p
     JOIN post_drafts d ON p.draft_id = d.id
     WHERE d.user_id = ?`,
    [userId]
  );

  return rows;
}

