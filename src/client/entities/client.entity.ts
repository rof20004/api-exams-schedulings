import { Column, Entity, Index, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Client {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  cpf: string;

  @Column()
  birthDate: Date;
}
