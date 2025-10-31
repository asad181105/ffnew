# Supabase Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these values:**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** for `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the **anon public** key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**⚠️ Security Note:** Never commit your `.env.local` file to git! It's already added to `.gitignore`.

## Installation

After adding the environment variables, install the Supabase client:

```bash
npm install
```

## Usage

Import the Supabase client in your components:

```typescript
import { supabase } from '@/lib/supabase'

// Example: Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Example: Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert([{ column: 'value' }])
```

## Available Files

- `lib/supabase.ts` - Supabase client configuration
- Environment variables in `.env.local` (create this file manually)

## Next Steps

The Supabase client is now ready to use throughout your application. You can:
- Create database tables in your Supabase dashboard
- Use the client to fetch, insert, update, and delete data
- Implement authentication features if needed
- Set up real-time subscriptions for live updates

