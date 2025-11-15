import mongoose, { Schema, model, Document, Types } from "mongoose";
import { EspooUserDocument } from "./usermodel";

export interface BusinessDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  businessId: string;
  managers: Types.ObjectId[] | EspooUserDocument[]; // references EspooUser
  description: string;
}

const businessSchema = new Schema<BusinessDocument>({
  name: { type: String, required: true },
  businessId: { type: String, required: true, unique: true },
  managers: [{ type: Schema.Types.ObjectId, ref: "EspooUser", required: true }],
  description: { type: String, required: true },
}, { timestamps: true });

const Business = mongoose.models?.Business || model<BusinessDocument>("Business", businessSchema);
export default Business;
