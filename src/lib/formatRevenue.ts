/**
 * Format revenue numbers to display in a human-readable format
 * 1,500,000 -> 1.5M
 * 1,000,000,000 -> 1B
 * 15,000 -> 15K
 */
export function formatRevenue(amount: number): string {
  if (amount === 0) return '0'

  const absAmount = Math.abs(amount)

  // Billions
  if (absAmount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000
    return `${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)}B`
  }

  // Millions
  if (absAmount >= 1_000_000) {
    const millions = amount / 1_000_000
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`
  }

  // Thousands
  if (absAmount >= 1_000) {
    const thousands = amount / 1_000
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`
  }

  // Less than 1,000
  return amount.toString()
}

/**
 * Format revenue with dollar sign
 */
export function formatCurrency(amount: number): string {
  return `$${formatRevenue(amount)}`
}