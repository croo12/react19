import { DataTypeCalculator } from "../model";
import { TypeNode, ObjectTypeNode } from "../types";

export const getObjectType = (
	value: object,
	isConst: boolean
): ObjectTypeNode => {
	const innerTypeObject: Record<string | number | symbol, TypeNode> = {};

	Object.entries(value).forEach(([k, v]) => {
		innerTypeObject[k] = DataTypeCalculator.getType(v, isConst);
	});

	return {
		type: "object",
		value,
		isConst,
		children: innerTypeObject
	};
};
