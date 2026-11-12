import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockRegisterPushToken = jest.fn<(p: unknown) => Promise<void>>();
const mockGetExpoToken = jest.fn<() => Promise<string | null>>();
const mockGetInstallationId = jest.fn<() => Promise<string>>();
const mockSecureGet = jest.fn<(k: string) => Promise<string | null>>();
const mockSecureSet = jest.fn<(k: string, v: string) => Promise<void>>();
const mockSecureDelete = jest.fn<(k: string) => Promise<void>>();

jest.mock("@/api/notifications", () => ({
  registerPushToken: (p: unknown) => mockRegisterPushToken(p),
}));
jest.mock("@/lib/push-notifications", () => ({
  registerForPushNotificationsAsync: () => mockGetExpoToken(),
}));
jest.mock("@/lib/passkey-storage", () => ({
  getOrCreateInstallationId: () => mockGetInstallationId(),
}));
jest.mock("expo-secure-store", () => ({
  getItemAsync: (k: string) => mockSecureGet(k),
  setItemAsync: (k: string, v: string) => mockSecureSet(k, v),
  deleteItemAsync: (k: string) => mockSecureDelete(k),
}));
// The suite runs in a plain node environment (see jest.config.js), so the real
// react-native package can't be imported — only Platform is needed here.
jest.mock("react-native", () => ({ Platform: { OS: "ios" } }));

import { PushTokenSyncedStorageKey } from "@/constants/api";
import {
  clearSyncedPushToken,
  syncPushTokenToBackend,
} from "@/lib/push-token-sync";

const Token = "ExponentPushToken[test-abc-123]";

beforeEach(() => {
  jest.clearAllMocks();
  mockGetExpoToken.mockResolvedValue(Token);
  mockGetInstallationId.mockResolvedValue("install-uuid-1");
  mockSecureGet.mockResolvedValue(null);
  mockSecureSet.mockResolvedValue();
  mockSecureDelete.mockResolvedValue();
});

describe("syncPushTokenToBackend", () => {
  it("registers the Expo token with the backend and remembers it", async () => {
    await syncPushTokenToBackend();

    expect(mockRegisterPushToken).toHaveBeenCalledWith({
      token: Token,
      deviceId: "install-uuid-1",
      platform: "ios",
    });
    expect(mockSecureSet).toHaveBeenCalledWith(PushTokenSyncedStorageKey, Token);
  });

  it("skips the backend call when the same token is already registered", async () => {
    mockSecureGet.mockResolvedValue(Token);

    await syncPushTokenToBackend();

    expect(mockRegisterPushToken).not.toHaveBeenCalled();
  });

  it("re-registers when the device token has rotated", async () => {
    mockSecureGet.mockResolvedValue("ExponentPushToken[old]");

    await syncPushTokenToBackend();

    expect(mockRegisterPushToken).toHaveBeenCalledTimes(1);
  });

  it("does nothing when no push token is available (simulator / permission denied)", async () => {
    mockGetExpoToken.mockResolvedValue(null);

    await syncPushTokenToBackend();

    expect(mockRegisterPushToken).not.toHaveBeenCalled();
    expect(mockSecureSet).not.toHaveBeenCalled();
  });

  it("does not remember the token when the backend call fails, so the next mount retries", async () => {
    mockRegisterPushToken.mockRejectedValueOnce(new Error("503"));

    await syncPushTokenToBackend();
    expect(mockSecureSet).not.toHaveBeenCalled();

    mockRegisterPushToken.mockResolvedValueOnce();
    await syncPushTokenToBackend();
    expect(mockRegisterPushToken).toHaveBeenCalledTimes(2);
    expect(mockSecureSet).toHaveBeenCalledWith(PushTokenSyncedStorageKey, Token);
  });
});

describe("clearSyncedPushToken", () => {
  it("drops the remembered token so the next sign-in re-registers", async () => {
    await clearSyncedPushToken();
    expect(mockSecureDelete).toHaveBeenCalledWith(PushTokenSyncedStorageKey);
  });
});
