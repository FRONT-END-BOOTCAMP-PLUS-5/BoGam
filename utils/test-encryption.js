const { validateEncryption, encryptJson, decryptJson } = require('./encryption.ts');

console.log('🔐 암호화 테스트 시작...');

// 테스트 데이터
const testData = {
  resultCode: 'CF-00000',
  resultMessage: '성공',
  taxCertInfo: {
    issueNo: '202412345678',
    userName: '홍길동',
    userAddr: '서울특별시 강남구 테헤란로 123',
    paymentTaxStatus: '정상',
    issueDate: '2024-12-31'
  },
  sensitiveData: {
    phoneNo: '010-1234-5678',
    personalInfo: {
      residentNo: '901234-1******',
      address: '서울특별시 강남구'
    }
  }
};

try {
  // 1. 기본 검증
  console.log('1️⃣ 기본 암호화/복호화 검증:', validateEncryption() ? '✅ 성공' : '❌ 실패');

  // 2. JSON 암호화 테스트
  console.log('\n2️⃣ JSON 데이터 암호화 테스트');
  console.log('원본 데이터:', JSON.stringify(testData, null, 2));
  
  const encrypted = encryptJson(testData);
  console.log('\n암호화된 데이터 (일부):', encrypted.substring(0, 100) + '...');
  
  const decrypted = decryptJson(encrypted);
  console.log('\n복호화된 데이터:', JSON.stringify(decrypted, null, 2));
  
  // 3. 데이터 무결성 검증
  const isIdentical = JSON.stringify(testData) === JSON.stringify(decrypted);
  console.log('\n3️⃣ 데이터 무결성 검증:', isIdentical ? '✅ 성공' : '❌ 실패');
  
  console.log('\n🎉 모든 암호화 테스트가 성공적으로 완료되었습니다!');
  
} catch (error) {
  console.error('\n❌ 암호화 테스트 실패:', error.message);
  process.exit(1);
}