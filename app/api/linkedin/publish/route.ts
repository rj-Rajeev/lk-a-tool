import { POST_STATUS } from "@/constants/post-status";
import { getAuth } from "@/lib/auth";
import { getPostDraftById } from "@/modules/post/post-draft/post-draft.repository";
import { postOnLinkedin } from "@/modules/post/post-publish/post-publish.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { draftId } = await request.json();
    const user = await getAuth();

    const draftPost = await getPostDraftById(draftId);

    if (!draftPost) {
      return NextResponse.json(
        { error: "Draft not found" },
        { status: 404 }
      );
    }

    if(draftPost.status === POST_STATUS.PUBLISHED ){
      return NextResponse.json(
        {
          message: "Post has been published successfully.",
          status: POST_STATUS.PUBLISHED,
        },
        { status: 200 } 
      )
    }
    
    await postOnLinkedin(
      {
        id: draftPost.id,
        topic: draftPost.topic,
        content: draftPost.content,
      },
      user.userId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
     return NextResponse.json({ success: false, error });
  }
}
