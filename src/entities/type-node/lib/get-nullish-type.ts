import { NullishTypeNode } from "../types";

export const getNullishType = (value: null | undefined, isConst: boolean) => {
	return {
		type: value === null ? "null" : "undefined",
		value,
		isConst,
		children: null
	} satisfies NullishTypeNode;
};
