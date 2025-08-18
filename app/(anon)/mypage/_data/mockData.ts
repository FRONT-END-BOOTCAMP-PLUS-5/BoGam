// 마이페이지 하드코딩된 데이터
export const mockData = {
  profile: {
    name: '나는야노석준',
    avatar: '나'
  },
  addresses: [
    {
      id: '1',
      address: '경기도 고양시 왕산동구 항시티 0로 000, B동 000호 (당사동, 전세보갑아파트)',
      isFavorite: true,
      isExpanded: true,
      isActive: false
    },
    {
      id: '2',
      address: '경기도 고양시 왕산동구 항시티 0로 000, B동 000호 (당사동, 전세보갑아파트)',
      isFavorite: true,
      isActive: true
    },
    {
      id: '3',
      address: '서울특별시 강남구 강시티 0로 000, 100동 101호 (강남동, 전세보갑아파트)',
      isFavorite: true,
      isActive: false
    },
    {
      id: '4',
      address: '서울특별시 강남구 강시티 0로 000, 100동 101호 (강남동, 전세보갑아파트)',
      isFavorite: false,
      isActive: false
    },
    {
      id: '5',
      address: '서울특별시 강남구 강시티 0로 000, 100동 101호 (강남동, 전세보갑아파트)',
      isFavorite: false,
      isActive: false
    }
  ],
  guideSummary: {
    match: 15,
    mismatch: 9,
    unchecked: 4
  },
  guideSteps: [
    // Main Step 1: 집 고를 때 (sub-steps 1.1, 1.2, 1.3)
    {
      id: 20,
      userAddressId: 1,
      stepId: 1,
      match: 2,
      mismatch: 0,
      unchecked: 1,
      createdAt: "2025-08-08T06:10:59.493Z",
      updatedAt: "2025-08-18T02:57:08.906Z",
      mainNum: 1,
      subNum: 1,
      expanded: true,
      title: "가짜 임대인 구분하기",
      content: "신흥사부동산중개인사무소의 홍길동 씨는 공인중개사 자격증을 소지하고 있습니다!",
      type: "match" as const,
      multiLine: false,
      hasLink: false,
      details: {
        "갑구": "match",
        "을구": "uncheck",
        "표제부": "match"
      }
    },
    {
      id: 21,
      userAddressId: 1,
      stepId: 1,
      match: 0,
      mismatch: 0,
      unchecked: 1,
      createdAt: "2025-08-08T06:15:00.000Z",
      updatedAt: "2025-08-12T01:50:13.329Z",
      mainNum: 1,
      subNum: 2,
      expanded: false,
      title: "최우선변제 금액 안내",
      content: "",
      type: "unchecked" as const,
      multiLine: true,
      details: [
        "서울특별시",
        "소액보증금 범위 : 1억 5천만원 이하",
        "최우선변제금액 : 5천만원"
      ],
      hasLink: false
    },
    {
      id: 22,
      userAddressId: 1,
      stepId: 1,
      match: 0,
      mismatch: 0,
      unchecked: 1,
      createdAt: "2025-08-08T06:20:00.000Z",
      updatedAt: "2025-08-15T03:30:00.000Z",
      mainNum: 1,
      subNum: 3,
      expanded: false,
      title: "공제증서 발급 안내",
      content: "공제증서 발급 요건이 불충족되었습니다.",
      type: "mismatch" as const,
      multiLine: false,
      hasLink: true,
      linkHref: "http://localhost:3000/online-service",
      linkText: "온라인 서비스로 이동하기"
    },
    // Main Step 2: 임대인 확인할 때
    {
      id: 3,
      userAddressId: 1,
      stepId: 2,
      mismatch: 1,
      match: 1,
      unchecked: 1,
      details: {
        "1": "uncheck",
        "2": "mismatch",
        "3": "match"
      },
      createdAt: "2025-08-08T02:19:21.487Z",
      updatedAt: "2025-08-12T01:50:13.329Z",
      mainNum: 2,
      subNum: 1,
      expanded: false
    },
    // Main Step 3: 계약서 작성할 때
    {
      id: 4,
      userAddressId: 1,
      stepId: 3,
      match: 5,
      mismatch: 1,
      unchecked: 0,
      details: {},
      createdAt: "2025-08-08T02:19:21.487Z",
      updatedAt: "2025-08-10T04:20:00.000Z",
      mainNum: 3,
      subNum: 1,
      expanded: false
    },
    // Main Step 4: 계약한 직후
    {
      id: 5,
      userAddressId: 1,
      stepId: 4,
      match: 2,
      mismatch: 3,
      unchecked: 1,
      details: {},
      createdAt: "2025-08-08T02:19:21.487Z",
      updatedAt: "2025-08-11T05:15:00.000Z",
      mainNum: 4,
      subNum: 1,
      expanded: false
    },
    // Main Step 5: 입주한 이후
    {
      id: 6,
      userAddressId: 1,
      stepId: 5,
      match: 1,
      mismatch: 2,
      unchecked: 2,
      details: {},
      createdAt: "2025-08-08T02:19:21.487Z",
      updatedAt: "2025-08-13T06:45:00.000Z",
      mainNum: 5,
      subNum: 1,
      expanded: false
    },
    // Main Step 6: 계약기간이 끝난 후
    {
      id: 7,
      userAddressId: 1,
      stepId: 6,
      match: 2,
      mismatch: 1,
      unchecked: 1,
      details: {},
      createdAt: "2025-08-08T02:19:21.487Z",
      updatedAt: "2025-08-14T07:30:00.000Z",
      mainNum: 6,
      subNum: 1,
      expanded: false
    },
    // Main Step 7: 이런 상황에 휘말리지 않도록 유의하세요!
    {
      id: 8,
      userAddressId: 1,
      stepId: 7,
      match: 1,
      mismatch: 0,
      unchecked: 0,
      details: {},
      createdAt: "2025-08-08T02:19:21.487Z",
      updatedAt: "2025-08-16T08:20:00.000Z",
      mainNum: 7,
      subNum: 1,
      expanded: false
    }
  ]
};
