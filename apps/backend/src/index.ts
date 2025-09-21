import express, { type Express, type Response, type Request } from "express";
import { Mistral } from "@mistralai/mistralai";
import multer from "multer";
import path from "path";
import { remark } from "remark";
import remarkHtml from "remark-html";
import cors from "cors";
import z from "zod";
import { v2 as cloudinary } from "cloudinary";
import { db, schema } from "@repo/db";
import { generateUUID } from "./utils";
import { authMiddleware, type AuthenticatedRequest } from "./middleware";

const app: Express = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.PRODUCTION
        : "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

const PORT = process.env.PORT ?? 3001;
const apiKey = process.env.MISTRAL_API_KEY ?? "mistral_api_key";
const client = new Mistral({ apiKey: apiKey });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// can also quick and fast Buffer store.
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (
    _: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filePath: string) => void,
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

//@ts-ignore
const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback 
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

app.post(
  "/api/upload",
  authMiddleware,
  upload.single("file"),
  async (req: AuthenticatedRequest, res: Response) => {
		console.log("request reached")
    const file = req.file;
    const {
      id: providedId,
      chatId, // chatId is optional
    } = req.body;
    const userId = req.user!.id;

    console.log({ id: providedId, chatId });

    if (!userId) {
      res.status(401).json({
        message: "UserId doens't exists!",
      });
      return;
    }

    const validateFileMetadata = z
      .object({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.string(),
        destination: z.string(),
        filename: z.string(),
        path: z.string(),
        size: z.number(),
      })
      .safeParse(file);

    const { data, error, success } = validateFileMetadata;

    if (!success) {
      res.status(404).json({
        message: z.treeifyError(error),
      });
      return;
    }

    try {
      //TODO: Not working with pdf currently. Error perset.
      const cloudinaryUpload = await cloudinary.uploader.upload(data.path, {
        resource_type: "raw",
        public_id: path.parse(data.originalname).name,
      });

      const osrResponse = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
          type: "document_url",
          documentUrl: cloudinaryUpload.secure_url,
        },
        includeImageBase64: true,
      });

      const mergedResponse = osrResponse.pages.map((m) => m.markdown).join();

      const processedContent = await remark()
        .use(remarkHtml, { sanitize: false })
        .process(mergedResponse);

      const htmlContent = processedContent.toString();

      const documentId = providedId || generateUUID();
      await db.insert(schema.document).values({
        id: documentId,
        chatId: chatId || null,
        userId,
        name: data.originalname,
        content: htmlContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(200).json({
        message: "File uploaded and processed successfully.",
        documentId,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server is renning at ${PORT}`);
});
