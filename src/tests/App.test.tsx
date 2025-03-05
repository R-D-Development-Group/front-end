import { render, screen } from "@testing-library/react";
import App from "../App.tsx";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Simple Button test", () => {
    it("renders the login button", () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        const button = screen.getByRole("button", { name: /Login/i });
        expect(button).toBeInTheDocument();
    });
});

// function mockValidLogin(){
//     return {
//         ok: true,
//         json: async () => ({ access_token: "mocked_token" }),
//     };
// }
//
// function mockSampleForm(){
//     return {
//         ok: true,
//         json: async () => ({
//             id: 1,
//             name: "Sample Form",
//             tasks: [{ title: "Task 1", description: "Description 1" }],
//         })
//     };
// }

describe("Happy Path", () => {
    beforeEach(() => {
        vi.restoreAllMocks(); // Reset mocks before each test
    });

    it("click on the login button", async () => {
        //TODO: Use mock-data for valid credentials and a sample form
        // const mockLogin = vi.fn().mockImplementation(mockValidLogin);
        // const mockForm = vi.fn().mockImplementation(mockSampleForm);

        render(<BrowserRouter><App/></BrowserRouter>);
        const loginButton = screen.getByRole("button", {name: /Login/});
        await userEvent.click(loginButton);

        //TODO: Login with mock-data that returns a valid login

        // Expect to be on the dashboard page
        // expect(window.location.pathname).toBe("/dashboard");
    });

    it ("select a form", async () => {
        // TODO: select the sample form

        // TODO: expect to be on the sample form's page
    });
});

describe("Sad Path", () => {
    beforeEach(() => {
        vi.restoreAllMocks(); // Reset mocks before each test
    });

    it("click on the login button", async () => {
        //TODO: Use mock-data for valid credentials and a sample form
        render(<BrowserRouter><App/></BrowserRouter>);
        const loginButton = screen.getByRole("button", {name: /Login/});
        await userEvent.click(loginButton);

        //TODO: Login with mock-data that returns an invalid login

        // Expect to remain on the same page
        expect(window.location.pathname).toBe("/");
    });
});
