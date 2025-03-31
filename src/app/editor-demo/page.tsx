"use client";

import React, { useState } from 'react';
import RichTextEditor from '@/components/RichTextEditor';
import { OutputData } from '@editorjs/editorjs';

export default function EditorDemo() {
  const [editorData, setEditorData] = useState<OutputData | undefined>(undefined);
  const [savedData, setSavedData] = useState<string>('');

  const handleEditorChange = (data: OutputData) => {
    setEditorData(data);
  };

  const handleSave = () => {
    setSavedData(JSON.stringify(editorData, null, 2));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Rich Text Editor with Image Upload</h1>
      
      <div className="mb-6">
        <RichTextEditor 
          data={editorData} 
          onChange={handleEditorChange} 
          placeholder="Start typing or upload an image..."
          height="500px"
        />
      </div>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Content
        </button>
      </div>
      
      {savedData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Saved Content (JSON):</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {savedData}
          </pre>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use the toolbar buttons to add different types of content</li>
          <li>Click the &ldquo;Image&rdquo; button to add an image</li>
          <li>Upload an image from your device</li>
          <li>The editor is scrollable, so you can add as much content as needed</li>
          <li>Click &ldquo;Save Content&rdquo; to see the JSON representation of your content</li>
        </ul>
      </div>
    </div>
  );
}
