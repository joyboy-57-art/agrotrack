import Notification from '../models/notificationModel.js';

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.getByUserId(req.user.id);
        const unreadCount = await Notification.getUnreadCount(req.user.id);
        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.markAsRead(id, req.user.id);
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSystemNotification = async (userId, message, type) => {
    try {
        await Notification.create(userId, message, type);
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};
