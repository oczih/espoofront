/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { AppointmentBooking } from './AppointmentBooking';
import { Language } from '@/app/types';
import { signOut } from 'next-auth/react';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface NavigationProps {
  language: Language;
  onLanguageChange: (lang: Language) => void; // <- use Language
}

export default function Navigation({ language, onLanguageChange }: NavigationProps) {
  const checklistTranslations: Record<Language, ChecklistItem[]> = {
    en: [
      { id: "1", label: "Business Idea", checked: false },
      { id: "2", label: "Entrepreneur's Skills", checked: false },
      { id: "3", label: "Products & Customers", checked: false },
      { id: "4", label: "Marketing & Operations", checked: false },
      { id: "5", label: "Competition & Operating Environment", checked: false },
      { id: "6", label: "Vision & Future Plans", checked: false },
      { id: "7", label: "Legal Requirements & Risks", checked: false },
      { id: "8", label: "Finances & Practical Arrangements", checked: false },
    ],
    fi: [
      { id: "1", label: "Liikeidea", checked: false },
      { id: "2", label: "Yrittäjän taidot", checked: false },
      { id: "3", label: "Tuotteet & Asiakkaat", checked: false },
      { id: "4", label: "Markkinointi & Toiminta", checked: false },
      { id: "5", label: "Kilpailu & Toimintaympäristö", checked: false },
      { id: "6", label: "Visio & Tulevaisuuden suunnitelmat", checked: false },
      { id: "7", label: "Lainsäädäntö & Riskit", checked: false },
      { id: "8", label: "Rahoitus & Käytännön järjestelyt", checked: false },
    ]
  };
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const currentChecklist = checklistTranslations[language].map(item => ({
    ...item,
    checked: checkedItems[item.id] || false,
  }));
  const [isChecklistDialogOpen, setChecklistDialogOpen] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);

  const handleChecklistToggle = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = currentChecklist.every(item => item.checked);

  const [warningModal, setWarningModal] = useState(false);

  const handleBookingClick = () => {
    if (!allChecked) {
      setWarningModal(true); // show warning first
      return;
    }
    setChecklistDialogOpen(false);
    setShowAppointment(true);
  };

  const handleWarningResponse = (confirm: boolean) => {
    setWarningModal(false);
    if (confirm) {
      setChecklistDialogOpen(false);
      setShowAppointment(true);
    }
  };

  const closeAppointment = () => setShowAppointment(false);
  const dialogTexts: Record<Language, { title: string; description: string }> = {
    en: {
      title: "Prepare and Book a Meeting",
      description: "Before booking please make sure that you have drafted a business plan for most benefit. Feel free to to discuss with the AI assistant if you need help with any of the topics.",
    },
    fi: {
      title: "Valmistele ja varaa tapaaminen",
      description: "Jotta tapaaminen olisi madollisimman hyödyllinen, varmista, että olet laatinut liiketoimintasuunnitelman etukäteen. Voit keskustella mistä tahansa aiheesta AI-assistentin kanssa."
    },
  };
  const warningDialogTexts: Record<Language, {
    title: string;
    description: string;
    yes: string;
    no: string;
  }> = {
    en: {
      title: "Incomplete Checklist",
      description: "All steps of the business plan checklist are not yet checked. Do you still want to continue to booking?",
      yes: "Yes",
      no: "No",
    },
    fi: {
      title: "Täydentämätön tarkistuslista",
      description: "Kaikki liiketoimintasuunnitelman vaiheet eivät ole vielä tarkistettu. Haluatko silti jatkaa varaukseen?",
      yes: "Kyllä",
      no: "Ei",
    },
  };
  
  return (
    <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-16 h-6 rounded-lg flex items-center justify-center">
          <img src="/businessespoo_small.png" alt="Business Espoo logo" className="w-14 h-5 object-contain"/>
        </div>
        <div>
          <h1 className="font-semibold font-bold text-black">Business Advisor AI</h1>
          <p className="text-sm text-gray-600">Your entrepreneurial companion</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
      <Button onClick={() => signOut()} className="bg-red-500 cursor-pointer transition-colorstext-white px-4 py-2 rounded hover:bg-red-600">
          Sign out
        </Button>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[140px] text-black">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">In English</SelectItem>
            <SelectItem value="fi">Suomeksi</SelectItem>
            <SelectItem value="sv" className='disabled:hover:cursor-not-allowed' disabled={true}>På Svenska</SelectItem>
            <SelectItem value="ru" className='disabled:hover:cursor-not-allowed' disabled={true}>На русском</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isChecklistDialogOpen} onOpenChange={setChecklistDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
              <Calendar className="h-5 w-5 mr-2" />
              Prepare & Book advisor meeting
            </Button>
          </DialogTrigger>

          <DialogContent>
          <DialogHeader>
  <DialogTitle className="text-black">{dialogTexts[language].title}</DialogTitle>
  <DialogDescription className="text-black">{dialogTexts[language].description}</DialogDescription>
</DialogHeader>


            <div className="mt-6 space-y-4">
            <Card key={language} className="p-4">
  <h3 className="mb-4">Things to consider for a business plan</h3>
  <div className="space-y-3">
  {currentChecklist.map(item => (
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
              <button
  className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors
    ${allChecked ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer' : 'bg-indigo-300'}`}
  onClick={handleBookingClick}
>
  Book Appointment
</button> 

              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Render AppointmentBooking via createPortal */}
        {warningModal && typeof window !== 'undefined' &&
  createPortal(
    <Dialog open={true} onOpenChange={setWarningModal}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className='text-black'>{warningDialogTexts[language].title}</DialogTitle>
      <DialogDescription>{warningDialogTexts[language].description}</DialogDescription>
    </DialogHeader>
    <div className="flex gap-3 justify-end mt-4">
      <Button variant="outline" className="cursor-pointer" onClick={() => handleWarningResponse(false)}>
        {warningDialogTexts[language].no}
      </Button>
      <Button className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer" onClick={() => handleWarningResponse(true)}>
        {warningDialogTexts[language].yes}
      </Button>
    </div>
  </DialogContent>
</Dialog>,
    document.body
  )
}

        {showAppointment && typeof window !== 'undefined' &&
  createPortal(
    <div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-auto bg-black/50 p-8">
      <div className="bg-white rounded-lg w-full max-w-5xl shadow-lg my-8">
        <AppointmentBooking onBack={closeAppointment} />
      </div>
    </div>,
    document.body
  )}
      </div>
    </div>
  );
}
