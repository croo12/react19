import { useState } from "react";
import { DataTypeCalculator, Type } from "../model/data-type-calculator";
import { Card } from "../../../shared/ui";

export const MockDataMainPage = () => {
	const [value, setValue] = useState("");
	const [calculatedValue, setCalculatedValue] = useState<Type | null>(null);

	return (
		<div style={{ width: "100%" }}>
			<h1>하이 목데이터</h1>
			<div
				style={{
					padding: "2rem",
					display: "flex",
					flexDirection: "column",
					gap: "8px"
				}}
			>
				<textarea
					placeholder="데이터를 입력하세요..."
					value={value}
					onChange={(e) => setValue(e.currentTarget.value)}
					style={{
						height: "20rem",
						padding: "1rem"
					}}
				/>
				<button
					onClick={() => {
						const result = DataTypeCalculator.getType(JSON.parse(value));
						console.log(result);
						setCalculatedValue(result);
					}}
				>
					분석하기
				</button>
			</div>
			<Card>
				<code>
					{calculatedValue
						? JSON.stringify(calculatedValue)
						: "분석하기 버튼을 눌러주세요."}
				</code>
			</Card>
		</div>
	);
};
