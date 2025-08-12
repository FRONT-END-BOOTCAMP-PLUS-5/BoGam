import { GetTransactionDetailResponseDto } from '@be/applications/transactionDetails/dtos/GetTransactionDetailResponseDto';
import {
  TransactionDetailSingleEntity,
  TransactionDetailSingleRentItem,
  TransactionDetailSingleSaleItem,
} from '@be/domain/entities/TransactionDetailSingle';

type UnknownRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is UnknownRecord =>
  typeof v === 'object' && v !== null;
const asRecord = (v: unknown): UnknownRecord => (isRecord(v) ? v : {});

function pickSale(item: UnknownRecord): TransactionDetailSingleSaleItem {
  return new TransactionDetailSingleSaleItem(
    String(item.resYear ?? ''),
    String(item.resMonth ?? ''),
    String(item.resDays ?? ''),
    String(item.resAddrDong ?? ''),
    String(item.resStreetNumber ?? ''),
    String(item.resRoadName ?? ''),
    String(item.resArea ?? ''),
    String(item.resArea1 ?? ''),
    String(item.resTranAmount ?? ''),
    String(item.resDealType ?? ''),
    String(item.resRoadCondition ?? ''),
    String(item.resLandMoveDate ?? ''),
    String(item.resLandMoveReason ?? ''),
    String(item.resBuildYear ?? ''),
    String(item.resHouseType ?? ''),
    item.resCancelDate ? String(item.resCancelDate) : undefined,
    item.resLocation ? String(item.resLocation) : undefined,
    item.resDesignationYN ? String(item.resDesignationYN) : undefined,
    item.resMinBLR ? String(item.resMinBLR) : undefined,
    item.resMaxBLR ? String(item.resMaxBLR) : undefined,
    item.resMinFAR ? String(item.resMinFAR) : undefined,
    item.resMaxFAR ? String(item.resMaxFAR) : undefined,
    item.resFloorNum ? String(item.resFloorNum) : undefined,
    item.resStructure ? String(item.resStructure) : undefined
  );
}

function pickRent(item: UnknownRecord): TransactionDetailSingleRentItem {
  return new TransactionDetailSingleRentItem(
    String(item.resYear ?? ''),
    String(item.resMonth ?? ''),
    String(item.resDays ?? ''),
    String(item.resAddrDong ?? ''),
    String(item.resStreetNumber ?? ''),
    String(item.resHouseType ?? ''),
    String(item.resArea ?? ''),
    String(item.resDeposit ?? ''),
    String(item.resMonthlyRent ?? ''),
    String(item.resRoadCondition ?? ''),
    String(item.resLandMoveDate ?? ''),
    String(item.resLandMoveReason ?? ''),
    String(item.resBuildYear ?? ''),
    item.resRoadName ? String(item.resRoadName) : undefined,
    item.commStartDate ? String(item.commStartDate) : undefined,
    item.commEndDate ? String(item.commEndDate) : undefined,
    item.resContractType ? String(item.resContractType) : undefined,
    item.resRenewalUse ? String(item.resRenewalUse) : undefined,
    item.resPrevDeposit ? String(item.resPrevDeposit) : undefined,
    item.resPrevMonthlyRent ? String(item.resPrevMonthlyRent) : undefined,
    item.resDesignationYN ? String(item.resDesignationYN) : undefined,
    item.resMinBLR ? String(item.resMinBLR) : undefined,
    item.resMaxBLR ? String(item.resMaxBLR) : undefined,
    item.resMinFAR ? String(item.resMinFAR) : undefined,
    item.resMaxFAR ? String(item.resMaxFAR) : undefined,
    item.resFloorNum ? String(item.resFloorNum) : undefined,
    item.resStructure ? String(item.resStructure) : undefined
  );
}

function sanitizeOne(item: unknown): TransactionDetailSingleEntity {
  const saleList =
    isRecord(item) && Array.isArray(item.resSaleList)
      ? item.resSaleList.map((s: unknown) => pickSale(asRecord(s)))
      : undefined;
  const rentList =
    isRecord(item) && Array.isArray(item.resRentList)
      ? item.resRentList.map((r: unknown) => pickRent(asRecord(r)))
      : undefined;

  return new TransactionDetailSingleEntity(saleList, rentList);
}

export function sanitizeTransactionDetailSingleResponse(
  response: GetTransactionDetailResponseDto
): GetTransactionDetailResponseDto {
  const rawData: unknown = (response as { data?: unknown }).data;
  if (!rawData) return response;
  if (Array.isArray(rawData)) {
    const mapped = rawData.map((d: unknown) => sanitizeOne(d));
    return { ...response, data: mapped } as GetTransactionDetailResponseDto;
  }
  const mappedOne = sanitizeOne(rawData);
  return { ...response, data: mappedOne } as GetTransactionDetailResponseDto;
}
