import { BrokerRepository } from '@be/domain/repository/BrokerRepository';
import { BrokerEntity } from '@be/domain/entities/Broker';

export class GetBrokerUsecase {
    constructor(
        private brokerRepository: BrokerRepository
    ) {}

    async execute(brkrNm:string, bsnmCmpnm:string) : Promise<BrokerEntity> {
        const broker = await this.brokerRepository.find(brkrNm, bsnmCmpnm);
        console.log('broker: ',broker);
        if (!broker) {
            throw new Error('Broker not found');
        }
        return broker;
    }
}