export const revalidate = 60;

import { redirect } from "next/navigation";
import { Pagination, ProductosGrid, Title } from "@/components";
import { getPaginatedProductsWithImages } from "@/actions";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>
}

export default async function ShopPage({ searchParams }: Props) {

  const queryParams = await searchParams;    
  const page = queryParams.page ? parseInt(queryParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page });
    
  if( !products.length )
    redirect('/');

  return (
    <>
      <Title
        title="Productos"
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductosGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
