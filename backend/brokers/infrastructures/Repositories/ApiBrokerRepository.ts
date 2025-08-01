import { BrokerRepository } from '../../domains/repositories/BrokerRepository';
import { Broker } from '../../domains/entities/Broker';

export class ApiBrokerRepository implements BrokerRepository {

    async findAll(url:string): Promise<Broker | undefined> {
        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            const data = jsonData.EDBrokers.field[0];
            return{
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
        catch(error) {
            console.error('error in infrastructure:', error);
            return undefined;
        }
    }
}