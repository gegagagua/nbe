import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  markAllNotificationsRead,
  markNotificationsRead,
} from "@/api/notifications";
import i18n from "@/i18n/i18n";
import { showErrorToast } from "@/lib/show-error-toast";
import { showSuccessToast } from "@/lib/show-success-toast";

/**
 * Marks notifications as read — either a specific set of ids, or the whole
 * feed. Refreshes the list and the header unread badge on success.
 */
export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: { ids: number[] } | { all: true }) =>
      "all" in input
        ? markAllNotificationsRead()
        : markNotificationsRead(input.ids),
    onSuccess: () => {
      showSuccessToast(i18n.t("notifications.markReadSuccess"));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
    onError: (error) => {
      showErrorToast(i18n.t("notifications.markReadError"), error);
    },
  });

  return {
    markRead: (ids: number[]) => mutation.mutate({ ids }),
    markAllRead: () => mutation.mutate({ all: true }),
    isPending: mutation.isPending,
  };
}
