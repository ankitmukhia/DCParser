import { type Message } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { generateUUID } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { db, schema } from "@repo/db";
import { eq } from "drizzle-orm";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const readonlyHeaders = await headers();
    const requestHeaders = new Headers(readonlyHeaders);
    console.log("request headers: ", requestHeaders);
    const session = await auth.api.getSession({ headers: requestHeaders });

    console.log("sessions: ", session);

    if (!session?.user) {
      return NextResponse.json("Unauthorized request.", { status: 401 });
    }

    const { id: chatId, messages } = (await req.json()) as {
      id: string;
      messages: Array<Message>;
    };

    const userId = session.user.id;
    const userMessage = messages
      .filter((message) => message.role === "user")
      .at(-1);

    console.log("userMessage: ", userMessage);

    if (!userMessage) {
      return NextResponse.json("No user messages found", { status: 400 });
    }

    const chatExists = await db.query.chat.findFirst({
      where: eq(schema.chat.id, chatId),
    });

    if (!chatExists) {
      await db.insert(schema.chat).values({
        id: chatId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const backendGeneratedUserId = generateUUID();

    await db.insert(schema.message).values({
      id: backendGeneratedUserId,
      chatId,
      role: "user",
      content: userMessage.content,
      createdAt: new Date(),
    });

    const document = await db.query.document.findFirst({
      where: eq(schema.document.chatId, chatId),
    });

    console.log("document: ", document);

    const systemPrompt = document
      ? `Here is a document for context: \n\n${document.content}`
      : "";

    const result = streamText({
      model: google("models/gemini-2.5-flash"),
      messages,
      system: systemPrompt,
      maxSteps: 2,
      onFinish: async ({ response }) => {
        if (userId) {
          const messagesToInsert = response.messages.map((message) => ({
            id: message.id,
            chatId: chatId,
            role: "assistant" as const,
            /* Serilize this in more specific way	 */
            content: JSON.stringify(message.content),
            createdAt: new Date(),
          }));

          if (messagesToInsert.length > 0) {
            await db.insert(schema.message).values(messagesToInsert);
          }
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (err) {
    return NextResponse.json(
      err instanceof Error ? err.message : "unknown error",
      {
        status: 500,
      },
    );
  }
}
