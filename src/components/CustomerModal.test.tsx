import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerModal from "./CustomerModal";

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

describe("CustomerModal", () => {
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("não renderiza nada quando isOpen é false", () => {
    const { container } = render(
      <CustomerModal isOpen={false} onClose={onCloseMock} onSave={onSaveMock} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renderiza com título de novo cliente quando isOpen = true", () => {
    render(
      <CustomerModal isOpen={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    expect(screen.getByText(/Novo Cliente/i)).toBeInTheDocument();
  });

  it("preenche campos ao editar um cliente", () => {
    const customer = {
      id: "1",
      name: "Fulano",
      document: "123.456.789-00",
      phone: "(11) 91234-5678",
    };

    render(
      <CustomerModal
        isOpen={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        customerToEdit={customer}
      />
    );

    expect(screen.getByDisplayValue("Fulano")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123.456.789-00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("(11) 91234-5678")).toBeInTheDocument();
    expect(screen.getByText(/Editar Cliente/i)).toBeInTheDocument();
  });

  it("chama onClose ao clicar em Fechar", async () => {
    render(
      <CustomerModal isOpen={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    await userEvent.click(screen.getByRole("button", { name: /Fechar/i }));

    expect(onCloseMock).toHaveBeenCalled();
  });
});
