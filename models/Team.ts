import { Schema, model, models, Document, Types } from "mongoose";

export interface ITeam extends Document {
  team_id: number;
  team_name: string;
  members: string[];
  credits: number;
  purchased_startups: Types.ObjectId[];
}

const TeamSchema = new Schema<ITeam>(
  {
    team_id: { type: Number, unique: true, required: true },
    team_name: { type: String, required: true },
    members: { type: [String], required: true },
    credits: { type: Number, default: 5000 },
    purchased_startups: [{ type: Schema.Types.ObjectId, ref: "Startup" }],
  },
  { timestamps: true }
);

export default models.Team || model<ITeam>("Team", TeamSchema);
