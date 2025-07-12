import { normalizeDate } from "./Date"

describe("normalizeDate", () => {
    it("converte string de data para objeto Date com hora zero", () =>{
        const result = normalizeDate("2025-03-01")
        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toContain('2025-03-01T03:00:00.000Z');
    })
})