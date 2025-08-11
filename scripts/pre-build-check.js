const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 빌드 전 3D 모델 최적화 준비 상태 확인...');

// 필요한 디렉토리와 파일 확인
const requiredPaths = [
  'public/models/book/scene.gltf',
  'public/models/book/textures/book_normal.png',
  'public/models/book/textures/book_metallicRoughness.png'
];

// 7개 책 베이스컬러 텍스처 확인
const bookTextures = [
  'book1_baseColor.png',
  'book2_baseColor.png',
  'book3_baseColor.png',
  'book4_baseColor.png',
  'book5_baseColor.png',
  'book6_baseColor.png',
  'book7_baseColor.png'
];

console.log('\n📁 필수 파일 확인 중...');

// 필수 파일들 확인
let allFilesExist = true;
requiredPaths.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${filePath}`);
  } else {
    console.log(`❌ ${filePath} - 파일이 없습니다!`);
    allFilesExist = false;
  }
});

// 베이스컬러 텍스처 확인
console.log('\n🎨 베이스컬러 텍스처 확인 중...');
bookTextures.forEach(textureName => {
  const texturePath = `public/models/book/textures/${textureName}`;
  if (fs.existsSync(texturePath)) {
    console.log(`✅ ${textureName}`);
  } else {
    console.log(`❌ ${textureName} - 파일이 없습니다!`);
    allFilesExist = false;
  }
});

// gltf-transform 설치 확인
console.log('\n🔧 gltf-transform 설치 확인 중...');
try {
  execSync('npx gltf-transform --version', { stdio: 'pipe' });
  console.log('✅ gltf-transform이 설치되어 있습니다.');
} catch (error) {
  console.log('❌ gltf-transform이 설치되어 있지 않습니다.');
  console.log('📦 설치 중...');
  try {
    execSync('npm install -g @gltf-transform/cli', { stdio: 'inherit' });
    console.log('✅ gltf-transform 설치 완료!');
  } catch (installError) {
    console.error('❌ gltf-transform 설치 실패:', installError.message);
    console.log('💡 수동 설치: npm install -g @gltf-transform/cli');
    allFilesExist = false;
  }
}

// 출력 디렉토리 생성
const outputDir = 'public/models/books-optimized';
if (!fs.existsSync(outputDir)) {
  console.log(`\n📁 출력 디렉토리 생성: ${outputDir}`);
  fs.mkdirSync(outputDir, { recursive: true });
}

// 최종 결과
console.log('\n📊 확인 결과:');
if (allFilesExist) {
  console.log('🎉 모든 파일이 준비되어 있습니다!');
  console.log('🚀 3D 모델 최적화를 진행할 수 있습니다.');
  process.exit(0);
} else {
  console.log('⚠️ 일부 파일이 누락되었습니다.');
  console.log('💡 다음을 확인해주세요:');
  console.log('   1. public/models/book/textures/ 폴더에 필요한 텍스처 파일들이 있는지');
  console.log('   2. gltf-transform이 설치되어 있는지');
  console.log('   3. 원본 scene.gltf 파일이 있는지');
  process.exit(1);
}
