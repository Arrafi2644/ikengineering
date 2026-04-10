import { envVars } from '@/config/env';
import httpStatus from 'http-status-codes';
import AppError from '@/errorHelpers/appError';
import { IContactFormData } from '@/interfaces/contact.interface';
import { ContactForm } from '@/models/contact.model';
import { sendEmail } from '@/utils/sendEmail';
import { QueryBuilder } from '@/utils/QueryBuilder';
import { ContactFormSearchableFields } from '@/constants/contact.constants';

const submitContactForm = async (payload: IContactFormData) => {

    const result = await ContactForm.create(payload);

    await Promise.all([
        sendEmail({
            to: envVars.CONTACT_EMAIL,
            subject: "New Contact Form Submission",
            templateName: "contact-form",
            templateData: {
                name: result.name,
                email: result.email,
                phone: result.phone,
                company: result.company || "N/A",
                preferredContactTime: result.preferredContactTime || "N/A",
                projectType: result.projectType,
                projectDetails: result.projectDetails,
                uploadSpec: result?.uploadSpec?.length
                    ? result.uploadSpec
                        .map((file: string, i: number) => `${i + 1}. ${file}`)
                        .join("\n")
                    : "N/A",
            },
        }),
    ]);

    return result;
};


const getSingleContactForm = async (id: string) => {
    const result = await ContactForm.findById(id);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Form not found");
    }

    return result;
};

const getAllSubmittedFormData = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(ContactForm.find(), query);

    const messages = await queryBuilder
        .search(ContactFormSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        messages.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};

const deleteContactForm = async (id: string) => {
    const result = await ContactForm.findByIdAndDelete(id);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Form not found");
    }

    return result;
};

export const ContactFormServices = {
    submitContactForm,
    getSingleContactForm,
    getAllSubmittedFormData,
    deleteContactForm

}