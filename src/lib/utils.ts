/**
 * cn — class name utility
 *
 * Combines clsx and tailwind-merge for clean conditional class application.
 * Used by all shadcn/ui components and custom components throughout the project.
 *
 * Usage:
 *   cn('base-class', condition && 'conditional-class', 'another-class')
 *   cn('p-4', isActive && 'bg-accent-blue', className)
 */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
