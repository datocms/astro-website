import { RECAPTCHA_SECRET_KEY } from 'astro:env/server';
import ky from 'ky';

export async function isRecaptchaTokenValid(token: string) {
  const { success } = await ky
    .post<{ success: boolean }>('https://www.google.com/recaptcha/api/siteverify', {
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    })
    .json();
  return success;
}
