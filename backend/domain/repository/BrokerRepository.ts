import { Broker } from '@be/domain/entities/Broker';

export interface BrokerRepository {
    find(brkrNm:string, bsnmCmpnm:string): Promise<Broker>;
}