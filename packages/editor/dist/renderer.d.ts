import type { JSONContent } from "novel";
import React from "react";
import type { NodeHandler } from "./react-renderer";
export declare const DocRender: NodeHandler;
export declare const TextRender: NodeHandler;
export declare const HeadingRender: NodeHandler<{
    level: number;
}>;
export declare const ParagraphRender: NodeHandler;
export declare const OrderedListRender: NodeHandler;
export declare const BulletListRender: NodeHandler;
export declare const ListItem: NodeHandler;
export declare const BlockquoteRender: NodeHandler;
interface RendererProps {
    content: JSONContent;
}
export declare const Renderer: ({ content }: RendererProps) => React.JSX.Element;
export {};
//# sourceMappingURL=renderer.d.ts.map