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
        const data = jsonData.EDBrokers.field[0];
        return new Broker(
          data.idCode,
          data.idCodeNm,
          data.jurirno,
          data.bsnmCmpnm,
          data.brkrNm,
          parseInt(data.brkrAsortCode.toString()),
          data.brkrAsortCodeNm,
          data.crqfcNo,
          new Date(data.crqfcAcqdt),
          data.ofcpsSeCode,
          data.ofcpsSeCodeNm,
          new Date(data.lastUpdtDt)
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
        
        return jsonData.EDBrokers.field.map(data => new Broker(
          data.idCode,
          data.idCodeNm,
          data.jurirno,
          data.bsnmCmpnm,
          data.brkrNm,
          parseInt(data.brkrAsortCode.toString()),
          data.brkrAsortCodeNm,
          data.crqfcNo,
          new Date(data.crqfcAcqdt),
          data.ofcpsSeCode,
          data.ofcpsSeCodeNm,
          new Date(data.lastUpdtDt)
        ));
      }
    } catch (error) {
      console.error('error in infrastructure:', error);
      throw new Error();
    }
  }
}
