
export function unwrapData<T>(response: any): T | undefined {
  if (!response) return undefined;
  if (response.data !== undefined && response.success !== undefined) return response.data as T;
  return response as T;
}

export function formatCurrency(value: number | string | undefined): string {
  const amount = typeof value === 'number' ? value : Number(value || 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
