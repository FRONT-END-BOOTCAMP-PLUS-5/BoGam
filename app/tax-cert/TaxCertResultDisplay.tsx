'use client';

import { CodefResponse } from '@/backend/tax-cert/application/dtos/TaxCertDto';
import { decodeTaxCertResponse, urlDecode } from '@/lib/codef-decoder';
import styles from './TaxCertResultDisplay.module.css';

interface TaxCertResultDisplayProps {
  response: CodefResponse;
}

export default function TaxCertResultDisplay({ response }: TaxCertResultDisplayProps) {
  // 디버깅을 위한 로그
  console.log('🔍 원본 응답:', response);
  
  // 무조건 디코딩된 데이터 사용
  const decodedResponse = decodeTaxCertResponse(response);
  console.log('🔍 디코딩된 응답:', decodedResponse);
  
  const { data } = decodedResponse;

  // 원본 응답이 URL 인코딩되어 있는지 확인
  const isUrlEncoded = false; // response.result는 객체이므로 URL 인코딩 체크 불필요

  // 만약 data가 없고 response 자체가 URL 인코딩된 문자열이라면
  if (!data && typeof response === 'string') {
    try {
      const decodedString = urlDecode(response);
      const parsedResponse = JSON.parse(decodedString);
      console.log('🔍 문자열 응답 디코딩 완료:', parsedResponse);
      
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <h3 className={styles.title}>📄 납세증명서 발급 결과</h3>
            <div className={`${styles.statusContainer} ${styles.statusSuccess}`}>
              <p className={`${styles.statusText} ${styles.statusTextSuccess}`}>
                ✅ URL 디코딩된 데이터를 표시하고 있습니다.
              </p>
            </div>
          </div>
          
          <div className={styles.decodedDataContent}>
            <h4 className={styles.decodedDataTitle}>디코딩된 응답 데이터</h4>
            <pre className={styles.decodedDataText}>
              {JSON.stringify(parsedResponse, null, 2)}
            </pre>
          </div>
        </div>
      );
    } catch (error) {
      console.error('❌ 문자열 디코딩 실패:', error);
    }
  }

  if (!data) {
    // data가 없으면 원본 응답을 디코딩해서 표시
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
        
        <div className={`${styles.decodedDataContainer} ${styles.decodedDataContent}`}>
          <h4 className={styles.decodedDataTitle}>디코딩 시도</h4>
          <pre className={styles.decodedDataText}>
            {JSON.stringify(decodedResponse, null, 2)}
          </pre>
        </div>

        {/* 임시 테스트: 사용자가 제공한 URL 인코딩된 데이터 테스트 */}
        <div className={styles.testContainer}>
          <h4 className={styles.testTitle}>URL 디코딩 테스트</h4>
          <button 
            onClick={() => {
              const testData = "%7B%22result%22%3A%7B%22code%22%3A%22CF-00000%22%2C%22extraMessage%22%3A%22%22%2C%22message%22%3A%22%EC%84%B1%EA%B3%B5%22%2C%22transactionId%22%3A%2268898b7eec82c879ec901cb6%22%7D%2C%22data%22%3A%7B%22resIssueNo%22%3A%222837-308-1113-604%22%2C%22resPaymentTaxStatusCd%22%3A%22ZZ%22%2C%22resPaymentTaxStatus%22%3A%22%ED%95%B4%EB%8B%B9%EC%97%86%EC%9D%8C%22%2C%22resUserAddr%22%3A%22%EA%B2%BD%EA%B8%B0%EB%8F%84+%EA%B3%A0%EC%96%91%EC%8B%9C+****+****+****+****%22%2C%22resUsePurpose%22%3A%22%EB%82%A9%EC%84%B8%EC%A6%9D%EB%AA%85%EC%84%9C%28%EB%8C%80%EA%B8%88%EC%88%98%EB%A0%B9%EC%9A%A9%29%22%2C%22resUserIdentiyNo%22%3A%22001006-3213219%22%2C%22resCompanyIdentityNo%22%3A%22%22%2C%22resCompanyNm%22%3A%22%22%2C%22resUserNm%22%3A%22%EC%A1%B0%EC%8A%B9%EC%97%B0%22%2C%22resValidPeriod%22%3A%2220250829%22%2C%22resReason%22%3A%22%EA%B5%AD%EC%84%B8%EC%A7%95%EC%88%98%EB%B2%95%EC%8B%9C%ED%96%89%EB%A0%B9+%EC%A0%9C96%EC%A1%B01%22%2C%22resIssueOgzNm%22%3A%22%EA%B3%A0%EC%96%91%EC%84%B8%EB%AC%B4%EC%84%9C%22%2C%22resIssueDate%22%3A%2220250730%22%2C%22resOriGinalData%22%3A%22%22%2C%22resOriGinalData1%22%3A%22%22%2C%22resReceiptNo%22%3A%22504728156816%22%2C%22resDepartmentName%22%3A%22%EB%AF%BC%EC%9B%90%EB%B4%89%EC%82%AC%EC%8B%A4%22%2C%22resPhoneNo%22%3A%22031-900-9229%22%2C%22resUserNm1%22%3A%22%22%2C%22resRespiteList%22%3A%5B%5D%2C%22resArrearsList%22%3A%5B%5D%7D%2C%22identityEncYn%22%3A%22N%22%7D";
              try {
                const decoded = urlDecode(testData);
                const parsed = JSON.parse(decoded);
                console.log('🔍 테스트 데이터 디코딩 성공:', parsed);
                alert('테스트 데이터 디코딩 성공! 콘솔을 확인하세요.');
              } catch (error) {
                console.error('❌ 테스트 데이터 디코딩 실패:', error);
                alert('테스트 데이터 디코딩 실패! 콘솔을 확인하세요.');
              }
            }}
            className={styles.testButton}
          >
            URL 디코딩 테스트 실행
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>📄 납세증명서 발급 결과</h3>
        
        {/* 디코딩 상태 표시 */}
        {isUrlEncoded && (
          <div className={`${styles.statusContainer} ${styles.statusSuccess}`}>
            <p className={`${styles.statusText} ${styles.statusTextSuccess}`}>
              ✅ URL 디코딩된 데이터를 표시하고 있습니다.
            </p>
          </div>
        )}
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
                {data.resRespiteList.map((item, index) => (
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
                {data.resArrearsList.map((item, index) => (
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

      {/* 디코딩된 응답 데이터 (디버깅용) */}
      {isUrlEncoded && (
        <div className={styles.decodedDataContainer}>
          <h4 className={styles.decodedDataTitle}>디코딩된 응답 데이터</h4>
          <div className={styles.decodedDataContent}>
            <pre className={styles.decodedDataText}>
              {JSON.stringify(decodedResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 