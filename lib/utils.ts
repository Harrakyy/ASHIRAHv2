import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Bentuk umum error yang ditangkap: `Error` biasa maupun objek error Supabase ({ message, code, hint }). */
export type CaughtError = {
  message?: string
  code?: string
  hint?: string
  cause?: unknown
  error_description?: string
}

/** Pengganti `catch (error: any)` yang aman tipe — tidak menghilangkan field error Supabase. */
export function asCaughtError(error: unknown): CaughtError {
  return typeof error === "object" && error !== null ? (error as CaughtError) : { message: String(error) }
}
