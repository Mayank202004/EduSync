import crypto from 'crypto';

export const generateMeetingId = () => {
  return crypto.randomBytes(9).toString("base64url");
};
