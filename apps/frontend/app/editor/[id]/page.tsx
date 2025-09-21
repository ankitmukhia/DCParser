import { db, schema } from "@repo/db";
import { InferSelectModel } from "drizzle-orm"
import { getUser } from "@/app/(auth)/auth";
import { notFound } from "next/navigation";
import { eq, and, asc } from "drizzle-orm";
import { RichTextEditor } from "@/components/editors/rich-text-editor"

type Document = InferSelectModel<typeof schema.document>

interface Params {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: Params) {
	const documentId = (await params).id;

	const user = await getUser();
	if (!user) {
		console.warn("[user not found], unauthorized");
		notFound();
	}

	const document: Document[] = await db
		.select()
		.from(schema.document)
		.where(
			and(
				eq(schema.document.userId, user.id),
				eq(schema.document.id, documentId),
			),
		).orderBy(asc(schema.document.createdAt))

	return <RichTextEditor content={document[0].content} />
}
