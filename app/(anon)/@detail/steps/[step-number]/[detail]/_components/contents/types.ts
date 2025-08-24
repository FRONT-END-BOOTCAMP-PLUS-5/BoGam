// 공통 콘텐츠 섹션 인터페이스
export interface BaseContentSection {
  title?: string;
  subtitle?: string;
  summary?: string;
}

// TextOnly 전용 인터페이스
export interface TextOnlySection extends BaseContentSection {
  type: 'TextOnly';
  data: Array<{ left: string; right?: string }>;
  subtitles?: string[];
  contents?: string[];
  contentSections?: Array<{
    subtitle: string;
    contents: string[];
  }>;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  button?: {
    text: string;
    onClick?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    href?: string;
    fullWidth?: boolean;
  };
  buttons?: Array<{
    text: string;
    onClick?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    href?: string;
    fullWidth?: boolean;
  }>;
}

// RadioGroup 전용 인터페이스
export interface RadioGroupSection extends BaseContentSection {
  type: 'RadioGroup';
  data: Array<{ left: string; right?: string }>;
  contents?: string[];
  messages?: string[];
  link?: string;
}

// Table 전용 인터페이스
export interface TableSection extends BaseContentSection {
  type: 'Table';
  data: Array<{ left: string; right?: string; center?: string }>;
}

// List 전용 인터페이스
export interface ListSection extends BaseContentSection {
  type: 'List';
  data: Array<{ left: string; right?: string }>;
}

// DataGrid 전용 인터페이스
export interface DataGridSection extends BaseContentSection {
  type: 'DataGrid';
  data: Array<{ left: string; right?: string }>;
}

// 모든 섹션 타입을 유니온으로 정의
export type ContentSection =
  | TextOnlySection
  | RadioGroupSection
  | TableSection
  | ListSection
  | DataGridSection;

// CombinedContent용 인터페이스
export interface CombinedContentProps {
  sections: ContentSection[];
  spacing?: 'sm' | 'md' | 'lg';
  showDividers?: boolean;
}

// ModalContent용 인터페이스
export interface StepContentData {
  dataType: string;
  data: ContentSection[][];
  sections?: ContentSection[]; // CombinedContent용
  columns?: 2 | 3;
  title?: string;
  emptyRows?: number;
}

// 기존 ContentSection과의 호환성을 위한 타입
export interface LegacyContentSection {
  title?: string;
  subtitles?: string[];
  contents?: string[];
  contentSections?: Array<{
    subtitle: string;
    contents: string[];
  }>;
  summary?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  button?: {
    text: string;
    onClick?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    href?: string;
    fullWidth?: boolean;
  };
  buttons?: Array<{
    text: string;
    onClick?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    href?: string;
    fullWidth?: boolean;
  }>;
  messages?: string[];
  link?: string;
}
