const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('🎨 Sharp를 사용한 컬러맵 변형 베이스컬러 텍스처 생성 중...');

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

// Sharp를 사용하여 컬러맵 변경
async function modifyPNGColorsWithSharp(inputPath, outputPath, targetR, targetG, targetB) {
  try {
    // 이미지 로드
    const image = sharp(inputPath);
    
    // 이미지 메타데이터 가져오기
    const metadata = await image.metadata();
    console.log(`📐 이미지 크기: ${metadata.width}x${metadata.height} 픽셀`);
    
    // 컬러맵 변경: 원본 이미지의 밝기 정보를 유지하면서 색상 변경
    await image
      .removeAlpha() // 알파 채널 제거
      .tint({ r: targetR, g: targetG, b: targetB }) // 색상 변경
      .png() // PNG 형식으로 출력
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error('Sharp 처리 중 오류:', error);
    return false;
  }
}

// 각 책의 컬러맵 변형 텍스처 생성
async function generateAllTextures() {
  for (const book of bookColors) {
    const fileName = `${book.name}_baseColor.png`;
    const filePath = path.join(texturesDir, fileName);
    
    try {
      console.log(`🔄 ${fileName} 생성 중... (${book.description})`);
      
      // 컬러맵 변경
      const success = await modifyPNGColorsWithSharp(
        baseColorFile, 
        filePath, 
        book.color[0], 
        book.color[1], 
        book.color[2]
      );
      
      if (success) {
        console.log(`✅ ${fileName} 생성 완료 (${book.description})`);
      } else {
        console.error(`❌ ${fileName} 생성 실패`);
      }
    } catch (error) {
      console.error(`❌ ${fileName} 생성 실패:`, error.message);
    }
  }
  
  console.log('\n🎉 Sharp를 사용한 컬러맵 변형 베이스컬러 텍스처 생성 완료!');
  console.log('\n📁 생성된 파일들:');
  bookColors.forEach(book => {
    console.log(`   - ${book.name}_baseColor.png (${book.description})`);
  });
  
  console.log('\n💡 이제 3D 모델에서 실제 컬러맵이 변경된 텍스처가 적용됩니다!');
}

// 스크립트 실행
generateAllTextures().catch(console.error);
