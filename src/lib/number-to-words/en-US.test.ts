import { describe, expect, it } from "vitest"
import { toWords } from "./en-US"

describe("English Number to Words", () => {
  describe("Basic numbers (0-9)", () => {
    it.each([
      [0, "zero"],
      [1, "one"],
      [2, "two"],
      [3, "three"],
      [4, "four"],
      [5, "five"],
      [6, "six"],
      [7, "seven"],
      [8, "eight"],
      [9, "nine"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Teens (10-19)", () => {
    it.each([
      [10, "ten"],
      [11, "eleven"],
      [12, "twelve"],
      [13, "thirteen"],
      [14, "fourteen"],
      [15, "fifteen"],
      [16, "sixteen"],
      [17, "seventeen"],
      [18, "eighteen"],
      [19, "nineteen"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Tens (20-99) - hyphenated format", () => {
    it.each([
      [20, "twenty"],
      [21, "twenty-one"],
      [25, "twenty-five"],
      [30, "thirty"],
      [42, "forty-two"],
      [50, "fifty"],
      [55, "fifty-five"],
      [99, "ninety-nine"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Hundreds (100-999)", () => {
    it.each([
      [100, "one hundred"],
      [101, "one hundred one"],
      [110, "one hundred ten"],
      [111, "one hundred eleven"],
      [120, "one hundred twenty"],
      [121, "one hundred twenty-one"],
      [200, "two hundred"],
      [250, "two hundred fifty"],
      [500, "five hundred"],
      [555, "five hundred fifty-five"],
      [999, "nine hundred ninety-nine"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Thousands", () => {
    it.each([
      [1000, "one thousand"],
      [1001, "one thousand one"],
      [1010, "one thousand ten"],
      [1100, "one thousand one hundred"],
      [1234, "one thousand two hundred thirty-four"],
      [2000, "two thousand"],
      [10000, "ten thousand"],
      [12345, "twelve thousand three hundred forty-five"],
      [100000, "one hundred thousand"],
      [123456, "one hundred twenty-three thousand four hundred fifty-six"],
      [999999, "nine hundred ninety-nine thousand nine hundred ninety-nine"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Millions", () => {
    it.each([
      [1000000, "one million"],
      [1000001, "one million one"],
      [1001000, "one million one thousand"],
      [1234567, "one million two hundred thirty-four thousand five hundred sixty-seven"],
      [10000000, "ten million"],
      [100000000, "one hundred million"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Billions", () => {
    it.each([
      [1000000000, "one billion"],
      [1000000001, "one billion one"],
      [1234567890, "one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Negative numbers", () => {
    it.each([
      [-1, "negative one"],
      [-42, "negative forty-two"],
      [-100, "negative one hundred"],
      [-1000, "negative one thousand"],
    ])("converts %d to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("Decimal numbers", () => {
    it.each([
      [0.5, "zero point five"],
      [1.5, "one point five"],
      [3.14, "three point one four"],
      [10.01, "ten point zero one"],
      [100.001, "one hundred point zero zero one"],
    ])("converts %s to '%s'", (input, expected) => {
      expect(toWords(input)).toBe(expected)
    })
  })

  describe("String and BigInt inputs", () => {
    it("converts string inputs", () => {
      expect(toWords("42")).toBe("forty-two")
      expect(toWords("1000")).toBe("one thousand")
      expect(toWords("-123")).toBe("negative one hundred twenty-three")
    })

    it("converts BigInt inputs", () => {
      expect(toWords(42n)).toBe("forty-two")
      expect(toWords(1000000n)).toBe("one million")
      expect(toWords(-1000n)).toBe("negative one thousand")
    })

    it("handles very large BigInt values", () => {
      expect(toWords(1000000000000n)).toBe("one trillion")
      expect(toWords(1000000000000000n)).toBe("one quadrillion")
    })
  })

  describe("Edge cases", () => {
    it("handles zero", () => {
      expect(toWords(0)).toBe("zero")
      expect(toWords("0")).toBe("zero")
      expect(toWords(0n)).toBe("zero")
    })

    it("throws error for invalid inputs", () => {
      expect(() => toWords("")).toThrow("Value cannot be empty")
      expect(() => toWords("abc")).toThrow("Invalid number format")
      expect(() => toWords(Infinity)).toThrow("Value must be a finite number")
      expect(() => toWords(NaN)).toThrow("Value must be a finite number")
    })
  })
})
