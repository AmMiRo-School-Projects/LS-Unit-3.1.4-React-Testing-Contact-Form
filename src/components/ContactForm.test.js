import React from "react";
import {
  render,
  fireEvent,
  waitForElement,
  wait
} from "@testing-library/react";
import "mutationobserver-shim";
import ContactForm from "./ContactForm";

test("form elements are rendered", () => {
  const { getByLabelText } = render(<ContactForm />);
  getByLabelText(/first name/i);
  getByLabelText(/last name/i);
  getByLabelText(/email/i);
  getByLabelText(/message/i);
});

test("form submit submits appropriate values", async () => {
  const { getByLabelText, getByTestId } = render(<ContactForm />);
  const firstNameInput = getByLabelText(/first name/i);
  const lastNameInput = getByLabelText(/last name/i);
  const emailInput = getByLabelText(/email/i);
  const messageInput = getByLabelText(/message/i);

  fireEvent.change(firstNameInput, { target: { value: "Test First Name" } });
  fireEvent.change(lastNameInput, { target: { value: "Test Last Name" } });
  fireEvent.change(emailInput, { target: { value: "Test Email" } });
  fireEvent.change(messageInput, { target: { value: "Test Message" } });

  expect(firstNameInput.value).toBe("Test First Name");
  expect(lastNameInput.value).toBe("Test Last Name");
  expect(emailInput.value).toBe("Test Email");
  expect(messageInput.value).toBe("Test Message");

  fireEvent.click(getByTestId(/submit/i));

  let formText;
  await wait(() => {
    formText = getByTestId(/test first name/i);
  });

  expect(formText).toBeInTheDocument();
});

test("error message displays if no value is added", async () => {
  const { getAllByText, getByTestId } = render(<ContactForm />);

  fireEvent.click(getByTestId(/submit/i));

  let fieldErrors;

  await wait(() => {
    fieldErrors = getAllByText(/looks like there was an error/i);
  });

  expect(fieldErrors.length === 3);
});
