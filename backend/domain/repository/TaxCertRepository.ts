import { TaxCertRequest, TaxCertTwoWayRequest, CodefResponse } from '@be/applications/taxCert/dtos/TaxCertDto';

export interface TaxCertRepository {
  requestTaxCert(request: TaxCertRequest): Promise<CodefResponse>;
  requestTaxCertTwoWay(request: TaxCertTwoWayRequest): Promise<CodefResponse>;
} 