import type { APIRoute } from 'astro';
// @ts-expect-error - No type definitions available for @mailchimp/mailchimp_marketing
import mailchimp from '@mailchimp/mailchimp_marketing';
import { createHash } from 'crypto';

// Mark this endpoint as server-rendered
export const prerender = false;

// Configure Mailchimp
const apiKey = import.meta.env.MAILCHIMP_API_KEY;
const serverPrefix = import.meta.env.MAILCHIMP_SERVER_PREFIX;
const listId = import.meta.env.MAILCHIMP_LIST_ID;

if (apiKey && serverPrefix) {
  mailchimp.setConfig({
    apiKey: apiKey,
    server: serverPrefix,
  });
}

/**
 * Generate MD5 hash of lowercase email for Mailchimp subscriber hash
 */
function subscriberHash(email: string): string {
  return createHash('md5').update(email.toLowerCase()).digest('hex');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate environment variables
    if (!apiKey || !serverPrefix || !listId) {
      console.error('Missing Mailchimp configuration');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Newsletter service is not configured. Please try again later.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const firstName = formData.get('firstName')?.toString();
    const tags = formData.get('tags')?.toString(); // Comma-separated tag names

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please provide a valid email address.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const hash = subscriberHash(email);

    // Use setListMember (PUT/upsert) instead of addListMember (POST)
    // This gracefully handles existing subscribers, previously unsubscribed,
    // and cleaned contacts — avoiding "Member Exists" errors.
    await mailchimp.lists.setListMember(listId, hash, {
      email_address: email,
      status_if_new: 'pending', // Double opt-in for new subscribers
      merge_fields: {
        FNAME: firstName || '',
      },
    });

    // Add tags if provided
    if (tags) {
      const tagList = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      if (tagList.length > 0) {
        await mailchimp.lists.updateListMemberTags(listId, hash, {
          tags: tagList.map((name: string) => ({ name, status: 'active' })),
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Please check your email to confirm your subscription.',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Mailchimp error:', error);

    // Handle specific Mailchimp errors
    if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'This email is already subscribed to our newsletter.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (error.status === 400 && error.response?.body?.title === 'Invalid Resource') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please provide a valid email address.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Generic error
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Something went wrong. Please try again later.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
