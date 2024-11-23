import Table from "react-bootstrap/Table";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {
	faTrash,
	faFile,
	faCaretLeft,
	faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./InvoiceTable.css";
import PageSelectModal from "./PageSelectModal";
import axios from "axios";
import { Invoice } from "../../../classes/Invoice";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { RequestUtil } from "../../../utils/RequestUtil";

const InvoiceTable = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [pages, setPages] = useState<number[]>([1, 2, 5, 6]);
	const [invoices, setInvoices] = useState<Invoice[]>();
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState<boolean>(true);
	const auth = useAuth();

	// const getAllData = async () => {
	// 	try {
	// 		const response = await axios.get("/api/db/all");
	// 		// Map the response data to Invoice instances
	// 		const invoiceData: Invoice[] = response.data.map((data: any) =>
	// 			Invoice.fromJSON(data)
	// 		);
	// 		setInvoices(invoiceData); // Set the state with the array of Invoice objects
	// 	} catch (error) {
	// 		console.error("Error fetching invoices:", error);
	// 	} finally {
	// 		setLoading(false); // Set loading to false after fetch is complete
	// 	}
	// };

	const getDataByPage = async (page: number) => {
		try {
			const response = await axios.get(
				"/api/db/all/" + page,
				RequestUtil.getDefaultRequestConfig(await auth.getToken())
			);
			// Map the response data to Invoice instances
			const invoiceData: Invoice[] = response.data.map((data: any) =>
				Invoice.fromJSON(data)
			);
			setInvoices(invoiceData); // Set the state with the array of Invoice objects
		} catch (error) {
			console.error("Error fetching invoices:", error);
		} finally {
			setLoading(false); // Set loading to false after fetch is complete
		}
	};

	const getTotalPages = async () => {
		try {
			const response = await axios.get(
				"/api/db/pages",
				RequestUtil.getDefaultRequestConfig(await auth.getToken())
			);
			// Map the response data to Invoice instances
			setTotalPages(response.data);
			setPagesArray(response.data);
		} catch (error) {
			console.error("Error fetching page count:", error);
		}
	};

	const deleteInvoice = async (id: string) => {
		try {
			await axios.delete("api/db/delete/" + id);
			// Map the response data to Invoice instances
			refreshData(currentPage);
		} catch (error) {
			console.error("Error fetching page count:", error);
		}
	};

	const setPagesArray = (total: number) => {
		if (total === 1) {
			setPages([]);
			return;
		}

		const arr: number[] = [1, 2, total - 1, total];

		if (arr[0] === arr[2] && arr[1] === arr[3]) {
			arr[2] = -1;
			arr[3] = -1;
		}

		console.log(arr);

		setPages(arr);
	};

	useEffect(() => {
		getTotalPages();
		refreshData(1);
	}, []);

	const onPageClicked = (page: number) => {
		setCurrentPage(page);
		refreshData(page);
	};

	const decreasePage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
			refreshData(currentPage - 1);
		}
	};

	const increasePage = () => {
		if (currentPage < totalPages!) {
			setCurrentPage(currentPage + 1);
			refreshData(currentPage + 1);
		}
	};

	const refreshData = async (page: number) => {
		await getDataByPage(page);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	if (loading) {
		return <h3>Loading</h3>;
	}

	return (
		<>
			{invoices !== null && totalPages > 0 ? (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>ID</th>
							<th>Naziv</th>
							<th>Znesek</th>
							<th>Datum izdaje</th>
							<th>Rok plačila</th>
							<th>Plačnik</th>
							<th>Status</th>
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						{invoices?.map((data, index) => (
							<tr>
								<td>{(currentPage - 1) * 5 + index + 1}</td>
								<td>{data.name}</td>
								<td>{data.amount} €</td>
								<td>{data.date.toLocaleDateString()}</td>
								<td
									className={
										data.dueDate > data.date
											? "text-green"
											: "text-red"
									}
								>
									{data.dueDate.toLocaleDateString()}
								</td>
								<td>{data.payer}</td>
								<td>
									<span
										className={
											"status-tag " +
											(data.statusSent
												? "text-green"
												: "text-red")
										}
									>
										{data.statusSent
											? "Poslano"
											: "Neposlano"}
									</span>
									<span
										className={
											data.statusPaid
												? "text-green"
												: "text-red"
										}
									>
										{data.statusPaid
											? "Plačano"
											: "Neplačano"}
									</span>
								</td>
								<td id="table-button-container">
									<Link to={"/invoices/" + data._id}>
										<Button variant="primary" size="sm">
											<FontAwesomeIcon icon={faFile} />
										</Button>
									</Link>
									<Button
										variant="danger"
										size="sm"
										onClick={() => deleteInvoice(data._id)}
									>
										<FontAwesomeIcon icon={faTrash} />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						{pages.length > 0 ? (
							<tr>
								<td colSpan={8}>
									<div id="pager-container">
										<div id="pager">
											<div
												className="pager-element pager-arrow-left"
												onClick={() => decreasePage()}
											>
												<FontAwesomeIcon
													icon={faCaretLeft}
												/>
											</div>
											<div
												className={
													"pager-element pager-start" +
													(pages[0] == currentPage
														? " bold bg-blue text-white"
														: "")
												}
												onClick={() =>
													onPageClicked(pages[0])
												}
											>
												{pages[0]}
											</div>
											<div
												className={
													"pager-element" +
													(pages[1] == currentPage
														? " bold bold bg-blue text-white"
														: "")
												}
												onClick={() =>
													onPageClicked(pages[1])
												}
											>
												{pages[1]}
											</div>
											{pages[2] !== -1 &&
											pages[3] !== -1 &&
											currentPage > 2 &&
											currentPage < totalPages - 1 ? (
												<div
													className="pager-element bold bold bg-blue text-white"
													onClick={() =>
														setShowModal(true)
													}
												>
													{currentPage}
												</div>
											) : (
												<div
													className="pager-element pager-middle"
													onClick={() =>
														setShowModal(true)
													}
												>
													...
												</div>
											)}
											{pages[2] !== -1 ? (
												<div
													className={
														"pager-element" +
														(pages[2] == currentPage
															? " bold bold bg-blue text-white"
															: "")
													}
													onClick={() =>
														onPageClicked(pages[2])
													}
												>
													{pages[2]}
												</div>
											) : (
												<></>
											)}
											{pages[3] !== -1 ? (
												<div
													className={
														"pager-element pager-end" +
														(pages[3] == currentPage
															? " bold bold bg-blue text-white"
															: "")
													}
													onClick={() =>
														onPageClicked(pages[3])
													}
												>
													{pages[3]}
												</div>
											) : (
												<></>
											)}
											<div
												className="pager-element pager-arrow-right"
												onClick={() => increasePage()}
											>
												<FontAwesomeIcon
													icon={faCaretRight}
												/>
											</div>
										</div>
									</div>
								</td>
							</tr>
						) : (
							<></>
						)}
					</tfoot>
					<PageSelectModal
						setPage={setCurrentPage}
						showModal={showModal}
						onCloseModal={closeModal}
					/>
				</Table>
			) : (
				<h3>No invoices</h3>
			)}
		</>
	);
};

export default InvoiceTable;
