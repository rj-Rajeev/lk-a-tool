// import { db } from "../db";
import OpenAI from "openai";
const client = new OpenAI();

// await db.query(`SELECT ANGLE From linkedin_config WHERE user eq rajeev`);



export default function generateTopic(angle: string){
    const response = client.responses.create({
        model: "gpt-5-nano",
        input: "Provide a Topic from New gen of tecnologies"
    })

    return response;
}


