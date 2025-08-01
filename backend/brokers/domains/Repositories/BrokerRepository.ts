import { Broker } from '../Entities/Broker';

export interface BrokerRepository {
    findAll(url:string): Promise<Broker | undefined>;
}