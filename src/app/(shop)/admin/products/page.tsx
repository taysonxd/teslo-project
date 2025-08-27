// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, Title } from '@/components';

import { ProductsTable } from './ui/ProductsTable';
import Link from 'next/link';

interface Props {
  searchParams: Promise<{
    page?: string;
  }>
}

export default async function({ searchParams }: Props) {

  const queryParams = await searchParams;    
  const page = queryParams.page ? parseInt(queryParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page });
    
  return (
    <>
      <Title title="Mantenimiento de productos" />

      <div className='flex justify-end mb-2'>
        <Link href="/admin/product/new" className='btn-primary'>Nuevo producto</Link>
      </div>
      <div className="mb-10">
        <ProductsTable products={products} />

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}