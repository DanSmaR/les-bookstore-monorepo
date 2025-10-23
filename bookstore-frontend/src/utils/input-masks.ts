// Input mask utilities for Brazilian formats

export const formatCPF = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Apply CPF mask: 000.000.000-00
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  return digits
    .slice(0, 11)
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const formatPhone = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Apply phone mask: (00) 00000-0000 or (00) 0000-0000
  if (digits.length <= 11) {
    if (digits.length <= 10) {
      // Landline format: (00) 0000-0000
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      // Mobile format: (00) 00000-0000
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
  }

  // If more than 11 digits, truncate and format as mobile
  return digits.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export const formatZipCode = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Apply ZIP code mask: 00000-000
  if (digits.length <= 8) {
    return digits.replace(/(\d{5})(\d)/, '$1-$2')
  }

  return digits.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2')
}

export const formatDate = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Apply date mask: DD/MM/YYYY
  if (digits.length <= 8) {
    return digits
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
  }

  return digits.slice(0, 8).replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
}

// Remove mask to get clean value for validation/submission
export const formatISBN = (value: string): string => {
  // Remove all non-digits and X
  const cleanValue = value.replace(/[^0-9X]/gi, '').toUpperCase()

  if (cleanValue.length <= 10) {
    // ISBN-10 format: X-XXX-XXXXX-X
    return cleanValue
      .replace(/(\d{1})(\d)/, '$1-$2')
      .replace(/(\d{1}-\d{3})(\d)/, '$1-$2')
      .replace(/(\d{1}-\d{3}-\d{5})(\d|X)/, '$1-$2')
  } else {
    // ISBN-13 format: XXX-X-XX-XXXXXX-X
    return cleanValue
      .slice(0, 13)
      .replace(/(\d{3})(\d)/, '$1-$2')
      .replace(/(\d{3}-\d{1})(\d)/, '$1-$2')
      .replace(/(\d{3}-\d{1}-\d{2})(\d)/, '$1-$2')
      .replace(/(\d{3}-\d{1}-\d{2}-\d{6})(\d)/, '$1-$2')
  }
}

export const formatCreditCard = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Apply credit card mask: 0000 0000 0000 0000
  if (digits.length <= 16) {
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  // If more than 16 digits, truncate and format
  return digits.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}

export const formatCardExpiry = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Apply expiry mask: MM/YY
  if (digits.length <= 4) {
    return digits.replace(/(\d{2})(\d)/, '$1/$2')
  }

  // If more than 4 digits, truncate and format
  return digits.slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2')
}

export const formatCardCVV = (value: string): string => {
  // Remove all non-digits and limit to 4 characters (for American Express)
  return value.replace(/\D/g, '').slice(0, 4)
}

export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '')
}

// Validate if masked input has minimum required digits
export const hasMinimumDigits = (value: string, minDigits: number): boolean => {
  const digits = removeMask(value)
  return digits.length >= minDigits
}

// Convert backend data to masked format
export const convertToMaskedFormat = {
  // Convert ISO date (2003-01-15T00:00:00Z) to DD/MM/YYYY
  date: (isoDate: string): string => {
    if (!isoDate) return ''
    try {
      // Extract date parts directly from ISO string to avoid timezone issues
      if (isoDate.includes('T')) {
        const datePart = isoDate.split('T')[0] // Get "2003-01-15" part
        const [year, month, day] = datePart.split('-')
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
      } else {
        // If it's just a date string like "2003-01-15"
        const [year, month, day] = isoDate.split('-')
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
      }
    } catch {
      return ''
    }
  },

  // Apply CPF mask to raw CPF data
  cpf: (rawCpf: string): string => {
    if (!rawCpf) return ''
    return formatCPF(rawCpf)
  },

  // Apply phone mask to raw phone data
  phone: (rawPhone: string): string => {
    if (!rawPhone) return ''
    return formatPhone(rawPhone)
  },

  // Apply ZIP code mask to raw postal code data
  zipCode: (rawZipCode: string): string => {
    if (!rawZipCode) return ''
    return formatZipCode(rawZipCode)
  },

  // Apply ISBN mask to raw ISBN data
  isbn: (rawISBN: string): string => {
    if (!rawISBN) return ''
    return formatISBN(rawISBN)
  },
}

// Convert masked format back to backend format
export const convertFromMaskedFormat = {
  // Convert DD/MM/YYYY to ISO date format
  date: (maskedDate: string): string => {
    if (!maskedDate) return ''
    try {
      const [day, month, year] = maskedDate.split('/')
      if (day && month && year) {
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
        )
        return date.toISOString()
      }
      return ''
    } catch {
      return ''
    }
  },

  // Remove CPF mask for backend
  cpf: (maskedCpf: string): string => {
    return removeMask(maskedCpf)
  },

  // Remove phone mask for backend
  phone: (maskedPhone: string): string => {
    return removeMask(maskedPhone)
  },

  // Remove ZIP code mask for backend
  zipCode: (maskedZipCode: string): string => {
    return removeMask(maskedZipCode)
  },

  // Remove ISBN mask for backend
  isbn: (maskedISBN: string): string => {
    return maskedISBN.replace(/[^0-9X]/gi, '').toUpperCase()
  },
}
