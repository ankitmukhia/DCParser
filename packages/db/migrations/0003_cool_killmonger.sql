ALTER TABLE "document" ALTER COLUMN "chat_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "chat_id" DROP NOT NULL;