// Minimal className joiner -- kept dependency-free on purpose (this whole
// project deliberately keeps its dependency surface small: react-router
// plus the framework itself, nothing more).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
