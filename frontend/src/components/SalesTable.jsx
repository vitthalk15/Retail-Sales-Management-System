import React from 'react';

const SalesTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg mt-5 text-gray-600">
        <p>No sales data found. Try adjusting your search or filters.</p>
      </div>
    );
  }

  const formatMoney = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getValue = (row, field) => row[field] || '-';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-5 overflow-x-auto">
      <table className="w-full border-collapse min-w-[1200px]">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Transaction ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Customer ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Customer name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Phone Number</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Gender</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Age</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Product Category</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Quantity</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Total Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Customer region</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Product ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white border-b-2 border-gray-700 whitespace-nowrap">Employee name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Transaction ID')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Date')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Customer ID')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Customer Name')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Phone Number')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Gender')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Age')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Product Category')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Quantity')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{row['Total Amount'] ? formatMoney(row['Total Amount']) : '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Customer Region')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Product ID')}</td>
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">{getValue(row, 'Employee Name')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
