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
    item.resDong ? String(item.resDong) : undefined,
    // 전월세 전용 필드들
    item.commStartDate ? String(item.commStartDate) : undefined,
    item.commEndDate ? String(item.commEndDate) : undefined,
    item.resDeposit ? String(item.resDeposit) : undefined,
    item.resMonthlyRent ? String(item.resMonthlyRent) : undefined,
    item.resContractType ? String(item.resContractType) : undefined,
    item.resRenewalUse ? String(item.resRenewalUse) : undefined,
    item.resPrevDeposit ? String(item.resPrevDeposit) : undefined,
    item.resPrevMonthlyRent ? String(item.resPrevMonthlyRent) : undefined,
    item.resDesignationYN ? String(item.resDesignationYN) : undefined,
    item.resRoadCondition ? String(item.resRoadCondition) : undefined,
    item.resLandMoveDate ? String(item.resLandMoveDate) : undefined,
    item.resLandMoveReason ? String(item.resLandMoveReason) : undefined,
    item.resMinBLR ? String(item.resMinBLR) : undefined,
    item.resMaxBLR ? String(item.resMaxBLR) : undefined,
    item.resMinFAR ? String(item.resMinFAR) : undefined,
    item.resMaxFAR ? String(item.resMaxFAR) : undefined,
    item.resStructure ? String(item.resStructure) : undefined,
    item.resBuildYear ? String(item.resBuildYear) : undefined
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
