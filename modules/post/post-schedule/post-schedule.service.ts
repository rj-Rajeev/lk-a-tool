import { isoToMysql } from "@/utils/auth/date.utils";
import {
  draftBelongsToUser,
  upsertSchedule,
  getScheduleByDraft,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} from "./post-schedule.repository";

export async function schedulePost(
  userId: number,
  draftId: number,
  scheduledAt: string,
) {
  const ownsDraft = await draftBelongsToUser(draftId, userId);
  if (!ownsDraft) throw new Error("Draft not found");

  await upsertSchedule(draftId, isoToMysql(scheduledAt));
}

export async function getSchedules(
  userId: number,
  draftId?: number
) {
  if (draftId) {
    return getScheduleByDraft(draftId, userId);
  }
  return getAllSchedules(userId);
}

export async function updateScheduledPost(
  userId: number,
  draftId: number,
  scheduledAt: string
) {
  await updateSchedule(draftId, userId, isoToMysql(scheduledAt));
}

export async function cancelScheduledPost(
  userId: number,
  draftId: number
) {
  await deleteSchedule(draftId, userId);
}
