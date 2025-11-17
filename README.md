# Espoo Business Advisor — Frontend

> A human-centered, AI-assisted frontend that helps anyone start a business in Espoo: smarter, smoother, more inclusive.

This repository contains the **Next.js + TypeScript** frontend for the Junction 2025 challenge solution. The product is a conversational advisor (chatbot) that answers questions about starting a business in Espoo and lets users book free advisory appointments with City of Espoo representatives.

---

## Key ideas

* Extend personal advisory services with a lightweight digital layer that prepares entrepreneurs before meetings and reduces knowledge & network gaps.
* Use an AI-powered chatbot (Featherless AI) to surface relevant, localised guidance and service flows (residence permits, company registration, taxes, insurances, funding, local networks).
* Provide an appointment booking flow that connects users to Business Espoo advisors, improving meeting preparation and advisor context.

---

## Demo / Prototype

* Chatbot converses in natural language and can:

  * Answer step-by-step guidance about starting a business in Espoo.
  * Suggest local resources, links, and required documents.
  * Offer next steps and checklist items before an advisory meeting.
  * Trigger an appointment booking flow (select time, provide contact details).

* A public link to the backend (API) is included separately in the project; the chat frontend calls that backend for AI responses, booking, and user session management.

---

## Tech stack

* **Frontend:** Next.js (App Router) + TypeScript
* **Styling:** Tailwind CSS
* **UI components:** BerlixUI + shadcn/ui
* **Auth:** NextAuth.js
* **Database (sessions / optional local storage):** MongoDB
* **AI model (backend):** Featherless AI (accessed via the backend service — frontend only calls backend endpoints)
* **Other:** Vercel/Netlify-friendly build configuration

---

## Features

* Conversational UI (chatbot) with message history and suggested prompts.
* Multi-step appointment booking integrated with the Business Espoo representative scheduler.
* Localisation-ready UI (texts and resource links relevant to Espoo / Finland).
* Advisor context panel — summarizes user-provided info to give advisors better pre-meeting insight.
* Accessibility and inclusive design considerations (clear language, adjustable text size, keyboard navigation).

---

## Environment variables

Create a `.env.local` file in the project root with the following variables:

```

NEXT_PUBLIC_API_URL=[https://your-backend.example.com](https://your-backend.example.com)      # backend that proxies Featherless AI
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/db
NEXTAUTH_URL=[http://localhost:3000](http://localhost:3000)
NEXTAUTH_SECRET=some_long_random_secret
NEXTAUTH_MONGODB_URI=${MONGODB_URI}

````

> Security note: The Featherless AI model key must be stored and used in the backend — frontend must never contain raw model API keys.

---

## Local development

1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
````

2. Add `.env.local` with variables above.

3. Run the dev server

```bash
npm run dev
# or
pnpm dev
```

The app should be available at `http://localhost:3000`.

---

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## Chatbot behaviour (frontend responsibilities)

* Collect user messages and enrich with lightweight metadata (e.g., language, region, whether user is international).
* Show system prompts and suggested follow-ups received from the backend.
* Maintain a conversation history and present quick-checklist suggestions derived from the assistant answers.
* Provide a clear CTA to book a meeting with Business Espoo advisor when appropriate.
* When user requests a booking, collect required fields (name, email, phone, preferred times, language) and call the backend booking endpoint.

---

## Booking flow

1. User clicks **Book an appointment** inside chat or via a CTA.
2. Booking modal collects basic details and preferred time slots.
3. Frontend validates input and calls backend `/api/bookings` endpoint.
4. Backend confirms slot with Business Espoo scheduling API (or via mock in the hackathon environment) and returns confirmation.
5. Frontend shows confirmation with calendar add option and an appointment summary for the advisor.

---

## Authentication & Privacy

* Sign-in via NextAuth (email or social providers configured in the backend).
* Users may use the chat anonymously in a limited mode; booking requires verification (email) before confirming.
* Personal data collected for booking is minimal — only what is necessary to schedule an advisory meeting. Data storage and retention must follow GDPR and City of Espoo policies if piloted.

---

## Accessibility

* UI components follow ARIA and keyboard navigation patterns from shadcn/ui and BerlixUI.
* All images include `alt` tags.
* Colors and contrast designed to meet WCAG AA where possible.

---

## Deployment

* Recommended: Deploy to Vercel (Next.js native) or Netlify.
* Ensure environment variables are set in the hosting provider dashboard.
* Keep Featherless API keys only in the backend.

---

## Development notes & gotchas

* The frontend expects a backend that:

  * Proxies calls to Featherless AI and returns formatted chat responses.
  * Exposes `POST /api/chat` and `POST /api/bookings` endpoints.
  * Handles user sessions and booking persistence.

* If you need to run the demo without a backend, use the included `mockServer` (see `/lib/mocks`) and set `NEXT_PUBLIC_API_URL` to `http://localhost:3000/api/mock`.

---

## Acknowledgements

* City of Espoo — challenge brief and resources
* Featherless AI — model powering the assistant (accessed via backend)
* UI: BerlixUI, shadcn/ui
* Event: Junction 2025

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit changes with clear messages.
4. Open a pull request describing the changes and rationale.

---

## License

This project is provided under the MIT License. See `LICENSE` for details.

---

## Contact

For questions about the frontend, open an issue or contact the maintainers listed in the repository metadata.
