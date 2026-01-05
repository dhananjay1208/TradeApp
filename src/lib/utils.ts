import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indian currency (INR) with proper lakhs/crores formatting
 * Examples:
 * - 1234 -> ₹1,234
 * - 123456 -> ₹1,23,456
 * - 12345678 -> ₹1,23,45,678
 */
export function formatINR(
  amount: number,
  options?: {
    showSign?: boolean;
    compact?: boolean;
    decimals?: number;
  }
): string {
  const { showSign = false, compact = false, decimals = 0 } = options || {};

  const absAmount = Math.abs(amount);
  const sign = amount >= 0 ? (showSign ? "+" : "") : "-";

  if (compact) {
    if (absAmount >= 10000000) {
      // 1 Crore = 10,000,000
      return `${sign}₹${(absAmount / 10000000).toFixed(2)}Cr`;
    } else if (absAmount >= 100000) {
      // 1 Lakh = 100,000
      return `${sign}₹${(absAmount / 100000).toFixed(2)}L`;
    } else if (absAmount >= 1000) {
      return `${sign}₹${(absAmount / 1000).toFixed(1)}K`;
    }
  }

  // Indian number formatting: 12,34,567.89
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formatted = formatter.format(absAmount);
  return amount < 0 ? `-${formatted}` : (showSign && amount > 0 ? `+${formatted}` : formatted);
}

/**
 * Format P&L with sign
 */
export function formatPnL(amount: number): string {
  const formatted = formatINR(Math.abs(amount));
  return amount >= 0 ? `+${formatted}` : `-${formatted.replace('₹', '₹')}`;
}

/**
 * Format percentage with optional sign
 */
export function formatPercent(
  value: number,
  options?: {
    showSign?: boolean;
    decimals?: number;
  }
): string {
  const { showSign = true, decimals = 2 } = options || {};
  const sign = value >= 0 ? (showSign ? "+" : "") : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format date to IST timezone
 */
export function formatDateIST(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    ...options,
  });
}

/**
 * Format time to IST timezone
 */
export function formatTimeIST(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
}

/**
 * Format date and time to IST
 */
export function formatDateTimeIST(date: Date | string): string {
  return `${formatDateIST(date, { day: "2-digit", month: "short" })} ${formatTimeIST(date)}`;
}

/**
 * Get today's date in YYYY-MM-DD format (IST)
 */
export function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/**
 * Check if market is open (NSE: 9:15 AM - 3:30 PM IST, Mon-Fri)
 */
export function isMarketOpen(): boolean {
  const now = new Date();
  const istOptions: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };

  // Weekend check
  const dayName = now.toLocaleDateString("en-US", { ...istOptions, weekday: "short" });
  if (dayName === "Sat" || dayName === "Sun") return false;

  const timeStr = now.toLocaleTimeString("en-US", {
    ...istOptions,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const [hours, minutes] = timeStr.split(":").map(Number);
  const currentMinutes = hours * 60 + minutes;

  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM

  return currentMinutes >= marketOpen && currentMinutes <= marketClose;
}

/**
 * Calculate P&L from entry and exit
 */
export function calculatePnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  direction: "LONG" | "SHORT"
): { pnl: number; pnlPercent: number } {
  const pnl =
    direction === "LONG"
      ? (exitPrice - entryPrice) * quantity
      : (entryPrice - exitPrice) * quantity;

  const pnlPercent =
    direction === "LONG"
      ? ((exitPrice - entryPrice) / entryPrice) * 100
      : ((entryPrice - exitPrice) / entryPrice) * 100;

  return { pnl, pnlPercent };
}

/**
 * Get color class based on P&L value
 */
export function getPnLColorClass(value: number): string {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-foreground-muted";
}

/**
 * Get background color class based on P&L value
 */
export function getPnLBgClass(value: number): string {
  if (value > 0) return "bg-profit-muted";
  if (value < 0) return "bg-loss-muted";
  return "bg-muted";
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
