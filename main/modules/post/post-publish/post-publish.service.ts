import { getLinkedinAccessToken } from "../../user/oauth-account.repository";
import { saveToPublish } from "./post-publish.repository";
import { PROVIDERS } from "../../../constants/providers";
import { getPostDraftById } from "../post-draft/post-draft.repository";

type PostData = {
  id: number;
  topic: string;
  content: string;
};

export async function postOnLinkedin(draftId: number, userId: number) {
  // 1. Fetch LinkedIn credentials
  const linkedinResult = await getLinkedinAccessToken(userId);

  const account = linkedinResult?.[0]?.[0];
  if (!account?.access_token) {
    throw new Error("LinkedIn access token missing");
  }
  if (!account?.provider_user_id) {
    throw new Error("LinkedIn provider user id missing");
  }

  // 2. Fetch draft
  const postData: PostData | null = await getPostDraftById(draftId);
  if (!postData) {
    throw new Error(`Draft ${draftId} not found`);
  }

  // 3. Build post payload
  const text = `${postData.topic}\n\n${postData.content}`;

  const payload = {
    author: `urn:li:person:${account.provider_user_id}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  // 4. Call LinkedIn API
  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${account.access_token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.text(); // ✅ read ONCE

  if (!response.ok) {
    throw new Error(
      `LinkedIn publish failed (${response.status}): ${responseBody}`
    );
  }

  // 5. Extract LinkedIn post URN
  const postUrn = response.headers.get("x-restli-id");
  if (!postUrn) {
    throw new Error("LinkedIn response missing post URN");
  }

  // 6. Persist published post
  await saveToPublish({
    draftId: postData.id,
    provider: PROVIDERS.LINKEDIN,
    platformPostId: postUrn,
  });

  return {
    success: true,
    linkedinPostUrn: postUrn,
  };
}
