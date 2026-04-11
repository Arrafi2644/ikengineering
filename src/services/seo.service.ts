import { SEOSearchableFields } from '@/constants/seo.constants';
import AppError from '@/errorHelpers/appError';
import { ISEO } from '@/interfaces/seo.interface';
import { SEO } from '@/models/seo.model';
import { QueryBuilder } from '@/utils/QueryBuilder';
import httpStatus from 'http-status-codes';


const getSinglePageSEO = async (pagePath: string): Promise<ISEO | null> => {
    const seo = await SEO.findOne({ pagePath });
    if(!seo){
        throw new AppError(httpStatus.NOT_FOUND, "SEO info not found for this path")
    }
    return seo;
};

const createSEO = async (payload: ISEO): Promise<ISEO> => {
    const existing = await SEO.findOne({ pagePath: payload.pagePath });
    if (existing) {
        throw new AppError(httpStatus.CONFLICT, "SEO info for this page already exists. Use update instead.");
    }
    const newSEO = await SEO.create(payload);
    return newSEO;
};

const updateSEO = async (id: string, payload: Partial<ISEO>): Promise<ISEO> => {
    // First, check if SEO exists
    const existing = await SEO.findById(id);

    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, "No SEO info found for this page.");
    }

    // Update the document by id
    const updated = await SEO.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true } // return updated doc & validate
    );

    if (!updated) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update SEO info.");
    }

    return updated;
};



const deleteSEO = async (pagePath: string): Promise<ISEO> => {
    const existing = await SEO.findOne({ pagePath });

    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, "No SEO info found for this page.");
    }

    const deleted = await SEO.findByIdAndDelete(existing._id);

    if (!deleted) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete SEO info.");
    }

    return deleted;
};

const getAllSeo = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(SEO.find(), query);

  const seoResults = await queryBuilder
    .search(SEOSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    seoResults.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};


export const SEOServices = {
    getSinglePageSEO,
    createSEO,
    updateSEO,
    deleteSEO,
    getAllSeo
};
