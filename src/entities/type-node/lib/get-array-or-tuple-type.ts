import { DataTypeCalculator } from "../model";
import { ArrayTypeNode, TupleTypeNode } from "../types";
import { mergeTypes } from "./merge-type";

export const getArrayOrTupleType = (
	value: any[],
	isConst: boolean
): ArrayTypeNode | TupleTypeNode => {
	const innerTypes = value.map((v) => DataTypeCalculator.getType(v, isConst));

	// Check if it's a tuple
	if (
		isConst &&
		value.length > 0 &&
		value.length <= 10 &&
		new Set(innerTypes.map((t) => t.type)).size > 1
	) {
		return {
			type: "tuple",
			value,
			isConst,
			children: innerTypes
		};
	}

	// It's a regular array
	return {
		type: "array",
		value,
		isConst,
		children: mergeTypes(innerTypes)
	};
};
