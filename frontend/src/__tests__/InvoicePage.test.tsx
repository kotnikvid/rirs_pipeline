// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import InvoicesPage from "../pages/InvoicesPage/InvoicesPage.tsx";
import {ClerkProvider} from "@clerk/clerk-react";
import dotenv from "dotenv";
import {BrowserRouter} from "react-router-dom";
import { describe, expect } from 'vitest';
import "@testing-library/jest-dom"

dotenv.config();

describe("Invoice Page", () => {
    test("renders the invoice page", async () => {
        render(
            <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/">
                <BrowserRouter>
                    <InvoicesPage/>
                </BrowserRouter>
            </ClerkProvider>
        );

        const form = screen.getByText("Računi");
        expect(form).toBeInTheDocument();
    });
});

describe("Table Component in InvoicesPage", () => {
    test("renders the table component and tests if it renders", async () => {
        render(
            <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/">
                <BrowserRouter>
                    <InvoicesPage/>
                </BrowserRouter>
            </ClerkProvider>
        );

        waitFor(async () => {
            const form = await screen.findByText("No invoices");
            expect(form).toBeInTheDocument();
        })
    });
});

