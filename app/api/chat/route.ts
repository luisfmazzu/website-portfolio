import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Function to get OpenAI credentials from environment variables
function getCredentials() {
  // Access environment variables inside a function to ensure they are retrieved at runtime
  const apiKey = process.env.OPENAI_API_KEY;
  
  return { apiKey };
}

export async function POST(req: Request) {
  try {
    // Get credentials at runtime
    const { apiKey } = getCredentials();
    
    // Check if we have a valid API key
    if (!apiKey) {
      console.error("Missing OpenAI API key - chatbot functionality will not work");
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
    // Initialize the OpenAI client with the API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can change to a different model if needed
      messages: messages,
      temperature: 0.7,
      max_tokens: 500, // Adjust based on your needs
    });

    // Extract and return the message content
    const content = response.choices[0]?.message?.content || '';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate a response' },
      { status: 500 }
    );
  }
} 