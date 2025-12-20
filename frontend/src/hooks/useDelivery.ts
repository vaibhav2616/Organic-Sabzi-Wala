import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../features/store';
import { checkDelivery, setZipCode, resetDelivery } from '../features/delivery/deliverySlice';

export const useDelivery = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { zipCode, city, deliveryTimeHrs, isServiceable, isLoading, error } = useSelector((state: RootState) => state.delivery);

    const checkZip = (zip: string) => {
        dispatch(setZipCode(zip));
        dispatch(checkDelivery(zip));
    };

    const reset = () => {
        dispatch(resetDelivery());
    };

    return {
        zipCode,
        city,
        deliveryTimeHrs,
        isServiceable,
        isLoading,
        error,
        checkZip,
        reset
    };
};
