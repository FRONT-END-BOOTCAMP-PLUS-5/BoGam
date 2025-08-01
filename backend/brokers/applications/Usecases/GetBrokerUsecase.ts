import { BrokerRepository } from '../../domains/repositories/BrokerRepository';
import { Broker } from '../../domains/entities/Broker';

export class GetBrokerUsecase {
    constructor(
        private brokerRepository: BrokerRepository
    ) {}

    async execute(url: string) : Promise<Broker> {
        const broker = await this.brokerRepository.findAll(url);
        console.log('broker: ',broker);
        if (!broker) {
            throw new Error('Broker not found');
        }
        return broker;
    }
}