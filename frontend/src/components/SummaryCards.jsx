import React from 'react';

const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="grid grid-cols-3 gap-5 mb-5">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="text-sm text-gray-600 mb-2 font-medium">Total units sold</div>
        <div className="text-lg font-semibold text-gray-800">{summary.totalUnits}</div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="text-sm text-gray-600 mb-2 font-medium">Total Amount</div>
        <div className="text-lg font-semibold text-gray-800">
          {formatMoney(summary.totalAmount)} ({summary.salesRecords} SRs)
        </div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="text-sm text-gray-600 mb-2 font-medium">Total Discount</div>
        <div className="text-lg font-semibold text-gray-800">
          {formatMoney(summary.totalDiscount)} ({summary.salesRecords} SRs)
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
