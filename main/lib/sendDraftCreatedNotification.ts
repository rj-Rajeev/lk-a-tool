import { sendPushToTokens } from './notifications';
import { getUserFcmTokens } from '../modules/fcm/fcm.repository';

export async function notifyDraftCreated(
  userId: number,
  draftId: string
) {
  const tokens = await getUserFcmTokens(userId);

  if (!tokens.length) return;

    const res = await sendPushToTokens(tokens, {
      title: 'Draft ready for review',
      body: 'Your automation created a draft. Review it now.',
      data: {
        draftId: String(draftId),
        url: `/profile/linkedin/draft/${String(draftId)}`,
        type: 'DRAFT_READY',
      },
    });


  return res;
}
