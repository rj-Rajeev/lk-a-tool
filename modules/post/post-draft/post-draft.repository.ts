import { db } from "@/lib/db";

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

export async function getPostDraftById(id: number) {
    const [rows] = await db.query(
      `SELECT content FROM post_drafts WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows;
}

export async function getAllPostDraftTopics(userId: number) {
    const [rows] = await db.query(`SELECT id, topic FROM post_drafts WHERE user_id = ?`,[userId]);
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