import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const modelPath = path.join(process.cwd(), 'public/models/book/scene.gltf');
const outputDir = path.join(process.cwd(), 'public/models/book/optimized');
const tempModifiedGltf = path.join(process.cwd(), 'public/models/book/scene_no_textures.gltf');

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Book 모델 최적화 (텍스처 제거) 시작...\n');

try {
  // 1. GLTF 파일에서 텍스처 참조 제거
  console.log('📝 1단계: GLTF 파일에서 텍스처 참조 제거 시작...');

  try {
    const gltfContent = fs.readFileSync(modelPath, 'utf8');
    const gltfData = JSON.parse(gltfContent);

    // 텍스처 관련 데이터 제거
    if (gltfData.textures) {
      console.log(`  🔄 ${gltfData.textures.length}개 텍스처 참조 제거`);
      delete gltfData.textures;
    }

    if (gltfData.images) {
      console.log(`  🔄 ${gltfData.images.length}개 이미지 참조 제거`);
      delete gltfData.images;
    }

    if (gltfData.samplers) {
      console.log(`  🔄 ${gltfData.samplers.length}개 샘플러 참조 제거`);
      delete gltfData.samplers;
    }

    // 머티리얼에서 baseColor 텍스처만 제거 (normal, metallicRoughness는 유지)
    if (gltfData.materials) {
      gltfData.materials.forEach((material, index) => {
        if (material.pbrMetallicRoughness) {
          if (material.pbrMetallicRoughness.baseColorTexture) {
            console.log(`  🔄 머티리얼 ${index}에서 baseColorTexture만 제거 (색상 변경용)`);
            delete material.pbrMetallicRoughness.baseColorTexture;
          }
          // metallicRoughnessTexture는 유지 (재질 특성)
          if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
            console.log(`  ✅ 머티리얼 ${index}에서 metallicRoughnessTexture 유지`);
          }
        }
        // normalTexture는 유지 (표면 질감)
        if (material.normalTexture) {
          console.log(`  ✅ 머티리얼 ${index}에서 normalTexture 유지`);
        }
      });
    }

    // 수정된 GLTF 파일 저장
    fs.writeFileSync(tempModifiedGltf, JSON.stringify(gltfData, null, 2));
    console.log(`  ✅ 텍스처 참조가 제거된 GLTF 파일 저장: ${tempModifiedGltf}\n`);

  } catch (error) {
    console.error('  ❌ GLTF 파일 수정 실패:', error.message);
    throw error;
  }

  // 2. 수정된 GLTF → GLB 변환
  console.log('🔄 2단계: 수정된 GLTF → GLB 변환 시작...');
  const glbPath = path.join(outputDir, 'book-no-textures.glb');
  execSync(`gltf-transform copy ${tempModifiedGltf} ${glbPath}`);
  console.log(`  ✅ GLB 변환 완료: ${glbPath}\n`);

  // 3. Draco 압축
  console.log('🔄 3단계: Draco 압축 시작...');
  const finalPath = path.join(outputDir, 'book-draco-no-textures.glb');
  execSync(`gltf-transform draco ${glbPath} ${finalPath}`);
  console.log(`  ✅ Draco 압축 완료: ${finalPath}\n`);

  // 4. 임시 파일 정리
  console.log('🧹 4단계: 임시 파일 정리...');
  if (fs.existsSync(tempModifiedGltf)) {
    fs.unlinkSync(tempModifiedGltf);
    console.log('  ✅ 임시 GLTF 파일 삭제 완료');
  }

  // 5. 최종 결과 요약
  console.log('\n🎉 모든 최적화 완료!');
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

  console.log('\n💡 이제 모든 텍스처를 외부에서 동적으로 로딩할 수 있습니다!');

} catch (error) {
  console.error('❌ 최적화 중 오류 발생:', error);
  
  // 오류 발생 시 임시 파일 정리
  if (fs.existsSync(tempModifiedGltf)) {
    fs.unlinkSync(tempModifiedGltf);
    console.log('🧹 임시 파일 정리 완료');
  }
  
  process.exit(1);
}
