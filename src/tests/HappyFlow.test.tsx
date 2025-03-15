import {render, screen, waitFor} from "@testing-library/react";
import App from "../App.tsx";
import {describe, it, expect, vi} from "vitest";
import "@testing-library/jest-dom/vitest";
import {BrowserRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Happy Flow", () => {
    // Ensure token is in LocalStorage before login
    localStorage.setItem("access_token", "mocked_token");

    // Mock API responses
    vi.spyOn(global, "fetch").mockImplementation((url) => {
        if (typeof url === "string" && url.includes("/openid-connect/token")) {
            return Promise.resolve(
                new Response(JSON.stringify({ access_token: "mocked_token" }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                })
            );
        }

        if (typeof url === "string" && url.endsWith("/api/task-list/1")) {
            return Promise.resolve(
                new Response(
                    JSON.stringify({ id: 1, name: "Sample Form 1", tasks: [{ title: "Task A", description: "Do something" }] }),
                    { status: 200, headers: { "Content-Type": "application/json" } }
                )
            );
        }

        if (typeof url === "string" && url.endsWith("/api/task-list/2")) {
            return Promise.resolve(
                new Response(
                    JSON.stringify({ id: 2, name: "Sample Form 2", tasks: [{ title: "Task B", description: "Do something else" }] }),
                    { status: 200, headers: { "Content-Type": "application/json" } }
                )
            );
        }

        return Promise.reject(new Error("Unexpected API call: " + url));
    });

    it("clicks on the login button and navigates to the dashboard", async () => {
        await navigateToDashboard()
    });

    it("clicks on the first sample form and navigate to the details", async () => {
        await navigateToDashboard();

        // Wait for the sample form to be rendered (using the name of the form)
        const sampleForm = await screen.findByText("Sample Form 1");
        expect(sampleForm).toBeInTheDocument();

        // Click on the sample form
        await userEvent.click(sampleForm);

        // Ensure navigation to the form details page
        await waitFor(() => expect(window.location.pathname).toBe("/form/1"), { timeout: 3000 });

        // Check if the details are displayed
        const taskTitle = await screen.findByDisplayValue("Task A");
        const taskDescriptionInput = await screen.findByDisplayValue("Do something");

        expect(taskTitle).toBeInTheDocument();
        expect(taskDescriptionInput).toBeInTheDocument();
    });

    it("clicks on the second sample form and check the details", async () => {
        await navigateToDashboard();

        // Wait for the sample form to be rendered (using the name of the form)
        const sampleForm = await screen.findByText("Sample Form 2");
        expect(sampleForm).toBeInTheDocument();

        // Click on the sample form
        await userEvent.click(sampleForm);

        // Ensure navigation to the form details page
        await waitFor(() => expect(window.location.pathname).toBe("/form/2"), { timeout: 3000 });

        // Check if the details are displayed
        const taskTitle = await screen.findByDisplayValue("Task B");
        const taskDescriptionInput = await screen.findByDisplayValue("Do something else");

        expect(taskTitle).toBeInTheDocument();
        expect(taskDescriptionInput).toBeInTheDocument();
    });

    it("creates a new form and submits", async () => {
        await navigateToDashboard();

        // Click on the "Create Form" button
        const createFormButton = await screen.findByText("Create Form");
        expect(createFormButton).toBeInTheDocument();
        await userEvent.click(createFormButton);

        // Ensure we are redirected to the form creation page
        await waitFor(() => expect(window.location.pathname).toBe("/form/create"), { timeout: 3000 });

        // Fill out the form
        const formNameInput = await screen.findByPlaceholderText("Form Name");
        await userEvent.type(formNameInput, "New Form");

        const addTaskButton = screen.getByText("Add Task");
        await userEvent.click(addTaskButton);

        const taskTitleInput = await screen.findByPlaceholderText("Task Title");
        const taskDescriptionInput = await screen.findByPlaceholderText("Task Description");
        await userEvent.type(taskTitleInput, "New Task");
        await userEvent.type(taskDescriptionInput, "Task description");

        // Submit the form
        const submitButton = screen.getByText("Submit Form");
        await userEvent.click(submitButton);
    });

    it("creates a new form and cancels", async () => {
        await navigateToDashboard();

        // Click on the "Create Form" button
        const createFormButton = await screen.findByText("Create Form");
        expect(createFormButton).toBeInTheDocument();
        await userEvent.click(createFormButton);

        // Ensure we are redirected to the form creation page
        await waitFor(() => expect(window.location.pathname).toBe("/form/create"), { timeout: 3000 });

        // Fill out the form
        const formNameInput = await screen.findByPlaceholderText("Form Name");
        await userEvent.type(formNameInput, "New Form");

        const addTaskButton = screen.getByText("Add Task");
        await userEvent.click(addTaskButton);

        const taskTitleInput = await screen.findByPlaceholderText("Task Title");
        await userEvent.type(taskTitleInput, "Canceling this form");

        // Submit the form
        const cancelButton = screen.getByText("Return to Dashboard");
        await userEvent.click(cancelButton);

        // Wait for navigation to dashboard
        await waitFor(() => expect(window.location.pathname).toBe("/dashboard"), {timeout: 3000});
    });
});

async function navigateToDashboard() {
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
}