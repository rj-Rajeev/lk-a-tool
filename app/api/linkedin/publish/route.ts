import { POST_STATUS } from "@/constants/post-status";
import { getAuth } from "@/lib/auth";
import { getPostDraftById } from "@/modules/post/post-draft/post-draft.repository";
import { getAllPostPublishedTopics, getPostPublishedById } from "@/modules/post/post-publish/post-publish.repository";
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


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const user = await getAuth();

  if (id) {
    const rows = await getPostPublishedById(Number(id));
    return NextResponse.json(
      rows,
      { status: 200 }
    );
  } else {
    // Return all topics
    const topics = await getAllPostPublishedTopics(user.userId);
    
    return NextResponse.json(
      topics,
      { status: 200 }
    );
  }
}
