import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { connectDB } from './lib/db.js';
import { UserModel } from './models/User.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await connectDB();

        // POST /api/users?action=register
        if (req.method === 'POST' && req.query.action === 'register') {
            const { email, password, fullName } = req.body as {
                email: string;
                password: string;
                fullName: string;
            };

            if (!email || !password || !fullName) {
                return res.status(400).json({ error: 'Email, password, and full name are required.' });
            }

            const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ error: 'User with this email already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await UserModel.create({
                name: fullName,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'user',
            });

            return res.status(201).json({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }

        // POST /api/users?action=login
        if (req.method === 'POST' && req.query.action === 'login') {
            const { email, password } = req.body as { email: string; password: string };

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }

            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            return res.status(200).json({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }

        // GET /api/users?email=<email>
        if (req.method === 'GET' && req.query.email) {
            const user = await UserModel.findOne({ email: (req.query.email as string).toLowerCase() });
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            return res.status(200).json({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }

        return res.status(405).json({ error: 'Method not allowed.' });
    } catch (error) {
        console.error('[api/users] Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
