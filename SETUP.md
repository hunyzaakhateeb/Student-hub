# Setup Instructions

## Prerequisites

1. **Node.js**: Install Node.js 18 or higher from [nodejs.org](https://nodejs.org/)
2. **Google Gemini API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Email Account**: For sending notifications (Gmail recommended)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**Note for Gmail**: You'll need to generate an App Password:
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password for "Mail"
4. Use that password in `SMTP_PASS`

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database and tables
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Creating Initial Users

### Option 1: Using Prisma Studio

1. Run `npx prisma studio`
2. Navigate to the User table
3. Create users manually (passwords need to be hashed with bcrypt)

### Option 2: Using Registration Page

1. Go to `/register`
2. Create accounts for each role:
   - **TPO**: Training & Placement Officer
   - **HOD**: Head of Department (specify department)
   - **Student**: Regular student (will need HOD approval)

## Testing the Application

### TPO Workflow

1. Login as TPO
2. Add a company (`/dashboard/companies/new`)
3. Create a drive (`/dashboard/drives/new`)
4. View applications (`/dashboard/applications`)
5. Use resume filter tool (`/dashboard/resume-filter`)

### HOD Workflow

1. Login as HOD
2. Approve students (`/dashboard/students`)
3. View reports (`/dashboard/reports`)

### Student Workflow

1. Register as student
2. Wait for HOD approval
3. Complete profile (`/dashboard/profile`)
4. Build resume (`/dashboard/resume-builder`)
5. Browse and apply to drives (`/dashboard/drives`)

## Troubleshooting

### Database Issues

If you encounter database errors:
```bash
# Reset the database
npx prisma db push --force-reset
```

### API Key Issues

- Ensure your Gemini API key is valid
- Check that the key has proper permissions
- Verify the key is in the `.env` file

### Email Issues

- Verify SMTP credentials
- For Gmail, ensure App Password is used (not regular password)
- Check firewall/network settings

## Production Deployment

For production:

1. Use a production database (PostgreSQL recommended)
2. Update `DATABASE_URL` in `.env`
3. Set secure session cookies
4. Use environment variables for all secrets
5. Enable HTTPS

```bash
npm run build
npm start
```

## Additional Notes

- The application uses SQLite by default for local development
- All passwords are hashed using bcrypt
- Sessions are stored in HTTP-only cookies
- AI features require an active Gemini API key

