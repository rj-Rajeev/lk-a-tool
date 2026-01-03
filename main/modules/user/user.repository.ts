import { db } from "@/lib/db";

type upsertUserInput = {
    name: String | null,
    email: String,
    picture: String | null
}

export async function upsertUser(connection: any, data:upsertUserInput){
    const [users]:any = await connection.query(`SELECT * FROM users WHERE email = ? LIMIT 1`,[data.email]);

    if(users.length > 0){
        const user_id = users[0].id;

        await connection.query(`UPDATE users SET name = ?, picture = ? WHERE id = ?`,[data.name, data.picture, user_id])

        return user_id;
    }

    const [result]: any = await connection.query(`INSERT INTO users (name, email, picture) VALUES(?, ?, ?)`,[data.name, data.email, data.picture])

    return result.insertId;
}

export async function findUserByEmail(email: string) {
  const [rows]: any = await db.query(
    "SELECT id, name, email, picture FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] ?? null;
}
