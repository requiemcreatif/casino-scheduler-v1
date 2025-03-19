import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PresenterForm } from "@/components/presenters/PresenterForm";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

// Mock the useAuth hook
jest.mock("@/providers/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("PresenterForm Component", () => {
  const mockOnSubmit = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Default mock for useAuth
    (useAuth as jest.Mock).mockReturnValue({
      isAllowed: () => true,
    });

    // Mock useRouter implementation
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders correctly with initial data", () => {
    const initialData = {
      name: "John Smith",
      email: "john@example.com",
      phone: "123-456-7890",
      shift: "morning" as const,
      active: true,
    };

    render(
      <PresenterForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Check if form fields have correct initial values
    expect(screen.getByLabelText(/name/i)).toHaveValue("John Smith");
    expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com");
    expect(screen.getByLabelText(/phone/i)).toHaveValue("123-456-7890");

    // Check if the status text is present, indicating active status
    expect(screen.getByText(/active/i)).toBeInTheDocument();

    // Check if morning shift is selected (it has a CheckCircleIcon)
    const morningShiftElement = screen.getByText(/morning/i);
    expect(morningShiftElement.parentElement).toHaveClass("bg-blue-50");
  });

  it("shows validation errors when form is submitted with empty fields", async () => {
    render(
      <PresenterForm
        initialData={{}}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Submit the form with empty fields
    const submitButton = screen.getByRole("button", {
      name: /create presenter/i,
    });
    fireEvent.click(submitButton);

    // Check for validation error messages
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone is required/i)).toBeInTheDocument();

    // onSubmit should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    render(
      <PresenterForm
        initialData={{}}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Presenter" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: "9876543210" },
    });

    // Click on the afternoon shift option
    const afternoonOption = screen.getByText(/afternoon/i);
    fireEvent.click(afternoonOption);

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /create presenter/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Check if onSubmit was called with correct data
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "New Presenter",
        email: "new@example.com",
        phone: "9876543210",
        shift: "afternoon",
        active: true,
      });
    });
  });

  it("shows permission warning when user does not have edit permission", () => {
    // Mock useAuth to return false for isAllowed
    (useAuth as jest.Mock).mockReturnValue({
      isAllowed: () => false,
    });

    render(
      <PresenterForm
        initialData={{}}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Check if permission warning is shown
    expect(
      screen.getByText(/you don't have permission to edit presenters/i)
    ).toBeInTheDocument();
  });
});
