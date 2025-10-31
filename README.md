# Founders Fest 2025-26

A modern, responsive website for **Founders Fest**, an upcoming event happening on **31st December 2025 and 1st January 2026**.

## 🎨 Design

- **Primary Colors:** Black (#000000) and Yellow (#FFD700) with White (#FFFFFF) accents
- **Theme:** Minimal, modern, bold aesthetic with festive yet professional vibes
- **Features:** Smooth scroll, subtle animations (Framer Motion), and glowing yellow accents

## 🚀 Tech Stack

- **Framework:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Database:** Supabase (connected)

## 📁 Project Structure

```
founders_fest/
├── components/
│   ├── Countdown.tsx      # Countdown timer component
│   ├── EventCard.tsx      # Event card component
│   ├── Footer.tsx         # Footer component
│   ├── Hero.tsx           # Hero section component
│   └── Navbar.tsx         # Navigation bar component
├── lib/
│   └── utils.ts           # Utility functions
├── pages/
│   ├── _app.tsx           # Next.js app wrapper
│   ├── _document.tsx      # Next.js document wrapper
│   ├── index.tsx          # Landing page
│   ├── about/
│   │   └── index.tsx      # About page
│   ├── explore/
│   │   └── index.tsx      # Explore page
│   └── founder/
│       └── index.tsx      # Founder page
├── styles/
│   └── globals.css        # Global styles
└── package.json
```

## 🧱 Pages

1. **Landing Page (Home):**
   - Full-width hero section with event title
   - Countdown timer showing days/hours/minutes/seconds until Dec 31, 2025
   - "Register Now" button
   - Animated particle background

2. **Explore Page:**
   - Description of Founders Fest
   - "What to Expect" section with cards
   - Upcoming events with placeholder cards

3. **About Page:**
   - Adventure Park Incubated information
   - Incubation Center details
   - Contact section (email, phone, social media)

4. **Founder Page:**
   - "Meet the Founder" section
   - Image placeholder and bio placeholder

## 🧭 Navigation

- Sticky navbar with smooth hover animations
- Mobile-responsive hamburger menu
- Links: Home, Explore, About, Founder

## 📜 Footer

- Three sections: About, Quick Links, Contact Info
- Social media links (Instagram, LinkedIn)
- Copyright notice

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. **Set up Supabase environment variables:**
   - Create a `.env.local` file in the root directory
   - Add the following variables (see `SUPABASE_SETUP.md` for detailed instructions):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   - Get your credentials from your Supabase project dashboard (Settings → API)

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5174](http://localhost:5174) in your browser.

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📝 Notes

- The countdown timer calculates time remaining until **December 31, 2025, 00:00**
- All placeholder content (founder info, events, contact details) can be easily updated
- The design is mobile-first and fully responsive
- Ready for future integrations (event registration, photo galleries, schedules)

## 🎯 Future Enhancements

- Event registration form integration
- Photo gallery section
- Detailed event schedules
- Speaker profiles
- Sponsor showcase
- Blog/News section

## 🚀 Deployment

Ready to deploy to Vercel! See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick steps:
1. Push your code to GitHub/GitLab/Bitbucket
2. Import project on [Vercel](https://vercel.com/new)
3. Add environment variables (Supabase credentials)
4. Deploy!

**Note:** Remember to add these environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📄 License

All rights reserved © 2025 Founders Fest

