import React from "react";
import "./InvoicesPage.css";
import InvoiceTable from "./Table/InvoiceTable";
import ExcelFileInput from "./ExcelImporter/ExcelImporter";
import axios from "axios";
import { Invoice } from "../../classes/Invoice";
import { RequestUtil } from "../../utils/RequestUtil";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const InvoicesPage: React.FC = () => {
	const auth = useAuth();

	const importInvoices = async (invoices: Invoice[]) => {
		try {
			console.log(
				"Token",
				RequestUtil.getDefaultRequestConfig(await auth.getToken())
			);

			await axios.post(
				"/api/db/addList",
				invoices,
				RequestUtil.getDefaultRequestConfig(await auth.getToken())
			);
			// Map the response data to Invoice instances
			window.location.reload();
		} catch (error) {
			console.error("Error fetching page count:", error);
			alert("Import not succesful");
		}
	};

	return (
		<div id="table-container">
			<h3>Računi</h3>
			<div id="controls-container">
				<Link to="/invoices/add">
					<Button><FontAwesomeIcon icon={faPlus} />Dodaj račun</Button>
				</Link>
				<ExcelFileInput importInvoices={importInvoices} />
			</div>
			<InvoiceTable />
		</div>
	);
};

export default InvoicesPage;
