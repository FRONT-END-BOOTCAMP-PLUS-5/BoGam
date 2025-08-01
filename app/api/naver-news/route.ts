import { NextResponse } from "next/server";
import { NaverNewsRepository } from "@/backend/naver-news/infrastructure/repository/NaverNewsRepository";
import { GetNaverNewsUseCase } from "@/backend/naver-news/applications/usecases/GetNaverNewsUseCase";

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
