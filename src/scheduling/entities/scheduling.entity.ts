import { Column, Entity, ObjectID, ObjectIdColumn, Unique, ValueTransformer } from 'typeorm';

@Entity()
@Unique(['client', 'date', 'exam'])
export class Scheduling {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  date: string;

  @Column()
  client: any;

  @Column()
  exam: any;
}