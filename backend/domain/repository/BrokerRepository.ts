import { Broker } from '../entities/Broker';

export interface BrokerRepository {
    find(brkrNm:string, bsnmCmpnm:string): Promise<Broker>;
}