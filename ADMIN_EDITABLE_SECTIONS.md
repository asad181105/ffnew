# Admin Editable Sections Guide

This document outlines all sections that can be edited from the Admin panel. **Layout is fixed** - only content can be added, edited, or deleted.

## Home Page (`/admin/home`)

### Hero Section
- ✅ Video URL
- ✅ Autoplay toggle
- ✅ Fallback image URL

### Section 1: "For the dreamers who dare"
- ✅ Headline
- ✅ Sub-headline
- ✅ Content (Paragraph 1)
- ✅ Content (Paragraph 2)

### "Why We Do This" Section
- ✅ Content text

### "The Proof is in the People" Section
- ✅ Section title
- ✅ Impact Stats (Add/Edit/Delete)
  - Value (e.g., "400+")
  - Label (e.g., "Businesses didn't just show up...")
  - Order

### "Join Us for the Next Chapter" Section
- ✅ Title
- ✅ Date
- ✅ Venue
- ✅ Content text

### Interactive Selector Section
- ✅ Title
- ✅ Subtitle
- ✅ Options (Add/Edit/Delete)
  - Title
  - Description
  - Image URL
  - Icon (ShoppingBag, Mic, Users, Award, Network)
  - Order

## About Page (`/admin/about`)

### 2023 & 2024 Sections
- ✅ Metrics (Add/Edit/Delete)
- ✅ Images (Add/Edit/Delete)
- ✅ Rotation settings
- ✅ Section visibility

### New Sections Tab
- ✅ "Why We Do This" content
- ✅ "The Proof is in the People" title
- ✅ "It Started With a Simple Idea" images
- ✅ EdVenture Park metrics
- ✅ Testimonials
- ✅ Impact stats
- ✅ "What Actually Happens" content
- ✅ "Looking Back" content
- ✅ Participate CTA text

### Team Section
- ✅ Team members (Add/Edit/Delete)
  - Name
  - Designation
  - Responsibility
  - Image
  - Social URL
  - Order
  - Visibility

## Participate Page (`/admin/participation`)

- ✅ "Why Participate" bullets (Add/Edit/Delete)
- ✅ "Why Participate" paragraphs (Add/Edit/Delete)
- ✅ Benefits (Add/Edit/Delete)
- ✅ Complementary items (Add/Edit/Delete)
- ✅ Carousel images (Add/Edit/Delete)

## Partners Page (`/admin/partners`)

- ✅ Government partners (2023 & 2024)
- ✅ Sponsors (2023 & 2024)
- ✅ Influencers (2023 & 2024)
- All with Add/Edit/Delete functionality

## Awards Page (`/admin/awards`)

- ✅ Page content (Hero, Spotlight, Nomination steps)
- ✅ Award categories
- ✅ Winners
- ✅ "Why Awards" content
- ✅ Spotlight benefits (Add/Edit/Delete)
- ✅ Nomination steps (Add/Edit/Delete)

## Contact Page (`/admin/contact`)

- ✅ Hero content
- ✅ "Reach Out" section
- ✅ "Stalk Us" social links
- ✅ Team note
- ✅ Contact queries management

## Team Page (`/admin/team`)

- ✅ Team members (Add/Edit/Delete)
  - Name
  - Designation
  - Responsibility
  - Image
  - Social URL
  - Order
  - Visibility

## Important Notes

1. **Layout is Fixed**: The structure, styling, and positioning of sections cannot be changed from the admin panel. Only content within sections can be modified.

2. **Content Management**: 
   - Text content can be edited
   - Images can be added/removed/reordered
   - Items in lists can be added/deleted
   - Order can be changed for sortable items

3. **Database-Driven**: All content is stored in Supabase and fetched dynamically on page load.

4. **Real-time Updates**: Changes made in the admin panel are saved immediately and reflected on the frontend after page refresh.

