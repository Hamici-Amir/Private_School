import { create } from 'zustand'

import type { TranslationKey } from '@/lib/i18n'

export type NotificationKind = 'student' | 'payment' | 'attendance' | 'system'

export interface AppNotification {
  id: string
  kind: NotificationKind
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  /** Epoch milliseconds since mock moment. */
  createdAt: number
  read: boolean
}

const MOCK_NOW = Date.now()
const MINUTE = 60_000

/** Seed notifications for the notification center (mock data). */
const SEED: AppNotification[] = [
  {
    id: 'n-1',
    kind: 'student',
    titleKey: 'notifications.items.newStudent.title',
    descriptionKey: 'notifications.items.newStudent.description',
    createdAt: MOCK_NOW - 12 * MINUTE,
    read: false,
  },
  {
    id: 'n-2',
    kind: 'payment',
    titleKey: 'notifications.items.paymentDue.title',
    descriptionKey: 'notifications.items.paymentDue.description',
    createdAt: MOCK_NOW - 3 * 60 * MINUTE,
    read: false,
  },
  {
    id: 'n-3',
    kind: 'attendance',
    titleKey: 'notifications.items.attendanceAlert.title',
    descriptionKey: 'notifications.items.attendanceAlert.description',
    createdAt: MOCK_NOW - 26 * 60 * MINUTE,
    read: true,
  },
  {
    id: 'n-4',
    kind: 'system',
    titleKey: 'notifications.items.systemUpdate.title',
    descriptionKey: 'notifications.items.systemUpdate.description',
    createdAt: MOCK_NOW - 2 * 24 * 60 * MINUTE,
    read: true,
  },
]

interface NotificationsState {
  notifications: AppNotification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  reset: () => void
}

const countUnread = (notifications: AppNotification[]): number =>
  notifications.filter((notification) => !notification.read).length

/** Notification center state with mock messages and read tracking. */
export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: SEED,
  unreadCount: countUnread(SEED),
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      )
      return { notifications, unreadCount: countUnread(notifications) }
    }),
  markAllAsRead: () =>
    set((state) => {
      const notifications = state.notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
      return { notifications, unreadCount: 0 }
    }),
  reset: () => set({ notifications: SEED, unreadCount: countUnread(SEED) }),
}))
