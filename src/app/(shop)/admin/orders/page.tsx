// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedOrders } from '@/actions';
import { Title } from '@/components';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';

export default async function() {

  const { ok, data: orders } = await getPaginatedOrders();

  if( !ok )
    redirect('/auth/login');

  return (
    <>
      <Title title="Todas las ordenes" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                #ID
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Nombre completo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Estado
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
          {
            orders?.map(item => (
              <tr key={item.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  { item.id.split('-').at(1) }
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  { item.OrderAddress?.firstName } { item.OrderAddress?.lastName }
                </td>
                <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {
                  item.isPaid
                   ? (
                    <>                    
                      <IoCardOutline className="text-green-800" />
                      <span className='mx-2 text-green-800'>Pagada</span>
                    </>
                   ) : (
                    <>                    
                      <IoCardOutline className="text-red-800" />
                    <span className='mx-2 text-red-800'>No Pagada</span>
                    </>
                   )
                }
                </td>
                <td className="text-sm text-gray-900 font-light px-6 ">
                  <Link href={`/orders/${item.id}`} className="hover:underline">
                    Ver orden
                  </Link>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </>
  );
}