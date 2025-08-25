import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RealEstateFormData } from '@/(anon)/_components/common/realEstate/types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

interface UseRealEstateInputProps {
  formData: RealEstateFormData;
}

export const useRealEstateInput = ({ formData }: UseRealEstateInputProps) => {
  const { selectedAddress } = useUserAddressStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<RealEstateFormData>({
    defaultValues: formData,
  });

  // 선택된 주소가 변경되면 자동으로 address 필드 업데이트
  useEffect(() => {
    if (selectedAddress) {
      const address = `${
        selectedAddress.roadAddress
          ? selectedAddress.roadAddress
          : selectedAddress.lotAddress
      } ${selectedAddress.dong}동 ${selectedAddress.ho}호`;
      setValue('address', address);
      setValue('userAddressNickname', selectedAddress.nickname);
    }
  }, [selectedAddress, setValue]);

  return {
    selectedAddress,
    register,
    handleSubmit,
    errors,
    setValue,
    reset,
    watch,
  };
};
