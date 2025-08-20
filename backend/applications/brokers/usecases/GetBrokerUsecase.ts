import { BrokerRepository } from '@be/domain/repository/BrokerRepository';
import { Broker } from '@be/domain/entities/Broker';
import { GetBrokerQueryDto } from '@be/applications/brokers/dtos/GetBrokerQueryDto';

export class GetBrokerUsecase {
    constructor(
        private brokerRepository: BrokerRepository
    ) {}

    async execute(query: GetBrokerQueryDto) : Promise<Broker | Broker[]> {
        const broker = await this.brokerRepository.find(query);
        if (!broker) {
            throw new Error('Broker not found');
        }
        return broker;
    }
}