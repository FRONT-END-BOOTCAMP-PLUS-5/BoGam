import { BrokerRepository } from '../../domains/repositories/BrokerRepository';
import { Broker } from '../../domains/entities/Broker';
import axios from 'axios';

export class ApiBrokerRepository implements BrokerRepository {

    async find(brkrNm:string, bsnmCmpnm:string): Promise<Broker> {
        try {
            const key = process.env.VWORLD_BROKER_KEY;
            const response = await axios.get(`http://api.vworld.kr/ned/data/getEBBrokerInfo?key=${key}&brkrNm=${encodeURIComponent(brkrNm)}&domain=localhost&bsnmCmpnm=${encodeURIComponent(bsnmCmpnm)}`);
            const jsonData = await response.data;
            const data = jsonData.EDBrokers.field[0];
            return {
                idCode: data.ldCode,
                idCodeNm: data.ldCodeNm,
                jurirno: data.jurirno,
                bsnmCmpnm: data.bsnmCmpnm,
                brkrNm: data.brkrNm,
                brkrAsortCode: data.brkrAsortCode,
                brkrAsortCodeNm: data.brkrAsortCodeNm,
                crqfcNo: data.crqfcNo,
                crqfcAcqdt: data.crqfcAcqdt,
                ofcpsSeCode: data.ofcpsSeCode,
                ofcpsSeCodeNm: data.ofcpsSeCodeNm,
                lastUpdtDt: data.lastUpdtDt
            }
        }
        catch (error) {
            console.error('error in infrastructure:', error);
            throw new Error();
        }
    }
}