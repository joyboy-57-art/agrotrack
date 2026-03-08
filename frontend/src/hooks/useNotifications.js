import { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './useAuth';

export const useNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every 30 seconds for new notifications
        const intervalId = setInterval(fetchNotifications, 30000);
        return () => clearInterval(intervalId);
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(notif => notif.id === id ? { ...notif, is_read: true } : notif)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    return { notifications, unreadCount, loading, markAsRead, refreshNotifications: fetchNotifications };
};
