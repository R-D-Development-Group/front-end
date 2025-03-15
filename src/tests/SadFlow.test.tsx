import {render, screen} from "@testing-library/react";
import App from "../App.tsx";
import {describe, it, expect, vi} from "vitest";
import "@testing-library/jest-dom/vitest";
import {BrowserRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Sad Path", () => {
    // Ensure token is in LocalStorage before login
    localStorage.setItem("access_token", "mocked_token");

    // Mock API responses
    vi.spyOn(global, "fetch").mockImplementation((url) => {
        if (typeof url === "string" && url.includes("/openid-connect/token")) {
            return Promise.resolve(
                new Response(JSON.stringify({ access_token: "mocked_token" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                })
            );
        }

        return Promise.reject(new Error("Unexpected API call: " + url));
    });

    it("click on the login button with unauthorized credentials", async () => {
        render(<BrowserRouter><App/></BrowserRouter>);
        const loginButton = screen.getByRole("button", {name: /Login/});
        await userEvent.click(loginButton);

        // Expect to remain on the same page
        expect(window.location.pathname).toBe("/");
        const invalidLogin = await screen.findByText("Login failed. Please try again.");
        expect(invalidLogin).toBeInTheDocument();
    });
});
