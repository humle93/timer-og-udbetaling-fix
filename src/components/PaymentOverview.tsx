import { Calendar } from 'lucide-react';
import { Button } from './ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TimeEntry } from '../types/TimeEntry';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import PDFTemplateSelector from './PDFTemplateSelector';
import { PDFTemplate } from '../types/PDFTemplate';

interface PaymentOverviewProps {
  entries: TimeEntry[];
}

const PaymentOverview = ({ entries }: PaymentOverviewProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTemplate, setSelectedTemplate] = useState<PDFTemplate | null>(null);

  const filteredEntries = entries.filter(entry => {
    if (!dateRange?.from || !dateRange?.to) return true;
    return entry.dates.some(date => {
      const entryDate = new Date(date);
      return entryDate >= dateRange.from && entryDate <= dateRange.to;
    });
  });

  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalPayment = filteredEntries.reduce((sum, entry) => sum + entry.total, 0);
  const totalMealAllowance = filteredEntries.reduce((sum, entry) => sum + entry.mealAllowanceAmount, 0);
  const totalTaxable = filteredEntries.reduce((sum, entry) => sum + entry.taxableAmount, 0);
  const totalTaxFree = filteredEntries.reduce((sum, entry) => sum + entry.taxFreeAmount, 0);

  const exportToPDF = async () => {
    const element = document.getElementById('payment-overview');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    
    if (selectedTemplate) {
      try {
        const templateResponse = await fetch(selectedTemplate.templateUrl);
        const templateBlob = await templateResponse.blob();
        const templateBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(templateBlob);
        });
        
        await pdf.loadFile(templateBase64);
        pdf.addPage();
      } catch (error) {
        console.error('Error loading template:', error);
      }
    }
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('lønoversigt.pdf');
  };

  return (
    <div className="space-y-6">
      <div id="payment-overview" className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-sky-600" />
            <h2 className="text-xl font-semibold text-gray-800">Lønsoversigt</h2>
          </div>
        </div>

        <div className="mb-6">
          <Label>Vælg periode</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                    </>
                  ) : (
                    format(dateRange.from, "PPP")
                  )
                ) : (
                  <span>Vælg periode</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-sky-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Timer i alt</p>
              <p className="text-2xl font-semibold text-gray-800">{totalHours.toFixed(1)}</p>
            </div>
            <div className="bg-sky-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Skattepligtig løn</p>
              <p className="text-2xl font-semibold text-gray-800">{totalTaxable.toFixed(2)} kr</p>
            </div>
            <div className="bg-sky-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Skattefri godtgørelse</p>
              <p className="text-2xl font-semibold text-gray-800">{totalTaxFree.toFixed(2)} kr</p>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Datoer</th>
                  <th className="text-left py-2">Tidsrum</th>
                  <th className="text-right py-2">Timer</th>
                  <th className="text-right py-2">Sats</th>
                  <th className="text-right py-2">Kostpenge</th>
                  <th className="text-right py-2">Skattepligtig</th>
                  <th className="text-right py-2">Skattefri</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-b">
                    <td className="py-2">
                      {entry.dates.length === 1 
                        ? format(new Date(entry.dates[0]), 'dd/MM/yyyy')
                        : `${entry.dates.length} dage: ${format(new Date(entry.dates[0]), 'dd/MM')} - ${format(new Date(entry.dates[entry.dates.length-1]), 'dd/MM/yyyy')}`
                      }
                    </td>
                    <td className="text-left">{entry.startTime} - {entry.endTime}</td>
                    <td className="text-right">{entry.hours * entry.dates.length}</td>
                    <td className="text-right">{entry.rate} kr</td>
                    <td className="text-right">
                      {entry.mealAllowance ? `${entry.mealAllowanceAmount.toFixed(2)} kr ${entry.mealAllowanceType === 'with_allowance' ? '(m/diæt)' : '(u/diæt)'}` : '-'}
                    </td>
                    <td className="text-right">{entry.taxableAmount.toFixed(2)} kr</td>
                    <td className="text-right">{entry.taxFreeAmount.toFixed(2)} kr</td>
                    <td className="text-right">
                      {(entry.taxableAmount + entry.taxFreeAmount).toFixed(2)} kr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">PDF Eksport</h3>
        <PDFTemplateSelector onTemplateSelect={setSelectedTemplate} />
        <div className="mt-4">
          <Button onClick={exportToPDF} variant="outline" size="sm">
            Eksporter {selectedTemplate ? `med ${selectedTemplate.name}` : 'PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverview;
