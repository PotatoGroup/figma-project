import type { Rectangle, HasLayoutTrait, StrokeWeights, HasFramePropertiesTrait } from "@figma/rest-api-spec";
import type { CSSHexColor, CSSRGBAColor } from "../transformers/style";
export declare function hasValue<K extends PropertyKey, T>(key: K, obj: unknown, typeGuard?: (val: unknown) => val is T): obj is Record<K, T>;
export declare function isFrame(val: unknown): val is HasFramePropertiesTrait;
export declare function isLayout(val: unknown): val is HasLayoutTrait;
/**
 * Checks if:
 * 1. A node is a child to an auto layout frame
 * 2. The child adheres to the auto layout rules—i.e. it's not absolutely positioned
 *
 * @param node - The node to check.
 * @param parent - The parent node.
 * @returns True if the node is a child of an auto layout frame, false otherwise.
 */
export declare function isInAutoLayoutFlow(node: unknown, parent: unknown): boolean;
export declare function isStrokeWeights(val: unknown): val is StrokeWeights;
export declare function isRectangle<T, K extends string>(key: K, obj: T): obj is T & {
    [P in K]: Rectangle;
};
export declare function isRectangleCornerRadii(val: unknown): val is number[];
export declare function isCSSColorValue(val: unknown): val is CSSRGBAColor | CSSHexColor;
//# sourceMappingURL=identity.d.ts.map