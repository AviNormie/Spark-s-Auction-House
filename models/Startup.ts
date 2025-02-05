import { Schema, model, models, Document, Types } from "mongoose";
import Counter from "./Counter";

export interface IStartup extends Document {
  _id: Types.ObjectId; // Explicitly add this to represent MongoDB's object ID
  startup_id: number;
  name: string;
  description: string;
  valuation: number;
  highest_bid: number;
  owner_team?: Types.ObjectId;
  currentBidAmount: number;
  industry: string;
  problem_it_solves: string;
  businessModel: string;
  funding_companies: string[];
  bid_session: boolean;
}

const StartupSchema = new Schema<IStartup>(
  {
    startup_id: { type: Number, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    valuation: { type: Number },
    highest_bid: { type: Number, default: 0 },
    owner_team: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    currentBidAmount: { type: Number, default: 0 },
    industry: { type: String },
    problem_it_solves: { type: String },
    businessModel: { type: String },
    funding_companies: { type: [String] },
    bid_session: { type:Boolean, default: false}
  },
  { timestamps: true }
);

StartupSchema.pre("save", async function (next) {
  if (!this.startup_id) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "startup_id" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );
    this.startup_id = counter.seq;
  }
  next();
});

export default models.Startup || model<IStartup>("Startup", StartupSchema);
