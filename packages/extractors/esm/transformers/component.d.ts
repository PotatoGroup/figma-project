import type { Component, ComponentPropertyType, ComponentSet } from "@figma/rest-api-spec";
export interface ComponentProperties {
    name: string;
    value: string;
    type: ComponentPropertyType;
}
export interface SimplifiedComponentDefinition {
    id: string;
    key: string;
    name: string;
    componentSetId?: string;
}
export interface SimplifiedComponentSetDefinition {
    id: string;
    key: string;
    name: string;
    description?: string;
}
/**
 * Remove unnecessary component properties and convert to simplified format.
 */
export declare function simplifyComponents(aggregatedComponents: Record<string, Component>): Record<string, SimplifiedComponentDefinition>;
/**
 * Remove unnecessary component set properties and convert to simplified format.
 */
export declare function simplifyComponentSets(aggregatedComponentSets: Record<string, ComponentSet>): Record<string, SimplifiedComponentSetDefinition>;
//# sourceMappingURL=component.d.ts.map