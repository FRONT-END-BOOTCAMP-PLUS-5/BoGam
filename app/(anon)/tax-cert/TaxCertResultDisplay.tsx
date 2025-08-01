'use client';

import { CodefResponse, TaxCertRespiteItem, TaxCertArrearsItem } from '../../../backend/applications/taxCert/dtos/TaxCertDto';
import { extractActualData } from '../../../libs/responseUtils';
import styles from './TaxCertResultDisplay.module.css';

interface TaxCertResultDisplayProps {
  response: CodefResponse;
}

export default function TaxCertResultDisplay({ response }: TaxCertResultDisplayProps) {
  // 디버깅을 위한 로그
  console.log('🔍 원본 응답:', response);
  
  // 중첩된 응답 구조에서 실제 데이터 추출
  const data = extractActualData(response);
  
  console.log('🔍 추출된 데이터:', data);

  if (!data) {
    // data가 없으면 원본 응답을 표시
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>📄 납세증명서 발급 결과</h3>
          <div className={`${styles.statusContainer} ${styles.statusWarning}`}>
            <p className={`${styles.statusText} ${styles.statusTextWarning}`}>
              ⚠️ 응답 데이터를 파싱할 수 없습니다. 원본 응답을 표시합니다.
            </p>
          </div>
        </div>
        
        <div className={styles.originalDataContent}>
          <h4 className={styles.originalDataTitle}>원본 응답</h4>
          <pre className={styles.originalDataContent}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>📄 납세증명서 발급 결과</h3>
      </div>

      {/* 기본 정보 */}
      <div className={styles.infoGrid}>
        <div className={styles.infoSection}>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>발급번호</label>
            <p className={styles.infoValue}>{data.resIssueNo || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>성명(대표자)</label>
            <p className={styles.infoValue}>{data.resUserNm || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>주소(본점)</label>
            <p className={styles.infoValueSecondary}>{data.resUserAddr || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>주민등록번호</label>
            <p className={styles.infoValueSecondary}>{data.resUserIdentiyNo || '-'}</p>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>상호(법인명)</label>
            <p className={styles.infoValue}>{data.resCompanyNm || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>사업자등록번호</label>
            <p className={styles.infoValueSecondary}>{data.resCompanyIdentityNo || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>납세상태</label>
            <p className={styles.infoValueSecondary}>{data.resPaymentTaxStatus || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>증명서 사용목적</label>
            <p className={styles.infoValueSecondary}>{data.resUsePurpose || '-'}</p>
          </div>
        </div>
      </div>

      {/* 발급 정보 */}
      <div className={styles.infoGrid}>
        <div className={styles.infoSection}>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>접수번호</label>
            <p className={styles.infoValue}>{data.resReceiptNo || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>발급기관</label>
            <p className={styles.infoValueSecondary}>{data.resIssueOgzNm || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>발급일자</label>
            <p className={styles.infoValueSecondary}>{data.resIssueDate || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>담당부서</label>
            <p className={styles.infoValueSecondary}>{data.resDepartmentName || '-'}</p>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>담당자</label>
            <p className={styles.infoValueSecondary}>{data.resUserNm1 || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>연락처</label>
            <p className={styles.infoValueSecondary}>{data.resPhoneNo || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>유효기간</label>
            <p className={styles.infoValueSecondary}>{data.resValidPeriod || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>유효기간 사유</label>
            <p className={styles.infoValueSecondary}>{data.resReason || '-'}</p>
          </div>
        </div>
      </div>

      {/* 징수유예등 또는 체납처분유예의 명세 */}
      {data.resRespiteList && data.resRespiteList.length > 0 && (
        <div className={styles.tableContainer}>
          <h4 className={styles.tableTitle}>징수유예등 또는 체납처분유예의 명세</h4>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>유예종류</th>
                  <th className={styles.tableHeaderCell}>유예기간</th>
                  <th className={styles.tableHeaderCell}>과세년도</th>
                  <th className={styles.tableHeaderCell}>세목</th>
                  <th className={styles.tableHeaderCell}>납부기한</th>
                  <th className={styles.tableHeaderCell}>지방세액</th>
                  <th className={styles.tableHeaderCell}>가산금</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {data.resRespiteList.map((item: TaxCertRespiteItem, index: number) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>{item.resRespiteType || '-'}</td>
                    <td className={styles.tableCell}>{item.resRespitePeriod || '-'}</td>
                    <td className={styles.tableCell}>{item.resTaxYear || '-'}</td>
                    <td className={styles.tableCell}>{item.resTaxItemName || '-'}</td>
                    <td className={styles.tableCell}>{item.resPaymentDeadline || '-'}</td>
                    <td className={styles.tableCell}>{item.resLocalTaxAmt || '-'}</td>
                    <td className={styles.tableCell}>{item.resAdditionalCharges || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 체납 List */}
      {data.resArrearsList && data.resArrearsList.length > 0 && (
        <div className={styles.tableContainer}>
          <h4 className={styles.tableTitle}>체납 내역</h4>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>성명</th>
                  <th className={styles.tableHeaderCell}>과세년도</th>
                  <th className={styles.tableHeaderCell}>세목</th>
                  <th className={styles.tableHeaderCell}>납부기한</th>
                  <th className={styles.tableHeaderCell}>지방세액</th>
                  <th className={styles.tableHeaderCell}>가산금</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {data.resArrearsList.map((item: TaxCertArrearsItem, index: number) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>{item.resUserNm || '-'}</td>
                    <td className={styles.tableCell}>{item.resTaxYear || '-'}</td>
                    <td className={styles.tableCell}>{item.resTaxItemName || '-'}</td>
                    <td className={styles.tableCell}>{item.resPaymentDeadline || '-'}</td>
                    <td className={styles.tableCell}>{item.resLocalTaxAmt || '-'}</td>
                    <td className={styles.tableCell}>{item.resAdditionalCharges || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 원문 데이터 */}
      {(data.resOriGinalData || data.resOriGinalData1) && (
        <div className={styles.originalDataContainer}>
          <h4 className={styles.originalDataTitle}>원문 데이터</h4>
          {data.resOriGinalData && (
            <div className={styles.originalDataField}>
              <label className={styles.originalDataLabel}>
                XML 원문 (디코딩됨)
              </label>
              <pre className={styles.originalDataContent}>
                {data.resOriGinalData}
              </pre>
            </div>
          )}
          {data.resOriGinalData1 && (
            <div className={styles.originalDataField}>
              <label className={styles.originalDataLabel}>
                PDF 원문 (디코딩됨)
              </label>
              <pre className={styles.originalDataContent}>
                {data.resOriGinalData1.substring(0, 500)}...
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 