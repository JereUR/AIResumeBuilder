import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";

export const mettadat: Metadata = {
  title: "Design your resume"
}

export default function EditorPage() {
  return <ResumeEditor />
}