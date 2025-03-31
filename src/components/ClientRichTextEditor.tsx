"use client";

import dynamic from 'next/dynamic';

// Import the RichTextEditor component with no SSR
const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

export default RichTextEditor;
