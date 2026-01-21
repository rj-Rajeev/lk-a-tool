import { PROVIDERS } from "@/constants/providers";
import { getAuth } from "@/lib/auth";
import { approvePostDraft, deletePostDraftById, getAllPostDraftTopics, getPostDraftById, insertPostDraft, updatePostDraft } from "@/modules/post/post-draft/post-draft.repository";
import { NextResponse } from "next/server";

// POST: create a draft
export async function POST(request: Request) {
  const user = await getAuth();
  if(!user){
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const { topic, content } = await request.json();

  await insertPostDraft(user.userId, topic, content);
  
  return NextResponse.json(
    { message: "Draft saved successfully" },
    { status: 201 }
  );
}

// PUT: update draft title + content
export async function PUT(request: Request) {
  const user = await getAuth();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const {
    topicId,
    updatedTopic,
    updatedContent,
    is_approved = false,
  } = await request.json();

  if (!topicId) {
    return NextResponse.json(
      { message: "Missing Draft Id" },
      { status: 400 }
    );
  }

  // 🔹 APPROVE ONLY
  if (is_approved) {
    await approvePostDraft(user.userId, topicId);
    return NextResponse.json(
      { message: "Draft approved & scheduled" },
      { status: 200 }
    );
  }

  // 🔹 UPDATE ONLY
  if (!updatedTopic || !updatedContent) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  await updatePostDraft(
    user.userId,
    topicId,
    updatedTopic,
    updatedContent
  );

  return NextResponse.json(
    { message: "Draft updated successfully" },
    { status: 200 }
  );
}

// GET: fetch all titles OR content of a specific title
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const user = await getAuth();
  if(!user){
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (id) {
    const rows = await getPostDraftById(Number(id));
    return NextResponse.json(
      rows,
      { status: 200 }
    );
  } else {
    // Return all topics
    const topics = await getAllPostDraftTopics(user.userId);
    
    return NextResponse.json(
      topics,
      { status: 200 }
    );
  }
}

// PUT: update draft title + content
export async function DELETE(request: Request) {
  const user = await getAuth();
  if(!user){
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  
  const { topicId } = await request.json();


  if (!topicId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  await deletePostDraftById(user.userId, topicId, PROVIDERS.LINKEDIN);

    return NextResponse.json(
      { message: "Draft updated successfully" },
      { status: 200 }
    );
}