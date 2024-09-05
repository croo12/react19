import ts from "typescript";

interface DocEntry {
	name?: string;
	fileName?: string;
	documentation?: string;
	type?: string;
	constructors?: DocEntry[];
	parameters?: DocEntry[];
	returnType?: string;
}

export function extractTypeFromJSON(jsonContent: string): string {
	const jsonObject = JSON.parse(jsonContent);

	console.log(jsonObject);

	// TypeScript 컴파일러 옵션 설정
	const compilerOptions: ts.CompilerOptions = {
		strict: true,
		noEmit: true
	};

	// 가상의 TypeScript 소스 파일 생성
	const sourceText = `const json = ${JSON.stringify(jsonObject, null, 2)};`;
	const sourceFile = ts.createSourceFile(
		"temp.ts",
		sourceText,
		ts.ScriptTarget.Latest,
		true
	);

	// 프로그램과 타입 체커 생성
	const host = ts.createCompilerHost(compilerOptions);
	host.getSourceFile = (fileName) =>
		fileName === "temp.ts" ? sourceFile : undefined;
	host.writeFile = () => {};
	host.getCurrentDirectory = () => "";
	host.getCanonicalFileName = (fileName) => fileName;
	host.useCaseSensitiveFileNames = () => true;
	host.getNewLine = () => "\n";

	const program = ts.createProgram(["temp.ts"], compilerOptions, host);
	const typeChecker = program.getTypeChecker();

	// 'json' 변수의 타입 추출
	const jsonNode = sourceFile.statements[0] as ts.VariableStatement;
	const declaration = jsonNode.declarationList.declarations[0];
	const symbol = typeChecker.getSymbolAtLocation(declaration.name);

	if (!symbol) {
		throw new Error("Could not find symbol for json variable");
	}

	const type = typeChecker.getTypeOfSymbolAtLocation(symbol, declaration);

	// 타입을 문자열로 변환
	const result = typeChecker.typeToString(
		type,
		undefined,
		ts.TypeFormatFlags.NoTruncation |
			ts.TypeFormatFlags.WriteArrayAsGenericType |
			ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
			ts.TypeFormatFlags.AddUndefined |
			ts.TypeFormatFlags.InTypeAlias |
			ts.TypeFormatFlags.MultilineObjectLiterals |
			ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral
	);
	console.log(result);

	const anotherResult = generateTypeDefinition(type, typeChecker);
	console.log(anotherResult);

	const formattedResult = result.replace(/\\u[\dA-F]{4}/gi, (match) => {
		return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
	});

	console.log(formattedResult);

	return formattedResult;
}

function generateTypeDefinition(
	type: ts.Type,
	typeChecker: ts.TypeChecker
): string {
	if (type.isUnion()) {
		return type.types
			.map((t) => generateTypeDefinition(t, typeChecker))
			.join(" | ");
	}

	if (type.isIntersection()) {
		return type.types
			.map((t) => generateTypeDefinition(t, typeChecker))
			.join(" & ");
	}

	if (type.isStringLiteral()) {
		return `"${type.value}"`;
	}

	if (type.isNumberLiteral()) {
		return type.value.toString();
	}

	if (type.flags & ts.TypeFlags.Boolean) {
		return "boolean";
	}

	if (type.flags & ts.TypeFlags.Number) {
		return "number";
	}

	if (type.flags & ts.TypeFlags.String) {
		return "string";
	}

	if (type.flags & ts.TypeFlags.Null) {
		return "null";
	}

	if (type.flags & ts.TypeFlags.Undefined) {
		return "undefined";
	}

	if (type.flags & ts.TypeFlags.Object) {
		const properties = type.getProperties();
		if (properties.length === 0) {
			return "{}";
		}

		const propertyDefinitions = properties.map((prop) => {
			const propType = typeChecker.getTypeOfSymbolAtLocation(
				prop,
				prop.valueDeclaration!
			);
			const propName = prop.getName();
			const isOptional = (prop.flags & ts.SymbolFlags.Optional) !== 0;
			return `${propName}${isOptional ? "?" : ""}: ${generateTypeDefinition(propType, typeChecker)}`;
		});

		return `{\n  ${propertyDefinitions.join(",\n  ")}\n}`;
	}

	return typeChecker.typeToString(
		type,
		undefined,
		ts.TypeFormatFlags.NoTruncation |
			ts.TypeFormatFlags.WriteArrayAsGenericType |
			ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
			ts.TypeFormatFlags.AddUndefined |
			ts.TypeFormatFlags.InTypeAlias |
			ts.TypeFormatFlags.MultilineObjectLiterals |
			ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral
	);
}
