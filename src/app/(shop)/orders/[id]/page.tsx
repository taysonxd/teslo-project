
import { redirect } from 'next/navigation';

import { getOrderById } from '@/actions';
import { ProductsInCart } from './ui/ProductsInCart';
import { OrderSummary } from './ui/OrderSummary';
import { OrderStatus, Title } from '@/components';

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function({ params }: Props) {

  const { id } = await params;

  const { ok, data: order }: any = await getOrderById(id);
    
  if( !ok )
    redirect('/');

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id}`} />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>

          <div className='flex flex-col mt-5'>

            <OrderStatus isPaid={order!.isPaid} /> 

            {/* Items */}
            <ProductsInCart items={order!.OrderItem} />
          </div>

          {/* Checkout - Resumen de la orden */}
          <OrderSummary order={order!} />
        </div>
      </div>
    </div>
  );
}
