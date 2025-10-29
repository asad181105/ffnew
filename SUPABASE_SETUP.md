# Supabase Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lxbqongllniqpexymmov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YnFvbmdsbG5pcXBleHltbW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTQ3NTAsImV4cCI6MjA3NzMzMDc1MH0.WQe9RYD0BIVBsPmEnPS1ZMT10XYMnRft34YmuC75O8M
```

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

