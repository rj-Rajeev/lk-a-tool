import { getLinkedinAccessToken } from "../../user/oauth-account.repository";
import { saveToPublish } from "./post-publish.repository";
import { PROVIDERS } from "../../../constants/providers";
import { getPostDraftById } from "../post-draft/post-draft.repository";

type PostData = {
  topic: string;
  content: string;
  id: number
};

export async function postOnLinkedin(id: number, userId: number) {
  const linkedinAccount = await getLinkedinAccessToken(userId);
  const postData: PostData | null = await getPostDraftById(id);

  if (!postData) {
    return {
      success: false,
      message: "post not found"
    };
  }

  if (!linkedinAccount[0][0]?.access_token) {
    throw new Error("LinkedIn access token missing");
  }

  if (!linkedinAccount[0][0]?.provider_user_id) {
    throw new Error("LinkedIn user id missing");
  }

  const text = `${postData.topic}\n\n${postData.content}`;

  const payload = {
    author: `urn:li:person:${linkedinAccount[0][0].provider_user_id}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text,
        },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${linkedinAccount[0][0].access_token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LinkedIn post failed: ${errorText}`);
  }

  const postUrn = response.headers.get("x-restli-id");
  

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
