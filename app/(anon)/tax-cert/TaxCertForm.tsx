"use client";

import React, { useState, useEffect } from 'react';
import { TaxCertRequest, TaxCertTwoWayRequest, CodefResponse } from '@be/applications/taxCert/dtos/TaxCertDto';
import { extractActualData } from '@libs/responseUtils';
import ApiResultDisplay from '@/(anon)/_components/common/ApiResultDisplay';
import TaxCertResultDisplay from '@/(anon)/tax-cert/TaxCertResultDisplay';
import { API_ENDPOINTS } from '@libs/api-endpoints';
import axios from 'axios';
import styles from '@/(anon)/tax-cert/TaxCertForm.module.css';
import commonStyles from '@/(anon)/tax-cert/_components/Common.module.css';

// 분리된 컴포넌트들 import
import StepGuide from '@/(anon)/tax-cert/_components/StepGuide';
import SimpleAuthModal from '@/(anon)/tax-cert/_components/SimpleAuthModal';
import CertificateLoginForm from '@/(anon)/tax-cert/_components/CertificateLoginForm';
import IdLoginForm from '@/(anon)/tax-cert/_components/IdLoginForm';
import SimpleAuthForm from '@/(anon)/tax-cert/_components/SimpleAuthForm';

export default function TaxCertForm() {
  const [formData, setFormData] = useState<TaxCertRequest>({
    organization: "0001",
    loginType: "", // 초기값을 빈 문자열로 설정
    loginTypeLevel: "1", // 카카오톡
    phoneNo: "", // 필수
    userName: "", // 필수
    loginIdentity: "", // 필수 (주민번호 13자리)
    loginBirthDate: "", // 생년월일 6자리
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // 세션/다건 처리용
    isIdentityViewYN: "1",
    isAddrViewYn: "0",
    proofType: "B0006",
    submitTargets: "04",
    applicationType: "01",
    clientTypeLevel: "1",
    identity: "",
    birthDate: "",
    telecom: "",
    originDataYN: "0",
    originDataYN1: "0",
  });

  const [, setTwoWayData] = useState<TaxCertTwoWayRequest | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<CodefResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSimpleAuthModal, setShowSimpleAuthModal] = useState(false);

  // loginTypeLevel에 따른 telecom 필드 자동 관리
  useEffect(() => {
    if (formData.loginTypeLevel === "5") {
      // 통신사인증서인 경우 telecom이 비어있으면 기본값 설정
      if (!formData.telecom) {
        setFormData((prev: TaxCertRequest) => ({ ...prev, telecom: "0" })); // SKT 기본값
      }
    } else {
      // 통신사인증서가 아닌 경우 telecom 필드 초기화
      if (formData.telecom) {
        setFormData((prev: TaxCertRequest) => ({ ...prev, telecom: "" }));
      }
    }
  }, [formData.loginTypeLevel, formData.telecom]);

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
  };



  const validateFormData = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // 기본 필수 필드 검증
    if (!formData.loginType) {
      errors.push("로그인 구분은 필수입니다.");
    }

    if (!formData.phoneNo) {
      errors.push("전화번호는 필수입니다.");
    }

    if (!formData.userName) {
      errors.push("사용자 이름은 필수입니다.");
    }

    if (!formData.loginIdentity) {
      errors.push("사용자 주민번호는 필수입니다.");
    }

    // 로그인 타입별 필수 필드 검증
    switch (formData.loginType) {
      case "0": // 회원 인증서로그인
      case "2": // 비회원 인증서로그인
        if (!formData.certType) {
          errors.push("인증서 구분은 필수입니다.");
        }
        if (formData.certType === "1") {
          if (!formData.certFile) {
            errors.push("인증서 der 파일은 필수입니다.");
          }
          if (!formData.keyFile) {
            errors.push("인증서 key 파일은 필수입니다.");
          }
          if (!formData.certPassword) {
            errors.push("인증서 비밀번호는 필수입니다.");
          }
        }
        if (formData.certType === "2" && !formData.id) {
          errors.push("요청 식별 아이디는 필수입니다.");
        }
        break;
      case "1": // 회원 아이디로그인
        if (!formData.userId) {
          errors.push("아이디는 필수입니다.");
        }
        if (!formData.userPassword) {
          errors.push("비밀번호는 필수입니다.");
        }
        break;
      case "5": // 회원 간편인증
      case "6": // 비회원 간편인증
        if (!formData.loginTypeLevel) {
          errors.push("간편인증 로그인 구분은 필수입니다.");
        }
        if (formData.loginTypeLevel === "5" && !formData.telecom) {
          errors.push("통신사는 필수입니다.");
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 폼 제출 시작");

    // 폼 데이터 유효성 검사
    const validation = validateFormData();
    if (!validation.isValid) {
      setError(`❌ 오류 발생\n${validation.errors.join("\n")}`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      updateStep(2);

      console.log("📋 폼 데이터:", formData);

      // 폼 데이터 준비 (암호화는 서버에서 처리)
      const preparedFormData = prepareFormData(formData);
      
      console.log('📋 전송할 폼 데이터:', preparedFormData);

      const apiResponse = await axios.post(API_ENDPOINTS.TAX_CERT, preparedFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = apiResponse.data as CodefResponse;
      
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(String(data.error));
      }

      console.log("✅ API 응답:", data);
      setResponse(data);

      // 1차 요청 완료 처리
      handleFirstRequestComplete(data);
    } catch (error) {
      console.error("❌ API 요청 오류:", error);
      setError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      );
      updateStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  // 암호화는 서버에서 처리하므로 클라이언트에서는 평문 그대로 전송
  const prepareFormData = (formData: TaxCertRequest): TaxCertRequest => {
    return { ...formData };
  };

  // 추가인증 제출 시 단계 업데이트
  const handleTwoWaySubmit = async (
    simpleAuth: string,
    signedData?: string,
    extraInfo?: Record<string, unknown>
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔐 추가인증 요청:', { simpleAuth, signedData, extraInfo });
      
      // 1차 응답에서 실제 데이터 추출
      const responseActualData = response ? extractActualData(response) : undefined;
      
      // 1차 응답에서 twoWayInfo 추출
      const twoWayInfo = {
        jobIndex: responseActualData?.jobIndex || 0,
        threadIndex: responseActualData?.threadIndex || 0,
        jti: responseActualData?.jti || '',
        twoWayTimestamp: responseActualData?.twoWayTimestamp || Date.now()
      };

      console.log("🔐 twoWayInfo:", twoWayInfo);

      // 1차 응답에서 간편인증 토큰들 추출
      const simpleKeyToken = responseActualData?.simpleKeyToken || responseActualData?.extraInfo?.simpleKeyToken;
      const rValue = responseActualData?.rValue || responseActualData?.extraInfo?.rValue;
      const certificate = responseActualData?.certificate || responseActualData?.extraInfo?.certificate;
      
      console.log('🔐 간편인증 토큰들:', { simpleKeyToken, rValue, certificate });
      
      const twoWayRequest: TaxCertTwoWayRequest = {
        organization: formData.organization,
        loginType: formData.loginType,
        isIdentityViewYN: formData.isIdentityViewYN,
        isAddrViewYn: formData.isAddrViewYn,
        proofType: formData.proofType,
        submitTargets: formData.submitTargets,
        applicationType: formData.applicationType,
        clientTypeLevel: formData.clientTypeLevel,
        id: formData.id,
        userName: formData.userName,
        loginIdentity: formData.loginIdentity,
        loginBirthDate: formData.loginBirthDate,
        phoneNo: formData.phoneNo,
        loginTypeLevel: formData.loginTypeLevel,
        telecom: formData.telecom,
        certType: formData.certType,
        certFile: formData.certFile,
        keyFile: formData.keyFile,
        certPassword: formData.certPassword,
        userId: formData.userId,
        userPassword: formData.userPassword,
        manageNo: formData.manageNo,
        managePassword: formData.managePassword,
        identity: formData.identity,
        birthDate: formData.birthDate,
        originDataYN: formData.originDataYN,
        originDataYN1: formData.originDataYN1,
        identityEncYn: formData.identityEncYn,
        is2Way: true,
        twoWayInfo,
        simpleAuth,
        simpleKeyToken,
        rValue,
        certificate,
        ...(extraInfo && { extraInfo }),
      };

      console.log(
        "🔐 2차 요청 데이터:",
        JSON.stringify(twoWayRequest, null, 2)
      );

      const apiResponse = await axios.post(API_ENDPOINTS.TAX_CERT, twoWayRequest, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = apiResponse.data as CodefResponse;
      
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(String(data.error));
      }

      console.log("🔐 추가인증 응답:", data);
      setResponse(data);
      updateStep(4); // 4단계로 이동
    } catch (error) {
      console.error("❌ 추가인증 요청 오류:", error);
      setError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 1차 API 요청 후 추가인증 UI 표시
  const handleFirstRequestComplete = (responseData: CodefResponse) => {
    const actualData = extractActualData(responseData);
    
    console.log('🔍 1차 API 응답 데이터 확인:', {
      // 실제 데이터에서 추출
      continue2Way: actualData?.continue2Way,
      method: actualData?.method,
      hasData: !!responseData.data,
      fullData: responseData.data,
      extractedData: actualData
    });
    
    // 실제 데이터에서 추가인증 필드 가져오기
    const actualContinue2Way = actualData?.continue2Way;
    const actualMethod = actualData?.method;
    
    console.log('🔍 실제 값:', { actualContinue2Way, actualMethod, actualData });
    
    if (actualContinue2Way && actualMethod === 'simpleAuth') {
      console.log('🔐 간편인증 추가인증 필요');
      
      // 3단계로 업데이트
      updateStep(3);
      
      // 1차 응답의 간편인증 토큰들 저장 (actualData에서)
      const simpleKeyToken = actualData?.simpleKeyToken || actualData?.extraInfo?.simpleKeyToken;
      const rValue = actualData?.rValue || actualData?.extraInfo?.rValue;
      const certificate = actualData?.certificate || actualData?.extraInfo?.certificate;
      
      console.log('🔐 1차 응답 간편인증 토큰들:', { simpleKeyToken, rValue, certificate });

      // 추가인증 UI 표시를 위해 twoWayData 설정
      const twoWayRequest: TaxCertTwoWayRequest = {
        organization: formData.organization,
        loginType: formData.loginType,
        isIdentityViewYN: formData.isIdentityViewYN,
        isAddrViewYn: formData.isAddrViewYn,
        proofType: formData.proofType,
        submitTargets: formData.submitTargets,
        applicationType: formData.applicationType,
        clientTypeLevel: formData.clientTypeLevel,
        id: formData.id,
        userName: formData.userName,
        loginIdentity: formData.loginIdentity,
        loginBirthDate: formData.loginBirthDate,
        phoneNo: formData.phoneNo,
        loginTypeLevel: formData.loginTypeLevel,
        telecom: formData.telecom,
        certType: formData.certType,
        certFile: formData.certFile,
        keyFile: formData.keyFile,
        certPassword: formData.certPassword,
        userId: formData.userId,
        userPassword: formData.userPassword,
        manageNo: formData.manageNo,
        managePassword: formData.managePassword,
        identity: formData.identity,
        birthDate: formData.birthDate,
        originDataYN: formData.originDataYN,
        originDataYN1: formData.originDataYN1,
        identityEncYn: formData.identityEncYn,
        is2Way: true,
        twoWayInfo: {
          jobIndex: actualData?.jobIndex || 0,
          threadIndex: actualData?.threadIndex || 0,
          jti: actualData?.jti || '',
          twoWayTimestamp: actualData?.twoWayTimestamp || Date.now()
        },
        simpleAuth: "true", // TaxCertTwoWayRequest 타입에 맞게 필수 필드 추가 (string 타입으로 수정)
        simpleKeyToken,
        rValue,
        certificate,
      };
      setTwoWayData(twoWayRequest);

      // 간편인증 모달 표시
      setShowSimpleAuthModal(true);
    } else {
      console.log('❌ 추가인증 조건 불만족:', {
        continue2Way: actualContinue2Way,
        method: actualMethod,
        reason: !actualContinue2Way ? 'continue2Way가 false 또는 undefined' : 
                actualMethod !== 'simpleAuth' ? `method가 '${actualMethod}' (simpleAuth가 아님)` : '기타'
      });
      
      // 추가인증이 필요하지 않은 경우 4단계로 이동
      updateStep(4);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: TaxCertRequest) => ({ ...prev, [name]: value }));
  };

  const handleLoginTypeLevelChange = (level: string) => {
    setFormData((prev: TaxCertRequest) => ({ ...prev, loginTypeLevel: level }));
  };

  const renderLoginTypeFields = () => {
    if (!formData.loginType) {
      return (
        <div className={commonStyles.formField}>
          <p className={commonStyles.noSelectionText}>
            👆 위에서 로그인 구분을 선택해주세요.
          </p>
        </div>
      );
    }

    switch (formData.loginType) {
      case "0": // 회원 인증서로그인
      case "2": // 비회원 인증서로그인
        return (
          <CertificateLoginForm
            formData={formData}
            onInputChange={handleInputChange}
            loginType={formData.loginType}
          />
        );
      case "1": // 회원 아이디로그인
        return (
          <IdLoginForm formData={formData} onInputChange={handleInputChange} />
        );
      case "5": // 회원 간편인증
      case "6": // 비회원 간편인증
        return (
          <SimpleAuthForm
            formData={formData}
            onInputChange={handleInputChange}
            onLoginTypeLevelChange={handleLoginTypeLevelChange}
            loginType={formData.loginType}
          />
        );
      default:
        return null;
    }
  };

  const handleSimpleAuthApprove = () => {
    handleTwoWaySubmit("1");
  };

  const handleSimpleAuthCancel = () => {
    handleTwoWaySubmit("0");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>납세증명서 발급</h2>

      {/* 단계별 진행 상태 */}
      <StepGuide
        currentStep={currentStep}
        isLoading={isLoading}
        response={response}
      />

      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>📄 납세증명서 발급</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 로그인 구분 선택 (맨 위로 이동) */}
          <div className={commonStyles.formField}>
            <label className={commonStyles.labelRequired}>로그인 구분</label>
            <select
              name="loginType"
              value={formData.loginType || ""}
              onChange={handleInputChange}
              className={commonStyles.selectRequired}
              required
            >
              <option value="">로그인 구분을 선택하세요</option>
              <option value="0">회원 인증서로그인</option>
              <option value="1">회원 아이디로그인</option>
              <option value="2">비회원 인증서로그인</option>
              <option value="5">회원 간편인증</option>
              <option value="6">비회원 간편인증</option>
            </select>
          </div>

          {/* 기본 정보 */}
          <div className={commonStyles.formGridTwo}>
            <div className={commonStyles.formField}>
              <label className={commonStyles.label}>기관코드</label>
              <input
                type="text"
                name="organization"
                value={formData.organization || ""}
                onChange={handleInputChange}
                className={commonStyles.input}
                readOnly
              />
            </div>
          </div>

          {/* 로그인 타입별 필드 */}
          {renderLoginTypeFields()}

          {/* 공통 필드 */}
          <div className={commonStyles.formGridTwo}>
            <div className={commonStyles.formField}>
              <label className={commonStyles.labelRequired}>증명구분</label>
              <select
                name="proofType"
                value={formData.proofType || ""}
                onChange={handleInputChange}
                className={commonStyles.selectRequired}
                required
              >
                <option value="B0006">대금수령</option>
                <option value="B0007">기타</option>
              </select>
            </div>
            <div className={commonStyles.formField}>
              <label className={commonStyles.labelRequired}>제출처</label>
              <select
                name="submitTargets"
                value={formData.submitTargets || ""}
                onChange={handleInputChange}
                className={commonStyles.selectRequired}
                required
              >
                <option value="04">금융기관</option>
                <option value="05">기타</option>
              </select>
            </div>
          </div>

          {/* 신청구분 및 의뢰인구분 */}
          <div className={styles.formGridTwo}>
            <div className={styles.formField}>
              <label className={styles.label}>신청 구분</label>
              <select
                name="applicationType"
                value={formData.applicationType || ""}
                onChange={handleInputChange}
                className={commonStyles.select}
              >
                <option value="01">본인</option>
                <option value="02">세무대리인</option>
              </select>
            </div>
            <div className={commonStyles.formField}>
              <label className={commonStyles.label}>의뢰인 구분</label>
              <select
                name="clientTypeLevel"
                value={formData.clientTypeLevel || ""}
                onChange={handleInputChange}
                className={commonStyles.select}
              >
                <option value="1">개인</option>
                <option value="2">개인 단체</option>
                <option value="3">사업자</option>
              </select>
            </div>
          </div>

          {/* 사업자번호/주민등록번호 및 생년월일 */}
          <div className={commonStyles.formGridTwo}>
            <div className={commonStyles.formField}>
              <label className={commonStyles.label}>
                사업자번호/주민등록번호
              </label>
              <input
                type="text"
                name="identity"
                value={formData.identity || ""}
                onChange={handleInputChange}
                className={commonStyles.input}
                placeholder="사업자번호 또는 주민등록번호"
              />
            </div>
            <div className={commonStyles.formField}>
              <label className={commonStyles.label}>생년월일</label>
              <input
                type="text"
                name="birthDate"
                value={formData.birthDate || ""}
                onChange={handleInputChange}
                className={commonStyles.input}
                placeholder="960413"
              />
            </div>
          </div>

          {/* 원문 데이터 포함 여부 */}
          <div className={commonStyles.formGridTwo}>
            <div className={commonStyles.formField}>
              <label className={commonStyles.label}>원문 DATA 포함 여부</label>
              <select
                name="originDataYN"
                value={formData.originDataYN || ""}
                onChange={handleInputChange}
                className={commonStyles.select}
              >
                <option value="0">미포함</option>
                <option value="1">포함</option>
              </select>
            </div>
            <div className={commonStyles.formField}>
              <label className={commonStyles.label}>PDF 원문 포함 여부</label>
              <select
                name="originDataYN1"
                value={formData.originDataYN1 || ""}
                onChange={handleInputChange}
                className={commonStyles.select}
              >
                <option value="0">미포함</option>
                <option value="1">포함</option>
              </select>
            </div>
          </div>

          <div className={commonStyles.buttonContainer}>
            <button
              type="submit"
              disabled={isLoading}
              className={commonStyles.submitButton}
            >
              {isLoading ? "처리중..." : "납세증명서 발급"}
            </button>
          </div>
        </form>

        {error && (
          <div className={commonStyles.errorContainer}>
            <p className={commonStyles.errorText}>{error}</p>
          </div>
        )}
      </div>

      {/* 간편인증 추가인증 UI */}
      <SimpleAuthModal
        showModal={showSimpleAuthModal}
        onClose={() => setShowSimpleAuthModal(false)}
        onApprove={handleSimpleAuthApprove}
        onCancel={handleSimpleAuthCancel}
        isLoading={isLoading}
      />

      {/* 결과 표시 */}
      {response && (
        <>
          <ApiResultDisplay response={response} error={error} />
          {extractActualData(response)?.resIssueNo && <TaxCertResultDisplay response={response} />}
        </>
      )}
    </div>
  );
}
