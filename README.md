# Daily Report Dashboard

Interactive Next.js dashboard to build daily report output in a consistent format, such as:

```txt
Report 05/05/2026

1. Tasks (1):
	 - [seaweed] Try to understand about the S3 (Backend) upload flow
		 + Get and read the documentation of the S3 upload flow (Shared via Teams)
```

## Features

- Dynamic sections: Tasks, Done, Doing, Pending, Priority
- Add, remove, and reorder report items per section
- Multiline detail support to produce bullet lines with `+`
- Live generated preview exactly matching expected report style
- One-click copy to clipboard and `.txt` download
- Dashboard stats and chart for section distribution
- Persistent local state using Zustand

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Zustand for state management
- React Hook Form + Zod for schema validation
- Recharts for visualization
- Framer Motion for animation
- Sonner for notifications
- Lucide icons

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000
