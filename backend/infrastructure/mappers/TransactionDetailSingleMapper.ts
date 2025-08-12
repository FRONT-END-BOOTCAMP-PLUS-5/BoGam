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
  return {
    resYear: String(item.resYear ?? ''),
    resMonth: String(item.resMonth ?? ''),
    resDays: String(item.resDays ?? ''),
    resAddrDong: String(item.resAddrDong ?? ''),
    resStreetNumber: String(item.resStreetNumber ?? ''),
    resRoadName: String(item.resRoadName ?? ''),
    resArea: String(item.resArea ?? ''),
    resArea1: String(item.resArea1 ?? ''),
    resCancelDate: item.resCancelDate ? String(item.resCancelDate) : undefined,
    resTranAmount: String(item.resTranAmount ?? ''),
    resDealType: String(item.resDealType ?? ''),
    resLocation: item.resLocation ? String(item.resLocation) : undefined,
    resDesignationYN: item.resDesignationYN
      ? String(item.resDesignationYN)
      : undefined,
    resRoadCondition: String(item.resRoadCondition ?? ''),
    resLandMoveDate: String(item.resLandMoveDate ?? ''),
    resLandMoveReason: String(item.resLandMoveReason ?? ''),
    resMinBLR: item.resMinBLR ? String(item.resMinBLR) : undefined,
    resMaxBLR: item.resMaxBLR ? String(item.resMaxBLR) : undefined,
    resMinFAR: item.resMinFAR ? String(item.resMinFAR) : undefined,
    resMaxFAR: item.resMaxFAR ? String(item.resMaxFAR) : undefined,
    resFloorNum: item.resFloorNum ? String(item.resFloorNum) : undefined,
    resStructure: item.resStructure ? String(item.resStructure) : undefined,
    resBuildYear: String(item.resBuildYear ?? ''),
    resHouseType: String(item.resHouseType ?? ''),
  };
}

function pickRent(item: UnknownRecord): TransactionDetailSingleRentItem {
  return {
    resYear: String(item.resYear ?? ''),
    resMonth: String(item.resMonth ?? ''),
    resDays: String(item.resDays ?? ''),
    resAddrDong: String(item.resAddrDong ?? ''),
    resStreetNumber: String(item.resStreetNumber ?? ''),
    resRoadName: item.resRoadName ? String(item.resRoadName) : undefined,
    resHouseType: String(item.resHouseType ?? ''),
    resArea: String(item.resArea ?? ''),
    commStartDate: item.commStartDate ? String(item.commStartDate) : undefined,
    commEndDate: item.commEndDate ? String(item.commEndDate) : undefined,
    resDeposit: String(item.resDeposit ?? ''),
    resMonthlyRent: String(item.resMonthlyRent ?? ''),
    resContractType: item.resContractType
      ? String(item.resContractType)
      : undefined,
    resRenewalUse: item.resRenewalUse ? String(item.resRenewalUse) : undefined,
    resPrevDeposit: item.resPrevDeposit
      ? String(item.resPrevDeposit)
      : undefined,
    resPrevMonthlyRent: item.resPrevMonthlyRent
      ? String(item.resPrevMonthlyRent)
      : undefined,
    resDesignationYN: item.resDesignationYN
      ? String(item.resDesignationYN)
      : undefined,
    resRoadCondition: String(item.resRoadCondition ?? ''),
    resLandMoveDate: String(item.resLandMoveDate ?? ''),
    resLandMoveReason: String(item.resLandMoveReason ?? ''),
    resMinBLR: item.resMinBLR ? String(item.resMinBLR) : undefined,
    resMaxBLR: item.resMaxBLR ? String(item.resMaxBLR) : undefined,
    resMinFAR: item.resMinFAR ? String(item.resMinFAR) : undefined,
    resMaxFAR: item.resMaxFAR ? String(item.resMaxFAR) : undefined,
    resFloorNum: item.resFloorNum ? String(item.resFloorNum) : undefined,
    resStructure: item.resStructure ? String(item.resStructure) : undefined,
    resBuildYear: String(item.resBuildYear ?? ''),
  };
}

function sanitizeOne(item: unknown): TransactionDetailSingleEntity {
  const out: TransactionDetailSingleEntity = {};
  if (isRecord(item) && Array.isArray(item.resSaleList)) {
    out.resSaleList = item.resSaleList.map((s: unknown) =>
      pickSale(asRecord(s))
    );
  }
  if (isRecord(item) && Array.isArray(item.resRentList)) {
    out.resRentList = item.resRentList.map((r: unknown) =>
      pickRent(asRecord(r))
    );
  }
  return out;
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
