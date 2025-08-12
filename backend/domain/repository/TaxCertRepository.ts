import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import { GetTaxCertResponseDto } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';

export interface TaxCertRepository {
  requestTaxCert(request: GetTaxCertRequestDto): Promise<GetTaxCertResponseDto>;
  requestTaxCertTwoWay(
    request: GetTaxCertRequestDto
  ): Promise<GetTaxCertResponseDto>;
}
