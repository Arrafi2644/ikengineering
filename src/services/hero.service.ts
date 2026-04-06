import AppError from '@/errorHelpers/appError';
import { IHero } from '@/interfaces/Hero.interface';
import { Hero } from '@/models/hero.model';
import httpStatus from 'http-status-codes';

const createHero = async (payload: Partial<IHero>) => {
    const isHeroExist = await Hero.findOne({ title: payload.title });
    if (isHeroExist) {
        throw new AppError(httpStatus.CONFLICT, "Hero already exists");
    }

    const hero = await Hero.create(payload);
    return hero;
};

const getSingleHero = async (heroId: string) => {

    const hero = await Hero.findById(heroId)

    if (!hero) {
        throw new AppError(httpStatus.NOT_FOUND, "Hero not found")
    }

    return hero;
};

// const updateHero = async (
//     heroId: string,
//     payload: Partial<IHero>
// ) => {
//     const existingHero = await Hero.findById(heroId);

//     if (!existingHero) {
//         throw new AppError(httpStatus.NOT_FOUND, "Hero not found");
//     }

//     const updatedHero = await Hero.findByIdAndUpdate(
//         heroId,
//         payload,
//         { new: true, runValidators: true }
//     );

//     return updatedHero;

// };

const updateHero = async (
    heroId: string,
    payload: Partial<IHero>
) => {
    const hero = await Hero.findById(heroId);
    if (!hero) {
        throw new AppError(httpStatus.NOT_FOUND, "Hero not found");
    }

    const updatedHero = await Hero.findByIdAndUpdate(
        heroId,
        payload,
        { new: true, runValidators: true }
    );

    return updatedHero;
};

export const HeroServices = {
    createHero,
    getSingleHero,
    updateHero,
}