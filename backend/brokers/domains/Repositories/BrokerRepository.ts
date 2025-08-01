import { Broker } from '../entities/Broker';

export interface BrokerRepository {
    findAll(url:string): Promise<Broker | undefined>;
}