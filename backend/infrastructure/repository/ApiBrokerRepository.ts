import { BrokerRepository } from '@be/domain/repository/BrokerRepository';
import { Broker, BrokerApiResponse } from '@be/domain/entities/Broker';
import { GetBrokerQueryDto } from '@be/applications/brokers/dtos/GetBrokerQueryDto';
import axios from 'axios';

export class ApiBrokerRepository implements BrokerRepository {
  async find(query: GetBrokerQueryDto): Promise<Broker | Broker[]> {
    try {
      const key = process.env.VWORLD_BROKER_KEY;
      if (!key) {
        throw new Error('VWORLD_BROKER_KEY not configured');
      }
      
      if (query.bsnmCmpnm) {
        // 정확한 중개사 조회 (중개사명 + 사업자명)
        const url = new URL('http://api.vworld.kr/ned/data/getEBBrokerInfo');
        url.searchParams.set('key', key);
        url.searchParams.set('brkrNm', query.brkrNm);
        url.searchParams.set('domain', 'localhost');
        if (query.bsnmCmpnm) {
          url.searchParams.set('bsnmCmpnm', query.bsnmCmpnm);
        }
        if (query.numOfRows) url.searchParams.set('numOfRows', query.numOfRows.toString());
        if (query.pageNo) url.searchParams.set('pageNo', query.pageNo.toString());
        
        const response = await axios.get(url.toString());
        const jsonData = response.data as unknown as BrokerApiResponse;
        console.log('jsonData', jsonData);
        
        // EDBrokers와 field 존재 여부 및 빈 배열 체크
        if (!jsonData?.EDBrokers?.field || jsonData.EDBrokers.field.length === 0) {
          throw new Error('검색 조건에 맞는 중개사가 없습니다.');
        }
        
        const data = jsonData.EDBrokers.field[0];
        return new Broker(
          data.brkrAsortCode,
          data.brkrAsortCodeNm,
          data.jurirno,
          data.crqfcAcqdt,
          data.ofcpsSeCodeNm,
          data.brkrNm,
          data.lastUpdtDt,
          data.ldCode,
          data.ldCodeNm,
          data.crqfcNo,
          data.ofcpsSeCode,
          data.bsnmCmpnm
        );
      } else {
        // 중개사명으로 유사한 중개사들 조회
        const url = new URL('http://api.vworld.kr/ned/data/getEBBrokerInfo');
        url.searchParams.set('key', key);
        url.searchParams.set('domain', 'localhost');
        url.searchParams.set('brkrNm', query.brkrNm);
        if (query.numOfRows) url.searchParams.set('numOfRows', query.numOfRows.toString());
        if (query.pageNo) url.searchParams.set('pageNo', query.pageNo.toString());
        
        const response = await axios.get(url.toString());
        const jsonData = response.data as unknown as BrokerApiResponse;
        console.log('jsonData', jsonData);
        
        // EDBrokers와 field 존재 여부 및 빈 배열 체크
        if (!jsonData?.EDBrokers?.field || jsonData.EDBrokers.field.length === 0) {
          throw new Error('검색 조건에 맞는 중개사가 없습니다.');
        }
        
        return jsonData.EDBrokers.field.map(data => new Broker(
          data.brkrAsortCode,
          data.brkrAsortCodeNm,
          data.jurirno,
          data.crqfcAcqdt,
          data.ofcpsSeCodeNm,
          data.brkrNm,
          data.lastUpdtDt,
          data.ldCode,
          data.ldCodeNm,
          data.crqfcNo,
          data.ofcpsSeCode,
          data.bsnmCmpnm
        ));
      }
    } catch (error) {
      console.error('error in infrastructure:', error);
      throw new Error();
    }
  }
}
