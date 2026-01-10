import { describe, expect, it } from "vitest"
import { toWords } from "./vi-VN"

describe("Vietnamese Number to Words", () => {
  describe("Basic numbers (0-9)", () => {
    it.each([
      [0, "không"],
      [1, "một"],
      [2, "hai"],
      [3, "ba"],
      [4, "bốn"],
      [5, "năm"],
      [6, "sáu"],
      [7, "bảy"],
      [8, "tám"],
      [9, "chín"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Teens (10-19)", () => {
    it.each([
      [10, "mười"],
      [11, "mười một"],
      [12, "mười hai"],
      [13, "mười ba"],
      [14, "mười bốn"],
      [15, "mười lăm"], // Special: lăm instead of năm
      [16, "mười sáu"],
      [17, "mười bảy"],
      [18, "mười tám"],
      [19, "mười chín"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Tens (20-99) - mốt and lăm rules", () => {
    it.each([
      [20, "hai mươi"],
      [21, "hai mươi mốt"], // mốt rule: 1 after tens
      [25, "hai mươi lăm"], // lăm rule: 5 after tens
      [30, "ba mươi"],
      [31, "ba mươi mốt"],
      [35, "ba mươi lăm"],
      [42, "bốn mươi hai"],
      [50, "năm mươi"],
      [51, "năm mươi mốt"],
      [55, "năm mươi lăm"],
      [99, "chín mươi chín"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Hundreds (100-999) - lẻ rule", () => {
    it.each([
      [100, "một trăm"],
      [101, "một trăm lẻ một"], // lẻ rule: single digit after hundreds
      [105, "một trăm lẻ năm"], // năm not lăm after lẻ
      [110, "một trăm mười"],
      [111, "một trăm mười một"],
      [115, "một trăm mười lăm"], // lăm in teens
      [120, "một trăm hai mươi"],
      [121, "một trăm hai mươi mốt"], // mốt rule
      [125, "một trăm hai mươi lăm"], // lăm rule
      [200, "hai trăm"],
      [202, "hai trăm lẻ hai"],
      [250, "hai trăm năm mươi"],
      [500, "năm trăm"],
      [555, "năm trăm năm mươi lăm"],
      [999, "chín trăm chín mươi chín"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Thousands (1,000-999,999) - không trăm rule", () => {
    it.each([
      [1000, "một nghìn"],
      [1001, "một nghìn không trăm lẻ một"], // không trăm lẻ for single digit
      [1005, "một nghìn không trăm lẻ năm"], // năm not lăm
      [1010, "một nghìn không trăm mười"], // không trăm for tens
      [1050, "một nghìn không trăm năm mươi"], // không trăm for tens (the bug fix!)
      [1100, "một nghìn một trăm"],
      [1101, "một nghìn một trăm lẻ một"],
      [1111, "một nghìn một trăm mười một"],
      [1234, "một nghìn hai trăm ba mươi bốn"],
      [2000, "hai nghìn"],
      [2001, "hai nghìn không trăm lẻ một"],
      [5000, "năm nghìn"],
      [10000, "mười nghìn"],
      [10001, "mười nghìn không trăm lẻ một"],
      [10050, "mười nghìn không trăm năm mươi"],
      [10100, "mười nghìn một trăm"],
      [12345, "mười hai nghìn ba trăm bốn mươi lăm"],
      [100000, "một trăm nghìn"],
      [100001, "một trăm nghìn không trăm lẻ một"],
      [123456, "một trăm hai mươi ba nghìn bốn trăm năm mươi sáu"],
      [999999, "chín trăm chín mươi chín nghìn chín trăm chín mươi chín"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Millions", () => {
    it.each([
      [1000000, "một triệu"],
      [1000001, "một triệu không trăm lẻ một"],
      [1000050, "một triệu không trăm năm mươi"],
      [1001000, "một triệu không trăm lẻ một nghìn"], // coefficient is 1 < 100, needs "không trăm lẻ"
      [1234567, "một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy"],
      [10000000, "mười triệu"],
      [100000000, "một trăm triệu"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Billions (tỷ)", () => {
    it.each([
      [1000000000, "một tỷ"],
      [1000000001, "một tỷ không trăm lẻ một"],
      [1234567890, "một tỷ hai trăm ba mươi bốn triệu năm trăm sáu mươi bảy nghìn tám trăm chín mươi"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Negative numbers", () => {
    it.each([
      [-1, "âm một"],
      [-5, "âm năm"],
      [-10, "âm mười"],
      [-42, "âm bốn mươi hai"],
      [-100, "âm một trăm"],
      [-101, "âm một trăm lẻ một"],
      [-1000, "âm một nghìn"],
      [-1234567, "âm một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Decimal numbers", () => {
    it.each([
      [0.5, "không phẩy năm"],
      [1.5, "một phẩy năm"],
      [3.14, "ba phẩy mười bốn"],
      [3.141, "ba phẩy một trăm bốn mươi mốt"],
      [10.01, "mười phẩy không một"],
      [100.001, "một trăm phẩy không không một"],
      [1.001, "một phẩy không không một"],
    ])("converts %s to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("String inputs", () => {
    it.each([
      ["0", "không"],
      ["42", "bốn mươi hai"],
      ["1000", "một nghìn"],
      ["-123", "âm một trăm hai mươi ba"],
      ["3.14", "ba phẩy mười bốn"],
    ])("converts string '%s' to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("BigInt inputs", () => {
    it("converts BigInt values", () => {
      expect(toWords(42n)).toBe("bốn mươi hai")
      expect(toWords(1000000n)).toBe("một triệu")
      expect(toWords(-1000n)).toBe("âm một nghìn")
    })

    it("handles very large BigInt values with Vietnamese scales", () => {
      // 10^12 = nghìn tỷ (trillion)
      expect(toWords(1000000000000n)).toBe("một nghìn tỷ")
      // 10^15 = triệu tỷ (quadrillion)
      expect(toWords(1000000000000000n)).toBe("một triệu tỷ")
      // 10^18 = tỷ tỷ (quintillion)
      expect(toWords(1000000000000000000n)).toBe("một tỷ tỷ")
    })
  })

  describe("Edge cases", () => {
    it("handles zero", () => {
      expect(toWords(0)).toBe("không")
      expect(toWords("0")).toBe("không")
      expect(toWords(0n)).toBe("không")
    })

    it("handles negative zero", () => {
      expect(toWords(-0)).toBe("không")
    })

    it("throws error for invalid inputs", () => {
      expect(() => toWords("")).toThrow("Value cannot be empty")
      expect(() => toWords("   ")).toThrow("Value cannot be empty")
      expect(() => toWords("abc")).toThrow("Invalid number format")
      expect(() => toWords(Infinity)).toThrow("Value must be a finite number")
      expect(() => toWords(-Infinity)).toThrow("Value must be a finite number")
      expect(() => toWords(NaN)).toThrow("Value must be a finite number")
    })
  })

  describe("Real-world Vietnamese money amounts", () => {
    it.each([
      [50000, "năm mươi nghìn"],
      [100000, "một trăm nghìn"],
      [500000, "năm trăm nghìn"],
      [1000000, "một triệu"],
      [10000000, "mười triệu"],
      [150000000, "một trăm năm mươi triệu"],
    ])("converts VND amount %d correctly", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Specific bug fixes", () => {
    it("correctly uses 'không trăm' instead of 'lẻ' for two-digit remainders", () => {
      // This was the main bug: 1050 was incorrectly "một nghìn lẻ năm mươi"
      expect(toWords(1050)).toBe("một nghìn không trăm năm mươi")
      expect(toWords(1010)).toBe("một nghìn không trăm mười")
      expect(toWords(1025)).toBe("một nghìn không trăm hai mươi lăm")
      expect(toWords(1099)).toBe("một nghìn không trăm chín mươi chín")
    })

    it("correctly uses 'lẻ' only for single-digit remainders", () => {
      expect(toWords(1001)).toBe("một nghìn không trăm lẻ một")
      expect(toWords(1005)).toBe("một nghìn không trăm lẻ năm")
      expect(toWords(1009)).toBe("một nghìn không trăm lẻ chín")
    })

    it("uses 'năm' after 'lẻ' instead of 'lăm'", () => {
      expect(toWords(105)).toBe("một trăm lẻ năm")
      expect(toWords(1005)).toBe("một nghìn không trăm lẻ năm")
      // But uses 'lăm' in tens position
      expect(toWords(125)).toBe("một trăm hai mươi lăm")
      expect(toWords(1025)).toBe("một nghìn không trăm hai mươi lăm")
    })
  })
})
