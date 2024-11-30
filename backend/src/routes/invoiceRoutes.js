const express = require("express");
const Invoice = require("../models/Invoice.js");

const router = express.Router();

// Route to add a document
router.post("/add", async (req, res) => {
	try {
		const x = req.body;

		const invoice = new Invoice({
			userId: "vk",
			name: x.name,
			amount: x.amount,
			date: x.date,
			dueDate: x.dueDate,
			payer: x.payer,
			statusSent: x.statusSent,
			statusPaid: x.statusPaid,
		});

		const response = await invoice.save();

		// const response = await addDocument(doc);
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to add a document
router.post("/addList", async (req, res) => {
	try {
		const docs = req.body;

		const invoices = docs.map(
			(x) =>
				new Invoice({
					userId: "vk",
					name: x.name,
					amount: x.amount,
					date: x.date,
					dueDate: x.dueDate,
					payer: x.payer,
					statusSent: x.statusSent,
					statusPaid: x.statusPaid,
				})
		);

		const response = await Invoice.insertMany(invoices);
		res.json(response);
	} catch (error) {
        console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Route to get all documents
router.get("/all", async (req, res) => {
	try {
		const response = await Invoice.find().sort({ dueDate: -1 });
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to get all documents
router.get("/all/:page", async (req, res) => {
	try {
		const response = await Invoice.find().sort({ dueDate: -1 });

		const totalPages = (response.length % 5) + 1;

		let startingIndex = (req.params.page - 1) * 5;
		let items = 5;

		if (req.params.page === totalPages) items = response.length % 5;

		const data = response.slice(startingIndex, startingIndex + items);
		res.json(data);
	} catch (error) {
        console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Route to delete a document by only `_id`
router.delete("/delete/:id", async (req, res) => {
	const { id } = req.params;

    if (!id) throw new Exception("ID is required");

	try {
		const response = await Invoice.findByIdAndDelete(id);
		res.json({ message: "Document deleted successfully", response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//get number of pages
router.get("/pages", async (req, res) => {
	try {
		const response = await Invoice.find().sort({ dueDate: -1 });
		res.json(Math.ceil(response.length / 5));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/analytics", async (req, res) => {
	try {
		const response = await Invoice.find().sort({ dueDate: -1 });

		const data = {
			totalInvoices: response.length,
			invoicesPaid: response.filter(i => i.statusPaid === true).length,
			invoicesSent: response.filter(i => i.statusSent === true).length,
			amountPaid: (await Invoice.aggregate([
				{ $match: { statusPaid: true } },
				{ $group: { _id: null, totalAmount: { $sum: "$amount" } } } // Sum the `amount` field
			]))[0].totalAmount,
			amountOwed: (await Invoice.aggregate([
				{ $match: { statusPaid: false } },
				{ $group: { _id: null, totalAmount: { $sum: "$amount" } } } // Sum the `amount` field
			]))[0].totalAmount
		}

		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

//wipe entire DB
router.get("/wipe", async (req, res) => {
	try {
		await destroy();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
