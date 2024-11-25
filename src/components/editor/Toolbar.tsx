"use client";

import { type Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo,
  Underline,
  Undo,
} from "lucide-react";

type Props = {
  editor: Editor | null;
};

const Toolbar = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-between rounded-tl-md rounded-tr-md border border-gray-300 bg-blue-100 px-2 py-1">
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("left").run();
        }}
        className={
          editor.isActive({ textAlign: "left" })
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <AlignLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("center").run();
        }}
        className={
          editor.isActive({ textAlign: "center" })
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <AlignCenter className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("right").run();
        }}
        className={
          editor.isActive({ textAlign: "right" })
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <AlignRight className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("justify").run();
        }}
        className={
          editor.isActive({ textAlign: "justify" })
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <AlignJustify className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={
          editor.isActive("bold")
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <Bold className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={
          editor.isActive("italic")
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <Italic className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={
          editor.isActive("underline")
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <Underline className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={
          editor.isActive("heading", { level: 1 })
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <Heading1 className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={
          editor.isActive("heading", { level: 3 })
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <Heading3 className="h-5 w-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={
          editor.isActive("bulletList")
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <List className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={
          editor.isActive("orderedList")
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND"
        }
      >
        <ListOrdered className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        className={
          editor.isActive("undo")
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND p-1 hover:rounded-lg hover:bg-blue-400 hover:text-accent-foreground"
        }
      >
        <Undo className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        className={
          editor.isActive("redo")
            ? "rounded-lg bg-blue-400 p-2 text-accent-foreground"
            : "text-primary-FOREGROUND p-1 hover:rounded-lg hover:bg-blue-400 hover:text-accent-foreground"
        }
      >
        <Redo className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toolbar;
