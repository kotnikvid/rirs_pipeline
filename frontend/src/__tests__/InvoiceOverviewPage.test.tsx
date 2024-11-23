// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import {render, screen} from "@testing-library/react";
import {describe, expect} from 'vitest';
import "@testing-library/jest-dom"
import {MemoryRouter, Route, Routes} from "react-router-dom";
import InvoiceFormPage from "../pages/InvoiceFormPage/InvoiceFormPage.tsx";
import {ClerkProvider} from "@clerk/clerk-react";
import dotenv from "dotenv";

dotenv.config();

describe("Invoice Overview Page", () => {
    test("renders the overview InvoiceForm page, checking for add mode", async () => {
        render(
            <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/">
                <MemoryRouter initialEntries={["/invoice/1234567"]}>
                    <Routes>
                        <Route path="/invoice/:id" element={<InvoiceFormPage isReadOnly={true}/>}/>
                    </Routes>
                </MemoryRouter>
            </ClerkProvider>
        );

        const form = screen.getByText("Pregled računa", { exact: false });
        expect(form).toBeInTheDocument();
    });
});

describe("All inputs render", () => {
    test("renders the overview InvoiceForm page, checking for all inputs being rendered", async () => {
        render(
            <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/">
                <MemoryRouter initialEntries={["/invoice/1234567"]}>
                    <Routes>
                        <Route path="/invoice/:id" element={<InvoiceFormPage isReadOnly={true}/>}/>
                    </Routes>
                </MemoryRouter>
            </ClerkProvider>
        );

        const nameField = screen.getByPlaceholderText("Naziv");
        const amountField = screen.getByPlaceholderText("Znesek");
        const dueDateField = screen.getByPlaceholderText("Rok");
        const payerField = screen.getByPlaceholderText("Plačnik");

        expect(nameField).toBeInTheDocument();
        expect(amountField).toBeInTheDocument();
        expect(dueDateField).toBeInTheDocument();
        expect(payerField).toBeInTheDocument();
    });
});

describe("All inputs are read-only", () => {
    test("renders the overview InvoiceForm page, checking if all inputs are read only", async () => {
        render(
            <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/">
                <MemoryRouter initialEntries={["/invoice/1234567"]}>
                    <Routes>
                        <Route path="/invoice/:id" element={<InvoiceFormPage isReadOnly={true}/>}/>
                    </Routes>
                </MemoryRouter>
            </ClerkProvider>
        );

        const nameField = screen.getByPlaceholderText("Naziv");
        const amountField = screen.getByPlaceholderText("Znesek");
        const dueDateField = screen.getByPlaceholderText("Rok");
        const payerField = screen.getByPlaceholderText("Plačnik");

        expect(nameField).toHaveAttribute("readonly");
        expect(amountField).toHaveAttribute("readonly");
        expect(dueDateField).toHaveAttribute("readonly");
        expect(payerField).toHaveAttribute("readonly");
    });
});