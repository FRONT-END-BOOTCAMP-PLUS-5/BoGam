import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import { CodefResponse } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';

export const useTaxCertHandlers = (
  formData: GetTaxCertRequestDto,
  setFormData: React.Dispatch<React.SetStateAction<GetTaxCertRequestDto>>,
  submitTaxCert: (formData: GetTaxCertRequestDto) => Promise<CodefResponse>,
  submitTwoWayAuth: (formData: GetTaxCertRequestDto, simpleAuth: string) => Promise<CodefResponse>,
  handleFirstRequestComplete: (responseData: CodefResponse) => boolean,
  setShowSimpleAuthModal: (show: boolean) => void,
  validateFormData: (formData: GetTaxCertRequestDto) => { isValid: boolean; errors: string[] },
  setError: (error: string | null) => void
) => {
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: GetTaxCertRequestDto) => ({ ...prev, [name]: value }));
  };

  const handleLoginTypeLevelChange = (level: string) => {
    setFormData((prev: GetTaxCertRequestDto) => ({
      ...prev,
      loginTypeLevel: level,
    }));
  };

  const handleSubmit = async (e: React.FormEvent | null) => {
    if (e) {
      e.preventDefault();
    }

    // 폼 데이터 유효성 검사
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setError(`❌ 오류 발생\n${validation.errors.join('\n')}`);
      return;
    }

    try {
      const data = await submitTaxCert(formData);
      
      // 1차 요청 완료 처리
      const needsTwoWay = handleFirstRequestComplete(data);
      
      if (!needsTwoWay) {
        // 추가인증이 필요하지 않은 경우 처리
      }
    } catch (error) {
      console.error('❌ 폼 제출 오류:', error);
    }
  };

  const handleSimpleAuthApprove = async () => {
    try {
      await submitTwoWayAuth(formData, '1');
      setShowSimpleAuthModal(false);
    } catch (error) {
      console.error('❌ 간편인증 승인 오류:', error);
    }
  };

  const handleSimpleAuthCancel = () => {
    setShowSimpleAuthModal(false);
  };

  return {
    handleInputChange,
    handleLoginTypeLevelChange,
    handleSubmit,
    handleSimpleAuthApprove,
    handleSimpleAuthCancel,
  };
};
