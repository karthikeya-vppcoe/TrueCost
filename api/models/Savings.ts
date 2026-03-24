import mongoose, { Document, Schema } from 'mongoose';

interface CheckoutActivity {
    id: string;
    date: string;
    merchant: string;
    items: number;
    savings: number;
}

export interface ISavings extends Document {
    userId: string;
    totalSavings: number;
    averageSavings: number;
    risksDetected: number;
    savingsGoal: number;
    activity: CheckoutActivity[];
    updatedAt: Date;
}

const CheckoutActivitySchema = new Schema<CheckoutActivity>(
    {
        id: { type: String, required: true },
        date: { type: String, required: true },
        merchant: { type: String, required: true },
        items: { type: Number, required: true },
        savings: { type: Number, required: true },
    },
    { _id: false }
);

const SavingsSchema = new Schema<ISavings>(
    {
        userId: { type: String, required: true, unique: true, index: true },
        totalSavings: { type: Number, default: 0 },
        averageSavings: { type: Number, default: 0 },
        risksDetected: { type: Number, default: 0 },
        savingsGoal: { type: Number, default: 25000 },
        activity: { type: [CheckoutActivitySchema], default: [] },
    },
    { timestamps: true }
);

export const SavingsModel =
    mongoose.models.Savings || mongoose.model<ISavings>('Savings', SavingsSchema);
