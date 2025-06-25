# Invitation System Setup Guide

## Overview
This guide will help you set up the complete invitation system for Layrbase using Supabase.

## 1. Database Setup

### Run the SQL Script
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the `invitation-system.sql` file to create:
   - `organization_invitations` table
   - Database functions for inviting and accepting users
   - Row Level Security policies

## 2. Frontend Components

### Files Created/Updated:
- `src/pages/JoinOrganization.js` - New join page for handling invitations
- `src/pages/organizations/MyOrganizations.js` - Updated with invitation functionality
- `src/contexts/AuthContext.js` - Added `refreshOrganizations` function
- `src/App.js` - Added routing for join page

### Features:
- ✅ Invitation creation with unique tokens
- ✅ Email client integration (opens with pre-filled invitation)
- ✅ Join page with invitation validation
- ✅ Automatic organization membership upon acceptance
- ✅ Invitation expiration handling
- ✅ Email verification (must match invitation email)

## 3. Email Options

### Current Implementation (Development)
The system currently opens the user's email client with a pre-filled invitation. This is perfect for development and testing.

### Production Email Options

#### Option 1: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Deploy the Edge Function in `supabase/functions/send-invitation-email/`
4. Set environment variable: `RESEND_API_KEY`

#### Option 2: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Update the Edge Function to use SendGrid API

#### Option 3: Supabase Auth Email Templates
1. Configure email templates in Supabase Auth settings
2. Use Supabase's built-in email functionality

## 4. Testing the System

### Test Invitation Flow:
1. Log in as an admin/owner of an organization
2. Go to "My Organizations"
3. Select an organization and click "Invite Member"
4. Enter an email address and role
5. The system will create an invitation and open your email client
6. Send the email or copy the join link
7. Open the join link in an incognito window
8. Sign up/sign in with the invited email
9. Accept the invitation

### Test Cases:
- ✅ Invitation creation
- ✅ Email client integration
- ✅ Join page validation
- ✅ Invitation acceptance
- ✅ Organization membership
- ✅ Email verification
- ✅ Expired invitation handling
- ✅ Invalid token handling

## 5. Security Features

### Database Level:
- Row Level Security (RLS) policies
- Token-based invitation system
- Automatic expiration (7 days)
- Email verification requirement
- Role-based permissions

### Application Level:
- Invitation validation
- User authentication required
- Email matching verification
- Organization membership checks

## 6. Next Steps

### For Production:
1. **Set up proper email service** (Resend, SendGrid, etc.)
2. **Deploy Edge Function** for automated email sending
3. **Configure domain** for join links
4. **Set up email templates** with your branding
5. **Add email tracking** (optional)
6. **Implement rate limiting** for invitations

### Additional Features:
- Bulk invitations
- Invitation reminders
- Invitation analytics
- Custom invitation messages
- Role-based invitation permissions

## 7. Troubleshooting

### Common Issues:
1. **"Function does not exist"** - Run the SQL script in Supabase
2. **"Permission denied"** - Check RLS policies
3. **"Invalid token"** - Check invitation expiration
4. **"Email mismatch"** - User must sign in with the invited email

### Debug Commands:
```sql
-- Check invitations
SELECT * FROM organization_invitations WHERE email = 'test@example.com';

-- Check user organizations
SELECT * FROM user_organizations WHERE user_id = 'user-uuid';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'organization_invitations';
```

## 8. Environment Variables

### Required for Production Email:
```bash
RESEND_API_KEY=your_resend_api_key
# or
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Optional:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 9. Deployment

### Frontend:
1. Build and deploy your React app
2. Ensure the join route (`/join/:token`) is accessible
3. Update the join URL in the invitation email template

### Backend:
1. Deploy the Edge Function to Supabase
2. Set environment variables
3. Test the email sending functionality

## 10. Monitoring

### Key Metrics to Track:
- Invitation creation rate
- Invitation acceptance rate
- Email delivery rate
- Join page conversion rate
- Error rates

### Logs to Monitor:
- Database function errors
- Email sending failures
- Join page errors
- Authentication issues

---

The invitation system is now ready for use! Start with the development email client approach, then upgrade to a proper email service for production. 