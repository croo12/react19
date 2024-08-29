import { LiteralType, PrimitiveType, PrimitiveTypeNode } from "../types";

export const getLiteralOrPrimitiveType = (
	value: number | string | boolean,
	isConst: boolean
): PrimitiveTypeNode => {
	const type = typeof value as PrimitiveType;
	const literalType = `${type}Literal` as LiteralType;

	return {
		type: isConst ? literalType : type,
		value,
		isConst,
		children: null
	};
};
