export type CvOption = "upload" | "gdrive" | "dropbox";

export interface IJobApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;

  cvOption: CvOption;

  cvFile?: string; 
  googleDriveLink?: string;
  dropboxLink?: string;

  coverLetter?: string;
}