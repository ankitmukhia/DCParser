import { redirect } from "next/navigation";
import { Editor } from "@/components/editors/editor";
import { useSession } from "@/app/(auth)/auth";

export default async function EditorPage() {
  const session = await useSession();

  console.log("session: ", session?.user);
  /* if (!session?.user) {
    redirect("/");
  } */

  return <Editor />;
}
