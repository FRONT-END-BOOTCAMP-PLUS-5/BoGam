const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 설정
const BOOKSHELF_DIR = path.join(__dirname, '..', 'public', 'models', 'bookshelf');
const INPUT_FILE = path.join(BOOKSHELF_DIR, 'scene.gltf');
const OUTPUT_DIR = path.join(BOOKSHELF_DIR);

console.log('🚀 Bookshelf 모델 최적화 시작...');

// 입력 파일 확인
if (!fs.existsSync(INPUT_FILE)) {
  console.error('❌ 입력 파일을 찾을 수 없습니다:', INPUT_FILE);
  process.exit(1);
}

console.log(`📁 입력 파일: ${INPUT_FILE}`);

// 1. Draco 압축 적용
console.log('\n🔒 1단계: Draco 압축 적용 중...');
try {
  const dracoOutputPath = path.join(OUTPUT_DIR, 'scene-draco.glb');
  execSync(`gltf-transform draco "${INPUT_FILE}" "${dracoOutputPath}"`, { 
    stdio: 'inherit'
  });
  console.log(`✅ Draco 압축 완료: ${dracoOutputPath}`);
} catch (error) {
  console.error('❌ Draco 압축 실패:', error.message);
  process.exit(1);
}

// 2. KTX2 압축 적용
console.log('\n🎨 2단계: KTX2 압축 적용 중...');
try {
  const finalOutputPath = path.join(OUTPUT_DIR, 'scene-draco-ktx-optimized.glb');
  execSync(`gltf-transform etc1s "${path.join(OUTPUT_DIR, 'scene-draco.glb')}" "${finalOutputPath}"`, { 
    stdio: 'inherit'
  });
  console.log(`✅ KTX2 압축 완료: ${finalOutputPath}`);
} catch (error) {
  console.error('❌ KTX2 압축 실패:', error.message);
  process.exit(1);
}

// 3. 중간 파일 정리
console.log('\n🧹 3단계: 중간 파일 정리 중...');
fs.unlinkSync(path.join(OUTPUT_DIR, 'scene-draco.glb'));
console.log('✅ 중간 파일 정리 완료');

// 4. 최종 결과 출력
const finalPath = path.join(OUTPUT_DIR, 'scene-draco-ktx-optimized.glb');
const stats = fs.statSync(finalPath);
const fileSizeInKB = (stats.size / 1024).toFixed(1);

console.log('\n🎉 최적화 완료!');
console.log(`📁 최종 파일: ${finalPath}`);
console.log(`📊 파일 크기: ${fileSizeInKB} KB`);
console.log('\n💡 사용법:');
console.log(`   - scene-draco-ktx-optimized.glb 파일을 사용하세요`);
console.log(`   - Draco + KTX2 압축으로 최적화됨`);
