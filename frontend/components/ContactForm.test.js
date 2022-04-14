import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  expect(screen.getByText(/contact form/i)).toBeInTheDocument();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/first name/i);
  userEvent.type(firstName, "123");
  expect(
    screen.getByText(/Error: firstName must have at least 5 characters/i)
  ).toBeInTheDocument();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitButton);
  await waitFor(() => {
    expect(screen.getAllByText(/Error/i).length).toBe(3);
  });
});
test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/first name/i);
  userEvent.type(firstName, "James");
  const lastName = screen.getByLabelText(/last name/i);
  userEvent.type(lastName, "Fincher");
  const submitButton = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitButton);
  await waitFor(() => {
    expect(
      screen.getByText(/Error: email must be a valid email address/i)
    ).toBeInTheDocument();
  });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const email = screen.getByLabelText(/email/i);
  userEvent.type(email, "jamesATgmailDOTcom");
  const submitButton = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitButton);
  await waitFor(() => {
    expect(
      screen.getByText(/Error: email must be a valid email address/i)
    ).toBeInTheDocument();
  });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {});

test("renders all fields text when all fields are submitted.", async () => {});
