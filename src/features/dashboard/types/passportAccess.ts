export type PassportAccessStatus = "active" | "expiring";

export type PassportAccessEntry = {
  badgeLabel: string;
  badgeTone: PassportAccessStatus;
  expiresText: string;
  icon: string;
  id: string;
  issuedText: string;
  metrics: string[];
  organization: string;
  showActions?: boolean;
};
