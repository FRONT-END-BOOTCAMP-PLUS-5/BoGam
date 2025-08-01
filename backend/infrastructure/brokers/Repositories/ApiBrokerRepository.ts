import { BrokerRepository } from '../../../domain/brokers/Repositories/BrokerRepository';
import { Broker } from '../../../domain/brokers/Entities/Broker';
import axios from 'axios';

// API 응답 타입 정의
interface BrokerApiData {
  ldCode: string;
  ldCodeNm: string;
  jurirno: string;
  bsnmCmpnm: string;
  brkrNm: string;
  brkrAsortCode: string;
  brkrAsortCodeNm: string;
  crqfcNo: string;
  crqfcAcqdt: string;
  ofcpsSeCode: string;
  ofcpsSeCodeNm: string;
  lastUpdtDt: string;
}

interface BrokerApiResponse {
  EDBrokers: {
    field: BrokerApiData[];
  };
}

export class ApiBrokerRepository implements BrokerRepository {

    async find(brkrNm:string, bsnmCmpnm:string): Promise<Broker> {
        try {
            const key = process.env.VWORLD_BROKER_KEY;
            const response = await axios.get(`http://api.vworld.kr/ned/data/getEBBrokerInfo?key=${key}&brkrNm=${encodeURIComponent(brkrNm)}&domain=localhost&bsnmCmpnm=${encodeURIComponent(bsnmCmpnm)}`);
            const jsonData = response.data as BrokerApiResponse;
            const data = jsonData.EDBrokers.field[0];
            return {
                idCode: parseInt(data.ldCode),
                idCodeNm: data.ldCodeNm,
                jurirno: data.jurirno,
                bsnmCmpnm: data.bsnmCmpnm,
                brkrNm: data.brkrNm,
                brkrAsortCode: parseInt(data.brkrAsortCode),
                brkrAsortCodeNm: data.brkrAsortCodeNm,
                crqfcNo: data.crqfcNo,
                crqfcAcqdt: new Date(data.crqfcAcqdt),
                ofcpsSeCode: data.ofcpsSeCode,
                ofcpsSeCodeNm: data.ofcpsSeCodeNm,
                lastUpdtDt: new Date(data.lastUpdtDt)
            }
        }
        catch (error) {
            console.error('error in infrastructure:', error);
            throw new Error();
        }
    }
}