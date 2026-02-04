import type { Node as FigmaDocumentNode } from "@figma/rest-api-spec";
export type SimplifiedTextStyle = Partial<{
    fontFamily: string;
    fontWeight: number;
    fontSize: number;
    lineHeight: string;
    letterSpacing: string;
    textCase: string;
    textAlignHorizontal: string;
    textAlignVertical: string;
}>;
export declare function isTextNode(n: FigmaDocumentNode): n is Extract<FigmaDocumentNode, {
    type: "TEXT";
}>;
export declare function hasTextStyle(n: FigmaDocumentNode): n is FigmaDocumentNode & {
    style: Extract<FigmaDocumentNode, {
        style: any;
    }>["style"];
};
export declare function extractNodeText(n: FigmaDocumentNode): string | undefined;
export declare function extractTextStyle(n: FigmaDocumentNode): Partial<{
    fontFamily: string;
    fontWeight: number;
    fontSize: number;
    lineHeight: string;
    letterSpacing: string;
    textCase: string;
    textAlignHorizontal: string;
    textAlignVertical: string;
}> | undefined;
//# sourceMappingURL=text.d.ts.map