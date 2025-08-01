import axios from "axios";
import { NewsRepository } from "@/backend/naver-news/domain/repository/NewsRepository";
import { NaverNewsResponseDto } from "../../applications/dtos/NaverNewsDto";
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET_NO!;

export class NaverNewsRepository implements NewsRepository {
  async fetchNews(): Promise<NaverNewsResponseDto> {
    const response = await axios.get<NaverNewsResponseDto>(
      "https://openapi.naver.com/v1/search/news.json",
      {
        headers: {
          "X-Naver-Client-Id": NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        },
        params: { query: "전세사기", display: 5, start: 1, sort: "date" },
      }
    );

    return response.data;
  }
}
