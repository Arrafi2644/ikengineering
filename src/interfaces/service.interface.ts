
export interface IFeature {
    title: string;
}

export interface IService {
    _id?: string;
    title: string;
    slug?: string;
    serviceIcon: string;
    shortDescription: string;
    image: string;
    features: IFeature[];
    createdAt?: string;
    updatedAt?: string;
}