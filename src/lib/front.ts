/**
 * Front channel submission utility
 *
 * Handles server-side submission of form data to Front channels,
 * simulating browser form submissions. Supports both simple form data
 * and multipart uploads with files.
 */

export class FrontChannelError extends Error {
  errorCode: string;

  constructor(message: string, errorCode: string) {
    super(message);
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, FrontChannelError);
    }
  }
}

/**
 * Sends form data to a Front channel URL using multipart/form-data.
 * Works with both simple forms and forms with file uploads.
 *
 * @param channelUrl - The Front channel URL to submit to
 * @param formData - The form data to submit (can include File objects)
 * @param referer - The Referer header value (page URL where form was submitted)
 * @returns Promise with redirect URL on success
 * @throws {FrontChannelError} When channel submission fails
 *
 * @example
 * // Simple form data
 * await sendToFrontChannel(
 *   'https://webhook.frontapp.com/forms/123',
 *   {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     message: 'Hello'
 *   },
 *   'https://www.datocms.com/contact'
 * );
 *
 * @example
 * // Form with file uploads
 * await sendToFrontChannel(
 *   'https://webhook.frontapp.com/forms/123',
 *   {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     uploads: [file1, file2]
 *   },
 *   'https://www.datocms.com/support'
 * );
 */
export async function sendToFrontChannel(
  channelUrl: string,
  formData: Record<string, any>,
  referer: string,
): Promise<string> {
  try {
    // Build FormData for multipart/form-data submission
    const form = new FormData();

    for (const [key, value] of Object.entries(formData)) {
      if (Array.isArray(value)) {
        // Append each item in the array
        value.forEach((v) => {
          if (v !== undefined && v !== null) {
            form.append(key, v);
          }
        });
      } else if (value !== undefined && value !== null) {
        // Append single value
        form.append(key, value);
      }
    }

    // Submit to Front channel
    // Note: Don't set Content-Type header - fetch will set it automatically with boundary
    const response = await fetch(channelUrl, {
      method: 'POST',
      headers: {
        Referer: referer,
      },
      body: form,
      redirect: 'manual', // Don't follow redirects automatically
    });

    // Check Location header to determine success/failure
    // Front redirects to /thanks on success, /error on failure
    const location = response.headers.get('Location');

    if (!location) {
      // No redirect means something unexpected happened
      throw new FrontChannelError(
        'Channel did not respond with expected redirect',
        'no_location_header',
      );
    }

    const success = location.includes('/thanks');

    if (!success) {
      // Parse error code and message from Location URL
      // Example: https://www.datocms.com/contact/error?code=captcha_failed&message=Could%20not%20get%20CAPTCHA%20validation.
      try {
        const url = new URL(location);
        const errorCode = url.searchParams.get('code') || 'unknown_error';
        const errorMessage = url.searchParams.get('message') || 'Channel submission failed';

        throw new FrontChannelError(errorMessage, errorCode);
      } catch (e) {
        if (e instanceof FrontChannelError) {
          throw e;
        }
        throw new FrontChannelError('Channel submission failed', 'parse_error');
      }
    }

    // Extract pathname from the full URL
    // Example: https://www.datocms.com/contact/thanks -> /contact/thanks
    let redirectUrl: string;
    try {
      const url = new URL(location);
      redirectUrl = url.pathname;
    } catch (e) {
      // If parsing fails, use location as-is (might already be a path)
      redirectUrl = location;
    }

    return redirectUrl;
  } catch (error) {
    // Re-throw FrontChannelError as-is
    if (error instanceof FrontChannelError) {
      throw error;
    }

    // Handle network errors, timeouts, etc.
    const message =
      error instanceof Error
        ? `Failed to submit to channel: ${error.message}`
        : 'Failed to submit to channel';

    throw new FrontChannelError(message, 'network_error');
  }
}
