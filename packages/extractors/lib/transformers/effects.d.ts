import type { Node as FigmaDocumentNode } from "@figma/rest-api-spec";
export type SimplifiedEffects = {
    boxShadow?: string;
    filter?: string;
    backdropFilter?: string;
    textShadow?: string;
};
export declare function buildSimplifiedEffects(n: FigmaDocumentNode): SimplifiedEffects;
//# sourceMappingURL=effects.d.ts.map