// Safe currency formatter with error boundary
export function formatCurrency(amount: number | null | undefined, currencySymbol = '$'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currencySymbol}0.00`;
  }

  // Handle extreme numbers nicely
  if (Math.abs(amount) >= 1_000_000_000) {
    return `${currencySymbol}${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('$', currencySymbol);
}

// Calculate percentage spent safely without division by zero
export function calculatePercentage(spent: number, limit: number): number {
  if (!limit || limit <= 0) {
    return spent > 0 ? 100 : 0;
  }
  const pct = Math.round((spent / limit) * 100);
  return isNaN(pct) ? 0 : Math.max(0, pct);
}

// Calculate status info for a budget card
export function getBudgetStatus(spent: number, limit: number) {
  const percentage = calculatePercentage(spent, limit);
  const remaining = limit - spent;
  const isOverLimit = spent > limit;
  const isNearLimit = !isOverLimit && percentage >= 80;

  if (isOverLimit) {
    const overAmount = spent - limit;
    return {
      type: 'error' as const,
      label: `${formatCurrency(overAmount)} over budget!`,
      shortLabel: `${formatCurrency(overAmount)} over`,
      badgeClass: 'text-red-600 bg-red-50 font-bold',
      barColor: 'bg-red-600',
      isOver: true,
      isWarning: true,
    };
  }

  if (isNearLimit) {
    return {
      type: 'warning' as const,
      label: `${formatCurrency(remaining)} left`,
      shortLabel: `${formatCurrency(remaining)} left`,
      badgeClass: 'text-amber-600 bg-amber-50 font-bold',
      barColor: 'bg-amber-500',
      isOver: false,
      isWarning: true,
    };
  }

  return {
    type: 'normal' as const,
    label: remaining === 0 ? 'Fully used' : `${formatCurrency(remaining)} left`,
    shortLabel: remaining === 0 ? 'Fixed' : `${formatCurrency(remaining)} left`,
    badgeClass: 'text-slate-600 font-medium',
    barColor: percentage === 100 ? 'bg-emerald-600' : 'bg-slate-900',
    isOver: false,
    isWarning: false,
  };
}

// Date formatter
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
