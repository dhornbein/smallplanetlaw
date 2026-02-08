import type { APIRoute } from 'astro';
// @ts-expect-error - No type definitions available for @mailchimp/mailchimp_marketing
import mailchimp from '@mailchimp/mailchimp_marketing';

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

    // Add subscriber to Mailchimp
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: 'pending', // Double opt-in
      merge_fields: {
        FNAME: firstName || '',
      },
    });

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
