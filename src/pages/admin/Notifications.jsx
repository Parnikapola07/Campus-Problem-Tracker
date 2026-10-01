import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { NotificationItem } from '../../components/NotificationItem';
import { EmptyState } from '../../components/EmptyState';
import { Bell, CheckCheck } from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await apiService.getAdminNotifications();
      if (res.success) setNotifications(res.notifications || []);
    } catch (err) {
      console.error('Failed to load admin notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await handleMarkRead(n.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <PageHeader
        title="Admin Notifications & Escalation Alerts"
        subtitle="Operational logs, critical problem reports, and system notifications."
        action={
          unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs"
            >
              <CheckCheck className="w-4 h-4 text-indigo-600" />
              <span>Mark All as Read</span>
            </button>
          )
        }
      />

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up!"
          description="There are no active administrative notifications."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};
