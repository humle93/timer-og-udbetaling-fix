
import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { PDFTemplate } from '../types/PDFTemplate';
import { Input } from './ui/input';

interface PDFTemplateSelectorProps {
  onTemplateSelect: (template: PDFTemplate) => void;
}

const PDFTemplateSelector = ({ onTemplateSelect }: PDFTemplateSelectorProps) => {
  const [templates, setTemplates] = useState<PDFTemplate[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a URL for the uploaded file
    const templateUrl = URL.createObjectURL(file);
    const newTemplate: PDFTemplate = {
      id: Date.now(),
      name: file.name.replace('.pdf', ''),
      templateUrl,
    };

    setTemplates([...templates, newTemplate]);
    onTemplateSelect(newTemplate);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="template-upload">Upload ny PDF skabelon</Label>
        <Input
          id="template-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="mt-1"
        />
      </div>

      {templates.length > 0 && (
        <div className="space-y-2">
          <Label>Vælg skabelon</Label>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                onClick={() => onTemplateSelect(template)}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFTemplateSelector;
