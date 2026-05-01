import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

const SYSTEM_PROMPT = `You are a helpful virtual assistant for Luis Ortiz's portfolio website.

Your role is to help visitors learn about Luis and his work by answering their questions based on the following information:

EXPERIENCE:
- Software Engineering Manager at Ocarina Studios (2024-2025): Led multiple engineering teams, increased team retention by 40%, reduced onboarding time by 40%, and accelerated feature development time by 50% through rapid prototyping processes.

- Full-Stack Engineer at Elixir Technologies Ltd. (2022-2024): Built a decentralized market-making platform that reached billions in trading volume and $50M+ TVL. Designed systems supporting over 100,000 validators and implemented high-performance algorithms for SLA compliance.

- Full-Stack Software Engineer, Freelancer (2021-2023): Developed multiple successful projects including an irrigation mobile app, a decentralized storage system that improved file retrieval speeds by multiple times, and an AI-powered web scraping platform.

- Interview Engineer Contractor at Karat (2021-2023): Conducted over 100 technical assessments globally and performed hundreds of interview reviews as part of the quality control team.

- Full-Stack Software Engineer Consultant at Ocarina Studios (2021-2023): Led engineering hiring process, developed apps for audio conversion and trivia creation, and fully managed the lifecycle of multiple projects from requirements gathering to deployment.

- Lead Software Engineer at Agres Electronic Systems (2017-2020): Maintained software for agricultural automation product deployed on over 1,000,000 devices. Developed a Seeding Monitor feature that increased product sales by 100% in one year. Led engineering hiring that expanded the team by 300%.

- Junior Software Engineer at Tales Inc. (2016-2017): Automated machinery using PLCs and computer vision, reducing manual operations by more than 50% and increasing quality assurance by over 50%.

SKILLS:
- Programming Languages: JavaScript, TypeScript, Python, Golang, C#, C++, C, Solidity (junior)
- Frontend: React, Next.js, HTML, CSS, Tailwind
- Backend: Node.js, Express, Nest.js, Django, Flask, FastAPI, Gin
- Databases: PostgreSQL, MongoDB, Redis
- Cloud: AWS, Docker, Kafka
- Other: Git, DevOps, Leadership, Mentoring

PROJECTS:
- Elixir Protocol: A decentralized market-making platform in the blockchain
- Vintality: An irrigation mobile app with sensor hardware integration
- Portfolio Website: Personal responsive portfolio site with dark mode and translations
- Nebula Storage: A decentralized storage and CDN using Ethereum and IPFS
- Agronave PRO: Advanced agricultural automation system
- Scrape Sense AI: AI-powered web scraping platform
- TriviaGen AI: AI application for generating trivia questions
- Google Accelerator Program: One of 60 studios selected globally for mentorship
- Dream Quiz: A game API managing user sessions, analytics, and real-time data processing
- Save Your Brain: Trivia: A high-performance multiplayer trivia game API with matchmaking and rankings
- Maver: An iOS app that records voice input, converts to editable MIDI, and transforms into instrument sounds
- Secure Software Auditing with Intel SGX: A Linux kernel modification leveraging Intel SGX for tamper-proof program auditing
- In-depth Analysis of Blockchain Networks Using TEEs: Research project analyzing security vs. performance tradeoffs in trusted execution environments
- 3D Pokémon Fan Game: Unity-based 3D game prototype with turn-based battles and procedural terrain generation
- Bluetooth MIDI Controller: Custom MIDI controller using Arduino with Bluetooth control via Android app
- NFT Marketplace: Decentralized NFT marketplace with creation, auctions, and trading built with Solidity and Next.js

Luis resides in Curitiba, Brazil, but he may also be in other places such as Canada. He works remotely only and is his preferred way of working.
Luis email is luisfmazzu@gmail.com and phone is +55 41 997003955. Any mentioning of contact with him, direct him to the contact form in this website.

Luis availability is usually immediately, always instruct them to contact him directly that Luis will get back to them as soon as possible.
Luis is responsible, innovative, and a great leader. He considers empathy and collaboration in his work. He is always looking for ways to improve his skills and the way he works.
Luis is eager to help and always willing to share his knowledge. He is a great mentor and a great person to work with.
Luis is eager to learn and always looking for new challenges. He is a great problem solver and a great person to work with.
He is a great freelancer that delivers work quickly, on time, and with great quality.

Keep your responses concise, helpful, and in a friendly tone.
If you're asked about technical details that aren't provided, you can use your general knowledge but make it clear when you're not speaking specifically about Luis's work.
If you don't know the answer and also can't use general knowledge, you must politely say that you don't know and that you will improve, which is the same attitude Luis has. Improving is a never ending process.
You can also ask for more information if needed. You must be extra positive about Luis's work and skills.
If you are asked about something that you don't know about Luis more than once, you can say that you don't know and that they should contact Luis directly via the contact form in this website.`

const MAX_MESSAGES = 10
const MAX_MESSAGE_CHARS = 1000
const MAX_TOTAL_CHARS = 6000

const DAILY_LIMIT = 15
const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000
const MINUTE_LIMIT = 5
const MINUTE_WINDOW_MS = 60 * 1000

type IncomingMessage = { role: 'user' | 'assistant'; content: string }
type SanitizeResult =
  | { ok: true; messages: IncomingMessage[] }
  | { ok: false; reason: string }

function sanitizeMessages(input: unknown): SanitizeResult {
  if (!Array.isArray(input)) {
    return { ok: false, reason: `messages is not an array (got ${typeof input})` }
  }
  const cleaned: IncomingMessage[] = []
  let totalChars = 0
  for (let i = 0; i < input.length; i++) {
    const m = input[i]
    if (!m || typeof m !== 'object') {
      return { ok: false, reason: `messages[${i}] is not an object` }
    }
    const role = (m as { role?: unknown }).role
    const content = (m as { content?: unknown }).content
    if (role !== 'user' && role !== 'assistant') continue
    if (typeof content !== 'string') {
      return { ok: false, reason: `messages[${i}].content is not a string (got ${typeof content})` }
    }
    if (content.length === 0) continue
    if (content.length > MAX_MESSAGE_CHARS) {
      return { ok: false, reason: `messages[${i}].content too long (${content.length} > ${MAX_MESSAGE_CHARS})` }
    }
    totalChars += content.length
    if (totalChars > MAX_TOTAL_CHARS) {
      return { ok: false, reason: `total content too long (${totalChars} > ${MAX_TOTAL_CHARS})` }
    }
    cleaned.push({ role, content })
  }
  if (cleaned.length === 0) {
    return { ok: false, reason: 'no usable messages after filtering' }
  }
  if (cleaned.length > MAX_MESSAGES) {
    return { ok: false, reason: `too many messages (${cleaned.length} > ${MAX_MESSAGES})` }
  }
  if (cleaned[cleaned.length - 1].role !== 'user') {
    return { ok: false, reason: `last message role is "${cleaned[cleaned.length - 1].role}", expected "user"` }
  }
  return { ok: true, messages: cleaned }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('Missing OpenAI API key - chatbot functionality will not work')
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 },
      )
    }

    const ip = getClientIp(req)

    const minute = rateLimit(`chat:min:${ip}`, MINUTE_LIMIT, MINUTE_WINDOW_MS)
    if (!minute.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please slow down and try again in a moment.',
          retryAfterSeconds: minute.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(minute.retryAfterSeconds) },
        },
      )
    }

    const daily = rateLimit(`chat:day:${ip}`, DAILY_LIMIT, DAILY_WINDOW_MS)
    if (!daily.allowed) {
      const hours = Math.ceil(daily.retryAfterSeconds / 3600)
      return NextResponse.json(
        {
          error: `You have reached the daily limit for the assistant. Please try again later (in about ${hours} hour${hours === 1 ? '' : 's'}).`,
          retryAfterSeconds: daily.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(daily.retryAfterSeconds) },
        },
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const rawMessages = (body as { messages?: unknown })?.messages
    const sanitized = sanitizeMessages(rawMessages)
    if (!sanitized.ok) {
      console.warn('Chat payload rejected:', sanitized.reason, {
        rawType: Array.isArray(rawMessages) ? `array(${rawMessages.length})` : typeof rawMessages,
      })
      return NextResponse.json(
        { error: 'Invalid messages payload', reason: sanitized.reason },
        { status: 400 },
      )
    }
    const messages = sanitized.messages

    const openai = new OpenAI({ apiKey })

    let response
    try {
      response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      })
    } catch (openaiError: any) {
      console.error('OpenAI API error:', {
        status: openaiError?.status,
        code: openaiError?.code,
        type: openaiError?.type,
        message: openaiError?.message,
        body: openaiError?.error,
      })
      return NextResponse.json(
        {
          error: 'OpenAI request failed',
          status: openaiError?.status ?? null,
          code: openaiError?.code ?? null,
          type: openaiError?.type ?? null,
          message: openaiError?.message ?? String(openaiError),
        },
        { status: 502 },
      )
    }

    const choice = response.choices[0]
    const content = choice?.message?.content ?? ''
    if (!content) {
      console.warn('OpenAI returned empty content:', {
        finishReason: choice?.finish_reason,
        choiceCount: response.choices?.length,
      })
      return NextResponse.json(
        {
          error: 'OpenAI returned an empty response',
          finishReason: choice?.finish_reason ?? null,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Failed to generate a response', message: error?.message ?? String(error) },
      { status: 500 },
    )
  }
}
