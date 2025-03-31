"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from "lexical";
import { useEffect, useState } from "react";
import { $createImageNode, ImageNode, ImagePayload } from "../nodes/ImageNode";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export default function ImagePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagePlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}

export function InsertImageUploadButton({ editor }: { editor: LexicalEditor }): JSX.Element {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        const url = reader.result as string;
        
        // Insert image into editor
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src: url,
          altText: file.name,
        });
        
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload-button">
      <label htmlFor="image-upload" className={`button ${isUploading ? 'uploading' : ''}`}>
        {isUploading ? 'Uploading...' : 'Image'}
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        disabled={isUploading}
      />
    </div>
  );
}
