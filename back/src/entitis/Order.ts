import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'merchant_uid' })
  merchant_uid: string;

  @Column({ type: 'varchar', name: 'status', nullable: true })
  status: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'int', name: 'amount' })
  amount: number;

  @Column({ type: 'varchar', name: 'buyer_email' })
  buyer_email: string;

  @Column({ type: 'varchar', name: 'buyer_name' })
  buyer_name: string;

  @Column({ type: 'varchar', name: 'buyer_tel' })
  buyer_tel: string;

  @Column({ type: 'varchar', name: 'buyer_addr' })
  buyer_addr: string;

  @Column({ type: 'varchar', name: 'buyer_postcode' })
  buyer_postcode: string;
}
