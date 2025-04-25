
import { DollarSign, FileText } from 'lucide-react';
import { Button } from './ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TimeEntry } from '../types/TimeEntry';

interface PaymentOverviewProps {
  entries: TimeEntry[];
}

const PaymentOverview = ({ entries }: PaymentOverviewProps) => {
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalPayment = entries.reduce((sum, entry) => sum + entry.total, 0);
  const totalMealAllowance = entries.reduce((sum, entry) => sum + entry.mealAllowanceAmount, 0);

  const exportToPDF = async () => {
    const element = document.getElementById('payment-overview');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('lønoversigt.pdf');
  };

  return (
    <div id="payment-overview" className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-sky-600" />
          <h2 className="text-xl font-semibold text-gray-800">Lønsoversigt</h2>
        </div>
        <Button onClick={exportToPDF} variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Eksporter PDF
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-sky-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Samlede Timer</p>
            <p className="text-2xl font-semibold text-gray-800">{totalHours.toFixed(1)}</p>
          </div>
          <div className="bg-sky-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Løn Total</p>
            <p className="text-2xl font-semibold text-gray-800">{totalPayment.toFixed(2)} kr</p>
          </div>
          <div className="bg-sky-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Kostpenge Total</p>
            <p className="text-2xl font-semibold text-gray-800">{totalMealAllowance.toFixed(2)} kr</p>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Dato</th>
                <th className="text-right py-2">Timer</th>
                <th className="text-right py-2">Sats</th>
                <th className="text-right py-2">Løn</th>
                <th className="text-right py-2">Kostpenge</th>
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
                  <td className="text-right">{entry.mealAllowanceAmount.toFixed(2)} kr</td>
                  <td className="text-right">
                    {(entry.total + entry.mealAllowanceAmount).toFixed(2)} kr
                  </td>
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
