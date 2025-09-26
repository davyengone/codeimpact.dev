/**
 * Convert technology name to a clean ID format
 * Rules:
 * - Convert to lowercase
 * - Remove dots, underscores, and special characters
 * - Keep only letters and numbers
 * - Remove spaces
 *
 * Examples:
 * - "React" -> "react"
 * - "Vue.js" -> "vuejs"
 * - "Node.js" -> "nodejs"
 * - "C++" -> "cpp"
 * - "ASP.NET" -> "aspnet"
 */
export function generateTechnologyId(name: string): string {
  return name
    .toLowerCase()
    // Handle special cases first
    .replace(/c\+\+/g, 'cpp')
    .replace(/c#/g, 'csharp')
    .replace(/\.net/g, 'net')
    .replace(/asp\.net/g, 'aspnet')
    // Remove all dots, underscores, and special characters except letters/numbers
    .replace(/[^a-z0-9]/g, '')
    // Ensure no empty string
    || 'unknown'
}

/**
 * Validate that a technology ID follows the correct format
 */
export function isValidTechnologyId(id: string): boolean {
  return /^[a-z0-9]+$/.test(id) && id.length > 0
}