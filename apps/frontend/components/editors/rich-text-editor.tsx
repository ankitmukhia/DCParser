"use client";

import React from "react";
import {
  useEditor,
  EditorContent,
  type Editor,
  type Content,
} from "@tiptap/react";
import { IntersectionSwap } from "@/components/intersection-swap";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAligin from "@tiptap/extension-text-align";
import Strike from "@tiptap/extension-strike";
import { MenuButtons } from "@/components/editor-buttons/menu-buttons";

const HeaderMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <MenuButtons
      editor={editor}
      className="flex items-center overflow-x-auto justify-center gap-1 border-b pb-2"
    />
  );
};

const NavMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <MenuButtons
      editor={editor}
      className="flex gap-1 items-center justify-center bg-zinc-900/90 rounded-xl py-2"
    />
  );
};

export const RichTextEditor = React.memo(
  ({ content }: { content: Content }) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Strike,
        TextAligin.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      // tries to render immediately, during SSR, so false.
      immediatelyRender: false,
      content,
      editorProps: {
        attributes: {
          class:
            "prose dark:prose-invert prose-sm focus:outline-none max-w-none",
        },
      },
    });

    return (
      <div className="flex flex-col space-y-6">
        <IntersectionSwap nav={<NavMenu editor={editor} />}>
          <HeaderMenu editor={editor} />
        </IntersectionSwap>

        <EditorContent editor={editor} />
      </div>
    );
  },
);
