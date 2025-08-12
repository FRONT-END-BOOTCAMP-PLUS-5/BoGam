import { GetTransactionDetailResponseDto } from '@be/applications/transactionDetails/dtos/GetTransactionDetailResponseDto';
import {
  TransactionDetailApartEntity,
  TransactionDetailApartRentItem,
  TransactionDetailApartSaleItem,
} from '@be/domain/entities/TransactionDetailApart';

function pickSale(
  item: Record<string, unknown>
): TransactionDetailApartSaleItem {
  return {
    resYear: String(item.resYear ?? ''),
    resMonth: String(item.resMonth ?? ''),
    resDays: String(item.resDays ?? ''),
    resArea: String(item.resArea ?? ''),
    resArea1: item.resArea1 ? String(item.resArea1) : undefined,
    resCancelYN: item.resCancelYN ? String(item.resCancelYN) : undefined,
    resRegistrationDate: item.resRegistrationDate
      ? String(item.resRegistrationDate)
      : undefined,
    resTranAmount: String(item.resTranAmount ?? ''),
    resFloor: String(item.resFloor ?? ''),
    resDealType: item.resDealType ? String(item.resDealType) : undefined,
    resLocation: item.resLocation ? String(item.resLocation) : undefined,
    resFloorNum: item.resFloorNum ? String(item.resFloorNum) : undefined,
    resDong: item.resDong ? String(item.resDong) : undefined,
  };
}

function pickRent(
  item: Record<string, unknown>
): TransactionDetailApartRentItem {
  return {
    resYear: String(item.resYear ?? ''),
    resMonth: String(item.resMonth ?? ''),
    resDays: String(item.resDays ?? ''),
    resArea: String(item.resArea ?? ''),
    resArea1: item.resArea1 ? String(item.resArea1) : undefined,
    resCancelYN: item.resCancelYN ? String(item.resCancelYN) : undefined,
    resRegistrationDate: item.resRegistrationDate
      ? String(item.resRegistrationDate)
      : undefined,
    resTranAmount: String(item.resTranAmount ?? ''),
    resFloor: String(item.resFloor ?? ''),
    resDealType: item.resDealType ? String(item.resDealType) : undefined,
    resLocation: item.resLocation ? String(item.resLocation) : undefined,
    resFloorNum: item.resFloorNum ? String(item.resFloorNum) : undefined,
    resDong: item.resDong ? String(item.resDong) : undefined,
  };
}

function sanitizeOne(
  item: Record<string, unknown>
): TransactionDetailApartEntity {
  const out: TransactionDetailApartEntity = {};
  if (Array.isArray(item?.resSaleList)) {
    out.resSaleList = item.resSaleList.map((s: Record<string, unknown>) =>
      pickSale(s)
    );
  }
  if (Array.isArray(item?.resRentList)) {
    out.resRentList = item.resRentList.map((r: Record<string, unknown>) =>
      pickRent(r)
    );
  }
  return out;
}

export function sanitizeTransactionDetailApartResponse(
  response: GetTransactionDetailResponseDto
): GetTransactionDetailResponseDto {
  if (!response?.data) return response;

  if (Array.isArray(response.data)) {
    const mapped = response.data.map((d: unknown) =>
      sanitizeOne(d as Record<string, unknown>)
    );
    return { ...response, data: mapped };
  }

  const mappedOne = sanitizeOne(response.data as Record<string, unknown>);
  return { ...response, data: mappedOne };
}
