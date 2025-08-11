const fs = require('fs');
const path = require('path');

console.log('🎨 7개 책 베이스컬러 텍스처 생성 중...');

// 텍스처 폴더 경로
const texturesDir = 'public/models/book/textures';

// 폴더가 없다면 생성
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
  console.log(`📁 텍스처 폴더 생성: ${texturesDir}`);
}

// 7개 책의 색상 설정 (RGB 값)
const bookColors = [
  { name: 'book1', color: [255, 100, 100], description: '빨간색' },      // 빨간색
  { name: 'book2', color: [100, 150, 255], description: '파란색' },      // 파란색
  { name: 'book3', color: [100, 255, 100], description: '초록색' },      // 초록색
  { name: 'book4', color: [255, 200, 100], description: '주황색' },      // 주황색
  { name: 'book5', color: [200, 100, 255], description: '보라색' },      // 보라색
  { name: 'book6', color: [255, 255, 100], description: '노란색' },      // 노란색
  { name: 'book7', color: [100, 255, 255], description: '청록색' }       // 청록색
];

// 간단한 PNG 헤더 (1x1 픽셀, 단색)
function createSimplePNG(r, g, b) {
  // PNG 시그니처
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR 청크 (1x1 픽셀, 8비트 컬러)
  const ihdrData = Buffer.alloc(25);
  ihdrData.writeUInt32BE(1, 0);      // width: 1
  ihdrData.writeUInt32BE(1, 4);      // height: 1
  ihdrData.writeUInt8(8, 8);         // bit depth: 8
  ihdrData.writeUInt8(2, 9);         // color type: 2 (RGB)
  ihdrData.writeUInt8(0, 10);        // compression: 0
  ihdrData.writeUInt8(0, 11);        // filter: 0
  ihdrData.writeUInt8(0, 12);        // interlace: 0
  
  // IDAT 청크 (1x1 RGB 픽셀 데이터)
  const pixelData = Buffer.from([r, g, b]);
  const idatData = Buffer.concat([
    Buffer.from([0x00]), // filter type
    pixelData
  ]);
  
  // IEND 청크
  const iendData = Buffer.alloc(0);
  
  // CRC 계산 함수 (간단한 구현)
  function calculateCRC(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
      }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  
  // 청크 생성 함수
  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(calculateCRC(crcData), 0);
    
    return Buffer.concat([length, typeBuffer, data, crc]);
  }
  
  // PNG 파일 조합
  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', idatData);
  const iendChunk = createChunk('IEND', iendData);
  
  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

// 각 책의 베이스컬러 텍스처 생성
bookColors.forEach((book, index) => {
  const fileName = `${book.name}_baseColor.png`;
  const filePath = path.join(texturesDir, fileName);
  
  try {
    // PNG 파일 생성
    const pngData = createSimplePNG(book.color[0], book.color[1], book.color[2]);
    fs.writeFileSync(filePath, pngData);
    
    console.log(`✅ ${fileName} 생성 완료 (${book.description})`);
  } catch (error) {
    console.error(`❌ ${fileName} 생성 실패:`, error.message);
  }
});

// 공통 텍스처 파일들도 생성 (기존 파일이 없다면)
const commonTextures = [
  { name: 'book_normal.png', description: '공통 법선 맵' },
  { name: 'book_metallicRoughness.png', description: '공통 금속성/거칠기' }
];

console.log('\n🔧 공통 텍스처 파일 확인 중...');

commonTextures.forEach(texture => {
  const filePath = path.join(texturesDir, texture.name);
  
  if (!fs.existsSync(filePath)) {
    // 기본값으로 간단한 텍스처 생성
    try {
      // normal map: 기본값 (128, 128, 255) - 평면 표면
      const normalData = createSimplePNG(128, 128, 255);
      fs.writeFileSync(filePath, normalData);
      console.log(`✅ ${texture.name} 생성 완료 (${texture.description})`);
    } catch (error) {
      console.error(`❌ ${texture.name} 생성 실패:`, error.message);
    }
  } else {
    console.log(`✅ ${texture.name} 이미 존재함`);
  }
});

console.log('\n🎉 텍스처 파일 생성 완료!');
console.log('\n📁 생성된 파일들:');
console.log('   베이스컬러 텍스처:');
bookColors.forEach(book => {
  console.log(`     - ${book.name}_baseColor.png (${book.description})`);
});
console.log('   공통 텍스처:');
console.log('     - book_normal.png');
console.log('     - book_metallicRoughness.png');

console.log('\n💡 이제 다음 명령어로 3D 모델을 최적화할 수 있습니다:');
console.log('   npm run build');
