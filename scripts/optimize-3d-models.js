const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MODELS_DIR = 'public/models';
const OUTPUT_DIR = 'public/models/optimized';

// 원래 경로
const KTX_PATH = 'C:\\Program Files\\KTX-Software\\bin';
const NPX_PATH = 'C:\\Program Files\\nodejs\\npx.cmd';
const NODE_PATH = 'C:\\Program Files\\nodejs';

// 실행 파일 절대경로
const KTX_EXE = path.join(KTX_PATH, 'ktx.exe');

// 8.3 경로 변환 함수
function getShortPath(longPath) {
  return execSync(`for %I in ("${longPath}") do @echo %~sI`, { shell: 'cmd.exe' })
    .toString()
    .trim();
}

const KTX_PATH_SHORT = getShortPath(KTX_PATH);
const NODE_PATH_SHORT = getShortPath(NODE_PATH);

console.log(`🔧 KTX 실행 파일: ${KTX_EXE}`);
console.log(`🔧 짧은 KTX 경로: ${KTX_PATH_SHORT}`);
console.log(`🔧 짧은 Node 경로: ${NODE_PATH_SHORT}`);

// 출력 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// KTX 실행 사전 검증
try {
  const ktxVersion = execSync(`"${KTX_EXE}" --version`, { encoding: 'utf8' }).trim();
  console.log('✅ ktx 실행 확인:', ktxVersion);
} catch (err) {
  console.error('❌ ktx 실행 불가:', err.message);
  process.exit(1);
}

// 모델 폴더 찾기
function findModelFolders() {
  const modelFolders = [];
  if (fs.existsSync(MODELS_DIR)) {
    const items = fs.readdirSync(MODELS_DIR);
    for (const item of items) {
      const itemPath = path.join(MODELS_DIR, item);
      if (fs.statSync(itemPath).isDirectory()) {
        const gltfPath = path.join(itemPath, 'scene.gltf');
        if (fs.existsSync(gltfPath)) {
          modelFolders.push({ name: item, gltfPath });
        }
      }
    }
  }
  return modelFolders;
}

const modelFolders = findModelFolders();
if (modelFolders.length === 0) {
  console.error('❌ 변환할 GLTF 파일이 없습니다.');
  process.exit(1);
}

console.log(`📁 발견된 모델: ${modelFolders.map(f => f.name).join(', ')}`);

for (const folder of modelFolders) {
  console.log(`\n🔄 ${folder.name} 변환 시작`);

  try {
    const dracoOutput = path.join(OUTPUT_DIR, `${folder.name}-draco.glb`);
    const finalOutput = path.join(OUTPUT_DIR, `${folder.name}-draco-ktx.glb`);

    // Draco 압축
    execSync(`"${NPX_PATH}" gltf-transform draco "${folder.gltfPath}" "${dracoOutput}"`, {
      stdio: 'inherit',
      shell: 'cmd.exe'
    });
    console.log(`  ✅ Draco 완료`);

    // 환경변수 설정 (KTX bin 경로를 PATH 맨 앞에)
    const env = { ...process.env };
    env.PATH = `${KTX_PATH_SHORT};${NODE_PATH_SHORT};${process.env.PATH}`;

    // KTX2 압축
    execSync(`"${NPX_PATH}" gltf-transform etc1s "${dracoOutput}" "${finalOutput}"`, {
      stdio: 'inherit',
      env,
      shell: 'cmd.exe'
    });
    console.log(`  ✅ KTX2 완료`);

    // 중간 파일 삭제
    fs.unlinkSync(dracoOutput);

    const sizeMB = (fs.statSync(finalOutput).size / (1024 * 1024)).toFixed(2);
    console.log(`  📊 최종 크기: ${sizeMB} MB`);
  } catch (err) {
    console.error(`  ❌ ${folder.name} 실패:`, err.message);
  }
}

console.log('\n🎉 모든 변환 완료!');
