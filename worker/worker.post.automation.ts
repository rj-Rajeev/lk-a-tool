import { db } from "@/lib/db";
import { PROVIDERS } from "@/constants/providers";
import { getPromptConfigByUser } from "@/modules/prompt/prompt-config.repository";
import { generateLinkedInTopics } from "@/modules/ai/topic.service";
import { generateLinkedInPost } from "@/modules/ai/ai.service";
import { insertPostDraft } from "@/modules/post/post-draft/post-draft.repository";
import { notifyDraftCreated } from "@/lib/sendDraftCreatedNotification";


export async function postAutomationWorker() {
    try{
        const [automation_scedules]:any = await db.query(`
            SELECT *
            FROM post_automation_schedules
            WHERE is_active = TRUE
            AND CURDATE() BETWEEN start_date AND IFNULL(end_date, CURDATE())
            AND CURTIME() >= CAST(JSON_UNQUOTE(JSON_EXTRACT(times, '$[0]')) AS TIME)
            AND (last_run_at IS NULL OR DATE(last_run_at) < CURDATE())
            LIMIT 1;
        `);

        if(!automation_scedules || automation_scedules.length == 0){
            console.log("automation_scedules not found", automation_scedules);
            return;
        }

        

        // generate topic

            const config = await getPromptConfigByUser(
              automation_scedules[0].user_id,
              PROVIDERS.LINKEDIN
            );

            const topics = await generateLinkedInTopics(config);
            
            // console.log('topic---------------');

        // generaet post

            const content = await generateLinkedInPost(topics[0], config);
            // console.log('content------------');

        // save to draft

            
            // console.log('draft saved---');
            
            const draft = await insertPostDraft(automation_scedules[0].user_id, topics[0], content);

            //notify user about draft

            notifyDraftCreated(automation_scedules[0].user_id, draft[0].id);

        //

        const data = await db.query(`UPDATE post_automation_schedules
            SET last_run_at = NOW()
            WHERE id = ?;
            `,[automation_scedules[0].id])

            // console.log(data,'----update db');
            
        
    }catch(error){
        console.log(error);
        
    }
}

console.log("Post Automation Working");
