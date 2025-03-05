import {render, screen} from "@testing-library/react";
import App from "../App.tsx"
import {describe, it, expect} from "vitest";
import "@testing-library/jest-dom/vitest";
import {BrowserRouter} from "react-router-dom";
// import userEvent from "@testing-library/user-event";

describe("Button", () => {
    it ("renders the login button", () => {
        render(<BrowserRouter><App/></BrowserRouter>);
        const button = screen.getByRole("button", {name: /Login/});
        expect(button).toBeInTheDocument();
    });

    //TODO: discuss test-environment or mock-data

    // it ("click on the next-page button goes to next page", async () => {
    //     render(<App/>);
    //     const button = screen.getByRole("button", {name: /Next Page/});
    //
    //     await userEvent.click(button);
    //
    //     expect(window.location.pathname).toBe("/page2");
    // });
})