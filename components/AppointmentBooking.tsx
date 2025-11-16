import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Calendar } from "./ui/calendar";
import { enUS, fi } from 'date-fns/locale';
import {
  MapPin,
  Video,
  Clock,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useSession } from "next-auth/react";

type MeetingType = "onsite" | "remote";

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

interface AppointmentBookingProps {
    onBack?: () => void;
    language?: "en" | "fi";
    onBooked?: () => void;
    setShowAppointment?: (show: boolean) => void;
  }

  export function AppointmentBooking({ onBack, onBooked, language = "en", setShowAppointment }: AppointmentBookingProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState("");
    const [notes, setNotes] = useState("");
    const [meetingType, setMeetingType] = useState<MeetingType>("remote");
    const [isBooked, setIsBooked] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession();
    
    const t = {
      en: {
        back: "Back to Chat",
        title: "Book an Appointment",
        description: "Schedule a 1-hour consultation with our business advisor",
        meetingType: "Meeting Type",
        remote: "Remote Meeting",
        onsite: "On-site at Otaniemi",
        remoteDesc: "Join via video call from anywhere",
        onsiteDesc: "Meet in person at our Otaniemi office",
        durationInfo: "All meetings are scheduled for 1 hour",
        selectTime: "Select Time",
        additionalInfo: "Additional Information",
        notesPlaceholder: "Any specific topics you'd like to discuss?",
        upload: "Upload Business Plan",
        uploadDesc: "Business Plan (Optional)",
        uploadFormats: "Accepted formats: PDF, DOC, DOCX",
        confirm: "Confirm Appointment",
        cancel: "Cancel Appointment",
        confirmed: "Appointment Confirmed!",
        typeLabel: "Type:",
        durationLabel: "Duration:",
        confirmationSent: "Confirmation sent to:",
        reminder: "A reminder about this meeting will be sent to your phone number and email."
      },
      fi: {
        back: "Takaisin keskusteluun",
        title: "Varaa tapaaminen",
        description: "Aikatauluta yhden (1) tunnin konsultaatio liikeneuvojamme kanssa",
        meetingType: "Tapaamisen tyyppi",
        remote: "Etätapaaminen",
        onsite: "Paikan päällä Otaniemessä",
        remoteDesc: "Osallistu videopuheluun mistä tahansa",
        onsiteDesc: "Tapaa henkilökohtaisesti Otaniemen toimistolla",
        durationInfo: "Kaikki tapaamiset kestävät yhden (1) tunnin",
        selectTime: "Valitse aika",
        additionalInfo: "Lisätiedot",
        notesPlaceholder: "Onko jotain erityisiä aiheita, joista haluat keskustella?",
        upload: "Lataa liiketoimintasuunnitelma",
        uploadDesc: "Liiketoimintasuunnitelma (valinnainen)",
        uploadFormats: "Hyväksytyt muodot: PDF, DOC, DOCX",
        confirm: "Vahvista tapaaminen",
        cancel: "Peruuta tapaaminen",
        confirmed: "Tapaaminen vahvistettu!",
        typeLabel: "Tyyppi:",
        durationLabel: "Kesto:",
        confirmationSent: "Vahvistus lähetetty:",
        reminder: "Muistutus tästä tapaamisesta lähetetään puhelimeesi ja sähköpostiisi."
      }
    }[language];
    
    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) return;
        const businessId = session?.user?.business?.toString();
        const dateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(":").map(Number);
        dateTime.setHours(hours, minutes);
        setLoading(true)
        try {
          const res = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              businessId: businessId,
              date: dateTime,
              type: meetingType,
              notes,
            }),
          });
      
          if (!res.ok) throw new Error("Failed to book appointment");
      
          setIsBooked(true);
          if (onBooked) onBooked();
        } catch (err) {
          console.error(err);
          alert("Failed to book appointment");
        } finally{
            setLoading(false)
        }
      };
      if (isBooked) {
        return (
          <div className="min-h-screen flex items-center rounded-2xl justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="max-w-2xl w-full">
              {onBack && (
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="mb-6 flex items-center cursor-pointer cursor-pointer gap-2 text-gray-800 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.back}
                </Button>
              )}
              <Card className="p-8 rounded-2xl shadow-lg text-center border border-gray-200">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">{t.confirmed}</h2>
                <p className="text-gray-700 mb-6">
                  {meetingType === "onsite" ? t.onsite : t.remote} <span className="font-medium">{t.durationLabel.toLowerCase()}</span> {" "}
                  {selectedDate?.toLocaleDateString("fi-FI", { day: "2-digit", month: "2-digit", year: "numeric" })} <span className="font-medium">{t.selectTime.toLowerCase()}</span> {selectedTime}.
                </p>
                <div className="bg-gray-50 rounded-lg p-5 mb-6 text-left border border-gray-200">
                  <p className="text-sm mb-2">
                    <span className="text-gray-500">{t.typeLabel}</span> <strong>{meetingType === "onsite" ? t.onsite : t.remote}</strong>
                  </p>
                  <p className="text-sm mb-2">
                    <span className="text-gray-500">{t.durationLabel}</span> <strong>1 hour</strong>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">{t.confirmationSent}</span> <strong>{session?.user.email}{session?.user.number ? ` • ${session.user.number}` : ""}</strong>
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-6">{t.reminder}</p>
                <Button
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-md"
                  onClick={() => {
                    if (setShowAppointment) {
                      setShowAppointment(false);
                    } else if (onBack) {
                      onBack();
                    }
                  }}
                >
                  {t.back}
                </Button>
              </Card>
            </div>
          </div>
        );
      }      
  
    return (
      <div className="min-h-screen rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 px-1">
        <div className="max-w-4xl mx-auto py-8">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-4 text-black cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
          )}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="mb-2 text-black">{t.title}</h1>
            <p className="text-gray-600">{t.description}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-4">{t.meetingType}</h3>
                <RadioGroup value={meetingType} onValueChange={v => setMeetingType(v as MeetingType)}>
                  <div className="space-y-3">
                    <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${meetingType === "remote" ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`} onClick={() => setMeetingType("remote")}>
                      <RadioGroupItem value="remote" id="remote" />
                      <div className="flex-1">
                        <Label htmlFor="remote" className="cursor-pointer flex items-center gap-2">
                          <Video className="w-5 h-5 text-indigo-600" />
                          <span>{t.remote}</span>
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">{t.remoteDesc}</p>
                      </div>
                    </div>
                    <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${meetingType === "onsite" ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`} onClick={() => setMeetingType("onsite")}>
                      <RadioGroupItem value="onsite" id="onsite" />
                      <div className="flex-1">
                        <Label htmlFor="onsite" className="cursor-pointer flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-indigo-600" />
                          <span>{t.onsite}</span>
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">{t.onsiteDesc}</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">{t.durationInfo}</p>
                </div>
              </Card>
              <Card className="p-4 mb-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                {language === "fi" ? "Valittu päivä" : "Selected Date"}
                </h3>
                <p className="text-black">
                {selectedDate
                    ? selectedDate.toLocaleDateString("fi-FI", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    : language === "fi"
                    ? "Ei valittua päivää"
                    : "No date selected"}
                </p>
                </Card>
                <div className="w-sm max-w-xl text-black">
            <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-lg border w-full"
            locale={language === "fi" ? fi : enUS}
        />
        </div>
            </div>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-4">{t.selectTime}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(time => (
                    <Button key={time} variant={selectedTime === time ? "default" : "outline"} className={selectedTime === time ? "bg-indigo-600 hover:bg-indigo-700" : "cursor-pointer"} onClick={() => setSelectedTime(time)}>
                      {time}
                    </Button>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="mb-4">{t.additionalInfo}</h3>
                <Label htmlFor="notes">{t.notesPlaceholder}</Label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1" rows={3}   />
              </Card>
              <Card className="p-6">
                <h3 className="mb-4">{t.upload}</h3>
                <Label htmlFor="business-plan">{t.uploadDesc}</Label>
                <input id="business-plan" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => setUploadedFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {uploadedFile && <p className="text-sm text-green-600 mt-2">✓ {uploadedFile.name} uploaded</p>}
                <p className="text-xs text-gray-500 mt-1">{t.uploadFormats}</p>
              </Card>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleBooking} disabled={!selectedDate || !selectedTime || !meetingType || loading}>
                {t.confirm}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  