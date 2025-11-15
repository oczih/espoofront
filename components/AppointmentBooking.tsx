import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Calendar } from "./ui/calendar";
import {
  MapPin,
  Video,
  Clock,
  ArrowLeft,
  Check,
} from "lucide-react";

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
}

export function AppointmentBooking({
  onBack,
}: AppointmentBookingProps) {
  const [selectedDate, setSelectedDate] = useState<
    Date | undefined
  >(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState("remote");
  const [isBooked, setIsBooked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(
    null,
  );

  const handleBooking = () => {
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto py-8">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
          )}

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="mb-2">Appointment Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your{" "}
              {meetingType === "onsite" ? "on-site" : "remote"}{" "}
              meeting has been scheduled for{" "}
              {selectedDate?.toLocaleDateString()} at{" "}
              {selectedTime}.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm mb-2">
                <span className="text-gray-600">Type:</span>{" "}
                <strong>
                  {meetingType === "onsite"
                    ? "On-site at Otaniemi"
                    : "Remote Meeting"}
                </strong>
              </p>
              <p className="text-sm mb-2">
                <span className="text-gray-600">Duration:</span>{" "}
                <strong>1 hour</strong>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">
                  Confirmation sent to:
                </span>{" "}
                <strong>
                  example@email.com and +358 40 123 4567
                </strong>
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              A reminder about this meeting will be sent to your
              phone number and email.
            </p>
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => setIsBooked(false)}
            >
              Cancel Appointment
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="mb-2">Book an Appointment</h1>
          <p className="text-gray-600">
            Schedule a 1-hour consultation with our business
            advisor
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Meeting Type */}
            <Card className="p-6">
              <h3 className="mb-4">Meeting Type</h3>
              <RadioGroup
                value={meetingType}
                onValueChange={(value) =>
                  setMeetingType(value as MeetingType)
                }
              >
                <div className="space-y-3">
                  <div
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      meetingType === "remote"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setMeetingType("remote")}
                  >
                    <RadioGroupItem
                      value="remote"
                      id="remote"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="remote"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Video className="w-5 h-5 text-indigo-600" />
                        <span>Remote Meeting</span>
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Join via video call from anywhere
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      meetingType === "onsite"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setMeetingType("onsite")}
                  >
                    <RadioGroupItem
                      value="onsite"
                      id="onsite"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="onsite"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        <span>On-site at Otaniemi</span>
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Meet in person at our Otaniemi office
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  All meetings are scheduled for 1 hour
                </p>
              </div>
            </Card>

            {/* Date Selection */}
            <Card className="p-6">
              <h3 className="mb-4">Select Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) =>
                  date <
                  new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Time Selection */}
            <Card className="p-6">
              <h3 className="mb-4">Select Time</h3>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={
                      selectedTime === time
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedTime === time
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : ""
                    }
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Additional Information */}
            <Card className="p-6">
              <h3 className="mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">
                    Additional Notes (Optional)
                  </Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
                    rows={3}
                    placeholder="Any specific topics you'd like to discuss?"
                  />
                </div>
              </div>
            </Card>

            {/* Business Plan Upload */}
            <Card className="p-6">
              <h3 className="mb-4">Upload Business Plan</h3>
              <div className="space-y-2">
                <Label htmlFor="business-plan">
                  Business Plan (Optional)
                </Label>
                <input
                  id="business-plan"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) =>
                    setUploadedFile(e.target.files?.[0] || null)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {uploadedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {uploadedFile.name} uploaded
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX
                </p>
              </div>
            </Card>

            {/* Book Button */}
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}