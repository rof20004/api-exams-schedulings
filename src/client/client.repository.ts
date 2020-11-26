import { EntityRepository, MongoRepository } from 'typeorm';
import { Client } from './entities/client.entity';

@EntityRepository(Client)
export class ClientRepository extends MongoRepository<Client> { }
