import { useQuery, useMutation } from '@tanstack/react-query';
import { taxCertApi, TaxCertIssueRequest } from '@libs/api_front/taxCert.api';
import { taxCertCopyApi } from '@libs/api_front/taxCertCopy.api';

export const useCheckTaxCertExists = (nickname: string) => {
  return useQuery({
    queryKey: ['taxCert', 'exists', nickname],
    queryFn: () => taxCertApi.checkTaxCertExists(nickname),
    enabled: !!nickname,
  });
};

export const useGetTaxCertCopy = (userAddressNickname: string) => {
  return useQuery({
    queryKey: ['taxCertCopy', userAddressNickname],
    queryFn: () => taxCertCopyApi.getTaxCertCopy({ userAddressNickname }),
    enabled: !!userAddressNickname,
  });
};

export const useIssueTaxCert = () => {
  return useMutation({
    mutationFn: (data: TaxCertIssueRequest) => taxCertApi.issueTaxCert(data),
  });
};
