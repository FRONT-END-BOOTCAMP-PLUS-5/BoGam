import { Broker } from '../Entities/Broker';

export interface BrokerRepository {
    find(brkrNm:string, bsnmCmpnm:string): Promise<Broker>;
}