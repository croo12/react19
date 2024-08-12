import type { TypeNode } from "@/entities/type-node";
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
				return (
					<div>
						&#91;
						<br />
						{innerType.join(", ")}
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
					{uniqueTypeArray.map((node, idx) => (
						<Fragment key={idx}>
							{node}&nbsp;&#124;
							<br />
						</Fragment>
					))}
					&#41;&#91;&#93;
				</>
			);
		}

		case "object": {
			return (
				<>
					&#123;
					<br />
					{Object.entries(node.children).map(([k, v], idx, arr) => {
						return (
							<Fragment key={k}>
								{`${k}:`} {displayTypeNode(v)}
								{idx !== arr.length - 1 ? ", " : ""}
								<br />
							</Fragment>
						);
					})}
					&#125;
				</>
			);
		}
	}
};
