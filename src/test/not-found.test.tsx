import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotFound from "@/app/not-found";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Mock framer-motion to avoid issues with animations in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("NotFound Page", () => {
  it("renders the 404 page correctly", () => {
    render(
      <ThemeProvider>
        <NotFound />
      </ThemeProvider>
    );

    // Check if important elements are displayed
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText(/Looks like the odds weren't in your favor/i)
    ).toBeInTheDocument();

    // Check if navigation buttons are present
    expect(screen.getByText("Back to Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Go Home")).toBeInTheDocument();
  });
});
