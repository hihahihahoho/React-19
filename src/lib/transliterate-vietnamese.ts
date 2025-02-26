export function transliterateVietnamese(
  text: string,
  options?: { keepInput?: boolean; toLowerCase?: boolean }
): string[] {
  const diacriticMap: { [key: string]: string } = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    đ: "d",
    À: "A",
    Á: "A",
    Ả: "A",
    Ã: "A",
    Ạ: "A",
    Ă: "A",
    Ằ: "A",
    Ắ: "A",
    Ẳ: "A",
    Ẵ: "A",
    Ặ: "A",
    Â: "A",
    Ầ: "A",
    Ấ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ậ: "A",
    È: "E",
    É: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ẹ: "E",
    Ê: "E",
    Ề: "E",
    Ế: "E",
    Ể: "E",
    Ễ: "E",
    Ệ: "E",
    Ì: "I",
    Í: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ị: "I",
    Ò: "O",
    Ó: "O",
    Ỏ: "O",
    Õ: "O",
    Ọ: "O",
    Ô: "O",
    Ồ: "O",
    Ố: "O",
    Ổ: "O",
    Ỗ: "O",
    Ộ: "O",
    Ơ: "O",
    Ờ: "O",
    Ớ: "O",
    Ở: "O",
    Ỡ: "O",
    Ợ: "O",
    Ù: "U",
    Ú: "U",
    Ủ: "U",
    Ũ: "U",
    Ụ: "U",
    Ư: "U",
    Ừ: "U",
    Ứ: "U",
    Ử: "U",
    Ữ: "U",
    Ự: "U",
    Ỳ: "Y",
    Ý: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Ỵ: "Y",
    Đ: "D",
  };

  const partialDiacriticsMap: { [key: string]: string } = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ằ: "ă",
    ắ: "ă",
    ẳ: "ă",
    ẵ: "ă",
    ặ: "ă",
    ầ: "â",
    ấ: "â",
    ẩ: "â",
    ẫ: "â",
    ậ: "â",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ề: "ê",
    ế: "ê",
    ể: "ê",
    ễ: "ê",
    ệ: "ê",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ồ: "ô",
    ố: "ô",
    ổ: "ô",
    ỗ: "ô",
    ộ: "ô",
    ờ: "ơ",
    ớ: "ơ",
    ở: "ơ",
    ỡ: "ơ",
    ợ: "ơ",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ừ: "ư",
    ứ: "ư",
    ử: "ư",
    ữ: "ư",
    ự: "ư",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    Đ: "Đ", // Keep Đ
    À: "A",
    Á: "A",
    Ả: "A",
    Ã: "A",
    Ạ: "A",
    Ằ: "Ă",
    Ắ: "Ă",
    Ẳ: "Ă",
    Ẵ: "Ă",
    Ặ: "Ă",
    Ầ: "Â",
    Ấ: "Â",
    Ẩ: "Â",
    Ẫ: "Â",
    Ậ: "Â",
    È: "E",
    É: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ẹ: "E",
    Ề: "Ê",
    Ế: "Ê",
    Ể: "Ê",
    Ễ: "Ê",
    Ệ: "Ê",
    Ì: "I",
    Í: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ị: "I",
    Ò: "O",
    Ó: "O",
    Ỏ: "O",
    Õ: "O",
    Ọ: "O",
    Ồ: "Ô",
    Ố: "Ô",
    Ổ: "Ô",
    Ỗ: "Ô",
    Ộ: "Ô",
    Ờ: "Ơ",
    Ớ: "Ơ",
    Ở: "Ơ",
    Ỡ: "Ơ",
    Ợ: "Ơ",
    Ù: "U",
    Ú: "U",
    Ủ: "U",
    Ũ: "U",
    Ụ: "U",
    Ừ: "Ư",
    Ứ: "Ư",
    Ử: "Ư",
    Ữ: "Ư",
    Ự: "Ư",
    Ỳ: "Y",
    Ý: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Ỵ: "Y",
    đ: "đ", // Keep đ
  };

  const keepInput = options?.keepInput ?? true;
  const toLowerCase = options?.toLowerCase ?? true;

  let noDiacritics = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    noDiacritics += diacriticMap[char] || char;
  }

  let partialDiacritics = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    partialDiacritics += partialDiacriticsMap[char] || char;
  }

  let finalNoDiacritics = noDiacritics;
  let finalPartialDiacritics = partialDiacritics;

  if (toLowerCase) {
    finalNoDiacritics = noDiacritics.toLowerCase();
    finalPartialDiacritics = partialDiacritics.toLowerCase();
  }

  if (keepInput) {
    return [text, finalNoDiacritics, finalPartialDiacritics];
  } else {
    return [finalNoDiacritics, finalPartialDiacritics];
  }
}
