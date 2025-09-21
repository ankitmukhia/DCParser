import { remark } from "remark";
import remarkHtml from "remark-html";
import { generateJSON } from "@tiptap/html";

import { StarterKit } from "@tiptap/starter-kit";

const extensions = [StarterKit];

export const convertMarkdownToTiptopJSON = async (markdown: string) => {
  try {
    const processedContent = await remark()
      .use(remarkHtml, { sanitize: false })
      .process(markdown);

    const htmlContent = processedContent.toString();

    const json = generateJSON(htmlContent, extensions);

    return JSON.parse(JSON.stringify(json));
  } catch (error) {
    console.error("Error converting markdown to Tiptap JSON:", error);
    // Return a default document structure if conversion fails
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Error loading content. Please try again.",
            },
          ],
        },
      ],
    };
  }
};
