import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random ID with a given length
 */
export function generateId(length = 8) {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Formats a date as DD/MM/YYYY
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formats a datetime as DD/MM/YYYY HH:MM
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR') + ' ' + 
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Generates an equipment code based on a number
 */
export function generateEquipmentCode(num: number): string {
  return `EQ-${String(num).padStart(4, '0')}`;
}

/**
 * Returns a user-friendly status name from the enum value
 */
export function getStatusName(status: string): string {
  switch (status) {
    case 'CLEANING':
      return 'Em Limpeza';
    case 'FINISHED':
      return 'Finalizado';
    case 'RETURNED':
      return 'Devolvido';
    case 'PENDING':
    default:
      return 'Aguardando';
  }
}

/**
 * Returns a user-friendly role name from the enum value
 */
export function getRoleName(role: string): string {
  switch (role) {
    case 'MANAGER':
      return 'Gerente';
    case 'EMPLOYEE':
      return 'Funcionário';
    case 'CLIENT':
    default:
      return 'Cliente';
  }
}
