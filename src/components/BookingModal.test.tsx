import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingModal from "./BookingModal";
import { Booking } from "@/types/booking";

describe("BookingModal", () => {
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("não renderiza quando isOpen é false", () => {
    const { container } = render(
      <BookingModal isOpen={false} onClose={onCloseMock} onSave={onSaveMock} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renderiza título de cadastro quando isOpen = true e sem bookingToEdit", () => {
    render(
      <BookingModal isOpen={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    expect(screen.getByText("Cadastrar Reserva")).toBeInTheDocument();
  });

  it("renderiza título de edição quando bookingToEdit está presente", () => {
    const mockBooking: Booking = {
      id: "1",
      customerId: "123",
      customerName: "Fulano",
      checkIn: new Date("2025-03-01"),
      checkOut: new Date("2025-03-05"),
      price: 100,
      days: 4,
      status: "Reservado",
      userId: "user1",
      bookingByName: "Tester",
    };

    render(
      <BookingModal
        isOpen={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        bookingToEdit={mockBooking}
      />
    );

    expect(screen.getByText("Editar Reserva")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fulano")).toBeInTheDocument();
  });

  it("chama onClose ao clicar no botão de fechar", async () => {
    render(
      <BookingModal isOpen={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    const closeButton = screen.getByRole("button", { name: /fechar/i });
    await userEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
