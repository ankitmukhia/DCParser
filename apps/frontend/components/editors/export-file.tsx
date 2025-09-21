import { type Editor } from "@tiptap/react";

export const exportFile = (editor: Editor) => {
  const content = editor.getHTML();

  const exportPdf = async () => {
    try {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.writeln(`
					<html>
						<head>
							<title>Document</title>
							<style>
								body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
								h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
								h2 { color: #666; margin-top: 30px; }
								blockquote { border-left: 4px solid #ddd; margin: 20px 0; padding-left: 20px; font-style: italic; }
								code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
								ul { margin: 15px 0; }
								li { margin: 5px 0; }
							</style>
						</head>
						<body>${content}</body>
					</html>
				`);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : "Error exporting PDF");
    }
  };

  const exportDocx = async () => {
    try {
      const { Document, Paragraph, Packer, TextRun, HeadingLevel } =
        await import("docx");

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;

      const children: any[] = [];

      const processElement = (element: Element): any[] => {
        const tagName = element.tagName.toLowerCase();
        const elements: any[] = [];

        switch (tagName) {
          case "h1":
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: element.textContent || "",
                    bold: true,
                    size: 32,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
              }),
            );
            break;
          case "h2":
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: element.textContent || "",
                    bold: true,
                    size: 28,
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
              }),
            );
            break;
          case "h3":
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: element.textContent || "",
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_3,
              }),
            );
            break;
          default:
            // Handle other elements or plain text
            if (element.textContent?.trim()) {
              elements.push(
                new Paragraph({
                  children: [new TextRun(element.textContent)],
                }),
              );
            }
        }

        return elements;
      };

      // children = [Paragrah, Paragraph]
      Array.from(tempDiv.children).forEach((element) => {
        children.push(...processElement(element));
      });

      /**
       * @example
       *
       * create the document
       * https://docx.js.org/#/usage/sections
       **/

      const doc = new Document({
        sections: [
          {
            children:
              children.length > 0
                ? children
                : [
                    new Paragraph({
                      children: [new TextRun("Empty document")],
                    }),
                  ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err instanceof Error ? err.message : "Error exporting PDF");
    }
  };

  const exportMarkdown = async () => {
    try {
      const markdown = content
        .replace(/<h1[^>]*>(.*?)<\/h1>/g, "# $1\n\n")
        .replace(/<h2[^>]*>(.*?)<\/h2>/g, "## $1\n\n")
        .replace(/<h3[^>]*>(.*?)<\/h3>/g, "### $1\n\n")
        .replace(/<p[^>]*>(.*?)<\/p>/g, "$1\n\n")
        .replace(/<strong[^>]*>(.*?)<\/strong>/g, "**$1**")
        .replace(/<em[^>]*>(.*?)<\/em>/g, "*$1*")
        .replace(/<code[^>]*>(.*?)<\/code>/g, "`$1`")
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, "> $1\n\n")
        .replace(/<ul[^>]*>(.*?)<\/ul>/gs, (match, content) => {
          return content.replace(/<li[^>]*>(.*?)<\/li>/g, "- $1\n") + "\n";
        })
        .replace(/<ol[^>]*>(.*?)<\/ol>/gs, (match, content) => {
          let counter = 1;
          return (
            content.replace(
              /<li[^>]*>(.*?)<\/li>/g,
              () => `${counter++}. $1\n`,
            ) + "\n"
          );
        })
        .replace(/<[^>]*>/g, "") // Remove remaining HTML tags
        .replace(/\n\s*\n\s*\n/g, "\n\n") // Clean up extra newlines
        .trim();

      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.md";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err instanceof Error ? err.message : "Error exporting PDF");
    }
  };

  return { pdf: exportPdf, docx: exportDocx, md: exportMarkdown };
};

export type ReturnKeyType = keyof ReturnType<typeof exportFile>;
