import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  status: string;

  @Column()
  species: string;

  @Column()
  gender: string;

  @Column()
  location: string;

  @Column()
  image: string;
}
