import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import invoiceRoutes from "./src/routes/invoiceRoutes.mjs";
import cors from "cors";
import { verifyToken } from "@clerk/express";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

const connectDB = async () => {
	try {
		const dbURI = process.env.DB_URI;
	
		await mongoose.connect(dbURI);

		console.log("MongoDB connected succesfully");
	} catch (error) {
		console.error("Error connecting to MongoDB", error);
		// process.exit(1);
	}
};

const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

app.use(async (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");
	if (token == null) {
		res.status(403).send();
		return;
	}

	try {
		const verifiedToken = await verifyToken(token, {
			jwtKey: process.env.JWT_KEY,
		});
		req.auth = {
			sessionId: verifiedToken.sid,
			userId: verifiedToken.sub,
		};
	} catch (e) {
		console.error(e);
		res.status(403).send();
    return;
	}

	next();
});

app.use(bodyParser.json());
app.use("/db", invoiceRoutes);
app.use(cors(corsOptions));

const startServer = async () => {
	try {
    await connectDB();

    app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	} catch (error) {
    console.error(error);
  }
};

startServer();
