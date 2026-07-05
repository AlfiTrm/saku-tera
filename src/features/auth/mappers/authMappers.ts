import type {
  AuthSession,
  OtpRequestResult,
  OtpVerificationResult,
} from "@/src/features/auth/types/auth";

type OtpRequestResponse = {
  data: {
    delivery_method: "sms" | "whatsapp";
    expires_in_seconds: number;
    masked_destination: string;
    request_id: string;
  };
};

type OtpVerificationResponse = {
  data: {
    is_new_user: boolean;
    session: {
      access_token: string;
      expires_at: string;
      refresh_token: string;
      user_id: string;
    };
  };
};

function mapSession(response: OtpVerificationResponse["data"]["session"]): AuthSession {
  return {
    accessToken: response.access_token,
    expiresAt: response.expires_at,
    refreshToken: response.refresh_token,
    userId: response.user_id,
  };
}

export function mapOtpRequestResult(response: OtpRequestResponse): OtpRequestResult {
  return {
    deliveryMethod: response.data.delivery_method,
    expiresInSeconds: response.data.expires_in_seconds,
    maskedDestination: response.data.masked_destination,
    requestId: response.data.request_id,
  };
}

export function mapOtpVerificationResult(
  response: OtpVerificationResponse,
): OtpVerificationResult {
  return {
    isNewUser: response.data.is_new_user,
    session: mapSession(response.data.session),
  };
}
