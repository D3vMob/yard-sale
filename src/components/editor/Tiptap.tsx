"use client";

import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";

interface TiptapProps {
  onChange: (newContent: string) => void;
  content: string;
}

const Tiptap = ({ onChange, content }: TiptapProps) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"] as const,
        defaultAlignment: "left",
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "break-words px-4 py-3 justify-start border-b border-r border-l border-border text-foreground items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="shadow-sm">
      <Toolbar editor={editor} />
      <EditorContent
        style={{ whiteSpace: "pre-line" }}
        editor={editor}
        className="bg-white"
      />
    </div>
  );
};

export default Tiptap;
