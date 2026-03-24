import mongoose, { Document, Schema } from 'mongoose';

interface PriceHistoryPoint {
    date: string;
    price: number;
    merchant: string;
}

export interface IShoppingListItem extends Document {
    userId: string;
    name: string;
    category: string;
    targetPrice: number;
    currentPrice: number;
    merchant: string;
    addedDate: string;
    notes?: string;
    priority: 'high' | 'medium' | 'low';
    priceHistory: PriceHistoryPoint[];
    priceAlert: boolean;
}

const PriceHistorySchema = new Schema<PriceHistoryPoint>(
    {
        date: { type: String, required: true },
        price: { type: Number, required: true },
        merchant: { type: String, required: true },
    },
    { _id: false }
);

const ShoppingListItemSchema = new Schema<IShoppingListItem>(
    {
        userId: { type: String, required: true, index: true },
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true },
        targetPrice: { type: Number, required: true },
        currentPrice: { type: Number, required: true },
        merchant: { type: String, required: true },
        addedDate: { type: String, required: true },
        notes: { type: String },
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        priceHistory: { type: [PriceHistorySchema], default: [] },
        priceAlert: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const ShoppingListItemModel =
    mongoose.models.ShoppingListItem ||
    mongoose.model<IShoppingListItem>('ShoppingListItem', ShoppingListItemSchema);
