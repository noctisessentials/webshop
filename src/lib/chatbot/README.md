# Chatbot Knowledge + Guardrails

This chatbot is configured to answer **only** from the FAQ knowledge in:

- `src/lib/chatbot/knowledge.ts`

## Update knowledge

1. Edit `FAQ_GROUPS_NL` and `FAQ_GROUPS_EN` in `knowledge.ts`.
2. Keep answers factual and policy-safe.
3. The FAQ page (`/veelgestelde-vragen`) and chatbot both use this file, so content stays in sync.

## Environment variables

- `OPENAI_API_KEY` (required for OpenAI responses)
- `OPENAI_CHAT_MODEL` (optional, default: `gpt-4.1-mini`)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_TO` (fallback escalation recipient)
- `CHATBOT_ESCALATION_TO` (optional dedicated escalation inbox)

## Safety behavior

- If a user asks outside FAQ knowledge, chatbot escalates instead of guessing.
- If user asks for a real person, chatbot immediately offers escalation form.
- Escalation form asks for name + email and confirms response within 24 hours.
