import type { EditorInstance, JSONContent } from "novel";
interface TailwindAdvancedEditorProps {
    className?: string;
    defaultContent?: JSONContent;
    onContentChange: (editor: EditorInstance) => void;
}
declare const TailwindAdvancedEditor: ({ className, onContentChange, defaultContent, }: TailwindAdvancedEditorProps) => import("react").JSX.Element;
export { TailwindAdvancedEditor };
//# sourceMappingURL=editor.d.ts.map