import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { NotificationItem } from '../../components/NotificationItem';
import { EmptyState } from '../../components/EmptyState';
import { Bell, CheckCheck, Filter } from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL or UNREAD

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await apiService.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
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
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await handleMarkRead(n.id);
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <PageHeader
        title="Notifications Center"
        subtitle="Real-time alerts and progress logs for your reported campus issues."
        action={
          unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-indigo-600" />
              <span>Mark All as Read</span>
            </button>
          )
        }
      />

      {/* Control Tabs */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'UNREAD'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filter === 'UNREAD' ? 'bg-indigo-700 text-white' : 'bg-rose-100 text-rose-700'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredNotifs.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'UNREAD' ? "You're all caught up!" : "No notifications yet"}
          description={
            filter === 'UNREAD'
              ? 'You have read all status updates and alerts.'
              : 'Notifications will appear here when admins update your reported tickets.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map(notif => (
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
