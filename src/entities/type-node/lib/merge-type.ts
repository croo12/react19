import { TypeNode, UnionTypeNode } from "../types";

export const mergeTypes = (types: TypeNode[]): TypeNode[] => {
	if (types.length === 0) return [];
	if (types.length === 1) return types;

	const mergedType = types.reduce((acc, curr) => {
		if (acc.type === curr.type) return acc;

		return {
			type: "union",
			value: null,
			isConst: false,
			children: [acc, curr]
		} as UnionTypeNode;
	});

	return [mergedType];
};
