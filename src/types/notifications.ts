export type NotificationsCountUnreadEnvelope = {
  data: number;
};

// ── Server DTOs (POST /notif-portal/v1/notifications/search) ───────────────────

export type NotificationTypeDto = {
  id: number;
  name: string;
  active: boolean;
};

export type NotificationDto = {
  id: number;
  createdDate: string;
  modifiedDate: string;
  user: { id: number; name: string };
  read: boolean;
  /** enforcement application id the notification points at */
  appId: number;
  /** case reg number, e.g. "A23022853" */
  regnumber: string;
  notifType: NotificationTypeDto;
  /** HTML body, e.g. "<pre>…</pre>" */
  notifText: string;
};

export type NotificationsSearchEnvelope = {
  data: NotificationDto[];
  page: {
    totalRecords: number;
    totalPages: number;
    size: number;
    number: number;
  };
};

/** Request body for the search endpoint (`ApiReq<…>` shape). */
export type NotificationsSearchRequest = {
  data: {
    regnumber?: string;
    /** YYYY-MM-DD */
    createdDateFrom?: string;
    createdDateTo?: string;
  };
  page: { number: number; size: number };
  sort?: { property: string; direction: "ASC" | "DESC" }[];
};

// ── UI model ───────────────────────────────────────────────────────────────

/** Read-state filter segments shown above the feed. */
export type NotificationFilterValue = "all" | "read" | "unread";

export type AppNotification = {
  id: number;
  /** headline — mapped from `notifType.name` */
  title: string;
  /** related case number rendered as `#A23022853` */
  caseNumber: string;
  /** enforcement application id, for navigating to the case */
  appId: number;
  /** preview text — `notifText` with its HTML stripped */
  body: string;
  /** formatted date shown on the right, e.g. "20.08.26" */
  date: string;
  /** unread rows are emphasised (bold title, stronger border) */
  isRead: boolean;
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
