const request = require("supertest");
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
const express = require("express");
const router = require("../routes/invoiceRoutes"); // Adjust path to your route file
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

async function getAnalyticsData() {
	try {
		const response = await Invoice.find().sort({ dueDate: -1 });

		const data = {
			totalInvoices: response.length,
			invoicesPaid: response.filter((i) => i.statusPaid === true).length,
			invoicesSent: response.filter((i) => i.statusSent === true).length,
			amountPaid:
				(
					await Invoice.aggregate([
						{ $match: { statusPaid: true } },
						{
							$group: {
								_id: null,
								totalAmount: { $sum: "$amount" },
							},
						},
					])
				)[0]?.totalAmount || 0,
			amountOwed:
				(
					await Invoice.aggregate([
						{ $match: { statusPaid: false } },
						{
							$group: {
								_id: null,
								totalAmount: { $sum: "$amount" },
							},
						},
					])
				)[0]?.totalAmount || 0,
		};

		return data;
	} catch (error) {
		throw new Error(error.message);
	}
}

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri);
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

describe("GET /api/db/analytics", () => {
	it("should return analytics data when invoices are present", async () => {
		// Insert mock data into the database
        await Invoice.deleteMany();

		await Invoice.create([
			{
				statusPaid: true,
				statusSent: true,
				amount: 100,
				dueDate: "2024-12-01",
				userId: new mongoose.Types.ObjectId(), // Assuming userId is required and is an ObjectId
			},
			{
				statusPaid: false,
				statusSent: true,
				amount: 200,
				dueDate: "2024-11-01",
				userId: new mongoose.Types.ObjectId(), // Add userId for each invoice
			},
		]);

		// Set up the Express app with the route
		const app = express();
		app.use("/api/db", router);

		// Make a GET request to the /analytics endpoint
		const response = await request(app).get("/api/db/analytics");

		// Assert the response status and data
		expect(response.status).toBe(200);
		expect(response.body.totalInvoices).toBe(2);
		expect(response.body.invoicesPaid).toBe(1);
		expect(response.body.invoicesSent).toBe(2);
		expect(response.body.amountPaid).toBe(100);
		expect(response.body.amountOwed).toBe(200);
	});
});

describe("getAnalyticsData", () => {
	it("should return correct analytics for invoices with mixed statuses", async () => {
        await Invoice.deleteMany();

		// Add mixed invoices to the in-memory database
		await Invoice.create([
			{
				statusPaid: true,
				statusSent: true,
				amount: 100,
				dueDate: "2024-12-01",
				userId: new mongoose.Types.ObjectId(),
			},
			{
				statusPaid: false,
				statusSent: true,
				amount: 200,
				dueDate: "2024-11-01",
				userId: new mongoose.Types.ObjectId(),
			},
			{
				statusPaid: true,
				statusSent: false,
				amount: 300,
				dueDate: "2024-10-01",
				userId: new mongoose.Types.ObjectId(),
			},
		]);

		// Call the business logic function directly
		const result = await getAnalyticsData();

		// Assert that the analytics are correct
		expect(result.totalInvoices).toBe(3); // Three invoices
		expect(result.invoicesPaid).toBe(2); // Two paid invoices
		expect(result.invoicesSent).toBe(2); // Two sent invoices
		expect(result.amountPaid).toBe(400); // Total paid amount (100 + 300)
		expect(result.amountOwed).toBe(200); // Total owed amount (200)
	});

	it("should return 0 analytics when no invoices exist", async () => {
        await Invoice.deleteMany();

		// No invoices in the in-memory DB
		// Call the business logic function directly
		const result = await getAnalyticsData();

		// Assert that the result is zero for all values
		expect(result.totalInvoices).toBe(0);
		expect(result.invoicesPaid).toBe(0);
		expect(result.invoicesSent).toBe(0);
		expect(result.amountPaid).toBe(0);
		expect(result.amountOwed).toBe(0);
	});

	it("should handle invoices with only unpaid and unsent status", async () => {
        await Invoice.deleteMany();

		// Add only unpaid and unsent invoices to the in-memory DB
		await Invoice.create([
			{
				statusPaid: false,
				statusSent: false,
				amount: 200,
				dueDate: "2024-11-01",
				userId: new mongoose.Types.ObjectId(),
			},
			{
				statusPaid: false,
				statusSent: false,
				amount: 300,
				dueDate: "2024-10-01",
				userId: new mongoose.Types.ObjectId(),
			},
		]);

		// Call the business logic function directly
		const result = await getAnalyticsData();

		// Assert that the analytics are correct
		expect(result.totalInvoices).toBe(2); // Two invoices
		expect(result.invoicesPaid).toBe(0); // No paid invoices
		expect(result.invoicesSent).toBe(0); // No sent invoices
		expect(result.amountPaid).toBe(0); // No amount paid
		expect(result.amountOwed).toBe(500); // Total owed amount (200 + 300)
	});
});
