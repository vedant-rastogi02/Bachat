# Bachat Buddy

Hindi-first financial inclusion web app for low-income Indian workers.

## Stack

- React + Vite
- Supabase Auth + PostgreSQL
- Supabase tables: users, schemes, chat_sessions, chat_messages

## Features Implemented

- Mobile-first warm color design system with large tap targets
- English default language with top-corner Hindi toggle
- Homepage with 3 large icon-led cards:
  - वित्तीय शिक्षा
  - आपके लिए सरकारी योजनाएं
  - बचत खेल
- Signup and profile with consent checkbox (Hindi) and Supabase email/password auth
- Government schemes matching engine (top 5 by profile relevance)
- Dummy no-AI chatbot with Hindi starter chips and safe-response policy
- Savings game: पान मसाला या सोना? with slider, chart, and relatable output
- Privacy policy page in Hindi and English

## Setup

1. Install dependencies

	npm install

2. Add environment variables

	cp .env.example .env

3. Fill these values in .env

	- VITE_SUPABASE_URL
	- VITE_SUPABASE_ANON_KEY
	- SUPABASE_SERVICE_ROLE_KEY

4. Run Supabase SQL migration

	- Execute file: supabase/migrations/001_init.sql in Supabase SQL editor

5. Import CSV scheme data

	npm run import:schemes

6. Start app

	npm run dev

## Notes

- Scheme recommendations are informational only.
- Users should verify eligibility and application details on myscheme.gov.in.
- Chatbot is intentionally non-AI and uses predefined responses.
