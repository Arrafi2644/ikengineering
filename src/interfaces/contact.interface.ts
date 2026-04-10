export interface IContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  projectDetails: string;
  uploadSpec?: string[];
  preferredContactTime?: string;
}