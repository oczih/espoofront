'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { AppointmentBooking } from './AppointmentBooking';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface NavigationProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

export default function Navigation({ language, onLanguageChange }: NavigationProps) {
  const initialChecklist: ChecklistItem[] = [
    { id: 'market', label: 'Define target market', checked: false },
    { id: 'finances', label: 'Prepare financial projections', checked: false },
    { id: 'team', label: 'Assemble team and roles', checked: false },
    { id: 'product', label: 'Clarify product/service offering', checked: false },
  ];

  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [isChecklistDialogOpen, setChecklistDialogOpen] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);

  const handleChecklistToggle = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const allChecked = checklist.every((item) => item.checked);

  const handleBookingClick = () => {
    if (!allChecked) return;
    setChecklistDialogOpen(false);
    setShowAppointment(true);
  };

  const closeAppointment = () => setShowAppointment(false);

  return (
    <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white">AI</span>
        </div>
        <div>
          <h1 className="font-semibold font-bold text-black">Business Advisor AI</h1>
          <p className="text-sm text-gray-600">Your entrepreneurial companion</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[140px] text-black">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isChecklistDialogOpen} onOpenChange={setChecklistDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="icon" className="bg-indigo-600 hover:bg-indigo-700">
              <Calendar className="h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-black">Prepare and Book a Meeting</DialogTitle>
              <DialogDescription className="text-black">
                Before booking a meeting please make sure that you have drafted a business plan for most benefit
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-4">
              <Card className="p-4">
                <h3 className="mb-4">Things to consider for a business plan</h3>
                <div className="space-y-3">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={() => handleChecklistToggle(item.id)}
                      />
                      <Label
                        htmlFor={item.id}
                        className={`cursor-pointer leading-relaxed ${item.checked ? 'line-through text-gray-500' : ''}`}
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="pt-4">
                <Button
                  className={`w-full ${allChecked ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed hover:bg-indigo-400'}`}
                  onClick={handleBookingClick}
                  disabled={!allChecked}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Render AppointmentBooking via createPortal */}
        {showAppointment &&
          createPortal(
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg">
                <AppointmentBooking onBack={closeAppointment} />
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
