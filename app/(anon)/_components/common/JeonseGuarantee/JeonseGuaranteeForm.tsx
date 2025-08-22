'use client';

import { useState, useEffect } from 'react';
import { GetJeonseGuaranteeRequestDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeRequestDto';
import { styles } from './JeonseGuarantee.styles';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import Field from '@/(anon)/_components/common/forms/Field';
import Button from '@/(anon)/_components/common/button/Button';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

interface JeonseGuaranteeFormProps {
  onSubmit: (data: GetJeonseGuaranteeRequestDto) => void;
}

export default function JeonseGuaranteeForm({ onSubmit }: JeonseGuaranteeFormProps) {
  const { selectedAddress } = useUserAddressStore();
  
  const [formData, setFormData] = useState<GetJeonseGuaranteeRequestDto>({
    numOfRows: 100,
    pageNo: 1,
    rentGrntAmt: 200000000,
    mmrtAmt: 1000000,
    trgtLwdgCd: selectedAddress?.legalDistrictCode || '2629000000',
    age: 22,
    weddStcd: 1,
    myIncmAmt: 40000000,
    myTotDebtAmt: 10000000,
    ownHsCnt: 1,
    grntPrmeActnDvcdCont: '01'
  });

  // 보증우대조치구분 옵션
  const grntPrmeActnOptions = [
    { code: '01', label: '2자녀이상' },
    { code: '02', label: '다문화가정' },
    { code: '03', label: '한부모가구' },
    { code: '04', label: '장애인' },
    { code: '05', label: '국가유공자' },
    { code: '06', label: '의사상자' },
    { code: '07', label: '신용회복지원자' },
    { code: '08', label: '사회적배려대상자' },
    { code: '09', label: '정책서민금융 이용자' },
    { code: '10', label: '영세자영업자' },
    { code: '11', label: '임대주택 입주자' },
    { code: '12', label: '분할상환 예정자' },
    { code: '13', label: '주택도시기금 전세대출 기존 이용자' },
    { code: '14', label: '제2금융권 전세대출 기존 이용자' },
    { code: '15', label: '서울시 갱신만료 임차인' },
    { code: '16', label: '부산시 공공임대주택(럭키7하우스) 임차인' },
    { code: '17', label: '고정금리 전세대출 신청자' },
    { code: '18', label: '전세사기피해자' }
  ];

  const [selectedGrntPrmeActn, setSelectedGrntPrmeActn] = useState<string[]>(['01']);

  // 선택된 주소가 변경될 때마다 법정동코드 업데이트
  useEffect(() => {
    if (selectedAddress?.legalDistrictCode) {
      setFormData(prev => ({
        ...prev,
        trgtLwdgCd: selectedAddress.legalDistrictCode || '2629000000'
      }));
    }
  }, [selectedAddress?.legalDistrictCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 보증우대조치구분 처리
    const updatedFormData = {
      ...formData,
      grntPrmeActnDvcdCont: selectedGrntPrmeActn.join(',')
    };

    onSubmit(updatedFormData);
  };

  const handleInputChange = (field: keyof GetJeonseGuaranteeRequestDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGrntPrmeActnChange = (code: string, checked: boolean) => {
    if (checked) {
      setSelectedGrntPrmeActn(prev => [...prev, code]);
    } else {
      setSelectedGrntPrmeActn(prev => prev.filter(item => item !== code));
    }
  };



  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className="space-y-6">    
        <Field
          id="rentGrntAmt"
          label="임차보증금액 (원)"
          required
          hint="전세 목적물 임차보증금액 (원 단위)"
        >
          <TextInput
            type="number"
            value={formData.rentGrntAmt}
            onChange={(e) => handleInputChange('rentGrntAmt', parseInt(e.target.value))}
          />
        </Field>
        
        <Field
          id="mmrtAmt"
          label="월세금액 (원)"
          required
          hint="전세 목적물 월세금액 (원 단위), 없는 경우 0 입력"
        >
          <TextInput
            type="number"
            value={formData.mmrtAmt}
            onChange={(e) => handleInputChange('mmrtAmt', parseInt(e.target.value))}
          />
        </Field>
        
        <Field
          id="age"
          label="만 나이"
          required
          hint="만 나이 (0~150)"
        >
          <TextInput
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
          />
        </Field>
        
        <Field
          id="weddStcd"
          label="결혼구분"
          required
        >
          <select
            value={formData.weddStcd}
            onChange={(e) => handleInputChange('weddStcd', parseInt(e.target.value))}
            className={styles.select}
          >
            <option value={1}>1: 미혼</option>
            <option value={2}>2: 기혼</option>
            <option value={3}>3: 신혼</option>
            <option value={4}>4: 결혼예정</option>
          </select>
        </Field>
        
        <Field
          id="myIncmAmt"
          label="연소득금액 (원)"
          required
          hint="연소득금액 (원 단위)"
        >
          <TextInput
            type="number"
            value={formData.myIncmAmt}
            onChange={(e) => handleInputChange('myIncmAmt', parseInt(e.target.value))}
          />
        </Field>
        
        <Field
          id="myTotDebtAmt"
          label="총부채금액 (원)"
          required
          hint="총부채금액 (원 단위)"
        >
          <TextInput
            type="number"
            value={formData.myTotDebtAmt}
            onChange={(e) => handleInputChange('myTotDebtAmt', parseInt(e.target.value))}
          />
        </Field>
        
        <Field
          id="ownHsCnt"
          label="주택보유수"
          required
          hint="보유주택 수 (0 이상)"
        >
          <TextInput
            type="number"
            value={formData.ownHsCnt}
            onChange={(e) => handleInputChange('ownHsCnt', parseInt(e.target.value))}
          />
        </Field>
      </div>

      {/* 보증우대조치구분 */}
      <div className={styles.checkboxContainer}>
        <label className={styles.checkboxLabel}>
          보증우대조치구분 (복수 선택 가능)
        </label>
        <div className={styles.checkboxGrid}>
          {grntPrmeActnOptions.map((option) => (
            <label key={option.code} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={selectedGrntPrmeActn.includes(option.code)}
                onChange={(e) => handleGrntPrmeActnChange(option.code, e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                {option.code}: {option.label}
              </span>
            </label>
          ))}
        </div>
        <p className={styles.selectedCodes}>
          선택된 코드: {selectedGrntPrmeActn.join(', ') || '없음'}
        </p>
      </div>
      
             <div className={styles.buttonContainer}>
         <Button
           type="submit"
           variant="primary"
         >
           전세자금보증상품 조회
         </Button>
       </div>
    </form>
  );
}
