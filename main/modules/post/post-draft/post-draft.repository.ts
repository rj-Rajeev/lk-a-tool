import { db } from "@/lib/db";

type DraftPost = {
  id: number;
  topic: string;
  content: string;
  status: string
};

export async function insertPostDraft(userId: number, topic: string, content: string) {
    await db.query(
        `INSERT INTO post_drafts (user_id, provider, topic, content, status) 
            VALUES (?, ?, ?, ?, ?)`,
        [userId, "linkedin", topic?.trim(), content, "draft"]
    );

}

export async function updatePostDraft(userId: number, topicId: number, updatedTopic: string, updatedContent: string) {
    await db.query(
        `
        UPDATE post_drafts
        SET topic = ?, content = ?
        WHERE user_id = ? AND provider = ? AND id = ?
        `,
        [updatedTopic.trim(), updatedContent, userId, "linkedin", topicId]
    );
}

export async function getPostDraftById(
  draftId: number
): Promise<DraftPost | null> {
  const [rows]: any = await db.query(
    `SELECT id, topic, content, status FROM post_drafts WHERE id = ? AND status <> 'published' LIMIT 1`,
    [draftId]
  );

  return rows.length ? rows[0] : null;
}

export async function getAllPostDraftTopics(userId: number) {
    const [rows] = await db.query(`SELECT id, topic FROM post_drafts WHERE user_id = ? AND status <> 'published'`,[userId]);
    return rows;
}

export async function deletePostDraftById(userId: number, postId: number, provider: string) {
    await db.query(
        `
        DELETE FROM post_drafts
        WHERE user_id = ? AND provider = ? AND id = ?
        `,
        [userId, provider, postId]
    );
}