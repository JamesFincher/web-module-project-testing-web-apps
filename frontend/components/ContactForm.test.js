import React from "react";
import {
  findAllByText,
  queryByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";
import { findCacheDir } from "webpack-dev-server";

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

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitButton);
  await waitFor(() => {
    expect(
      screen.getByText(/Error: lastName is a required field/i)
    ).toBeInTheDocument();
  });
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  //arrange
  render(<ContactForm />);
  const firstName = "james";
  const lastName = "fincher";
  const email = "james@fincher.dev";
  const submitButton = screen.getByRole("button", { name: /submit/i });

  //act
  userEvent.type(screen.getByLabelText(/first name/i), firstName);
  userEvent.type(screen.getByLabelText(/last name/i), lastName);
  userEvent.type(screen.getByLabelText(/email/i), email);
  userEvent.click(submitButton);

  //assert
  const message = screen.queryByText("Message:");
  expect(message).toBeNull();
});

test("renders all fields text when all fields are submitted.", async () => {
  //arrange
  render(<ContactForm />);
  const firstName = "james";
  const lastName = "fincher";
  const email = "james@fincher.dev";
  const message = "hello";
  const submitButton = screen.getByRole("button", { name: /submit/i });

  //act
  userEvent.type(screen.getByLabelText(/first name/i), firstName);
  userEvent.type(screen.getByLabelText(/last name/i), lastName);
  userEvent.type(screen.getByLabelText(/email/i), email);
  userEvent.type(screen.getByLabelText(/message/i), message);
  userEvent.click(submitButton);

  //assert

  const first = screen.getByText(firstName);
  const last = screen.getByText(lastName);
  const emailText = screen.getByText(email);
  const messageText = screen.getByText(message);
  expect(first).toBeInTheDocument();
  expect(last).toBeInTheDocument();
  expect(emailText).toBeInTheDocument();
  expect(messageText).toBeInTheDocument();
});
