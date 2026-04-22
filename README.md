# LectureMind AI - JEE/NEET Study Platform

LectureMind AI is a comprehensive study platform powered by Google Gemini AI, designed specifically for JEE and NEET aspirants. It transforms complex educational content into scannable summaries, interactive flashcards, and adaptive quizzes.

## Core Features

- **Multi-Source Knowledge Extraction**: Input YouTube links, upload PDFs, or paste raw text to generate materials.
- **AI-Generated Notes**: Get short, medium, or detailed summaries of any lecture.
- **Interactive Flashcards**: Master concepts using active recall and spaced repetition.
- **Adaptive Quizzes**: Test your knowledge with MCQ tests that include detailed explanations.
- **Performance Dashboard**: Track your study streak, subject progress, and syllabus coverage.
- **Academic Focused UI**: A clean, professional interface built with Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **AI**: Google Gemini API (@google/genai)
- **Utilities**: Framer Motion (Animations), jsPDF (Exports), Lucide React (Icons)

## Setup Instructions

1. **Environment Variables**:
   Update your `.env` file with the following:
   ```
   GEMINI_API_KEY="your-gemini-api-key"
   ```

2. **Firebase Setup**:
   The app uses the Firebase configuration from `firebase-applet-config.json`. Ensure this file is present and correctly provisioned in your environment.

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

## Workflow

1. **Upload**: Use the Dashboard to provide a source of information.
2. **Review**: Browse the generated Study Material View for summaries and formulas.
3. **Practice**: Go to the Flashcards or Quizzes section to reinforce learning.
4. **Track**: Check your Performance dashboard to see your progress across subjects.
