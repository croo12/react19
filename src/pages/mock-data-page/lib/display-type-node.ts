import { TypeNode } from "../model/data-type-calculator";

export const displayTypeNode = (node: TypeNode): string => {
	switch (node.type) {
		case "undefined":
		case "null": {
			//is Nullish
			return node.type;
		}
		case "string":
		case "number":
		case "bigint":
		case "boolean":
		case "symbol": {
			//is Pure
			if (node.isConst) {
				const str = node.value.toString();
				return node.type === "string" ? `"${str}"` : str;
			}
			return node.type;
		}
		case "array": {
			const innerType = node.children.map((n) => displayTypeNode(n));
			if (node.isConst) {
				return `[${innerType.join(", ")}]`;
			}
			const uniqueTypeArray = [...new Set(innerType)];
			return `${uniqueTypeArray.length > 1 ? `(${uniqueTypeArray.join(" | ")})` : `${uniqueTypeArray}`}[]`;
		}

		case "object": {
			let result = "{";
			Object.entries(node.children).forEach(([k, v], idx, arr) => {
				result += `${k}: ${displayTypeNode(v)}${idx !== arr.length - 1 ? ", " : ""}`;
			});
			result += "}";
			return result;
		}
	}
};
