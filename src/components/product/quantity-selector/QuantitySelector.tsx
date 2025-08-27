'use client'

import { IoMdAddCircleOutline } from "react-icons/io";
import { IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity: number;
    onQuantityChanged: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {

    const onValueChanged = (value: number) => {
        if( (quantity + value ) < 1 ) return;

        onQuantityChanged( quantity + value );
    }

    return (
        <div className="flex">
            <button onClick={() => onValueChanged( -1 ) }>
                <IoRemoveCircleOutline size={30} />
            </button>

            <div className="w-20 mx-3 px-5 bg-gray-200 text-center rounded">
                { quantity }
            </div>

            <button onClick={() => onValueChanged( +1 ) }>
                <IoMdAddCircleOutline size={30} />
            </button>
        </div>
    )
}
