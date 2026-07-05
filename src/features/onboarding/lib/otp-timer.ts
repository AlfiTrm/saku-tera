export function createOtpExpiresAt(expiresInSeconds: number) {
  return new Date(Date.now() + expiresInSeconds * 1000).toISOString();
}

export function getRemainingOtpSeconds(expiresAt: string) {
  if (!expiresAt) {
    return 0;
  }

  const expiresAtTimestamp = new Date(expiresAt).getTime();

  if (Number.isNaN(expiresAtTimestamp)) {
    return 0;
  }

  return Math.max(0, Math.ceil((expiresAtTimestamp - Date.now()) / 1000));
}

export function formatOtpCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
