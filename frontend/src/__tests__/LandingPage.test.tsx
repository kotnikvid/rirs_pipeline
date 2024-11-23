// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import {render, screen } from "@testing-library/react";
import LandingPage from "../pages/LandingPage/LandingPage.tsx";
import { describe, expect } from 'vitest';
import "@testing-library/jest-dom"

describe("Landing Page", () => {
    test("renders the landing page", async () => {
        render(
            <LandingPage />
        );

        const form = screen.getByText("Invoice Manager");
        expect(form).toBeInTheDocument();
    });
});