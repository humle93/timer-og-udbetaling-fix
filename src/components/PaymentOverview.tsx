
import { DollarSign } from 'lucide-react';

interface PaymentOverviewProps {
  entries: TimeEntry[];
}

const PaymentOverview = ({ entries }: PaymentOverviewProps) => {
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalPayment = entries.reduce((sum, entry) => sum + entry.total, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="h-5 w-5 text-sky-600" />
        <h2 className="text-xl font-semibold text-gray-800">Lønsoversigt</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-sky-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Samlede Timer</p>
            <p className="text-2xl font-semibold text-gray-800">{totalHours.toFixed(1)}</p>
          </div>
          <div className="bg-sky-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Løn</p>
            <p className="text-2xl font-semibold text-gray-800">{totalPayment.toFixed(2)} kr</p>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Dato</th>
                <th className="text-right py-2">Timer</th>
                <th className="text-right py-2">Sats</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="py-2">{entry.date}</td>
                  <td className="text-right">{entry.hours}</td>
                  <td className="text-right">{entry.rate} kr</td>
                  <td className="text-right">{entry.total.toFixed(2)} kr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverview;
