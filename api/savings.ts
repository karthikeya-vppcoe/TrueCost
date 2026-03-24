import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db.js';
import { SavingsModel } from './models/Savings.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

        // GET /api/savings - load savings & activity for user
        if (req.method === 'GET') {
            const savings = await SavingsModel.findOne({ userId }).lean();
            if (!savings) {
                // Return default savings record if none exists yet
                return res.status(200).json({
                    userId,
                    totalSavings: 0,
                    averageSavings: 0,
                    risksDetected: 0,
                    savingsGoal: 25000,
                    activity: [],
                });
            }
            return res.status(200).json(savings);
        }

        // POST /api/savings - save/update savings & activity for user
        if (req.method === 'POST') {
            const body = req.body as {
                totalSavings?: number;
                averageSavings?: number;
                risksDetected?: number;
                savingsGoal?: number;
                activity?: unknown[];
            };

            const savings = await SavingsModel.findOneAndUpdate(
                { userId },
                { $set: { ...body, userId } },
                { new: true, upsert: true, runValidators: true }
            );
            return res.status(200).json(savings);
        }

        return res.status(405).json({ error: 'Method not allowed.' });
    } catch (error) {
        console.error('[api/savings] Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
