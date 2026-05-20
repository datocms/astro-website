import { createHash } from 'node:crypto';
import { LINKEDIN_ACCESS_TOKEN } from 'astro:env/server';

export async function trackConversion(conversionRuleId: string, email: string): Promise<void> {
  const emailHash = createHash('sha256').update(email.toLowerCase().trim()).digest('hex');

  const response = await fetch('https://api.linkedin.com/rest/conversionEvents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': '202506',
      'X-RestLi-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      conversion: `urn:lla:llaPartnerConversion:${conversionRuleId}`,
      conversionHappenedAt: Date.now(),
      eventId: `${conversionRuleId}-${emailHash.slice(0, 16)}-${Date.now()}`,
      user: {
        userIds: [{ idType: 'SHA256_EMAIL', idValue: emailHash }],
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`LinkedIn CAPI ${response.status}: ${await response.text()}`);
  }
}
