import type { TypeNode, UnionTypeNode } from "@/entities/type-node";
import { LeftPaddingBox } from "@/shared/ui";
import { Fragment } from "react/jsx-runtime";

export const displayTypeNode = (node: TypeNode): React.ReactNode => {
	switch (node.type) {
		case "undefined":
		case "null": {
			//is Nullish
			return node.type;
		}
		case "string":
		case "number":
		case "boolean": {
			//isPrimitive
			return node.type;
		}
		case "stringLiteral":
		case "numberLiteral":
		case "booleanLiteral": {
			//isPrimitive
			const val = node.value.toString();
			return node.type === "stringLiteral" ? `"${val}"` : val;
		}
		case "bigint":
		case "symbol": {
			//is Pure
			return node.type;
		}
		case "tuple":
		case "array": {
			const innerType = node.children.map((n) => displayTypeNode(n));
			if (node.type === "tuple") {
				return (
					<div>
						&#91;
						<br />
						{innerType.map((node) => (
							<>{node},</>
						))}
						<br />
						&#93;
					</div>
				);
			}
			const uniqueTypeArray = [...new Set(innerType)];

			if (uniqueTypeArray.length === 0) {
				return "[]";
			}

			if (uniqueTypeArray.length === 1) {
				return <>{uniqueTypeArray[0]}&#91;&#93;</>;
			}

			return (
				<>
					&#40;
					<br />
					<LeftPaddingBox>
						{uniqueTypeArray.map((node, idx) => (
							<Fragment key={idx}>
								{node}&nbsp;&#124;
								<br />
							</Fragment>
						))}
					</LeftPaddingBox>
					&#41;&#91;&#93;
				</>
			);
		}

		case "object": {
			return (
				<>
					&#123;
					<br />
					<LeftPaddingBox>
						{Object.entries(node.children).map(([k, v], idx, arr) => {
							return (
								<Fragment key={k}>
									{`${k}:`} {displayTypeNode(v)}
									{idx !== arr.length - 1 ? ", " : ""}
									<br />
								</Fragment>
							);
						})}
					</LeftPaddingBox>
					&#125;
				</>
			);
		}

		case "union":
			return diplayUnionType(node);

		default:
			return "Unknown Type";
	}
};

const diplayUnionType = (node: UnionTypeNode) => {
	const uniqueTypes = [
		...new Set(node.children.map((child) => displayTypeNode(child)))
	];

	if (uniqueTypes.length === 0) {
		return "never";
	}

	if (uniqueTypes.length === 1) {
		return uniqueTypes[0];
	}

	return (
		<>
			{uniqueTypes.length > 1 && "("}
			<br />
			<LeftPaddingBox>
				{uniqueTypes.map((typeString, idx) => (
					<Fragment key={idx}>
						{typeString}
						{idx !== uniqueTypes.length - 1 && (
							<>
								&nbsp;|
								<br />
							</>
						)}
					</Fragment>
				))}
			</LeftPaddingBox>
			{uniqueTypes.length > 1 && ")"}
		</>
	);
};
