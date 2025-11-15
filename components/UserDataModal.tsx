import { useState, useEffect, startTransition } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { EspooUser } from "@/app/types";
import { Calendar } from "./ui/calendar";

interface UserDataModalProps {
  user: EspooUser; // session user
  onComplete: () => void;
}

export default function UserDataModal({ user, onComplete }: UserDataModalProps) {
  const [mounted, setMounted] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [phone, setPhone] = useState("");
  const [hometown, setHometown] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  useEffect(() => {
    const fetchMissingFields = async () => {
      const res = await fetch("/api/user/missing", {
        headers: { "x-user-id": user.id },
      });
      const data = await res.json();
      setMissingFields(data.missingFields);

      if (data.missingFields.includes("dob") && user.dob) setDob(new Date(user.dob));
      if (data.missingFields.includes("number") && user.number) setPhone(user.number);
      if (data.missingFields.includes("hometown") && user.hometown) setHometown(user.hometown);
    };
    fetchMissingFields();
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);

    type UserUpdatePayload = {
      dob?: string | null;
      number?: string | null;
      hometown?: string | null;
    };
    const userPayload: UserUpdatePayload = {};
    if (missingFields.includes("dob")) userPayload.dob = dob ? dob.toISOString() : null;
    if (missingFields.includes("number")) userPayload.number = phone || null;
    if (missingFields.includes("hometown")) userPayload.hometown = hometown || null;

    if (Object.keys(userPayload).length > 0) {
      const userRes = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });
      if (!userRes.ok) return;
    }

    if (missingFields.includes("business.name") && businessName &&
        missingFields.includes("business.description") && businessDescription) {
      const businessRes = await fetch("/api/business/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: businessName, description: businessDescription }),
      });
      if (!businessRes.ok) return;
    }

    onComplete();
  };

  if (!mounted || missingFields.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full p-8">
        <h1 className="mb-4">Additional Information Required</h1>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {missingFields.includes("dob") && (
              <div>
                <Label>Date of Birth</Label>
                <Popover>
  <PopoverTrigger asChild>
    {/* ---- Trigger button – gray border, full width, left-aligned ---- */}
    <button
      className={`
        flex w-full items-center justify-start gap-2
        rounded-md border border-gray-300 bg-background
        px-3 py-2 text-sm text-muted-foreground mt-2
        transition-colors hover:bg-accent hover:text-accent-foreground
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
      `}
    >
      <CalendarIcon className="h-4 w-4" />
      {dob ? dob.toLocaleDateString() : "Select date"}
    </button>
  </PopoverTrigger>

  {/* ---- Calendar popover – scrollable, gray border ---- */}
  <PopoverContent className="w-auto p-0" align="start">
    <div className="max-h-[340px] overflow-y-auto p-3">
      <Calendar
        mode="single"
        selected={dob}
        onSelect={setDob}
        startMonth={new Date(1900, 0)}
        endMonth={new Date()}
        captionLayout="dropdown"

        classNames={{
          day: "h-9 w-9 text-sm flex items-center justify-center rounded-md cursor-pointer",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
        }}

        /* ---- Calendar itself gets a gray border ---- */
        className="rounded-md border border-gray-300 shadow-sm"
      />
    </div>
  </PopoverContent>
</Popover>
              </div>
            )}
            {missingFields.includes("number") && (
              <div>
                <Label>Phone Number</Label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                />
              </div>
            )}
          </div>

          {missingFields.includes("hometown") && (
            <div>
              <Label>Home Town</Label>
              <input
                type="text"
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mt-1"
              />
            </div>
          )}

          {(missingFields.includes("business.name") || missingFields.includes("business.description")) && (
            <div className="grid md:grid-cols-2 gap-4">
              {missingFields.includes("business.name") && (
                <div>
                  <Label>Business Name</Label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                  />
                </div>
              )}
              {missingFields.includes("business.description") && (
                <div>
                  <Label>Business Description</Label>
                  <textarea
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <Button className="w-full cursor-pointer" disabled={loading} onClick={handleSubmit}>
            Continue
          </Button>
        </div>
      </Card>
    </div>,
    document.body
  );
}
