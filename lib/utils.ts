import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CANVAS_URL = process.env.NEXT_PUBLIC_CANVAS_URL || "https://canvas.ashiragroup.id/ashira-apparel"
