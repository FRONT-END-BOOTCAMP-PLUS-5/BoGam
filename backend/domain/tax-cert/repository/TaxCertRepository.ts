import { TaxCertRequest, TaxCertTwoWayRequest, CodefResponse } from '../../../applications/tax-cert/dtos/TaxCertDto';

export interface TaxCertRepository {
  requestTaxCert(request: TaxCertRequest): Promise<CodefResponse>;
  requestTaxCertTwoWay(request: TaxCertTwoWayRequest): Promise<CodefResponse>;
} 