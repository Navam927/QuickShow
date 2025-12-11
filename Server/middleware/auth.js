import { clerkClient } from '@clerk/express';

export const protectAdmin = async (req, res, next) => {
    try {
        const authData = req.auth ? req.auth() : null;
        const userId = authData?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const user = await clerkClient.users.getUser(userId);
        // check user's role in privateMetadata or publicMetadata
        if (user.privateMetadata?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
