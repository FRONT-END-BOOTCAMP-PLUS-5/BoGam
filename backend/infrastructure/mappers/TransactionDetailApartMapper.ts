import { GetTransactionDetailResponseDto } from '@be/applications/transactionDetails/dtos/GetTransactionDetailResponseDto';
import {
  TransactionDetailApartEntity,
  TransactionDetailApartRentItem,
  TransactionDetailApartSaleItem,
} from '@be/domain/entities/TransactionDetailApart';

function pickSale(
  item: Record<string, unknown>
): TransactionDetailApartSaleItem {
  return new TransactionDetailApartSaleItem(
    String(item.resYear ?? ''),
    String(item.resMonth ?? ''),
    String(item.resDays ?? ''),
    String(item.resArea ?? ''),
    String(item.resTranAmount ?? ''),
    String(item.resFloor ?? ''),
    item.resArea1 ? String(item.resArea1) : undefined,
    item.resCancelYN ? String(item.resCancelYN) : undefined,
    item.resRegistrationDate ? String(item.resRegistrationDate) : undefined,
    item.resDealType ? String(item.resDealType) : undefined,
    item.resLocation ? String(item.resLocation) : undefined,
    item.resFloorNum ? String(item.resFloorNum) : undefined,
    item.resDong ? String(item.resDong) : undefined
  );
}

function pickRent(
  item: Record<string, unknown>
): TransactionDetailApartRentItem {
  return new TransactionDetailApartRentItem(
    String(item.resYear ?? ''),
    String(item.resMonth ?? ''),
    String(item.resDays ?? ''),
    String(item.resArea ?? ''),
    String(item.resTranAmount ?? ''),
    String(item.resFloor ?? ''),
    item.resArea1 ? String(item.resArea1) : undefined,
    item.resCancelYN ? String(item.resCancelYN) : undefined,
    item.resRegistrationDate ? String(item.resRegistrationDate) : undefined,
    item.resDealType ? String(item.resDealType) : undefined,
    item.resLocation ? String(item.resLocation) : undefined,
    item.resFloorNum ? String(item.resFloorNum) : undefined,
    item.resDong ? String(item.resDong) : undefined
  );
}

function sanitizeOne(
  item: Record<string, unknown>
): TransactionDetailApartEntity {
  const saleList = Array.isArray(item?.resSaleList)
    ? item.resSaleList.map((s: Record<string, unknown>) => pickSale(s))
    : undefined;
  const rentList = Array.isArray(item?.resRentList)
    ? item.resRentList.map((r: Record<string, unknown>) => pickRent(r))
    : undefined;

  return new TransactionDetailApartEntity(saleList, rentList);
}

export function sanitizeTransactionDetailApartResponse(
  response: GetTransactionDetailResponseDto
): GetTransactionDetailResponseDto {
  if (!response?.data) return response;

  const sanitized = sanitizeOne(response.data as Record<string, unknown>);

  return {
    ...response,
    data: {
      resSaleList: sanitized.resSaleList,
      resRentList: sanitized.resRentList,
    },
  };
}
