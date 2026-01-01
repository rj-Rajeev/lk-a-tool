import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import {
  schedulePost,
  getSchedules,
  updateScheduledPost,
  cancelScheduledPost,
} from "@/modules/post/post-schedule/post-schedule.service";

// POST: create or update schedule
export async function POST(request: Request) {
  try {
    const user = await getAuth();
    if(!user){
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { draftId, scheduledAt, timezone } = await request.json();

    if (!draftId || !scheduledAt || !timezone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await schedulePost(user.userId, draftId, scheduledAt, timezone);

    return NextResponse.json(
      { message: "Post scheduled successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}

// GET: schedules
export async function GET(request: Request) {
  const user = await getAuth();
  if(!user){
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("draftId");

  const data = await getSchedules(
    user.userId,
    draftId ? Number(draftId) : undefined
  );

  return NextResponse.json(data);
}

// PUT: update schedule
export async function PUT(request: Request) {
  const user = await getAuth();
  if(!user){
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const { draftId, scheduledAt, timezone } = await request.json();

  if (!draftId || !scheduledAt || !timezone) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  await updateScheduledPost(
    user.userId,
    draftId,
    scheduledAt,
    timezone
  );

  return NextResponse.json({ message: "Schedule updated" });
}

// DELETE: cancel schedule
export async function DELETE(request: Request) {
  const user = await getAuth();
  if(!user){
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const { draftId } = await request.json();

  if (!draftId) {
    return NextResponse.json(
      { message: "Draft ID required" },
      { status: 400 }
    );
  }

  await cancelScheduledPost(user.userId, draftId);

  return NextResponse.json({ message: "Schedule cancelled" });
}
