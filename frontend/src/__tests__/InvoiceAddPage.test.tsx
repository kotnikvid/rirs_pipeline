// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect} from 'vitest';
import "@testing-library/jest-dom"
import {BrowserRouter} from "react-router-dom";
import InvoiceFormPage from "../pages/InvoiceFormPage/InvoiceFormPage.tsx";
import {ClerkProvider} from "@clerk/clerk-react";
import dotenv from "dotenv";

dotenv.config();

describe("Add Invoice Page", () => {
    test("renders the overview InvoiceForm page, checking for add mode", async () => {
        render(
            <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/">
                <BrowserRouter>
                    <InvoiceFormPage isReadOnly={false}/>
                </BrowserRouter>
            </ClerkProvider>
        );

        const form = screen.getByText("Dodaj račun");
        expect(form).toBeInTheDocument();
    });
});

describe("Required field validation", () => {
    test("form does not submit when required field is empty", async () => {

        render(
            <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/">
                <BrowserRouter>
                    <InvoiceFormPage isReadOnly={false}/>
                </BrowserRouter>
            </ClerkProvider>
        );

        const inputElement = screen.getByPlaceholderText("Naziv");
        const submitButton = screen.getByRole("button", { name: /Dodaj/i });

        fireEvent.change(inputElement, { target: { value: "" } });

        fireEvent.click(submitButton);

        const errorMessage = screen.getByText(/Polje je obvezno!/i);
        expect(errorMessage).toBeInTheDocument();
    });
});

describe("Amount input value", () => {
    test("enter value for amount and check for validity", async () => {
        const expectedValue: number = 93;

        render(
            <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/">
                <BrowserRouter>
                    <InvoiceFormPage isReadOnly={false}/>
                </BrowserRouter>
            </ClerkProvider>
        );

        const inputElement = screen.getByPlaceholderText("Znesek") as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: expectedValue } });

        expect(+inputElement.value).toBe(expectedValue);
    });
});