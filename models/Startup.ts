import { Schema, model, models, Document, Types } from "mongoose";

export interface IStartup extends Document {
  startup_id: number;
  name: string;
  description: string;
  valuation: number;
  highest_bid: number;
  winning_team?: Types.ObjectId;
  currentBidAmount: number;
}

const StartupSchema = new Schema<IStartup>(
  {
    startup_id: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    valuation: { type: Number, required: true },
    highest_bid: { type: Number, default: 0 },
    winning_team: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    currentBidAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Startup || model<IStartup>("Startup", StartupSchema);
