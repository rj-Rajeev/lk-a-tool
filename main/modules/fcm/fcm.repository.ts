import { db } from "../../lib/db"

export async function getUserFcmTokens(userId: number) {
    try {
        const query = `SELECT fcm_token FROM user_fcm_tokens WHERE user_id = ?`;
        const [result] = await db.query(query, [userId]);

        // console.log(result);
        
        return (result as { fcm_token: string }[]).map(row => row.fcm_token);

    } catch (error) {
        console.error("Error fetching FCM tokens:", error);
        return [];
    }
}