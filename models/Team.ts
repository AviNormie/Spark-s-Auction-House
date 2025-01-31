import { Schema, model, models, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface IMember {
  name: string;
  enrollmentNumber: string;
}

export interface ITeam extends Document {
  team_id: number;
  team_name: string;
  password: string;
  members: IMember[];
  credits: number;
  purchased_startups: Types.ObjectId[];
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const MemberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true },
    enrollmentNumber: { type: String, required: true },
  },
  { _id: false }
);

const TeamSchema = new Schema<ITeam>(
  {
    team_id: { type: Number, unique: true, required: true },
    team_name: { type: String, required: true },
    password: { type: String, required: true, select: false }, // Password field (hidden in queries)
    members: { type: [MemberSchema], required: true },
    credits: { type: Number, default: 5000 },
    purchased_startups: [{ type: Schema.Types.ObjectId, ref: "Startup" }],
  },
  { timestamps: true }
);

// 🔹 Hash password before saving
TeamSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Method to compare password during login
TeamSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default models.Team || model<ITeam>("Team", TeamSchema);
