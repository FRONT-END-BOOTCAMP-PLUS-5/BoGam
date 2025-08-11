const fs = require('fs');
const path = require('path');

console.log('🎨 실제 베이스컬러 텍스처 생성 중...');

// 텍스처 폴더 경로
const texturesDir = 'public/models/book/textures';

// 폴더가 없다면 생성
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
  console.log(`📁 텍스처 폴더 생성: ${texturesDir}`);
}

// 7개 책의 색상 및 패턴 설정
const bookTextures = [
  { name: 'book1', color: [255, 100, 100], description: '빨간색 책표지' },
  { name: 'book2', color: [100, 150, 255], description: '파란색 책표지' },
  { name: 'book3', color: [100, 255, 100], description: '초록색 책표지' },
  { name: 'book4', color: [255, 200, 100], description: '주황색 책표지' },
  { name: 'book5', color: [200, 100, 255], description: '보라색 책표지' },
  { name: 'book6', color: [255, 255, 100], description: '노란색 책표지' },
  { name: 'book7', color: [100, 255, 255], description: '청록색 책표지' }
];

// 64x64 픽셀 텍스처 생성 함수
function createTexturePNG(r, g, b, width = 64, height = 64) {
  // PNG 시그니처
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR 청크 (64x64 픽셀, 8비트 컬러)
  const ihdrData = Buffer.alloc(25);
  ihdrData.writeUInt32BE(width, 0);      // width: 64
  ihdrData.writeUInt32BE(height, 4);     // height: 64
  ihdrData.writeUInt8(8, 8);            // bit depth: 8
  ihdrData.writeUInt8(2, 9);            // color type: 2 (RGB)
  ihdrData.writeUInt8(0, 10);           // compression: 0
  ihdrData.writeUInt8(0, 11);           // filter: 0
  ihdrData.writeUInt8(0, 12);           // interlace: 0
  
  // IDAT 청크 (64x64 RGB 픽셀 데이터)
  const pixelData = Buffer.alloc(width * height * 3);
  let pixelIndex = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 기본 색상에 약간의 변화 추가 (텍스처 효과)
      const variation = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 20;
      const rVaried = Math.max(0, Math.min(255, r + variation));
      const gVaried = Math.max(0, Math.min(255, g + variation));
      const bVaried = Math.max(0, Math.min(255, b + variation));
      
      pixelData[pixelIndex++] = Math.round(rVaried);
      pixelData[pixelIndex++] = Math.round(gVaried);
      pixelData[pixelIndex++] = Math.round(bVaried);
    }
  }
  
  // 필터 타입 추가 (각 행마다)
  const filteredData = Buffer.alloc(width * height * 3 + height);
  let filterIndex = 0;
  let pixelDataIndex = 0;
  
  for (let y = 0; y < height; y++) {
    filteredData[filterIndex++] = 0x00; // filter type: none
    for (let x = 0; x < width; x++) {
      filteredData[filterIndex++] = pixelData[pixelDataIndex++];
      filteredData[filterIndex++] = pixelData[pixelDataIndex++];
      filteredData[filterIndex++] = pixelData[pixelDataIndex++];
    }
  }
  
  // IEND 청크
  const iendData = Buffer.alloc(0);
  
  // CRC 계산 함수
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
  const idatChunk = createChunk('IDAT', filteredData);
  const iendChunk = createChunk('IEND', iendData);
  
  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

// 각 책의 베이스컬러 텍스처 생성
bookTextures.forEach((book, index) => {
  const fileName = `${book.name}_baseColor.png`;
  const filePath = path.join(texturesDir, fileName);
  
  try {
    // 64x64 픽셀 PNG 파일 생성
    const pngData = createTexturePNG(book.color[0], book.color[1], book.color[2]);
    fs.writeFileSync(filePath, pngData);
    
    console.log(`✅ ${fileName} 생성 완료 (${book.description})`);
  } catch (error) {
    console.error(`❌ ${fileName} 생성 실패:`, error.message);
  }
});

console.log('\n🎉 실제 베이스컬러 텍스처 생성 완료!');
console.log('\n📁 생성된 파일들:');
bookTextures.forEach(book => {
  console.log(`   - ${book.name}_baseColor.png (${book.description})`);
});

console.log('\n💡 이제 3D 모델에서 실제 텍스처가 적용됩니다!');
