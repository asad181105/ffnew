# Database Setup for Stall Bookings

## Setup Instructions

### 1. Run the SQL Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `stall_bookings_schema.sql`
4. Click **Run** to execute the SQL

This will create:
- `stall_bookings` table
- Storage bucket `stall-bookings` for file uploads
- Required indexes and policies
- RLS (Row Level Security) policies

### 2. Verify Storage Bucket

1. Go to **Storage** in your Supabase Dashboard
2. Verify that the `stall-bookings` bucket exists
3. Check that it's set to **Public** (for public file access)

### 3. Test the Form

1. Navigate to `/book-stall` on your website
2. Fill out the form and submit
3. Check the `stall_bookings` table in Supabase to verify the data was inserted
4. Check the `stall-bookings` storage bucket to verify files were uploaded

## Database Schema

### Table: `stall_bookings`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| name | TEXT | Contact person's name |
| startup_name | TEXT | Business/Startup name |
| logo_url | TEXT | URL to uploaded logo |
| category | TEXT | Business category |
| business_description | TEXT | Description of the business |
| contact | TEXT | Phone number |
| email | TEXT | Email address |
| social_media_handle | TEXT | Social media link |
| stall_type | TEXT | Selected stall type |
| payment_screenshot_url | TEXT | URL to payment screenshot |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Storage Structure

Files are stored in the `stall-bookings` bucket with the following structure:

```
stall-bookings/
  ├── logos/
  │   └── {timestamp}_{random}.{ext}
  └── payments/
      └── {timestamp}_{random}.{ext}
```

## Security

- **RLS Enabled**: Row Level Security is enabled on the table
- **Public Inserts**: Anyone can submit a booking (anon users)
- **Authenticated Reads**: Only authenticated users can read bookings (for admin access)
- **Public Storage**: Files are publicly accessible via URLs

## Admin Access

To view bookings as an admin:

1. Authenticate in your Supabase dashboard
2. Go to **Table Editor** → `stall_bookings`
3. You'll be able to view all submitted bookings

## Troubleshooting

### Files not uploading?
- Check that the `stall-bookings` bucket exists
- Verify the bucket is set to **Public**
- Check browser console for error messages

### Form submission failing?
- Check Supabase logs in the Dashboard
- Verify RLS policies are correctly set
- Ensure all required fields are filled

### Can't see bookings?
- Make sure you're authenticated in Supabase
- Check that the "Allow authenticated reads" policy is active

