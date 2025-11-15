import mongoose, { Schema, model, Document, Types } from "mongoose";
import { EspooUserDocument } from "./usermodel";
import { BusinessDocument } from "./businessmodel";

export interface AppointmentDocument extends Document {
  _id: mongoose.Types.ObjectId;
  business: Types.ObjectId | BusinessDocument;
  user: Types.ObjectId | EspooUserDocument;
  date: Date;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
}

const appointmentSchema = new Schema<AppointmentDocument>({
  business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  user: { type: Schema.Types.ObjectId, ref: "EspooUser", required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
}, { timestamps: true });

const Appointment = mongoose.models?.Appointment || model<AppointmentDocument>("Appointment", appointmentSchema);
export default Appointment;
