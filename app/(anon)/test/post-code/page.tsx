'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

interface DaumPostcodeData {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  userSelectedType: 'R' | 'J';
  bname: string;
  buildingName: string;
  apartment: string;
  sigunguCode: string;
  bcode: string;
}

interface DaumPostcodeSize {
  height: number;
  width: number;
}

interface DaumPostcode {
  new (options: {
    oncomplete: (data: DaumPostcodeData) => void;
    onresize: (size: DaumPostcodeSize) => void;
    width: string;
    height: string;
  }): {
    embed: (element: HTMLDivElement | null) => void;
  };
}

export default function PostCodePage() {
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [sigunguCode, setSigunguCode] = useState('');
  const [bcode, setBcode] = useState('');
  const [showPostcode, setShowPostcode] = useState(false);

  const postcodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Daum Postcode 스크립트 로드
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const execDaumPostcode = () => {
    if (!window.daum) {
      alert('Daum Postcode 스크립트가 로드되지 않았습니다.');
      return;
    }

    setShowPostcode(true);

    // 약간의 지연을 두어 DOM이 업데이트된 후 실행
    setTimeout(() => {
      if (postcodeRef.current) {
        new window.daum.Postcode({
          oncomplete: function (data: DaumPostcodeData) {
            let addr = '';
            let extraAddr = '';

            if (data.userSelectedType === 'R') {
              addr = data.roadAddress;
            } else {
              addr = data.jibunAddress;
            }

            if (data.userSelectedType === 'R') {
              if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraAddr += data.bname;
              }
              if (data.buildingName !== '' && data.apartment === 'Y') {
                extraAddr +=
                  extraAddr !== ''
                    ? ', ' + data.buildingName
                    : data.buildingName;
              }
              if (extraAddr !== '') {
                extraAddr = ' (' + extraAddr + ')';
              }
              setExtraAddress(extraAddr);
            } else {
              setExtraAddress('');
            }

            setPostcode(data.zonecode);
            setAddress(addr);
            setSigunguCode(data.sigunguCode || '');
            setBcode(data.bcode || '');
            setShowPostcode(false);
          },
          onresize: function (size: DaumPostcodeSize) {
            if (postcodeRef.current) {
              postcodeRef.current.style.height = size.height + 'px';
            }
          },
          width: '100%',
          height: '100%',
        }).embed(postcodeRef.current);
      }
    }, 100);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Daum 우편번호 검색</h1>

      <div className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <input
            type='text'
            id='sample3_postcode'
            placeholder='우편번호'
            value={postcode}
            readOnly
            className={styles.input}
          />
          <button
            type='button'
            onClick={execDaumPostcode}
            className={styles.searchButton}
          >
            우편번호 찾기
          </button>
        </div>

        <input
          type='text'
          id='sample3_address'
          placeholder='주소'
          value={address}
          readOnly
          className={styles.input}
        />

        <input
          type='text'
          id='sample3_detailAddress'
          placeholder='상세주소'
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          className={styles.input}
        />

        <input
          type='text'
          id='sample3_extraAddress'
          placeholder='참고항목'
          value={extraAddress}
          readOnly
          className={styles.input}
        />
      </div>

      {showPostcode && (
        <div className={styles.postcodeContainer}>
          <div className={styles.postcodeHeader}>
            <h3>우편번호 검색</h3>
            <button
              onClick={() => setShowPostcode(false)}
              className={styles.closeButton}
            >
              ✕
            </button>
          </div>
          <div ref={postcodeRef} className={styles.postcodeFrame} />
        </div>
      )}

      <div className={styles.codeContainer}>
        <h3 className={styles.codeTitle}>추가 정보</h3>
        <div className={styles.codeGroup}>
          <div className={styles.codeItem}>
            <span className={styles.codeLabel}>시군구코드:</span>
            <span className={styles.codeValue}>{sigunguCode || '없음'}</span>
          </div>
          <div className={styles.codeItem}>
            <span className={styles.codeLabel}>법정동코드:</span>
            <span className={styles.codeValue}>{bcode || '없음'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
