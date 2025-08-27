import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getCountries } from '@/actions/country/get-countries';
import { getUserAddress } from '@/actions';
import { auth } from '@/auth.config';

export default async function NamePage() {

  const { countries } = await getCountries();
  
  const session = await auth();
  
  if( !session?.user )
    return (<span className='text-red-500'>No hay sesión activa</span>);

  const { data: userAddressStored } = await getUserAddress(session.user.id);

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">

      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm countries={countries} userAddressStored={userAddressStored} />

      </div>

    </div>
  );
}