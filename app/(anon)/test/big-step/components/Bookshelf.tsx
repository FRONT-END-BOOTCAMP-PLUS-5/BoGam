import * as THREE from 'three';
import { createBook } from './Book';

interface BookshelfProps {
  shelfCount?: number;
  booksPerShelf?: number;
  shelfWidth?: number;
  shelfHeight?: number;
  shelfDepth?: number;
  bookColors?: number[];
}

export const createBookshelf = async (props: BookshelfProps = {}): Promise<THREE.Group> => {
  const {
    shelfCount = 3,
    booksPerShelf = 4,
    shelfWidth = 8,
    shelfHeight = 0.2,
    shelfDepth = 2,
    bookColors = [0x8B0000, 0xFFB6C1, 0x8B0000, 0xFFB6C1] // 어두운 붉은색, 연한 분홍색
  } = props;

  const bookshelfGroup = new THREE.Group();

  // 책꽂이 구조 생성 (안쪽이 파여있는 형태)
  const createShelfStructure = () => {
    const structureGroup = new THREE.Group();
    
    // 왼쪽 기둥
    const leftPillarGeometry = new THREE.BoxGeometry(0.3, shelfCount * 2 + 0.4, shelfDepth + 0.4);
    const pillarMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const leftPillar = new THREE.Mesh(leftPillarGeometry, pillarMaterial);
    leftPillar.position.set(-shelfWidth / 2 - 0.15, shelfCount, 0);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    structureGroup.add(leftPillar);

    // 오른쪽 기둥
    const rightPillarGeometry = new THREE.BoxGeometry(0.3, shelfCount * 2 + 0.4, shelfDepth + 0.4);
    const rightPillar = new THREE.Mesh(rightPillarGeometry, pillarMaterial);
    rightPillar.position.set(shelfWidth / 2 + 0.15, shelfCount, 0);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;
    structureGroup.add(rightPillar);

    // 상단 연결부
    const topConnectorGeometry = new THREE.BoxGeometry(shelfWidth + 0.6, 0.3, shelfDepth + 0.4);
    const topConnector = new THREE.Mesh(topConnectorGeometry, pillarMaterial);
    topConnector.position.set(0, shelfCount * 2 + 0.15, 0);
    topConnector.castShadow = true;
    topConnector.receiveShadow = true;
    structureGroup.add(topConnector);

    // 하단 연결부
    const bottomConnectorGeometry = new THREE.BoxGeometry(shelfWidth + 0.6, 0.3, shelfDepth + 0.4);
    const bottomConnector = new THREE.Mesh(bottomConnectorGeometry, pillarMaterial);
    bottomConnector.position.set(0, -0.15, 0);
    bottomConnector.castShadow = true;
    bottomConnector.receiveShadow = true;
    structureGroup.add(bottomConnector);

    return structureGroup;
  };

  // 책꽂이 구조 추가
  const shelfStructure = createShelfStructure();
  bookshelfGroup.add(shelfStructure);

  // 각 층의 선반들
  for (let shelfIndex = 0; shelfIndex < shelfCount; shelfIndex++) {
    const shelfY = shelfIndex * 2;
    
    // 선반 (어두운 갈색) - 안쪽이 파여있는 형태
    const shelfGeometry = new THREE.BoxGeometry(shelfWidth, shelfHeight, shelfDepth);
    const shelfMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelf.position.set(0, shelfY, 0);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    bookshelfGroup.add(shelf);

    // 선반 안쪽 벽 (책이 넘어가지 않도록)
    const backWallGeometry = new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.1);
    const backWall = new THREE.Mesh(backWallGeometry, shelfMaterial);
    backWall.position.set(0, shelfY, -shelfDepth / 2 - 0.05);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    bookshelfGroup.add(backWall);

    // 각 선반에 책들 배치 (책등이 보이도록)
    const bookWidth = 0.3; // 책 두께 (책등 방향)
    const bookHeight = 1.8; // 책 높이
    const bookDepth = 0.8; // 책 너비 (책등과 수직)
    const bookSpacing = (shelfWidth - bookDepth) / (booksPerShelf - 1);
    const startX = -(shelfWidth - bookDepth) / 2;

    // 각 선반의 책들을 비동기로 로드
    const bookPromises = [];
    for (let bookIndex = 0; bookIndex < booksPerShelf; bookIndex++) {
      const bookX = startX + bookIndex * bookSpacing;
      const bookColor = bookColors[bookIndex % bookColors.length];
      
      const bookPromise = createBook({
        width: bookWidth, // 책 두께
        height: bookHeight, // 책 높이
        depth: bookDepth, // 책 너비
        color: bookColor,
        position: new THREE.Vector3(bookX, shelfY + shelfHeight / 2 + bookHeight / 2, 0),
        rotation: new THREE.Euler(0, Math.PI / 2, 0) // 90도 회전하여 책등이 보이도록
      });
      
      bookPromises.push(bookPromise);
    }

    // 모든 책이 로드될 때까지 대기
    const books = await Promise.all(bookPromises);
    books.forEach(book => bookshelfGroup.add(book));
  }

  return bookshelfGroup;
};
