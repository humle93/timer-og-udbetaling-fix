
import { useState } from 'react';
import TimeRegistration from '../components/TimeRegistration';
import PaymentOverview from '../components/PaymentOverview';
import { Button } from '../components/ui/button';

const Index = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  
  const addEntry = (entry: TimeEntry) => {
    setEntries([...entries, entry]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Timeregistrering og Løn</h1>
          <p className="text-gray-600">Hold styr på dine timer og løn</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <TimeRegistration onSave={addEntry} />
          <PaymentOverview entries={entries} />
        </div>
      </div>
    </div>
  );
};

export default Index;
