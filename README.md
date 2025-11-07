# College Placement Management Portal

A comprehensive web application to streamline campus recruitment processes for colleges, supporting multiple user roles with AI-powered features.

## Features

### User Roles

1. **Training & Placement Officer (TPO/Admin)**
   - Create and manage placement drives
   - Add and manage company details
   - Manage recruitment rounds and update selected/rejected lists
   - Upload offer letters for selected students
   - Send email notifications at each stage
   - Resume filtering tool with AI parsing
   - Generate comprehensive reports

2. **Head of Department (HOD)**
   - Approve student signups within their department
   - Verify and edit student profiles
   - View department-level placement statistics
   - Generate downloadable reports (Excel/PDF)

3. **Student**
   - Sign up and log in securely
   - Maintain personal details and upload résumé
   - View and enroll in active drives
   - Track drive status and round results
   - Receive automated emails for selection or rejection
   - Download final offer letters
   - AI-powered resume builder with job-fit analysis

### AI Features

- **AI Resume Builder**: Smart resume creation with job-fit analysis and suggestions
- **Resume Filtering**: Automatic extraction of candidate information (skills, experience, education)
- **Email Templates**: AI-generated professional email templates
- **Resume Parsing**: Extract structured data from resumes using Gemini API

## Tech Stack

- **Frontend**: React with Next.js 14
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **AI Integration**: Google Gemini API
- **Styling**: Tailwind CSS
- **Email**: Nodemailer
- **Reports**: XLSX (Excel) and jsPDF (PDF)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hackathon
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home/login page
├── components/
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database client
│   ├── email.ts          # Email utilities
│   ├── gemini.ts         # Gemini API integration
│   └── reports.ts        # Report generation
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Usage

### Creating Accounts

1. Navigate to the registration page
2. Select your role (Student, HOD, or TPO)
3. Fill in the required information
4. For students, wait for HOD approval before applying to drives

### TPO Workflow

1. Add companies
2. Create placement drives
3. Manage applications and filter resumes
4. Update round results
5. Upload offer letters
6. Generate reports

### HOD Workflow

1. Approve student registrations
2. View department statistics
3. Generate department reports

### Student Workflow

1. Complete profile and upload resume
2. Wait for HOD approval
3. Browse active drives
4. Apply to drives
5. Track application status
6. Use AI resume builder for improvements

## Database

The application uses SQLite with Prisma ORM. To view the database:

```bash
npx prisma studio
```

## API Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/drives` - Drive management
- `/api/companies` - Company management
- `/api/applications` - Application management
- `/api/resume/*` - Resume builder and filtering
- `/api/reports/*` - Report generation
- `/api/students/*` - Student management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

