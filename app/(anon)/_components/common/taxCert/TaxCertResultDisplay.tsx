'use client';

import React, { useEffect, useState } from 'react';
import {
  TaxCertRespiteItem,
  TaxCertArrearsItem,
} from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';
import { styles } from '@/(anon)/_components/common/taxCert/TaxCertResultDisplay.styles';
import PdfViewer from './PdfViewer';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';

// 납세증명서 데이터 타입 정의
interface TaxCertData {
  resIssueNo?: string;
  resUserNm?: string;
  resUserAddr?: string;
  resUserIdentiyNo?: string;
  resCompanyNm?: string;
  resCompanyIdentityNo?: string;
  resPaymentTaxStatus?: string;
  resUsePurpose?: string;
  resReceiptNo?: string;
  resIssueOgzNm?: string;
  resIssueDate?: string;
  resDepartmentName?: string;
  resUserNm1?: string;
  resPhoneNo?: string;
  resValidPeriod?: string;
  resReason?: string;
  resRespiteList?: TaxCertRespiteItem[];
  resArrearsList?: TaxCertArrearsItem[];
  resOriGinalData?: string;
  resOriGinalData1?: string;
}

export default function TaxCertResultDisplay() {
  const { selectedAddress } = useUserAddressStore();
  const userAddressNickname = selectedAddress?.nickname || '';
  const [data, setData] = useState<TaxCertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaxCertData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/copies/tax-cert?userAddressNickname=${encodeURIComponent(userAddressNickname)}`);
        const result = await response.json();



        if (result.success && result.data) {
          // DB에서 조회된 데이터를 파싱
          // GetTaxCertCopyUsecase에서 반환하는 taxCertJson 필드 사용
          if (result.data.taxCertJson) {
            try {
              // 이미 복호화된 JSON 객체이므로 파싱 불필요
              setData(result.data.taxCertJson);
            } catch {
              setError('납세증명서 데이터 형식이 올바르지 않습니다.');
            }
          } else if (result.data.data && result.data.data.taxCertJson) {
            try {
              // 실제 납세증명서 데이터는 result.data.data.taxCertJson.data에 있음
              if (result.data.data.taxCertJson.data) {
                setData(result.data.data.taxCertJson.data);
              } else {
                // data 필드가 없으면 전체 taxCertJson 사용
                setData(result.data.data.taxCertJson);
              }
            } catch {
              setError('납세증명서 데이터 형식이 올바르지 않습니다.');
            }
          } else if (result.data.taxCertData) {
            // taxCertData 필드가 있는 경우 (암호화된 데이터)
            try {
              const taxCertData = JSON.parse(result.data.taxCertData);
              setData(taxCertData);
            } catch {
              setError('납세증명서 데이터 형식이 올바르지 않습니다.');
            }
          } else {
            setError('납세증명서 데이터가 올바르지 않습니다.');
          }
        } else {
          setError(result.message || '납세증명서 데이터를 조회할 수 없습니다.');
        }
      } catch {
        setError('납세증명서 데이터 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userAddressNickname) {
      fetchTaxCertData();
    }
  }, [userAddressNickname]);

  // 로딩 오버레이
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>📄 납세증명서 발급 결과</h3>
        </div>
        <LoadingOverlay
          isVisible={true}
          title="납세증명서 데이터를 가져오고 있습니다..."
          currentStep={1}
          totalSteps={1}
        />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>📄 납세증명서 발급 결과</h3>
        </div>
        <div className={`${styles.statusContainer} ${styles.statusWarning}`}>
          <p className={`${styles.statusText} ${styles.statusTextWarning}`}>
            ❌ {error}
          </p>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>📄 납세증명서 발급 결과</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">해당 사용자 주소에 대한 납세증명서 데이터가 없습니다.</p>
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
            <p className={styles.infoValueSecondary}>
              {data.resUserAddr || '-'}
            </p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>주민등록번호</label>
            <p className={styles.infoValueSecondary}>
              {data.resUserIdentiyNo || '-'}
            </p>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>상호(법인명)</label>
            <p className={styles.infoValue}>{data.resCompanyNm || '-'}</p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>사업자등록번호</label>
            <p className={styles.infoValueSecondary}>
              {data.resCompanyIdentityNo || '-'}
            </p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>납세상태</label>
            <p className={styles.infoValueSecondary}>
              {data.resPaymentTaxStatus || '-'}
            </p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>증명서 사용목적</label>
            <p className={styles.infoValueSecondary}>
              {data.resUsePurpose || '-'}
            </p>
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
            <p className={styles.infoValueSecondary}>
              {data.resIssueOgzNm || '-'}
            </p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>발급일자</label>
            <p className={styles.infoValueSecondary}>
              {data.resIssueDate || '-'}
            </p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>담당부서</label>
            <p className={styles.infoValueSecondary}>
              {data.resDepartmentName || '-'}
            </p>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>담당자</label>
            <p className={styles.infoValueSecondary}>
              {data.resUserNm1 || '-'}
            </p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>연락처</label>
            <p className={styles.infoValueSecondary}>
              {data.resPhoneNo || '-'}
            </p>
          </div>
          <div className={styles.infoField}>
            <label className={styles.infoLabel}>유효기간</label>
            <p className={styles.infoValueSecondary}>
              {data.resValidPeriod || '-'}
            </p>
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
          <h4 className={styles.tableTitle}>
            징수유예등 또는 체납처분유예의 명세
          </h4>
          <div className='overflow-x-auto'>
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
                {data.resRespiteList.map(
                  (item: TaxCertRespiteItem, index: number) => (
                    <tr key={index} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        {item.resRespiteType || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resRespitePeriod || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resTaxYear || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resTaxItemName || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resPaymentDeadline || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resLocalTaxAmt || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resAdditionalCharges || '-'}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 체납 List */}
      {data.resArrearsList && data.resArrearsList.length > 0 && (
        <div className={styles.tableContainer}>
          <h4 className={styles.tableTitle}>체납 내역</h4>
          <div className='overflow-x-auto'>
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
                {data.resArrearsList.map(
                  (item: TaxCertArrearsItem, index: number) => (
                    <tr key={index} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        {item.resUserNm || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resTaxYear || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resTaxItemName || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resPaymentDeadline || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resLocalTaxAmt || '-'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.resAdditionalCharges || '-'}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 원문 데이터 */}
      {(data.resOriGinalData || data.resOriGinalData1) && (
        <div className={styles.originalDataContainer}>
          <h4 className={styles.originalDataTitle}>원문 데이터</h4>
          
          {/* XML 원문 */}
          {data.resOriGinalData && (
            <div className={styles.originalDataField}>
              <div className={styles.originalDataHeader}>
                <label className={styles.originalDataLabel}>
                  XML 원문 (디코딩됨)
                </label>
                <button
                  className={styles.copyButton}
                  onClick={() => {
                    navigator.clipboard.writeText(data.resOriGinalData || '');
                    // 복사 완료 피드백 (선택사항)
                    alert('XML 원문이 클립보드에 복사되었습니다.');
                  }}
                  title="클립보드에 복사"
                >
                  📋 복사
                </button>
              </div>
              <pre className={styles.originalDataContent}>
                {data.resOriGinalData}
              </pre>
            </div>
          )}
          
          {/* PDF 원문 - PdfViewer 컴포넌트 사용 */}
          {data.resOriGinalData1 && (
            <div className={styles.originalDataField}>
              <div className={styles.originalDataHeader}>
                <label className={styles.originalDataLabel}>
                  PDF 원문 (디코딩됨)
                </label>
                <button
                  className={styles.copyButton}
                  onClick={() => {
                    navigator.clipboard.writeText(data.resOriGinalData1 || '');
                    // 복사 완료 피드백 (선택사항)
                    alert('PDF 원문이 클립보드에 복사되었습니다.');
                  }}
                  title="클립보드에 복사"
                >
                  📋 복사
                </button>
              </div>
              
              {/* PDF 뷰어 및 다운로드 */}
              <PdfViewer 
                base64={data.resOriGinalData1} 
                fileName="납세증명서.pdf"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
