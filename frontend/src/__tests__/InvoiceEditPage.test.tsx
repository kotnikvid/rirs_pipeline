// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
import {render, screen} from "@testing-library/react";
import {describe, expect} from 'vitest';
import "@testing-library/jest-dom"
import {MemoryRouter, Route, Routes} from "react-router-dom";
import InvoiceFormPage from "../pages/InvoiceFormPage/InvoiceFormPage.tsx";
import {ClerkProvider} from "@clerk/clerk-react";
import dotenv from "dotenv";

dotenv.config();

describe("Edit Invoice Page", () => {
    test("renders the overview InvoiceForm page, checking for edit mode", async () => {
        render(
            <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/">
                <MemoryRouter initialEntries={["/invoice/1234567"]}>
                    <Routes>
                        <Route path="/invoice/:id" element={<InvoiceFormPage isReadOnly={false}/>} />
                    </Routes>
                </MemoryRouter>
            </ClerkProvider>
        );

        const form = screen.getByText("Uredi račun", { exact: false });
        expect(form).toBeInTheDocument();
    });
});