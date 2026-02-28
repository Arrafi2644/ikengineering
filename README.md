# IK Engineering Backend Server

A Node.js/Express backend server for the IK Engineering website, built with TypeScript and using Bun as the runtime.

## Features

- **Express.js** with TypeScript for type-safe API development
- **MVC Architecture** with organized controllers, routes, and middleware
- **File Upload Support** using Multer for CV and specification files
- **Email Integration** with Nodemailer for form submissions
- **CORS Protection** allowing only same-origin requests
- **Gzip Compression** for improved performance
- **Static File Serving** for the React frontend
- **Rate Limiting** for API protection

## API Endpoints

### Contact Form
- **POST** `/api/contact`
- Handles contact form submissions with optional file uploads
- Sends formatted emails to the contact email address

### Job Application
- **POST** `/api/application`
- Handles job application submissions with CV uploads or links
- Supports multiple CV submission methods (upload, Google Drive, Dropbox)
- Sends formatted emails to the HR email address

## Setup Instructions

### Prerequisites
- **Bun** runtime (recommended) or Node.js
- Email account with SMTP access (Gmail, Outlook, etc.)

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables:
   Copy `.env` file and update the values:
   ```bash
   cp .env .env.local
   ```

   Update the following variables in `.env`:
   ```env
   # Server Configuration
   PORT=3005
   NODE_ENV=development

   # Email Configuration (required for form submissions)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # Contact Email (where contact form submissions are sent)
   CONTACT_EMAIL=contact@ikengineering.co.nz

   # Application Email (where job applications are sent)
   APPLICATION_SUBMISSION_EMAIL=hr@ikengineering.co.nz

   # CORS Configuration
   FRONTEND_URL=http://localhost:8080

   # File Upload Configuration
   MAX_FILE_SIZE=5242880  # 5MB in bytes
   UPLOAD_DIR=uploads
   ```

### Gmail SMTP Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use your Gmail address as `SMTP_USER` and the app password as `SMTP_PASS`

### Running the Server

#### Development Mode (with hot reload)
```bash
bun run dev
```

#### Production Mode
```bash
bun run start
```

The server will start on the port specified in your `.env` file (default: 3005).

## Project Structure

```
server/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── contactController.ts
│   │   └── applicationController.ts
│   ├── middleware/           # Express middleware
│   │   ├── cors.ts
│   │   └── upload.ts
│   ├── routes/               # API routes
│   │   └── api.ts
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   └── email.ts
│   └── server.ts             # Main server file
├── uploads/                  # File upload directory (auto-created)
├── .env                      # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## File Upload Configuration

- **Maximum file size**: 5MB (configurable via `MAX_FILE_SIZE`)
- **Allowed file types**:
  - Contact form: PDF, DOC, DOCX, JPG, JPEG, PNG, DWG
  - Job applications: PDF, DOC, DOCX
- **Upload directory**: `uploads/` (relative to server root)

## Security Features

- **CORS**: Restricted to same-origin requests only
- **File validation**: Strict file type and size checking
- **Rate limiting**: Prevents API abuse
- **Input validation**: Type-safe request handling

## Deployment

1. Build the React frontend:
   ```bash
   cd ../client
   bun run build
   ```

2. The server will automatically serve the built files from `../client/dist`

3. Set `NODE_ENV=production` in your environment

4. Use a process manager like PM2 for production:
   ```bash
   bun install -g pm2
   pm2 start src/server.ts --name "ik-engineering-server"
   ```
pm2 start src/server.ts --name "ikengineering"
## Troubleshooting

### Email not sending
- Verify SMTP credentials in `.env`
- Check if your email provider requires app passwords
- Ensure firewall allows SMTP connections

### CORS errors
- Verify `FRONTEND_URL` matches your frontend URL exactly
- Check browser console for CORS error details

### File upload issues
- Ensure `uploads/` directory exists and is writable
- Check file size limits
- Verify supported file types

### Build issues
- Run `bun run type-check` to check for TypeScript errors
- Ensure all dependencies are installed

## License

ISC
