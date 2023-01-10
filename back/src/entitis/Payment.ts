import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Membership } from './Membership';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  // 유저 아이디, 가입한 유저의 아이디
  @Column({ type: 'int', nullable: true })
  userId: number;

  // 주문 번호
  @Column({ type: 'varchar', name: 'merchantuid', nullable: true })
  merchantUid: string;

  // 맴버쉽 아이디 
  @Column({ type: 'int', nullable: true })
  membershipId: number;

  // 결제 번호
  @Column({ type: 'varchar', nullable: true })
  impUid: string;

  // 지불, 취소 현황
  @Column({ type: 'varchar', nullable: true })
  status: string;

  // 상품 이름
  @Column({ type: 'varchar', })
  name: string;

  // 가격
  @Column({ type: 'int', default: 0 })
  amount: number;

  // 취소 금액
  @Column({ type: 'int', default: 0 })
  cancelAmount: number;

  // 취소 가능 금액
  @Column({ type: 'int', default: 0 })
  cancelAbleAmount: number;

  // 남은 영상 제작 갯수
  @Column({ type: 'int', nullable: true })
  count: number;

  // pc, Android, IOS
  @Column({ type: 'varchar', })
  device: string;

  @ManyToOne(() => Membership, (membership) => membership.payment, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'membershipId', referencedColumnName: 'id' }])
  Membership: Membership[];
}