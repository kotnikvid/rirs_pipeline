// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import dotenv from "dotenv";
import DashboardPage from "../pages/DashboardPage/DashboardPage.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

vi.mock("axios");

dotenv.config();

describe("Dashboard Page", () => {
	test("renders the page, checking if it loads", async () => {
		render(
			<ClerkProvider
				publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""}
				afterSignOutUrl="/"
			>
				<DashboardPage />
			</ClerkProvider>
		);

		const dashboard = screen.getByText("Dashboard", { exact: true });
		expect(dashboard).toBeInTheDocument();
	});
});

describe("Empty data validation", () => {
	test("renders the page, checking if it tries to load graphs with empty data", async () => {
		render(
			<ClerkProvider
				publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""}
				afterSignOutUrl="/"
			>
				<DashboardPage />
			</ClerkProvider>
		);

		const dashboard = screen.getByText("No data yet", { exact: true });
		expect(dashboard).toBeInTheDocument();
	});
});
