import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import "./InvoiceFormPage.css";
import axios from "axios";
import { Invoice } from "../../classes/Invoice";
import { useState } from "react";
import { RequestUtil } from "../../utils/RequestUtil";
import { useAuth } from "@clerk/clerk-react";

const InvoiceFormPage: React.FC = () => {
	const auth = useAuth();

	const { id } = useParams();
	const [invoice, setInvoice] = useState<Invoice>(new Invoice());
	const isEdit = !!id;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === "dueDate") {
			setInvoice((prevInvoiceState: Invoice) => ({
				...prevInvoiceState,
				[name]: new Date(value),
			}));
		} else {
			setInvoice((prevInvoiceState) => ({
				...prevInvoiceState,
				[name]: value,
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		try {
			e.preventDefault();

			setInvoice((prevInvoiceState) => ({
				...prevInvoiceState,
				["date"]: new Date(),
			}));

			await axios.post(
				"/api/db/add",
				invoice,
				RequestUtil.getDefaultRequestConfig(await auth.getToken())
			)
			.then(res => {
				console.log(res);
			});

			console.log(invoice);
		} catch (error) {
			console.error(error);
		}
	};

	const formattedDueDate =
		invoice.dueDate instanceof Date
			? invoice.dueDate.toISOString().split("T")[0] // Format to 'YYYY-MM-DD'
			: "";

	return (
		<div id="invoice-form-container">
			{!isEdit ? (
				<>
					<h2>Dodaj račun</h2>
					<Form onSubmit={handleSubmit}>
						<Row>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label>Naziv računa</Form.Label>
									<Form.Control
										name="name"
										type="text"
										placeholder="Naziv"
										onChange={handleChange}
										value={invoice.name}
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label>Znesek</Form.Label>
									<Form.Control
										name="amount"
										type="number"
										placeholder="Znesek"
										min="0.01"
										step="0.01"
										onChange={handleChange}
										value={invoice.amount}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label>Rok plačila</Form.Label>
									<Form.Control
										name="dueDate"
										type="date"
										placeholder="Rok"
										onChange={handleChange}
										value={formattedDueDate}
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label>Plačnik</Form.Label>
									<Form.Control
										name="payer"
										type="text"
										placeholder="Plačnik"
										onChange={handleChange}
										value={invoice.payer}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group className="mb-3">
									<Form.Check
										name="statusPaid"
										type="checkbox"
										label="Plačano?"
										onChange={handleChange}
										checked={invoice.statusPaid}
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3">
									<Form.Check
										name="statusSent"
										type="checkbox"
										label="Poslano?"
										onChange={handleChange}
										checked={invoice.statusSent}
									/>
								</Form.Group>
							</Col>
						</Row>
						<div id="button-container">
							<Button type="submit">Dodaj</Button>
							<Link to="/invoices">
								<Button variant="danger">Prekliči</Button>
							</Link>
						</div>
					</Form>
				</>
			) : (
				"Add me"
			)}
		</div>
	);
};

export default InvoiceFormPage;
