import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db.js';
import { ShoppingListItemModel } from './models/ShoppingListItem.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Email');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const userId = req.headers['x-user-email'] as string;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized. X-User-Email header is required.' });
    }

    try {
        await connectDB();

        // GET /api/shopping-list - fetch all items for user
        if (req.method === 'GET') {
            const items = await ShoppingListItemModel.find({ userId }).sort({ createdAt: -1 }).lean();
            return res.status(200).json(items);
        }

        // POST /api/shopping-list - add new item
        if (req.method === 'POST') {
            const body = req.body as Omit<import('../api/models/ShoppingListItem.js').IShoppingListItem, 'userId'>;
            const item = await ShoppingListItemModel.create({ ...body, userId });
            return res.status(201).json(item);
        }

        // PUT /api/shopping-list?id=<id> - update item
        if (req.method === 'PUT' && req.query.id) {
            const item = await ShoppingListItemModel.findOneAndUpdate(
                { _id: req.query.id, userId },
                req.body,
                { new: true, runValidators: true }
            );
            if (!item) {
                return res.status(404).json({ error: 'Item not found.' });
            }
            return res.status(200).json(item);
        }

        // DELETE /api/shopping-list?id=<id> - delete item
        if (req.method === 'DELETE' && req.query.id) {
            const item = await ShoppingListItemModel.findOneAndDelete({ _id: req.query.id, userId });
            if (!item) {
                return res.status(404).json({ error: 'Item not found.' });
            }
            return res.status(200).json({ message: 'Item deleted successfully.' });
        }

        return res.status(405).json({ error: 'Method not allowed.' });
    } catch (error) {
        console.error('[api/shopping-list] Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
