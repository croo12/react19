import { useEffect, useState } from "react";
import { Card } from "@/shared/ui";

type Log = { input: string; output: string; createdAt: Date };

const NODE_END_POINT = import.meta.env.NODE_END_POINT;

console.log(NODE_END_POINT);

const getLogs = async (callback: (log: Log[]) => void) => {
	const response = await fetch(`${NODE_END_POINT}/log`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	});

	const data = await response.json();

	callback(data.log);
};

export const MockDataMainPage = () => {
	const [value, setValue] = useState("");
	const [calculatedValue, setCalculatedValue] = useState<string | null>(null);

	const [logs, setLogs] = useState<Log[]>([]);

	useEffect(() => {
		getLogs(setLogs);
	}, []);

	const extractType = async (jsonValue: string) => {
		try {
			// setExtractedType("");

			const response = await fetch(`${NODE_END_POINT}/extract-type`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ jsonContent: jsonValue })
			});

			if (!response.ok) {
				throw new Error("Failed to extract type");
			}

			const data = await response.json();
			setCalculatedValue(data.type);
			console.log(data);
			getLogs(setLogs);
		} catch (err) {
			console.error("Error extracting type: ", err);
		}
	};

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
						// const result = DataTypeCalculator.getType(JSON.parse(value), false);
						// console.log(result);
						// setCalculatedValue(result);

						extractType(value);
					}}
				>
					분석하기
				</button>
			</div>
			<Card>
				<code>
					{calculatedValue ? calculatedValue : "분석하기 버튼을 눌러주세요."}
				</code>
			</Card>
			{logs.length > 0 &&
				logs.map((log, index) => (
					<div
						key={index}
						style={{ display: "flex", flexDirection: "column", gap: "8px" }}
					>
						<code>{log.input}</code>
						<code>{log.output}</code>
					</div>
				))}
		</div>
	);
};
