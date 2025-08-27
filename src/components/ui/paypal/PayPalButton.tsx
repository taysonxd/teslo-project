'use client'

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js';
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
  orderId: string;
  amount: number;
}

export const PayPalButton = ({ orderId, amount }: Props) => {

  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = async(data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

    const roundedMount = (Math.round(amount * 100)) / 100 ;

    const transactionId = await actions.order.create({
      purchase_units: [        
        {          
          invoice_id: orderId,
          amount: {
            currency_code: 'USD',
            value: `${ roundedMount }`
          }
        }
      ],
      intent: 'CAPTURE'
    });

    const { ok, message } = await setTransactionId(orderId, transactionId);

    if( !ok )
      throw new Error(message);      

    return transactionId;
  };

  const onApprove = async(data: OnApproveData, actions: OnApproveActions): Promise<void> => {

    const details = await actions.order?.capture();

    if( !details ) return;

    await paypalCheckPayment(details.id!);
  }

  if( isPending )
    return (
      <div className="animate-pulse mb-16">        
        <div className="h-11 bg-gray-300 rounded" />
        <div className="h-11 bg-gray-300 rounded mt-3" />
      </div>
    );

  return (
    <div className="relative z-0">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </div>
  )
}
