import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';

interface BookProps {
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  coverTexture?: string;
  title?: string; // 책 제목
  author?: string; // 저자명
  fontSize?: number; // 폰트 크기
  textColor?: string; // 텍스트 색상
}

export const createBook = (props: BookProps = {}): Promise<{ group: THREE.Group; mixer?: AnimationMixer }> => {
  const {
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    coverTexture,
    title,
    author,
    fontSize = 48,
    textColor = '#000000'
  } = props;

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
          loader.load(
        '/models/Book/animated book.glb',
        (gltf) => {
        const bookGroup = new THREE.Group();
        const bookModel = gltf.scene;
        
        // 모델에 그림자 설정 및 텍스처 변경
        bookModel.traverse(async (child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // 표지 텍스처 변경
            if (child.material && coverTexture) {
              const textureLoader = new THREE.TextureLoader();
              
              try {
                const coverTextureMap = await textureLoader.loadAsync(coverTexture);
                child.material.map = coverTextureMap;
                child.material.needsUpdate = true;
              } catch (error) {
                console.warn('Failed to load cover texture:', error);
              }
            }
            
            // 텍스트 추가 (제목이나 저자가 있을 때)
            if ((title || author) && child.material) {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              
              if (context) {
                // 캔버스 크기 설정
                canvas.width = 512;
                canvas.height = 512;
                
                // 배경색 설정 (투명)
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                // 폰트 설정
                context.font = `bold ${fontSize}px Arial`;
                context.fillStyle = textColor;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                
                // 텍스트 위치 계산 (살짝 아래로)
                const centerX = canvas.width / 2;
                const centerY = canvas.height * 0.35; // 상단 35% 위치
                
                // 제목 그리기 (좌우반전)
                if (title) {
                  // 좌우반전을 위한 변환
                  context.save();
                  context.scale(-1, 1);
                  context.fillText(title, -centerX, centerY);
                  context.restore();
                }
                
                // 저자 그리기 (좌우반전)
                if (author) {
                  context.font = `${fontSize * 0.6}px Arial`;
                  context.save();
                  context.scale(-1, 1);
                  context.fillText(author, -centerX, centerY + fontSize);
                  context.restore();
                }
                
                // 기존 텍스처와 합성
                if (child.material.map) {
                  const originalTexture = child.material.map;
                  const compositeCanvas = document.createElement('canvas');
                  const compositeContext = compositeCanvas.getContext('2d');
                  
                  if (compositeContext) {
                    compositeCanvas.width = 512;
                    compositeCanvas.height = 512;
                    
                    // 원본 텍스처 그리기 (flipY 고려)
                    const originalImage = await createImageBitmap(originalTexture.image);
                    if (originalTexture.flipY) {
                      // flipY가 true인 경우 Y축 반전
                      compositeContext.scale(1, -1);
                      compositeContext.drawImage(originalImage, 0, -512, 512, 512);
                      compositeContext.scale(1, -1);
                    } else {
                      compositeContext.drawImage(originalImage, 0, 0, 512, 512);
                    }
                    
                    // 텍스트 오버레이 그리기
                    compositeContext.drawImage(canvas, 0, 0);
                    
                    const compositeTexture = new THREE.CanvasTexture(compositeCanvas);
                    compositeTexture.flipY = originalTexture.flipY; // 원본과 동일한 flipY 설정
                    child.material.map = compositeTexture;
                  }
                } else {
                  // 텍스트만 있는 경우
                  const texture = new THREE.CanvasTexture(canvas);
                  texture.flipY = false; // 기본값
                  child.material.map = texture;
                }
                
                child.material.needsUpdate = true;
              }
            }
          }
        });
        
        // 책등에 세로 텍스트 추가
        if (title) {
          bookModel.traverse(async (child) => {
            if (child instanceof THREE.Mesh && child.material) {
              // 책등 텍스처 생성
              const spineCanvas = document.createElement('canvas');
              const spineContext = spineCanvas.getContext('2d');
              
              if (spineContext) {
                spineCanvas.width = 128; // 책등은 좁으므로 작은 크기
                spineCanvas.height = 512;
                
                // 배경색 설정 (투명)
                spineContext.clearRect(0, 0, spineCanvas.width, spineCanvas.height);
                
                // 폰트 설정 (세로용)
                const spineFontSize = fontSize * 0.4; // 책등용 작은 폰트
                spineContext.font = `bold ${spineFontSize}px Arial`;
                spineContext.fillStyle = textColor;
                spineContext.textAlign = 'center';
                spineContext.textBaseline = 'middle';
                
                // 세로 텍스트 그리기
                const centerX = spineCanvas.width / 2;
                const startY = spineCanvas.height * 0.2;
                const charSpacing = spineFontSize * 1.2;
                
                for (let i = 0; i < title.length; i++) {
                  const char = title[i];
                  const charY = startY + (i * charSpacing);
                  spineContext.fillText(char, centerX, charY);
                }
                
                // 책등 텍스처 생성
                const spineTexture = new THREE.CanvasTexture(spineCanvas);
                spineTexture.flipY = false;
                
                // 책등 재질에 적용 (필요한 경우)
                // 실제로는 메시의 UV 매핑에 따라 다를 수 있음
                if (child.material.normalMap) {
                  // 책등 부분을 식별할 수 있는 방법이 필요
                  // 여기서는 간단히 모든 메시에 적용
                  child.material.map = spineTexture;
                  child.material.needsUpdate = true;
                }
              }
            }
          });
        }
        
        // 애니메이션 설정
        let mixer: AnimationMixer | undefined;
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new AnimationMixer(bookModel);
          
          // 모든 애니메이션 재생
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
          
          console.log(`Loaded ${gltf.animations.length} animations:`, gltf.animations.map(clip => clip.name));
        }
        
        // 위치와 회전 설정
        bookGroup.position.copy(position);
        bookGroup.rotation.copy(rotation);
        
        bookGroup.add(bookModel);
        resolve({ group: bookGroup, mixer });
      },
      (progress) => {
        console.log('Loading book model...', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading book model:', error);
        reject(error);
      }
    );
  });
};
