import { ApiConfig } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

export async function sendOtp(phone: string): Promise<void> {
  await apiClient.post(ApiConfig.otpSendPath, { data: { phone } });
}

export async function verifyOtp(phone: string, code: string): Promise<void> {
  await apiClient.post(ApiConfig.otpVerifyPath, { data: { phone, code } });
}

export async function resetPassword(phone: string, code: string, newPassword: string): Promise<void> {
  await apiClient.post(ApiConfig.passwordResetPath, {
    data: { phone, code, newPassword },
  });
}
