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
