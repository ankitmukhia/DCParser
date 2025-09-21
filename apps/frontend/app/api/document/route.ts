import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { eq, and, InferSelectModel, asc } from "drizzle-orm";
import { db, schema } from "@repo/db";
import { auth } from "@/lib/auth";

type Document = InferSelectModel<typeof schema.document>;

export default async function GET(req: NextRequest) {
  const readonlyHeaders = await headers();
  const requestHeaders = new Headers(readonlyHeaders);
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user) {
    return NextResponse.json("Unauthorized request.", { status: 401 });
  }

  const userId = session.user.id;

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id || id === "undefined" || id === "null" || id === "init") {
    return NextResponse.json([]);
  }

  const document: Document[] = await db
    .select()
    .from(schema.document)
    .where(and(eq(schema.document.userId, userId), eq(schema.document.id, id)))
    .orderBy(asc(schema.document.createdAt));

		return NextResponse.json(document || [], { status: 200 })
}
