import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'imp_uid' })
  imp_uid: string;

  @Column({ type: 'varchar', name: 'merchant_uid' })
  merchant_uid: string;

  @Column({ type: 'varchar', name: 'reason', nullable: true })
  reason: string;

  @Column({ type: 'int', name: 'amount' })
  amount: number;

  @Column({ type: 'int', name: 'cancel_amount', nullable: true })
  cancel_amount: number;
}
