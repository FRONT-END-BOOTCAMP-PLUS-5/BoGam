const fs = require('fs');
const path = require('path');

console.log('🎨 컬러맵 변형 베이스컬러 텍스처 생성 중...');

// 텍스처 폴더 경로
const texturesDir = 'public/models/book/textures';

// 기존 베이스컬러 파일 경로
const baseColorFile = path.join(texturesDir, 'book_baseColor.png');

// 기존 파일이 존재하는지 확인
if (!fs.existsSync(baseColorFile)) {
  console.error('❌ 기존 베이스컬러 파일이 존재하지 않습니다:', baseColorFile);
  process.exit(1);
}

// 7개 책의 새로운 색상 설정
const bookColors = [
  { name: 'book1', color: [255, 100, 100], description: '빨간색 책표지' },
  { name: 'book2', color: [100, 150, 255], description: '파란색 책표지' },
  { name: 'book3', color: [100, 255, 100], description: '초록색 책표지' },
  { name: 'book4', color: [255, 200, 100], description: '주황색 책표지' },
  { name: 'book5', color: [200, 100, 255], description: '보라색 책표지' },
  { name: 'book6', color: [255, 255, 100], description: '노란색 책표지' },
  { name: 'book7', color: [100, 255, 255], description: '청록색 책표지' }
];

// PNG 파일을 읽고 컬러맵을 변경하는 함수
function modifyPNGColors(pngBuffer, targetR, targetG, targetB) {
  // PNG 시그니처 확인
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  if (pngBuffer.compare(pngSignature, 0, 8, 0, 8) !== 0) {
    throw new Error('유효하지 않은 PNG 파일입니다.');
  }

  // IHDR 청크 찾기 (8번째 바이트부터)
  let offset = 8;
  let width, height;
  
  while (offset < pngBuffer.length - 8) {
    const chunkLength = pngBuffer.readUInt32BE(offset);
    const chunkType = pngBuffer.toString('ascii', offset + 4, offset + 8);
    
    if (chunkType === 'IHDR') {
      width = pngBuffer.readUInt32BE(offset + 8);
      height = pngBuffer.readUInt32BE(offset + 12);
      console.log(`📐 이미지 크기: ${width}x${height} 픽셀`);
      break;
    }
    
    offset += 12 + chunkLength; // length + type + data + crc
  }
  
  if (!width || !height) {
    throw new Error('IHDR 청크를 찾을 수 없습니다.');
  }

  // IDAT 청크 찾기 및 픽셀 데이터 수정
  offset = 8;
  const newPngBuffer = Buffer.alloc(pngBuffer.length);
  pngBuffer.copy(newPngBuffer, 0, 0, 8); // PNG 시그니처 복사
  
  while (offset < pngBuffer.length - 8) {
    const chunkLength = pngBuffer.readUInt32BE(offset);
    const chunkType = pngBuffer.toString('ascii', offset + 4, offset + 8);
    
    if (chunkType === 'IDAT') {
      // IDAT 청크 헤더 복사
      newPngBuffer.writeUInt32BE(chunkLength, offset);
      newPngBuffer.write(chunkType, offset + 4);
      
      // 픽셀 데이터 수정
      const dataStart = offset + 8;
      const dataEnd = dataStart + chunkLength;
      
      for (let i = dataStart; i < dataEnd; i++) {
        if (i % 4 === 1) { // R 채널 (필터 타입 다음)
          newPngBuffer[i] = targetR;
        } else if (i % 4 === 2) { // G 채널
          newPngBuffer[i] = targetG;
        } else if (i % 4 === 3) { // B 채널
          newPngBuffer[i] = targetB;
        } else { // 필터 타입 (0번째)
          newPngBuffer[i] = pngBuffer[i];
        }
      }
      
      // CRC 재계산 및 복사
      const crcStart = dataEnd;
      newPngBuffer.writeUInt32BE(calculateCRC(newPngBuffer.slice(offset + 4, dataEnd)), crcStart);
      
      offset += 12 + chunkLength;
    } else {
      // 다른 청크들은 그대로 복사
      pngBuffer.copy(newPngBuffer, offset, offset, offset + 12 + chunkLength);
      offset += 12 + chunkLength;
    }
  }
  
  return newPngBuffer;
}

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

// 각 책의 컬러맵 변형 텍스처 생성
bookColors.forEach((book, index) => {
  const fileName = `${book.name}_baseColor.png`;
  const filePath = path.join(texturesDir, fileName);
  
  try {
    // 기존 베이스컬러 파일 읽기
    const originalPng = fs.readFileSync(baseColorFile);
    
    // 컬러맵 변경
    const modifiedPng = modifyPNGColors(originalPng, book.color[0], book.color[1], book.color[2]);
    
    // 새 파일 저장
    fs.writeFileSync(filePath, modifiedPng);
    
    console.log(`✅ ${fileName} 생성 완료 (${book.description})`);
  } catch (error) {
    console.error(`❌ ${fileName} 생성 실패:`, error.message);
  }
});

console.log('\n🎉 컬러맵 변형 베이스컬러 텍스처 생성 완료!');
console.log('\n📁 생성된 파일들:');
bookColors.forEach(book => {
  console.log(`   - ${book.name}_baseColor.png (${book.description})`);
});

console.log('\n💡 이제 3D 모델에서 실제 텍스처가 적용됩니다!');
