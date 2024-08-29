import { PureType, PureTypeNode } from "../types";

export const getPureType = (
	value: symbol | bigint,
	isConst: boolean
): PureTypeNode => {
	return {
		type: typeof value as PureType,
		value,
		isConst,
		children: null
	};
};
