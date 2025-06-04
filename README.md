# Neurova - Mental Health Practice Management System

![Neurova Logo](public/logo.png)

Neurova is a comprehensive mental health practice management system designed to help therapists manage their practice, patients, and appointments efficiently. The application features patient management, session notes, appointment scheduling, and Google Calendar integration.

## Features

- **Secure Authentication** - Google OAuth integration for secure sign-in
- **Patient Management** - Store and manage patient information, medical history, and contact details
- **Session Notes** - Rich text editor for detailed session documentation
- **Appointment Scheduling** - Calendar view with drag-and-drop functionality
- **Multi-language Support** - Currently supports English and Spanish
- **Responsive Design** - Works on desktop and tablet devices

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **UI Components**: Material-UI (MUI) with custom theming
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL
- **Internationalization**: next-intl
- **Form Handling**: Formik with Yup validation
- **Rich Text Editor**: Editor.js
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Supabase account
- Google OAuth credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/neurova.git
   cd neurova
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase and Google OAuth credentials

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                 # App router pages and layouts
├── components/          # Reusable UI components
├── config/              # Application configuration
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization setup
├── lib/                 # Utility libraries
├── messages/            # Translation files
├── services/            # API and service layer
├── themes/              # MUI theme configurations
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Database Setup

1. Create a new Supabase project
2. Run the SQL migrations in the `migrations` directory
3. Set up Row Level Security (RLS) policies as needed

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Upcoming Features

### Short-term

- [ ] Patient portal for secure communication
- [ ] Billing and invoicing system
- [ ] Telehealth integration
- [ ] Treatment plan templates
- [ ] Progress tracking and analytics

### Mid-term

- [ ] Mobile application
- [ ] AI-powered session note generation
- [ ] Automated appointment reminders
- [ ] Insurance claim processing
- [ ] Group therapy management

### Long-term

- [ ] Outcome measurement tools
- [ ] Integration with electronic health records (EHR)
- [ ] Advanced reporting and analytics dashboard
- [ ] Multi-provider practice management
- [ ] Patient satisfaction surveys

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact support@neurova.app

