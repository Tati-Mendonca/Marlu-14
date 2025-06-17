import { useState, useEffect } from "react";
import { getTotalBookings, getTotalRevenue, getTotalDaysRentedInYear, createBooking } from "@/services/booking";
import { getTotalCustomers, createCustomer} from "@/services/customer";
import { BookingInput } from "@/types/booking";
import { CustomerInput } from "@/types/customer";

export function useDashboardData(currentYear: number) {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsCount, customersCount, revenue] = await Promise.all([
          getTotalBookings(),
          getTotalCustomers(),
          getTotalRevenue(currentYear),
        ]);
        const days = await getTotalDaysRentedInYear(currentYear);

        setTotalBookings(bookingsCount);
        setTotalCustomers(customersCount);
        setTotalRevenue(revenue);
        setTotalDays(days);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [currentYear]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleCreateBooking = async (booking: BookingInput) => {
    try {
      await createBooking(booking);
      setMessage("Reserva criada com sucesso!");

      const [bookingsCount, revenue, days] = await Promise.all([
        getTotalBookings(),
        getTotalRevenue(currentYear),
        getTotalDaysRentedInYear(currentYear),
      ]);
      setTotalBookings(bookingsCount);
      setTotalRevenue(revenue);
      setTotalDays(days);
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);
      setMessage("Erro ao salvar reserva.");
    }
  };

  const handleCreateCustomer = async (customer: CustomerInput) => {
    try {
      await createCustomer(customer);
      setMessage("Cliente cadastrado com sucesso!");
      const count = await getTotalCustomers();
      setTotalCustomers(count);
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setMessage("Erro ao cadastrar cliente.");
    }
  };

  return {
    totalBookings,
    totalCustomers,
    totalRevenue,
    totalDays,
    message,
    setMessage,
    handleCreateBooking,
    handleCreateCustomer,
  };
}
