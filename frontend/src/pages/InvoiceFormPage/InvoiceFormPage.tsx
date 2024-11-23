import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./InvoiceFormPage.css";
import axios from "axios";
import { Invoice } from "../../classes/Invoice";
import { useState } from "react";
import { RequestUtil } from "../../utils/RequestUtil";
import { useAuth } from "@clerk/clerk-react";

interface InvoiceFormPageProps {
	isReadOnly: boolean;
}

const InvoiceFormPage: React.FC<InvoiceFormPageProps> = ({ isReadOnly }) => {
	const auth = useAuth();
	const navigate = useNavigate();

	const { id } = useParams();
	const [invoice, setInvoice] = useState<Invoice>(new Invoice());
	const isEdit = !!id;

	const title = !isReadOnly ? (isEdit ? "Uredi račun" : "Dodaj račun") : "Pregled računa";

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isReadOnly) return;

		const { name, type, value } = e.target;

		console.log(type);
		if (name === "dueDate") {
			setInvoice((prevInvoiceState: Invoice) => ({
				...prevInvoiceState,
				[name]: new Date(value),
			}));
		} else if (type === "checkbox") {
			setInvoice((prevInvoiceState: Invoice) => ({
				...prevInvoiceState,
				[name]: e.target.checked,
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

			await axios
				.post(
					"/api/db/add",
					invoice,
					RequestUtil.getDefaultRequestConfig(await auth.getToken())
				)
				.then((res) => {
					if (res.status === 200) {
						navigate("/invoices");
					}
				})
				.catch((e) => {
					console.error(e);
				});
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
			<h2>{title + (id ? ` - ${id}` : "")}</h2>
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
								readOnly={isReadOnly}
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
								readOnly={isReadOnly}
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
								readOnly={isReadOnly}
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
								readOnly={isReadOnly}
							/>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Group className="mb-3">
							<Form.Check
								name="statusSent"
								type="checkbox"
								label="Poslano?"
								onChange={handleChange}
								checked={invoice.statusSent}
								readOnly={isReadOnly}
							/>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group className="mb-3">
							<Form.Check
								name="statusPaid"
								type="checkbox"
								label="Plačano?"
								onChange={handleChange}
								checked={invoice.statusPaid}
								readOnly={isReadOnly}
							/>
						</Form.Group>
					</Col>
				</Row>
				<div id="button-container">
					{!isReadOnly ? (
						<>
							<Button type="submit">Dodaj</Button>
							<Link to="/invoices">
								<Button variant="danger">Prekliči</Button>
							</Link>
						</>
					) : (
						<Link to="/invoices">
							<Button>Nazaj</Button>
						</Link>
					)}
				</div>
			</Form>
		</div>
	);
};

export default InvoiceFormPage;
