import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import { CodefResponse } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';

export interface TaxCertRepository {
  requestTaxCert(request: GetTaxCertRequestDto): Promise<CodefResponse>;
  requestTaxCertTwoWay(
    request: GetTaxCertRequestDto
  ): Promise<CodefResponse>;
}
