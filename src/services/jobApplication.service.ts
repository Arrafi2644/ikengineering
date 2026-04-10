import { IJobApplication } from "@/interfaces/jobApplication.interface";
import { JobApplication } from "@/models/jobApplication.model";
import { sendEmail } from "@/utils/sendEmail";
import { envVars } from "@/config/env";
import AppError from "@/errorHelpers/appError";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "@/utils/QueryBuilder";
import { JobApplicationSearchableFields } from "@/constants/jobApplication.constants";

const submitJobApplication = async (payload: IJobApplication) => {

  const result = await JobApplication.create(payload);

  await sendEmail({
    to: envVars.CONTACT_EMAIL,
    subject: "New Job Application Received",
    templateName: "job-application",
    templateData: {

      firstName: result.firstName,
      lastName: result.lastName,

      email: result.email,
      phone: result.phone,
      position: result.position,

      cvOption: result.cvOption,
      cvFile: result.cvFile || null,
      googleDriveLink: result.googleDriveLink || null,
      dropboxLink: result.dropboxLink || null,

      coverLetter: result.coverLetter || null,
    },
  });

  return result;
};


const getSingleJobApplication = async (id: string) => {
    const result = await JobApplication.findById(id);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Job application not found");
    }

    return result;
};

const getAllJobApplications = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(JobApplication.find(), query);

    const messages = await queryBuilder
        .search(JobApplicationSearchableFields)
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

const deleteJobApplication = async (id: string) => {
    const result = await JobApplication.findByIdAndDelete(id);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Job application not found");
    }

    return result;
};

export const JobApplicationServices = {
  submitJobApplication,
  getSingleJobApplication,
  getAllJobApplications,
  deleteJobApplication
};