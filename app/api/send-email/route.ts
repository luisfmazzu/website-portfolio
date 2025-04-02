import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/app/components/email-template';

// Function to get Resend credentials from environment variables
function getCredentials() {
  // Access environment variables inside a function to ensure they are retrieved at runtime
  const apiKey = process.env.RESEND_API_KEY;
  
  return { apiKey };
}

export async function POST(req: Request) {
  try {
    // Get credentials at runtime
    const { apiKey } = getCredentials();
    
    // Check if we have a valid API key
    if (!apiKey) {
      console.error("Missing Resend API key - email functionality will not work");
      return NextResponse.json(
        { error: 'Resend API key is not configured' },
        { status: 500 }
      );
    }
    
    // Initialize Resend with the API key
    const resend = new Resend(apiKey);
    
    const body = await req.json();
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format the message content with proper line breaks
    const messageContent = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    
    // Enhanced subject line with sender name
    const enhancedSubject = `Portfolio Contact: ${subject} from ${name}`;
    
    // Add timeout for Resend API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      // Send the email through Resend
      const { data, error } = await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['luisfmazzu@gmail.com'],
        subject: enhancedSubject,
        react: EmailTemplate({ message: messageContent }) as React.ReactElement,
      });
      
      clearTimeout(timeoutId);

      if (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
          { error: 'Failed to send email', details: error },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data });
    } catch (sendError: any) {
      clearTimeout(timeoutId);
      console.error('Error in Resend API call:', sendError);
      
      // Check if it's an abort error (timeout)
      if (sendError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Email sending timed out', details: 'Request took too long to complete' },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to send email', details: sendError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in email sending API:', error);
    return NextResponse.json(
      { error: 'Server error while sending email', details: error.message },
      { status: 500 }
    );
  }
} 