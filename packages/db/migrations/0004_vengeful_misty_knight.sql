ALTER TABLE "document" DROP CONSTRAINT "document_chat_id_chat_id_fk";
--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE no action ON UPDATE no action;