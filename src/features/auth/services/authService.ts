import type {
  CheckPhonePayload,
  CheckPhoneResult,
  LoginPayload,
  OtpRequestPayload,
  OtpRequestResult,
  OtpVerificationPayload,
  OtpVerificationResult,
  SetPinPayload,
} from "@/src/features/auth/types/auth";
import { apiRequest, normalizePhoneNumber } from "@/src/shared/lib/api";

type RegisterResponseData = {
  message: string;
  phone_masked: string;
  session_token: string;
};

type VerifyOtpResponseData = {
  message: string;
  token: string;
};

type CheckPhoneResponseData = {
  has_pin: boolean;
  session_token?: string;
};

type SetPinResponseData = {
  message: string;
  token: string;
};

type LoginResponseData = {
  message: string;
  token: string;
};

export async function requestOtp(payload: OtpRequestPayload): Promise<OtpRequestResult> {
  const response = await apiRequest<RegisterResponseData>("/auth/register", {
    body: JSON.stringify({
      full_name: payload.fullName,
      phone_number: normalizePhoneNumber(payload.phoneNumber, payload.countryCode),
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return {
    deliveryMethod: payload.channel,
    expiresInSeconds: 300,
    maskedDestination: response.data.phone_masked,
    requestId: response.data.session_token,
  };
}

export async function verifyOtp(
  payload: OtpVerificationPayload,
): Promise<OtpVerificationResult> {
  const response = await apiRequest<VerifyOtpResponseData>("/auth/verify-otp", {
    body: JSON.stringify({
      code: payload.otpCode,
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Session-Token": payload.requestId,
    },
    method: "POST",
  });

  return {
    isNewUser: true,
    session: {
      accessToken: response.data.token,
    },
  };
}

export async function checkPhone(
  payload: CheckPhonePayload,
): Promise<CheckPhoneResult> {
  const response = await apiRequest<CheckPhoneResponseData>("/auth/check-phone", {
    body: JSON.stringify({
      phone_number: normalizePhoneNumber(
        payload.phoneNumber,
        payload.countryCode || "+62",
      ),
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return {
    hasPin: response.data.has_pin,
    message: response.message,
    sessionToken: response.data.session_token,
  };
}

export async function setPin(payload: SetPinPayload) {
  const response = await apiRequest<SetPinResponseData>("/auth/set-pin", {
    body: JSON.stringify({
      pin: payload.pin,
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Session-Token": payload.sessionToken,
    },
    method: "POST",
  });

  return {
    message: response.message,
    session: {
      accessToken: response.data.token,
    },
  };
}

export async function loginWithPin(payload: LoginPayload) {
  const response = await apiRequest<LoginResponseData>("/auth/login", {
    body: JSON.stringify({
      phone_number: normalizePhoneNumber(
        payload.phoneNumber,
        payload.countryCode || "+62",
      ),
      pin: payload.pin,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return {
    message: response.message,
    session: {
      accessToken: response.data.token,
    },
  };
}
