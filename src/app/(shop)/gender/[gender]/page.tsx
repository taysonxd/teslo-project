export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductosGrid, Title } from "@/components";
import { Gender } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    page?: string;    
  }>;
  params: Promise<{
    gender: Gender
  }>
}

export default async function({ params, searchParams }: Props) {
  
  const { gender } = await params;
  const queryParams = await searchParams;    
  const page = queryParams.page ? parseInt(queryParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page, gender});

  const genders: Record<Gender, { title: string; subtitle: string }>  = {
    'kid': {
      title: 'Niños',
      subtitle: 'Todos los productos para niños'
    },
    'women': {
      title: 'Mujeres',
      subtitle: 'Todos los productos para mujeres'
    },
    'men': {
      title: 'Hombres',
      subtitle: 'Todos los productos para hombres'
    },
    'unisex': {
      title: 'Unisex',
      subtitle: 'Productos para todos los generos'
    },
  }
  
  return (
    <>
      <Title
        title={ genders[gender].title }
        subtitle={ genders[gender].subtitle }
        className="mb-2"
      />

      <ProductosGrid products={ products } />

      <Pagination totalPages={ totalPages} /> 
    </>   
  );
}
