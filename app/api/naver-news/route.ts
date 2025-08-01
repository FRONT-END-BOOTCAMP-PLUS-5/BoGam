import { NextResponse } from "next/server";

// 임시로 비활성화된 라우트
export async function GET() {
  return NextResponse.json(
    { success: false, message: '이 API는 현재 비활성화되어 있습니다.' },
    { status: 503 }
  );
}

/*
import { NaverNewsRepository } from "@be/infrastructure/repository/NaverNewsRepository";
import { GetNaverNewsUseCase } from "@be/applications/naverNews/usecases/GetNaverNewsUseCase";

export async function GET() {
  const useCase = new GetNaverNewsUseCase(new NaverNewsRepository());

  try {
    const result = await useCase.fetchNaverNews();
    return NextResponse.json(result);
  } catch (error) {
    console.error("뉴스 요청 실패:", error);
    return NextResponse.json(
      { error: "네이버 뉴스 API 요청 중 오류 발생" },
      { status: 500 }
    );
  }
}
*/
