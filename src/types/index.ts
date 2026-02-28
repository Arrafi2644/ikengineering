// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  projectDetails: string;
  uploadSpec?: Express.Multer.File;
  preferredContactTime?: string;
}

export interface ContactFormRequest extends Omit<ContactFormData, 'uploadSpec'> {
  uploadSpec?: string; // filename after upload
}

// Job Application Form Types
export interface JobApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  cvOption: 'upload' | 'gdrive' | 'dropbox';
  cvFile?: Express.Multer.File;
  googleDriveLink?: string;
  dropboxLink?: string;
  coverLetter?: string;
}

export interface JobApplicationRequest extends Omit<JobApplicationData, 'cvFile'> {
  cvFile?: string; // filename after upload
}

// API Response Types
export interface ApiResponse<T = Record<string, unknown>> {
  success?: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Email Configuration Types
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
