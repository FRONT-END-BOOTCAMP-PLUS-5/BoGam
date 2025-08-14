import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const texturesDir = path.join(process.cwd(), 'public/models/book/textures');
const outputTexturesDir = path.join(process.cwd(), 'public/models/book/textures_ktx2');
const modelPath = path.join(process.cwd(), 'public/models/book/scene.gltf');
const outputDir = path.join(process.cwd(), 'public/models/book/optimized');

// 출력 디렉토리 생성
if (!fs.existsSync(outputTexturesDir)) {
  fs.mkdirSync(outputTexturesDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Book 모델 최적화 시작...\n');

try {
  // 1. PNG → KTX2 변환 (ICC 프로필 문제 해결을 위해 --assign_oetf 추가)
  console.log('📸 1단계: PNG → KTX2 변환 시작...');
  
  const pngFiles = fs.readdirSync(texturesDir).filter(file => 
    file.toLowerCase().endsWith('.png')
  );
  
  console.log(`  📁 발견된 PNG 파일: ${pngFiles.length}개`);
  
  for (const fileName of pngFiles) {
    const inputPath = path.join(texturesDir, fileName);
    const outputFileName = fileName.replace('.png', '.ktx2');
    const outputPath = path.join(outputTexturesDir, outputFileName);
    
    console.log(`  🔄 ${fileName} → ${outputFileName} 변환 중...`);
    
    try {
      // ICC 프로필 문제 해결을 위해 --assign_oetf srgb 추가
      execSync(`toktx --bcmp --assign_oetf srgb ${outputPath} ${inputPath}`);
      
      // 파일 크기 비교
      const originalSize = fs.statSync(inputPath).size;
      const convertedSize = fs.statSync(outputPath).size;
      const compressionRatio = ((originalSize - convertedSize) / originalSize * 100).toFixed(1);
      
      console.log(`    ✅ ${fileName} 변환 완료: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(convertedSize / 1024 / 1024).toFixed(1)}MB (${compressionRatio}% 압축)`);
    } catch (error) {
      console.error(`    ❌ ${fileName} 변환 실패:`, error.message);
    }
  }
  
  console.log('\n✅ 1단계 완료: 모든 PNG 파일이 KTX2로 변환되었습니다.\n');
  
  // 2. glTF → GLB 변환
  console.log('🔄 2단계: glTF → GLB 변환 시작...');
  const glbPath = path.join(outputDir, 'book.glb');
  execSync(`gltf-transform copy ${modelPath} ${glbPath}`);
  console.log(`  ✅ GLB 변환 완료: ${glbPath}\n`);
  
  // 3. Draco 압축
  console.log('🔄 3단계: Draco 압축 시작...');
  const finalPath = path.join(outputDir, 'book-draco.glb');
  execSync(`gltf-transform draco ${glbPath} ${finalPath}`);
  console.log(`  ✅ Draco 압축 완료: ${finalPath}\n`);
  
  console.log('🎉 모든 최적화 완료!');
  console.log(`📁 텍스처 출력: ${outputTexturesDir}`);
  console.log(`📁 모델 출력: ${outputDir}`);
  console.log(`📦 최종 파일: ${finalPath}`);
  
} catch (error) {
  console.error('❌ 최적화 중 오류 발생:', error);
  process.exit(1);
}
