export type Type =
	| null
	| "boolean"
	| "string"
	| "number"
	| "symbol"
	| "bigint"
	| boolean
	| string
	| number
	| symbol
	| bigint
	| Type[]
	| ObjectStruct;

type ObjectStruct = {
	[key: string | number | symbol]: Type;
};

export class DataTypeCalculator {
	#dataStructure: ObjectStruct = null!;
	#valueSet: Map<string, Set<Type>> = new Map();

	constructor(data: ObjectStruct) {
		this.#dataStructure = data;
	}

	static getType(value: unknown, isConst?: boolean): Type {
		if (value === null) {
			return value;
		}

		if (typeof value === "undefined") {
			return "undefined";
		}

		if (typeof value === "number") {
			return !isConst ? "number" : value;
		}

		if (typeof value === "string") {
			return !isConst ? "string" : value;
		}

		if (typeof value === "boolean") {
			return !isConst ? "boolean" : value;
		}

		if (typeof value === "symbol") {
			return !isConst ? "symbol" : value;
		}

		if (typeof value === "bigint") {
			return !isConst ? "bigint" : value;
		}

		if (Array.isArray(value)) {
			const innerTypeArray = value.map((v) => this.getType(v, isConst));

			return !isConst
				? `(${[...new Set(innerTypeArray)].join(" | ")})[]`
				: innerTypeArray;
		}

		let obj: ObjectStruct = {};

		Object.entries(value).forEach(([k, v]) => {
			obj[k] = this.getType(v);
		});

		return obj;
	}
}
