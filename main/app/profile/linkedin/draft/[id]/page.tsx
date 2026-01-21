'use client'
import DraftEditor from "@/components/DraftEditor";
import { useParams } from "next/navigation";

export default function DraftByIdPage() {
    const params = useParams();
  return <DraftEditor initialDraftId={Number(params.id)} />;
}
