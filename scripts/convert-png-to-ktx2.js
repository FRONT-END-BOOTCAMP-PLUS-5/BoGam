const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const texturesDir = path.join(process.cwd(), 'public/models/book/textures');
const outputTexturesDir = path.join(process.cwd(), 'public/models/textures');

// 출력 디렉토리 생성
if (!fs.existsSync(outputTexturesDir)) {
  fs.mkdirSync(outputTexturesDir, { recursive: true });
}

console.log('🚀 PNG → KTX2 변환 시작...\n');

try {
  // PNG 파일 찾기
  const pngFiles = fs.readdirSync(texturesDir).filter(file =>
    file.toLowerCase().endsWith('.png')
  );

  if (pngFiles.length === 0) {
    console.log('❌ 변환할 PNG 파일이 없습니다.');
    process.exit(0);
  }

  console.log(`📁 발견된 PNG 파일: ${pngFiles.length}개`);

  // 각 PNG 파일을 KTX2로 변환
  for (const fileName of pngFiles) {
    const inputPath = path.join(texturesDir, fileName);
    const outputFileName = fileName.replace('.png', '.ktx2');
    const outputPath = path.join(outputTexturesDir, outputFileName);

    console.log(`🔄 ${fileName} → ${outputFileName} 변환 중...`);

    try {
      // ICC 프로필 문제 해결을 위해 --assign_oetf srgb 추가
      execSync(`toktx --bcmp --assign_oetf srgb ${outputPath} ${inputPath}`);

      // 파일 크기 비교
      const originalSize = fs.statSync(inputPath).size;
      const convertedSize = fs.statSync(outputPath).size;
      const compressionRatio = ((originalSize - convertedSize) / originalSize * 100).toFixed(1);

      console.log(`  ✅ ${fileName} 변환 완료: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(convertedSize / 1024 / 1024).toFixed(1)}MB (${compressionRatio}% 압축)`);
    } catch (error) {
      console.error(`  ❌ ${fileName} 변환 실패:`, error.message);
    }
  }

  console.log('\n🎉 모든 PNG 파일 변환 완료!');
  console.log(`📁 출력 위치: ${outputTexturesDir}`);

  // 전체 압축 결과 요약
  let totalOriginalSize = 0;
  let totalConvertedSize = 0;
  
  pngFiles.forEach(fileName => {
    const inputPath = path.join(texturesDir, fileName);
    const outputFileName = fileName.replace('.png', '.ktx2');
    const outputPath = path.join(outputTexturesDir, outputFileName);
    
    if (fs.existsSync(outputPath)) {
      totalOriginalSize += fs.statSync(inputPath).size;
      totalConvertedSize += fs.statSync(outputPath).size;
    }
  });

  const totalCompressionRatio = ((totalOriginalSize - totalConvertedSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log(`\n📊 전체 압축 결과:`);
  console.log(`  원본 PNG 총 크기: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  KTX2 총 크기: ${(totalConvertedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  전체 압축률: ${totalCompressionRatio}%`);

} catch (error) {
  console.error('❌ 변환 중 오류 발생:', error);
  process.exit(1);
}
