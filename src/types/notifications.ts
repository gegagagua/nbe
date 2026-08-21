export type NotificationsCountUnreadEnvelope = {
  data: number;
};

/** Kind of notification, as sent by the backend. */
export type NotificationCategory = "newCase" | "statusChange";

/** Read-state filter segments shown above the feed. */
export type NotificationFilterValue = "all" | "read" | "unread";

export type AppNotification = {
  id: number;
  /** headline, e.g. "ახალი სააღსრულებო საქმე" */
  title: string;
  /** related case number rendered as `#A24006642` */
  caseNumber: string;
  /** preview text, truncated to a single line on the card */
  body: string;
  /** formatted date shown on the right, e.g. "18.03.24" */
  date: string;
  /** unread rows are emphasised (bold title, stronger border) */
  isRead: boolean;
  category: NotificationCategory;
};

export type NotificationsPage = {
  data: AppNotification[];
  totalPages: number;
  totalRecords: number;
};

/** Bulk-select presets offered by the toolbar checkbox menu. */
export type NotificationSelectPreset = "all" | "read" | "unread" | "none";

export type NotificationsSearchFilters = {
  readState?: NotificationFilterValue;
};
