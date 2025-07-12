
import { isValidCPF,isPhoneValid, isCheckOutAfterCheckIn } from "./Validators";

describe("isPhoneValid",() => {
    it("retorna true para numero de telefone válido", () => {
        expect(isPhoneValid("(11)97938-5145")).toBe(true);
    })
    it("retorna false para numero de telefone inválido", () => {
        expect(isPhoneValid("979385145")).toBe(false)
    })
    it("retorna false para numero de telefone vazio", () => {
        expect(isPhoneValid("")).toBe(false)
    })

})


describe("isValidCPF", () => {
    it("retorna true para CPF válido", () => {
        expect(isValidCPF("960.627.200-10")).toBe(true);
    })

    it("retorna false para CPF inválido", () => {
        expect(isValidCPF("000.000.000-00")).toBe(false);
    })
    it("retorna false para CPF vazio", () => {
        expect(isValidCPF("")).toBe(false);
    })
})

describe("isCheckOutAfterCheckIn", () => {
    it("retorna true para data de checkOut maior que data de checkIn", () => {
        expect(isCheckOutAfterCheckIn("2025-06-01", "2025-06-02")).toBe(true);
    }) 
    it("retorna false quando checkIn e checkOut são iguais", () => {
        expect(isCheckOutAfterCheckIn("2025-06-01", "2025-06-01")).toBe(false);
    });
    it("retorna false quando checkOut é antes de checkIn", () => {
        expect(isCheckOutAfterCheckIn("2025-06-02", "2025-06-01")).toBe(false);
    });
    it("retorna false se checkIn está vazio", () => {
        expect(isCheckOutAfterCheckIn("", "2025-06-02")).toBe(false);
    });
    it("retorna false se checkOut está vazio", () => {
        expect(isCheckOutAfterCheckIn("2025-06-01", "")).toBe(false);
    });
    it("retorna false se ambos estão vazios", () => {
        expect(isCheckOutAfterCheckIn("", "")).toBe(false);
    });
})