import { Country } from "@/interfaces/country.interface";
import prisma from "@/lib/prisma"

type funcReturn = {
    ok: boolean;
    message?: string;
    countries: Country[];
}

export const getCountries = async (): Promise<funcReturn> => {    
    try {
        
        const countries = await prisma.country.findMany();

        return {
            ok: true,
            countries
        };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'No se pudo obtener los paises',
            countries: []
        }
    }
}