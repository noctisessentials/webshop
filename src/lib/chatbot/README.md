# Chatbot Knowledge + Guardrails

This chatbot is configured to answer **only** from the knowledge base in:

- `src/lib/chatbot/knowledge-base.ts`

## Update knowledge

1. Edit `NOCTIS_KNOWLEDGE_BASE` and `CHATBOT_KNOWLEDGE_ITEMS` in `knowledge-base.ts`.
2. Keep facts strict and policy-safe.
3. If a user question is not covered by this file, the chatbot escalates to a human.

## Environment variables

- `OPENAI_API_KEY` (required for OpenAI responses)
- `OPENAI_CHAT_MODEL` (optional, default: `gpt-4.1`)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_TO` (fallback escalation recipient)
- `CHATBOT_ESCALATION_TO` (optional dedicated escalation inbox)

## Safety behavior

- If a user asks outside knowledge, chatbot escalates instead of guessing.
- If user asks for a real person, chatbot immediately offers escalation form.
- Escalation form asks for name + email and confirms response within 24 hours.
