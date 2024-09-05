import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://its19447:${process.env.DB_PASSWORD}@portfolio.oshygre.mongodb.net/?retryWrites=true&w=majority&appName=Portfolio`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});

const dbName = "nodeStudy";
const collectionName = "log";

interface Log {
	input: string;
	output: string;
	createAt: Date;
}

export async function insertLog(log: Omit<Log, "createAt">) {
	try {
		await client.connect();
		console.log("Connected to MongoDB Atlas");

		const database = client.db(dbName);
		const collection = database.collection(collectionName);

		// 단일 문서 삽입
		const result = await collection.insertOne({ ...log, createAt: new Date() });
		console.log(`A document was inserted with the _id: ${result.insertedId}`);
	} catch (error) {
		console.error(error);
		// Ensures that the client will close when you finish/error
		await client.close();
		throw Error();
	}
}

export async function getLogList() {
	try {
		await client.connect();
		const database = client.db(dbName);
		const collection = database.collection<Log>(collectionName);

		const result = await collection
			.find()
			.sort({ createAt: -1 })
			.limit(5)
			.toArray();
		console.log(result);

		return result satisfies Log[];
	} catch (error) {
		console.error(error);
		// Ensures that the client will close when you finish/error
		await client.close();
		throw Error();
	}
}

export async function connectDb() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} catch (error) {
		console.error(error);
		// Ensures that the client will close when you finish/error
		await client.close();
		throw Error();
	}
}

export function closeConnection() {
	client.close();
}
