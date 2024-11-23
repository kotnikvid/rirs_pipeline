import React from "react";
import * as XLSX from "xlsx";
import { Invoice } from "../../../classes/Invoice";
import "./ExcelImporter.css";
import { Button, Form } from "react-bootstrap";

interface ExcelFileInputProps {
	importInvoices: (invoices: Invoice[]) => void;
}

const ExcelFileInput: React.FC<ExcelFileInputProps> = ({ importInvoices }) => {
	const results: any[] = [];

	const handleFileUpload = (e: any) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.onload = (event) => {
			const workbook = XLSX.read(event.target!.result, {
				type: "binary",
				cellDates: true,
			});
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const sheetData = XLSX.utils.sheet_to_json(sheet);

			console.log(sheetData);

			sheetData.forEach((i) => {
				let entries = Object.entries(i as { [key: string]: unknown });
				let invoice = new Invoice(
					entries[0][1] as string,
					entries[1][1] as string,
					entries[2][1] as string,
					entries[3][1] as number,
					new Date(entries[4][1] as string) as Date,
					new Date(entries[5][1] as string) as Date,
					entries[6][1] as string,
					entries[7][1] as boolean,
					entries[8][1] as boolean
				);

				results.push(invoice);
			});

			importInvoices(results);
		};

		reader.readAsBinaryString(file);
	};

	return (
		<>
			<div id="import-container">
				<div>
					<a href="Uvoz_Predloga.xlsx">
						<Button variant="primary" size="sm">
							Uvozna predloga
						</Button>
					</a>
				</div>
				<div>
					<Form.Control
						id="files"
						size="sm"
						type="file"
						onChange={handleFileUpload}
						placeholder="Uvoz računov"
					/>
				</div>
			</div>
		</>
	);
};

export default ExcelFileInput;
