import mongoose, { Schema, model, Document, Types } from "mongoose";
import { BusinessDocument } from "./businessmodel";
import { AppointmentDocument } from "./appointmentmodel";

export interface EspooUserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  dob?: string;
  email?: string;
  name: string;
  number?: string;
  oauthProvider?: string;
  business: Types.ObjectId[] | BusinessDocument[];
  appointments?: Types.ObjectId[] | AppointmentDocument[];
}

const userSchema = new Schema<EspooUserDocument>({
  name: { type: String, required: [true, "Name is required"] },
  username: { type: String, unique: true, sparse: true },
  email: {
    type: String,
    unique: true,
    required: function () {
      return !this.oauthProvider;
    },
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email is invalid"],
  },
  dob: { type: String },
  number: { type: String },
  oauthProvider: { type: String },
  business: [{ type: Schema.Types.ObjectId, ref: "Business" }],
  appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
}, { timestamps: true });

// JSON transform
userSchema.set("toJSON", {
  transform: (doc: EspooUserDocument, ret: Partial<EspooUserDocument>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});

const EspooUser = mongoose.models?.EspooUser || model<EspooUserDocument>("EspooUser", userSchema);
export default EspooUser;
