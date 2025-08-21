import { Broker } from '@be/domain/entities/Broker';
import { GetBrokerQueryDto } from '@be/applications/brokers/dtos/GetBrokerQueryDto';

export interface BrokerRepository {
  find(query: GetBrokerQueryDto): Promise<Broker | Broker[]>;
}