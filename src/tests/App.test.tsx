import {render, screen, waitFor} from "@testing-library/react";
import App from "../App.tsx";
import {describe, it, expect, vi} from "vitest";
import "@testing-library/jest-dom/vitest";
import {BrowserRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Happy Path", () => {
    it("clicks on the login button and navigates to the dashboard", async () => {
        // Ensure token is in LocalStorage before login
        localStorage.setItem("access_token", "mocked_token");

        // Mock API responses
        vi.spyOn(global, "fetch").mockImplementation((url) => {
            if (typeof url === "string" && url.includes("/openid-connect/token")) {
                return new Promise((resolve) =>
                    setTimeout(() => {
                        resolve(
                            new Response(JSON.stringify({access_token: "mocked_token"}), {
                                status: 200,
                                headers: {"Content-Type": "application/json"},
                            })
                        );
                    }, 100)
                );
            }

            if (typeof url === "string" && url.includes("/api/task-list")) {
                return Promise.resolve(
                    new Response(
                        JSON.stringify({
                            id: 1,
                            name: "Sample Form",
                            tasks: [{title: "Task 1", description: "Description 1"}],
                        }),
                        {
                            status: 200,
                            headers: {"Content-Type": "application/json"},
                        }
                    )
                );
            }

            return Promise.reject(new Error("Unexpected API call: " + url));
        });

        render(
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        );

        // Wait for login button to be enabled before clicking
        const loginButton = await screen.findByRole("button", {name: /Login/i});
        await waitFor(() => expect(loginButton).not.toBeDisabled());
        await userEvent.click(loginButton);

        // Wait for navigation to dashboard
        await waitFor(() => expect(window.location.pathname).toBe("/dashboard"), {timeout: 3000});
    });
});

describe("Sad Path", () => {
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
