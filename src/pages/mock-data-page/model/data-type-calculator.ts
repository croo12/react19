type NullishType = "null" | "undefined";

type PureType = "boolean" | "string" | "number" | "symbol" | "bigint";

export type Type = NullishType | PureType | "array" | "object";

interface BaseTypeObject {
	type: Type;
	isConst: boolean;
	value: any;
	children:
		| BaseTypeObject[]
		| { [key: string | symbol | number]: BaseTypeObject }
		| null;
}

interface NullishTypeNode extends BaseTypeObject {
	type: NullishType;
	children: null;
}

interface PureTypeNode extends BaseTypeObject {
	type: PureType;
	children: null;
}

interface ArrayTypeNode extends BaseTypeObject {
	type: "array";
	children: BaseTypeObject[];
}

interface ObjectTypeNode extends BaseTypeObject {
	type: "object";
	children: { [key: string | symbol | number]: BaseTypeObject };
}

type TypeNode = NullishTypeNode | PureTypeNode | ArrayTypeNode | ObjectTypeNode;

export class DataTypeCalculator {
	// #dataStructure: ObjectStruct = null!;
	// #valueSet: Map<string, Set<Type>> = new Map();

	// constructor(data: ObjectStruct) {
	// 	this.#dataStructure = data;
	// }

	static getType(value: unknown, isConst: boolean): TypeNode {
		if (value === null) {
			return {
				type: "null",
				value,
				isConst,
				children: null
			} satisfies NullishTypeNode;
		}

		if (typeof value === "undefined") {
			return {
				type: "undefined",
				value,
				isConst,
				children: null
			} satisfies NullishTypeNode;
		}

		if (typeof value === "number") {
			return {
				type: "number",
				value,
				isConst,
				children: null
			} satisfies PureTypeNode;
		}

		if (typeof value === "string") {
			return {
				type: "string",
				value,
				isConst,
				children: null
			} satisfies PureTypeNode;
		}

		if (typeof value === "boolean") {
			return {
				type: "boolean",
				value,
				isConst,
				children: null
			} satisfies PureTypeNode;
		}

		if (typeof value === "symbol") {
			return {
				type: "symbol",
				value,
				isConst,
				children: null
			} satisfies PureTypeNode;
		}

		if (typeof value === "bigint") {
			return {
				type: "bigint",
				value,
				isConst,
				children: null
			} satisfies PureTypeNode;
		}

		if (Array.isArray(value)) {
			const innerTypeArray = value.map((v) => this.getType(v, isConst));

			return {
				type: "array",
				value,
				isConst,
				children: innerTypeArray
			} satisfies ArrayTypeNode;
		}

		const innerTypeObject: Record<string | number | symbol, TypeNode> = {};

		Object.entries(value).forEach(([k, v]) => {
			innerTypeObject[k] = this.getType(v, isConst);
		});

		return {
			type: "object",
			value,
			isConst,
			children: innerTypeObject
		} satisfies ObjectTypeNode;
	}
}
