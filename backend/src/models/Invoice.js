const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: false,
	},
	amount: {
		type: Number,
		required: false,
	},
	date: {
		type: Date,
		required: false,
	},
	dueDate: {
		type: Date,
		required: false,
	},
	payer: {
		type: String,
		required: false,
	},
	statusSent: {
		type: Boolean,
		required: false,
	},
	statusPaid: {
		type: Boolean,
		required: false,
	},
});

module.exports = new mongoose.model("Invoice", invoiceSchema);;
