export type AuthChannel = "sms" | "whatsapp";

export type OtpDeliveryMethod = "sms" | "whatsapp";

export type OtpRequestPayload = {
  channel: AuthChannel;
  countryCode: string;
  fullName: string;
  phoneNumber: string;
};

export type OtpRequestResult = {
  deliveryMethod: OtpDeliveryMethod;
  expiresInSeconds: number;
  maskedDestination: string;
  requestId: string;
};

export type OtpVerificationPayload = {
  otpCode: string;
  requestId: string;
};

export type AuthSession = {
  accessToken: string;
  expiresAt?: string;
  refreshToken?: string;
  userId?: string;
};

export type OtpVerificationResult = {
  isNewUser: boolean;
  session: AuthSession;
};

export type CheckPhonePayload = {
  countryCode?: string;
  phoneNumber: string;
};

export type CheckPhoneResult = {
  hasPin: boolean;
  message: string;
  sessionToken?: string;
};

export type SetPinPayload = {
  pin: string;
  sessionToken: string;
};

export type LoginPayload = {
  countryCode?: string;
  phoneNumber: string;
  pin: string;
};
