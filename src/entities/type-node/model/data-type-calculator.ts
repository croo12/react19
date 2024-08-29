import { getArrayOrTupleType } from "../lib";
import { getLiteralOrPrimitiveType } from "../lib/get-literal-or-primitive-type";
import { getNullishType } from "../lib/get-nullish-type";
import { getObjectType } from "../lib/get-object-type";
import { getPureType } from "../lib/get-pure-type";
import {
	ArrayTypeNode,
	NullishTypeNode,
	ObjectTypeNode,
	PrimitiveTypeNode,
	TypeNode
} from "../types";

export class DataTypeCalculator {
	// #dataStructure: ObjectStruct = null!;
	// #valueSet: Map<string, Set<Type>> = new Map();

	// constructor(data: ObjectStruct) {
	// 	this.#dataStructure = data;
	// }

	static getType(value: unknown, isConst: boolean): TypeNode {
		if (value === null || typeof value === "undefined") {
			return getNullishType(value, isConst);
		}

		if (
			typeof value === "number" ||
			typeof value === "string" ||
			typeof value === "boolean"
		) {
			return getLiteralOrPrimitiveType(value, isConst);
		}

		if (typeof value === "symbol" || typeof value === "bigint") {
			return getPureType(value, isConst);
		}

		if (Array.isArray(value)) {
			return getArrayOrTupleType(value, isConst);
		}

		if (typeof value === "object") {
			return getObjectType(value, isConst);
		}

		throw new Error("uns Type, value: " + value);
	}
}
