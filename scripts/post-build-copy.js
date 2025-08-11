const fs = require('fs');
const path = require('path');

console.log('📁 빌드 후 최적화된 3D 모델 파일 복사 중...');

const sourceDir = 'public/models/books-optimized';
const targetDir = 'public/models/book';
const sourceFile = 'books-draco-ktx.glb';
const targetFile = 'scene-draco-ktx.glb';

// 소스 파일 경로
const sourcePath = path.join(sourceDir, sourceFile);
const targetPath = path.join(targetDir, targetFile);

// 백업 파일 경로
const backupPath = path.join(targetDir, 'scene-draco-ktx.glb.backup');

try {
  // 소스 파일이 존재하는지 확인
  if (!fs.existsSync(sourcePath)) {
    console.log(`❌ 소스 파일을 찾을 수 없습니다: ${sourcePath}`);
    console.log('💡 3D 모델 최적화가 먼저 실행되어야 합니다.');
    process.exit(1);
  }

  // 기존 파일이 있다면 백업
  if (fs.existsSync(targetPath)) {
    console.log(`📋 기존 파일 백업 중: ${targetPath} → ${backupPath}`);
    fs.copyFileSync(targetPath, backupPath);
    console.log('✅ 백업 완료');
  }

  // 새 파일 복사
  console.log(`📋 최적화된 파일 복사 중: ${sourcePath} → ${targetPath}`);
  fs.copyFileSync(sourcePath, targetPath);
  console.log('✅ 파일 복사 완료');

  // 파일 크기 비교
  const sourceStats = fs.statSync(sourcePath);
  const sourceSizeMB = (sourceStats.size / (1024 * 1024)).toFixed(2);
  
  if (fs.existsSync(backupPath)) {
    const backupStats = fs.statSync(backupPath);
    const backupSizeMB = (backupStats.size / (1024 * 1024)).toFixed(2);
    const reduction = ((backupStats.size - sourceStats.size) / backupStats.size * 100).toFixed(1);
    
    console.log('\n📊 파일 크기 비교:');
    console.log(`   이전: ${backupSizeMB} MB`);
    console.log(`   현재: ${sourceSizeMB} MB`);
    console.log(`   감소: ${reduction}%`);
  } else {
    console.log(`\n📊 파일 크기: ${sourceSizeMB} MB`);
  }

  console.log('\n🎉 3D 모델 최적화 및 배포 완료!');
  console.log(`📁 최종 파일: ${targetPath}`);
  console.log('💡 이제 애플리케이션에서 최적화된 모델을 사용할 수 있습니다.');

} catch (error) {
  console.error('❌ 파일 복사 중 오류 발생:', error.message);
  
  // 백업에서 복구 시도
  if (fs.existsSync(backupPath)) {
    console.log('🔄 백업에서 복구 시도 중...');
    try {
      fs.copyFileSync(backupPath, targetPath);
      console.log('✅ 백업에서 복구 완료');
    } catch (restoreError) {
      console.error('❌ 백업 복구 실패:', restoreError.message);
    }
  }
  
  process.exit(1);
}
