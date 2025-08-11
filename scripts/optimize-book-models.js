const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 설정
const MODELS_DIR = 'public/models';
const BOOK_DIR = path.join(MODELS_DIR, 'book');
const OUTPUT_DIR = path.join(MODELS_DIR, 'books-optimized');
const SCRIPT_DIR = __dirname;

// 7개 책의 텍스처 설정 (베이스컬러만 다름)
const BOOK_TEXTURES = [
  {
    name: 'book1',
    baseColor: 'book1_baseColor.png'
  },
  {
    name: 'book2',
    baseColor: 'book2_baseColor.png'
  },
  {
    name: 'book3',
    baseColor: 'book3_baseColor.png'
  },
  {
    name: 'book4',
    baseColor: 'book4_baseColor.png'
  },
  {
    name: 'book5',
    baseColor: 'book5_baseColor.png'
  },
  {
    name: 'book6',
    baseColor: 'book6_baseColor.png'
  },
  {
    name: 'book7',
    baseColor: 'book7_baseColor.png'
  }
];

// 출력 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🚀 책 모델 최적화 시작...');

// 1. 원본 GLTF 파일 복사 및 수정
console.log('\n📝 1단계: GLTF 파일 생성 중...');

const originalGltfPath = path.join(BOOK_DIR, 'scene.gltf');
const originalGltf = JSON.parse(fs.readFileSync(originalGltfPath, 'utf8'));

// 7개 책 모델을 포함하는 새로운 GLTF 생성
const newGltf = {
  ...originalGltf,
  scenes: [],
  nodes: [],
  meshes: [],
  materials: [],
  textures: [],
  images: []
};

// 공통 텍스처 이미지 추가 (한 번만)
if (newGltf.images.length === 0) {
  newGltf.images.push(
    {
      uri: 'textures/book_normal.png'  // 공통 normal 텍스처
    },
    {
      uri: 'textures/book_metallicRoughness.png'  // 공통 metallicRoughness 텍스처
    }
  );
  
  // 공통 텍스처 추가
  newGltf.textures.push(
    {
      source: 0  // normal 텍스처
    },
    {
      source: 1  // metallicRoughness 텍스처
    }
  );
}

// 각 책마다 모델, 재질, 텍스처 생성
BOOK_TEXTURES.forEach((bookConfig, index) => {
  const bookName = bookConfig.name;
  console.log(`  - ${bookName} 모델 생성 중...`);
  
  // 베이스컬러 텍스처 이미지 추가
  const baseColorImageIndex = newGltf.images.length;
  newGltf.images.push({
    uri: `textures/${bookConfig.baseColor}`
  });
  
  // 베이스컬러 텍스처 추가
  const baseColorTextureIndex = newGltf.textures.length;
  newGltf.textures.push({
    source: baseColorImageIndex
  });
  
  // 재질 추가 (베이스컬러만 다르고, normal과 metallicRoughness는 공통)
  const materialIndex = newGltf.materials.length;
  newGltf.materials.push({
    name: `${bookName}_material`,
    pbrMetallicRoughness: {
      baseColorTexture: {
        index: baseColorTextureIndex
      },
      normalTexture: {
        index: 0  // 공통 normal 텍스처
      },
      metallicRoughnessTexture: {
        index: 1  // 공통 metallicRoughness 텍스처
      }
    }
  });
  
  // 메시 추가 (원본 메시 복사)
  const meshIndex = newGltf.meshes.length;
  const originalMesh = originalGltf.meshes[0];
  const newMesh = {
    ...originalMesh,
    name: `${bookName}_mesh`,
    primitives: originalMesh.primitives.map(primitive => ({
      ...primitive,
      material: materialIndex
    }))
  };
  newGltf.meshes.push(newMesh);
  
  // 노드 추가
  const nodeIndex = newGltf.nodes.length;
  newGltf.nodes.push({
    name: `${bookName}_node`,
    mesh: meshIndex,
    translation: [
      index * 3 - 9, // X축으로 간격을 두고 배치
      0,
      0
    ]
  });
});

// 씬 생성
newGltf.scenes.push({
  name: 'books_scene',
  nodes: newGltf.nodes.map((_, index) => index)
});

// 루트 노드 추가
newGltf.nodes.unshift({
  name: 'root',
  children: newGltf.nodes.map((_, index) => index + 1)
});

// 새로운 GLTF 파일 저장
const newGltfPath = path.join(OUTPUT_DIR, 'books.gltf');
fs.writeFileSync(newGltfPath, JSON.stringify(newGltf, null, 2));
console.log(`✅ GLTF 파일 생성 완료: ${newGltfPath}`);

// 2. Draco 압축 적용
console.log('\n🔒 2단계: Draco 압축 적용 중...');
try {
  const dracoOutputPath = path.join(OUTPUT_DIR, 'books-draco.glb');
  execSync(`npx gltf-transform draco ${newGltfPath} ${dracoOutputPath}`, { 
    stdio: 'inherit',
    cwd: SCRIPT_DIR 
  });
  console.log(`✅ Draco 압축 완료: ${dracoOutputPath}`);
} catch (error) {
  console.error('❌ Draco 압축 실패:', error.message);
  process.exit(1);
}

// 3. KTX2 압축 적용
console.log('\n🎨 3단계: KTX2 압축 적용 중...');
try {
  const finalOutputPath = path.join(OUTPUT_DIR, 'books-draco-ktx.glb');
  execSync(`npx gltf-transform etc1s ${path.join(OUTPUT_DIR, 'books-draco.glb')} ${finalOutputPath}`, { 
    stdio: 'inherit',
    cwd: SCRIPT_DIR 
  });
  console.log(`✅ KTX2 압축 완료: ${finalOutputPath}`);
} catch (error) {
  console.error('❌ KTX2 압축 실패:', error.message);
  process.exit(1);
}

// 4. 중간 파일 정리
console.log('\n🧹 4단계: 중간 파일 정리 중...');
fs.unlinkSync(path.join(OUTPUT_DIR, 'books.gltf'));
fs.unlinkSync(path.join(OUTPUT_DIR, 'books-draco.glb'));
console.log('✅ 중간 파일 정리 완료');

// 5. 최종 결과 출력
const finalPath = path.join(OUTPUT_DIR, 'books-draco-ktx.glb');
const stats = fs.statSync(finalPath);
const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('\n🎉 최적화 완료!');
console.log(`📁 최종 파일: ${finalPath}`);
console.log(`📊 파일 크기: ${fileSizeInMB} MB`);
console.log(`📚 책 개수: ${BOOK_TEXTURES.length}개`);
console.log('\n💡 사용법:');
console.log(`   - 최종 파일을 ${BOOK_DIR}로 복사하여 사용`);
console.log(`   - 각 책마다 다른 텍스처가 적용됨`);
console.log(`   - Draco + KTX2 압축으로 최적화됨`);
