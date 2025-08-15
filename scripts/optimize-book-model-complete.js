import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const texturesDir = path.join(process.cwd(), 'public/models/book/textures');
const outputTexturesDir = path.join(process.cwd(), 'public/models/book/textures_ktx2');
const modelPath = path.join(process.cwd(), 'public/models/book/scene.gltf');
const outputDir = path.join(process.cwd(), 'public/models/book/optimized');
const tempModifiedGltf = path.join(process.cwd(), 'public/models/book/scene_ktx2.gltf');

// 출력 디렉토리 생성
if (!fs.existsSync(outputTexturesDir)) {
  fs.mkdirSync(outputTexturesDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Book 모델 완전 최적화 시작...\n');

try {
  // 1. PNG → KTX2 변환
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

  // 2. GLTF 파일의 텍스처 경로를 KTX2로 수정
  console.log('📝 2단계: GLTF 파일 텍스처 경로 수정 시작...');

  try {
    const gltfContent = fs.readFileSync(modelPath, 'utf8');
    const gltfData = JSON.parse(gltfContent);

    // 텍스처 경로를 KTX2로 변경
    if (gltfData.images) {
      gltfData.images.forEach((image) => {
        if (image.uri && image.uri.includes('textures/') && image.uri.endsWith('.png')) {
          const newUri = image.uri
            .replace('textures/', 'textures_ktx2/')
            .replace('.png', '.ktx2');
          image.uri = newUri;
          console.log(`  🔄 텍스처 경로 수정: ${image.uri} → ${newUri}`);
        }
      });
    }

    // 수정된 GLTF 파일 저장
    fs.writeFileSync(tempModifiedGltf, JSON.stringify(gltfData, null, 2));
    console.log(`  ✅ 수정된 GLTF 파일 저장: ${tempModifiedGltf}\n`);

  } catch (error) {
    console.error('  ❌ GLTF 파일 수정 실패:', error.message);
    throw error;
  }

  // 3. 수정된 GLTF → GLB 변환
  console.log('🔄 3단계: 수정된 GLTF → GLB 변환 시작...');
  const glbPath = path.join(outputDir, 'book-ktx2.glb');
  execSync(`gltf-transform copy ${tempModifiedGltf} ${glbPath}`);
  console.log(`  ✅ GLB 변환 완료: ${glbPath}\n`);

  // 4. Draco 압축
  console.log('🔄 4단계: Draco 압축 시작...');
  const finalPath = path.join(outputDir, 'book-draco-ktx2.glb');
  execSync(`gltf-transform draco ${glbPath} ${finalPath}`);
  console.log(`  ✅ Draco 압축 완료: ${finalPath}\n`);

  // 5. 임시 파일 정리
  console.log('🧹 5단계: 임시 파일 정리...');
  if (fs.existsSync(tempModifiedGltf)) {
    fs.unlinkSync(tempModifiedGltf);
    console.log('  ✅ 임시 GLTF 파일 삭제 완료');
  }

  // 6. 최종 결과 요약
  console.log('\n🎉 모든 최적화 완료!');
  console.log(`📁 텍스처 출력: ${outputTexturesDir}`);
  console.log(`📁 모델 출력: ${outputDir}`);
  console.log(`📦 최종 파일: ${finalPath}`);

  // 파일 크기 비교
  const originalGltfSize = fs.statSync(modelPath).size;
  const finalGlbSize = fs.statSync(finalPath).size;
  const totalCompressionRatio = ((originalGltfSize - finalGlbSize) / originalGltfSize * 100).toFixed(1);

  console.log(`\n📊 압축 결과:`);
  console.log(`  원본 GLTF: ${(originalGltfSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  최종 GLB: ${(finalGlbSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  전체 압축률: ${totalCompressionRatio}%`);

  // KTX2 텍스처 크기 요약
  let totalKtx2Size = 0;
  const ktx2Files = fs.readdirSync(outputTexturesDir).filter(file => file.endsWith('.ktx2'));
  
  ktx2Files.forEach(file => {
    const filePath = path.join(outputTexturesDir, file);
    totalKtx2Size += fs.statSync(filePath).size;
  });

  console.log(`  KTX2 텍스처 총 크기: ${(totalKtx2Size / 1024 / 1024).toFixed(2)}MB`);

} catch (error) {
  console.error('❌ 최적화 중 오류 발생:', error);
  
  // 오류 발생 시 임시 파일 정리
  if (fs.existsSync(tempModifiedGltf)) {
    fs.unlinkSync(tempModifiedGltf);
    console.log('🧹 임시 파일 정리 완료');
  }
  
  process.exit(1);
}
