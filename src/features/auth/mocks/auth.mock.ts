export const otpRequestResponseMock = {
  data: {
    delivery_method: "whatsapp",
    expires_in_seconds: 300,
    masked_destination: "+62 812-***-7890",
    request_id: "otp_req_demo_01",
  },
} as const;

export const otpVerificationResponseMock = {
  data: {
    is_new_user: true,
    session: {
      access_token: "demo_access_token",
      expires_at: "2026-06-30T23:59:59.000Z",
      refresh_token: "demo_refresh_token",
      user_id: "user_demo_01",
    },
  },
} as const;
