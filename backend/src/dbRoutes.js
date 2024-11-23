const express = require("express");
const {
	addDocument,
	addDocumentsList,
	getAllDocuments,
	deleteDocument,
	deleteDocumentById,
	updateDocument,
	destroy,
} = require("../src/pouchdb");
const router = express.Router();
const { v4: uuid } = require("uuid");

// Route to add a document
router.post("/add", async (req, res) => {
	try {
		const doc = req.body;

		doc.userId = req.auth.userId;
		doc._id = uuid();

		const response = await addDocument(doc);
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to add a document
router.post("/addList", async (req, res) => {
	try {
		const docs = req.body;
		console.log(req.auth);
		// docs.forEach(d => d.userId = req.auth.userId)
		docs.forEach((d) => {
			d.userId = req.auth.userId;
		});
		const response = await addDocumentsList(docs);
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to get all documents
router.get("/all", async (req, res) => {
	try {
		const response = await getAllDocuments();
		res.json(response.rows.map((row) => row.doc));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to get all documents
router.get("/all/:page", async (req, res) => {
	try {
		const response = await getAllDocuments();

		const totalPages = (response.total_rows % 5) + 1;

		let startingIndex = (req.params.page - 1) * 5;
		let items = 5;

		if (req.params.page === totalPages) items = response.total_rows % 5;

		const data = response.rows.slice(startingIndex, startingIndex + items);
		res.json(data.map((row) => row.doc));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to delete document
router.delete("/delete/:id/:rev", async (req, res) => {
	const { id, rev } = req.params;

	try {
		const response = await deleteDocument(id, rev);
		res.json({ message: "Document deleted successfully", response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to delete a document by only `_id`
router.delete("/delete/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const response = await deleteDocumentById(id);
		res.json({ message: "Document deleted successfully", response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to update a document by `_id`
router.put("/update/:id", async (req, res) => {
	//should only owner be able to update this? if so then wee need to add a check here!!
	const { id } = req.params;
	const newData = req.body; // Get the new data from request body

	try {
		const response = await updateDocument(id, newData);
		res.json({ message: "Document updated successfully", response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//get number of pages
router.get("/pages", async (req, res) => {
	try {
		const response = await getAllDocuments();
		res.json(Math.ceil(response.total_rows / 5));
	} catch (error) {
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
