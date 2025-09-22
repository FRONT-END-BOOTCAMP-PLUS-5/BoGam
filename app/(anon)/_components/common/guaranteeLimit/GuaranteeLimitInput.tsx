'use client';
import { useEffect } from 'react';
import { GetGuaranteeLimitRequestDto } from '@libs/api_front/guaranteeLimit.api';
import {
  // REGION_OPTIONS,
  MARRIAGE_OPTIONS,
  HOUSE_COUNT_OPTIONS,
  FIELD_PLACEHOLDERS,
  FIELD_LABELS,
} from '@utils/constants/guaranteeLimit';
import { FormContainer } from '@/(anon)/_components/common/forms/FormContainer';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import Field from '@/(anon)/_components/common/forms/Field';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { formatToKoreanUnit } from '@utils/formatUtils';
import { DropDown } from '@/(anon)/_components/common/dropdown/DropDown';
import styles from './GuaranteeLimitInput.styles';

interface GuaranteeLimitInputProps {
  formData: GetGuaranteeLimitRequestDto;
  errors: Record<keyof GetGuaranteeLimitRequestDto, string | undefined>;
  // isPending: boolean;
  onInputChange: (
    field: keyof GetGuaranteeLimitRequestDto,
    value: string | number
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function GuaranteeLimitInput({
  formData,
  errors,
  onInputChange,
  onSubmit,
}: GuaranteeLimitInputProps) {
  const { selectedAddress } = useUserAddressStore();

  // selectedAddress가 변경될 때 지역 코드 자동 설정
  useEffect(() => {
    if (selectedAddress?.legalDistrictCode) {
      onInputChange('trgtLwdgCd', selectedAddress.legalDistrictCode || '');
    }
  }, [selectedAddress?.legalDistrictCode, onInputChange]);

  const formatNumber = (value: string): number => {
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  };

  return (
    <div>
      <FormContainer onSubmit={onSubmit}>
        <div className={styles.header}>
          <h3 className={styles.title}>전세자금보증 금액 조회</h3>
        </div>
        <div className={styles.formContainer}>
          {/* 전세보증금 */}
          <Field
            id='rentGrntAmt'
            label={FIELD_LABELS.rentGrntAmt}
            required
            error={errors.rentGrntAmt}
          >
            <div className={styles.inputWrapper}>
              <TextInput
                type='text'
                placeholder={FIELD_PLACEHOLDERS.rentGrntAmt}
                value={formData.rentGrntAmt ? formData.rentGrntAmt : ''}
                onChange={(e) =>
                  onInputChange('rentGrntAmt', formatNumber(e.target.value))
                }
                error={!!errors.rentGrntAmt}
                className={styles.inputWithUnit}
              />
              {formData.rentGrntAmt > 0 && (
                <div className={styles.unitDisplay}>
                  {formatToKoreanUnit(formData.rentGrntAmt)}
                </div>
              )}
            </div>
          </Field>

          {/* 나이 */}
          <Field id='age' label={FIELD_LABELS.age} required error={errors.age}>
            <TextInput
              type='number'
              placeholder={FIELD_PLACEHOLDERS.age}
              value={formData.age || ''}
              onChange={(e) =>
                onInputChange('age', parseInt(e.target.value) || 0)
              }
              error={!!errors.age}
            />
          </Field>

          {/* 결혼상태 */}
          <DropDown
            id='weddStcd'
            label={FIELD_LABELS.weddStcd}
            required
            error={errors.weddStcd}
            options={[...MARRIAGE_OPTIONS]}
            value={formData.weddStcd}
            onChange={(value) => onInputChange('weddStcd', value)}
            placeholder={FIELD_PLACEHOLDERS.weddStcd}
          />

          {/* 소득금액 */}
          <Field
            id='myIncmAmt'
            label={FIELD_LABELS.myIncmAmt}
            required
            error={errors.myIncmAmt}
          >
            <div className={styles.inputWrapper}>
              <TextInput
                type='text'
                placeholder={FIELD_PLACEHOLDERS.myIncmAmt}
                value={
                  formData.myIncmAmt > 0
                    ? formData.myIncmAmt.toLocaleString()
                    : ''
                }
                onChange={(e) =>
                  onInputChange('myIncmAmt', formatNumber(e.target.value))
                }
                error={!!errors.myIncmAmt}
                className={styles.inputWithUnit}
              />
              {formData.myIncmAmt > 0 && (
                <div className={styles.unitDisplay}>
                  {formatToKoreanUnit(formData.myIncmAmt)}
                </div>
              )}
            </div>
          </Field>

          {/* 총부채금액 */}
          <Field
            id='myTotDebtAmt'
            label={FIELD_LABELS.myTotDebtAmt}
            required={false}
            error={errors.myTotDebtAmt}
          >
            <div className={styles.inputWrapper}>
              <TextInput
                type='text'
                placeholder={FIELD_PLACEHOLDERS.myTotDebtAmt}
                value={
                  formData.myTotDebtAmt > 0
                    ? formData.myTotDebtAmt.toLocaleString()
                    : ''
                }
                onChange={(e) =>
                  onInputChange('myTotDebtAmt', formatNumber(e.target.value))
                }
                error={!!errors.myTotDebtAmt}
                className={styles.inputWithUnit}
              />
              {formData.myTotDebtAmt > 0 && (
                <div className={styles.unitDisplay}>
                  {formatToKoreanUnit(formData.myTotDebtAmt)}
                </div>
              )}
            </div>
          </Field>

          {/* 보유주택수 */}
          <DropDown
            id='ownHsCnt'
            label={FIELD_LABELS.ownHsCnt}
            required
            error={errors.ownHsCnt}
            options={[...HOUSE_COUNT_OPTIONS]}
            value={formData.ownHsCnt.toString()}
            onChange={(value) => onInputChange('ownHsCnt', parseInt(value))}
            placeholder={FIELD_PLACEHOLDERS.ownHsCnt}
          />

          {/* 월세금액 */}
          <Field
            id='mmrtAmt'
            label={FIELD_LABELS.mmrtAmt}
            required={false}
            error={errors.mmrtAmt}
          >
            <TextInput
              type='text'
              placeholder={FIELD_PLACEHOLDERS.mmrtAmt}
              value={formData.mmrtAmt > 0 ? formData.mmrtAmt : ''}
              onChange={(e) =>
                onInputChange('mmrtAmt', formatNumber(e.target.value))
              }
              error={!!errors.mmrtAmt}
              className={styles.inputWithUnit}
            />
          </Field>
        </div>
      </FormContainer>
    </div>
  );
}
