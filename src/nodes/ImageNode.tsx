import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, createEditor, DecoratorNode } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

export interface ImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  src: string;
  width?: number;
  showCaption?: boolean;
  caption?: string;
}

function ImageComponent({
  src,
  altText,
  width,
  height,
  nodeKey,
}: {
  src: string;
  altText: string;
  width?: number;
  height?: number;
  nodeKey: string;
}): JSX.Element {
  return (
    <Suspense fallback={null}>
      <div className="image-container">
        <div className="image-wrapper">
          <img
            src={src}
            alt={altText}
            style={{
              height: height ? `${height}px` : 'auto',
              maxWidth: '100%',
              width: width ? `${width}px` : '100%',
            }}
            className="image"
            draggable="false"
          />
        </div>
      </div>
    </Suspense>
  );
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    src: string;
    width?: number;
    showCaption?: boolean;
    caption?: string;
    type: 'image';
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: number | undefined;
  __height: number | undefined;
  __showCaption: boolean;
  __caption: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, src, width, showCaption, caption } = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      src,
      width,
      showCaption,
      caption,
    });
    return node;
  }

  constructor(
    src: string,
    altText: string,
    width?: number,
    height?: number,
    showCaption?: boolean,
    caption?: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
    this.__showCaption = showCaption || false;
    this.__caption = caption || '';
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width,
      showCaption: this.__showCaption,
      caption: this.__caption,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    );
  }
}

export function $createImageNode({
  altText,
  height,
  src,
  width,
  showCaption,
  caption,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, altText, width, height, showCaption, caption, key),
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
