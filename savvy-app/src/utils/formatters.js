export const formatCurrency = (value, maximumFractionDigits = 2) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: maximumFractionDigits,
    }).format(value || 0);
};

export const formatPercentage = (value) => {
    if (value === null || value === undefined) {
        return '0.00%';
    }
    return `${(value).toFixed(2)}%`;
};
