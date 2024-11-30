import axios from "axios";
import "./DashboardPage.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { RequestUtil } from "../../utils/RequestUtil";
import { useAuth } from "@clerk/clerk-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const paidData = {
	labels: ["Paid", "Unpaid"],
	datasets: [
		{
			label: "no. of invoices",
			data: [0, 0],
			backgroundColor: ["#E52D1A", "#0276FA"],
			borderWidth: 1,
		},
	],
};

const sentData = {
	labels: ["Sent", "Unsent"],
	datasets: [
		{
			label: "no. of invoices",
			data: [0, 0],
			backgroundColor: ["#E52D1A", "#0276FA"],
			borderWidth: 1,
		},
	],
};

const DashboardPage: React.FC = () => {
	const [invoiceData, setInvoiceData] = useState(null);
	const [totalInvoices, setTotalInvoices] = useState<number>(0);
	const [totalPaid, setTotalPaid] = useState<number>(0);
	const auth = useAuth();

	const retrieveDashboardData = async () => {
        console.log("Function called");
		try {

			const res = await axios.get(
				"/api/db/analytics",
				RequestUtil.getDefaultRequestConfig(await auth.getToken())
			);
            console.log('Data fetched:', res.data); // Check if the mock data is logged

			console.log(res);

			setInvoiceData(res.data);
			setTotalInvoices(res.data.totalInvoices);
			setTotalPaid(res.data.amountPaid);
			paidData.datasets[0].data = [
				res.data.invoicesPaid,
				res.data.totalInvoices - res.data.invoicesPaid,
			];

			sentData.datasets[0].data = [
				res.data.invoicesSent,
				res.data.totalInvoices - res.data.invoicesSent,
			];
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		retrieveDashboardData();
	}, []);

	return (
		<div id="dashboard-page-container">
			<h2>Dashboard</h2>
			{invoiceData ? (
				<div id="dashboard-grid">
					<div className="graph-container">
						<h4>Invoices paid</h4>
						<Pie data={paidData} />
					</div>
					<div className="graph-container">
						<h4>Invoices sent</h4>
						<Pie data={sentData} />
					</div>
					<div className="data-box">
						<p>Total invoices:</p>
						<p>{totalInvoices}</p>
					</div>
					<div className="data-box">
						<p>Total paid:</p>
						<p>{totalPaid} €</p>
					</div>
				</div>
			) : (
				<h4>No data yet</h4>
			)}
		</div>
	);
};

export default DashboardPage;
