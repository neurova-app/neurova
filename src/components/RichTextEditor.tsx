"use client";

import React, { useEffect, useRef, useState } from "react";
import EditorJS, { OutputData, API } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Image from "@editorjs/image";
import CodeTool from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

interface RichTextEditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: string;
}

const defaultData: OutputData = {
  time: new Date().getTime(),
  blocks: [],
  version: "2.26.5",
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  data,
  onChange,
  placeholder = "Start typing your notes here...",
  readOnly = false,
  height = "400px",
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [editorApi, setEditorApi] = useState<API | null>(null);
  const [isReady, setIsReady] = useState(false);
  const dataRef = useRef(data || defaultData);

  // Update the ref when data prop changes, but don't cause re-renders
  useEffect(() => {
    if (data && !isReady) {
      dataRef.current = data;
    } else if (data && isReady && editorRef.current) {
      // Only render new data if the editor is already initialized and data has changed significantly
      const currentData = JSON.stringify(dataRef.current);
      const newData = JSON.stringify(data);

      if (currentData !== newData) {
        dataRef.current = data;
        editorRef.current.render(data);
      }
    }
  }, [data, isReady]);

  const handleImageClick = () => {
    if (!editorApi) return;
    editorApi.blocks.insert("image");
  };

  const handleQuoteClick = () => {
    if (!editorApi) return;
    editorApi.blocks.insert("quote");
  };

  const handleCodeClick = () => {
    if (!editorApi) return;
    editorApi.blocks.insert("code");
  };

  const handleTableClick = () => {
    if (!editorApi) return;
    editorApi.blocks.insert("table");
  };

  const handleChecklistClick = () => {
    if (!editorApi) return;
    editorApi.blocks.insert("checklist");
  };

  useEffect(() => {
    if (!holderRef.current) return;

    // Initialize editor if it doesn't exist
    if (!editorRef.current) {
      // Using a type assertion to bypass TypeScript issues with Editor.js types
      const editor = new EditorJS({
        holder: holderRef.current,
        tools: {
          header: Header,
          list: List,
          checklist: Checklist,
          quote: Quote,
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile(file: File) {
                  // For now, just convert to base64 for demo purposes
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                      resolve({
                        success: 1,
                        file: {
                          url: e.target?.result as string,
                        },
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                },
              },
            },
          },
          code: CodeTool,
          linkTool: LinkTool,
          table: Table,
          marker: Marker,
          inlineCode: InlineCode,
        },
        data: dataRef.current,
        placeholder: placeholder,
        readOnly: readOnly,
        onChange: async () => {
          if (onChange && editorRef.current) {
            const savedData = await editorRef.current.save();
            if (savedData) {
              dataRef.current = savedData;
              onChange(savedData);
            }
          }
        },
        onReady: () => {
          if (editorRef.current) {
            // Get the API from the editor instance
            setEditorApi(editorRef.current as unknown as API);
            setIsReady(true);
          }
        },
      });

      editorRef.current = editor;
    }

    // Cleanup on unmount
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
        setIsReady(false);
      }
    };
  }, [onChange, placeholder]);

  // Handle readOnly changes without reinitializing the editor
  useEffect(() => {
    if (isReady && editorRef.current) {
      editorRef.current.readOnly.toggle(readOnly);
    }
  }, [readOnly, isReady]);

  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <button
          onClick={handleChecklistClick}
          className="toolbar-button"
          title="Checklist"
          disabled={readOnly}
        >
          ✓ List
        </button>
        <button
          onClick={handleQuoteClick}
          className="toolbar-button"
          title="Quote"
          disabled={readOnly}
        >
          &ldquo;Quote&rdquo;
        </button>
        <button
          onClick={handleImageClick}
          className="toolbar-button"
          title="Image"
          disabled={readOnly}
        >
          🖼️ Image
        </button>
        <button
          onClick={handleCodeClick}
          className="toolbar-button"
          title="Code"
          disabled={readOnly}
        >
          {"<>"} Code
        </button>
        <button
          onClick={handleTableClick}
          className="toolbar-button"
          title="Table"
          disabled={readOnly}
        >
          ⊞ Table
        </button>
      </div>
      <div className="editor-container" style={{ height }}>
        <div ref={holderRef} className="editor-js-container" />
      </div>
      <style jsx>{`
        .rich-text-editor {
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background-color: #fff;
          width: 100%;
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
          background-color: #f8f8f8;
        }

        .toolbar-button {
          padding: 6px 10px;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .toolbar-button:hover:not(:disabled) {
          background-color: #f0f0f0;
          border-color: #ccc;
        }

        .toolbar-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .editor-container {
          overflow-y: auto;
          padding: 10px;
          padding-left: 50px;
          padding-right: 50px;
        }

        .editor-js-container {
          min-height: 100%;
          word-wrap: break-word;
          word-break: break-word;
          padding-left: 30px;
          padding-right: 30px;
        }

        :global(.ce-block__content) {
          max-width: 100%;
          margin: 0;
          word-wrap: break-word;
          word-break: break-word;
        }

        :global(.ce-toolbar__content) {
          max-width: 100%;
        }

        :global(.ce-paragraph) {
          word-wrap: break-word;
          word-break: break-word;
          white-space: pre-wrap;
        }

        :global(.codex-editor) {
          width: 100%;
        }

        :global(.codex-editor__redactor) {
          padding-bottom: 100px !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
