# ChatGPT Integration for Portfolio Chatbot

This folder contains the API route that enables the portfolio chatbot to use OpenAI's ChatGPT model for generating responses.

## Setup

1. Sign up for an OpenAI account and get an API key at [OpenAI Platform](https://platform.openai.com/).
2. Create or edit the `.env.local` file in the root directory of the project.
3. Add your OpenAI API key to the `.env.local` file:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY="your-actual-api-key-here"
   ```

## How It Works

1. The chatbot component in `app/containers/chatbot/chatbot.tsx` collects user messages and sends them to the API route.
2. The API route in `app/api/chat/route.ts` forwards the conversation history along with a system prompt to the OpenAI API.
3. The system prompt contains information about Luis's experience, skills, and projects to help the AI provide relevant and accurate responses.
4. The API returns the AI-generated response to be displayed in the chatbot interface.

## Customization

You can customize the chatbot by editing the following:

- **System Prompt**: Edit the `systemPrompt` variable in `app/containers/chatbot/chatbot.tsx` to change what information is provided to the AI.
- **Model**: Change the `model` parameter in `app/api/chat/route.ts` to use a different OpenAI model.
- **Response Length**: Adjust `max_tokens` in `app/api/chat/route.ts` to control the length of responses.
- **Temperature**: Modify the `temperature` parameter in `app/api/chat/route.ts` to control the creativity/randomness of the responses (0.0 = deterministic, 1.0 = creative).

## Important Notes

- The OpenAI API incurs costs based on usage. Monitor your usage to control costs.
- The `.env.local` file containing your API key should never be committed to version control.
- For production, consider adding rate limiting to prevent abuse of the API. 