import type { JSX } from "react";
import React from "react";
/**
 * Render a tip tap JSON node and all its children
 * @param {TipTapNode} node JSON node to render
 * @param {NodeHandlers} handlers a handler for each node type
 * @returns tree of components as react elements
 */
export declare function TipTapRender(props: {
    node: TipTapNode<any>;
    handlers: NodeHandlers;
}): JSX.Element | null;
type Attrs = Readonly<Record<string, unknown>>;
export interface TipTapNode<T> {
    type?: string;
    attrs?: T & Attrs;
    marks?: Attrs[];
    content?: TipTapNode<T & Attrs>[];
    readonly [attr: string]: unknown;
}
export interface NodeProps<T> {
    children?: React.ReactNode;
    node: TipTapNode<T>;
}
export type NodeHandler<T = unknown> = (props: NodeProps<T>) => JSX.Element;
export type NodeHandlers = Readonly<Record<string, NodeHandler<any>>>;
export {};
//# sourceMappingURL=react-renderer.d.ts.map