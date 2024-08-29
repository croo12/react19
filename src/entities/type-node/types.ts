export type NullishType = "null" | "undefined";

export type PrimitiveType = "boolean" | "string" | "number";

export type PureType = "symbol" | "bigint";

export type LiteralType = "stringLiteral" | "numberLiteral" | "booleanLiteral";

export type ComplexType = "array" | "object" | "tuple";

export type Type =
	| NullishType
	| PrimitiveType
	| ComplexType
	| PureType
	| "union"
	| LiteralType;

interface BaseTypeObject {
	type: Type;
	isConst: boolean;
	value: any;
	children:
		| BaseTypeObject[]
		| { [key: string | symbol | number]: BaseTypeObject }
		| null;
}

export interface UnionTypeNode extends BaseTypeObject {
	type: "union";
	children: TypeNode[];
}

export interface TupleTypeNode extends BaseTypeObject {
	type: "tuple";
	children: TypeNode[];
}

export interface NullishTypeNode extends BaseTypeObject {
	type: NullishType;
	children: null;
}

export interface PrimitiveTypeNode extends BaseTypeObject {
	type: PrimitiveType | LiteralType;
	children: null;
}

export interface PureTypeNode extends BaseTypeObject {
	type: PureType;
	children: null;
}

export interface ArrayTypeNode extends BaseTypeObject {
	type: "array";
	children: TypeNode[];
}

export interface ObjectTypeNode extends BaseTypeObject {
	type: "object";
	children: { [key: string | symbol | number]: TypeNode };
}

export type TypeNode =
	| NullishTypeNode
	| PrimitiveTypeNode
	| ArrayTypeNode
	| ObjectTypeNode
	| UnionTypeNode
	| TupleTypeNode
	| PureTypeNode;
