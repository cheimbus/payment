import {
    Entity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
import { Payment } from './Payment';

// ttv DB 안 memberships 테이블과 동기화될 entity
@Entity('memberships')
export class Membership {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    // 영상 제작 가능 갯수
    @Column({ type: 'int', default: 0 })
    count: number;

    // 결제를 증명할 ID
    @Column({ nullable: false, length: 36 })
    paymentId!: string;

    // 구매자 email
    @Column({ nullable: false })
    email!: string;

    // '7D' / '1M' / '6M' / '1Y' 멤버쉽 구분
    @Column({ nullable: false, default: '7D' })
    duration!: string;

    // 멤버십이 끝나는 Date
    @Column({ type: 'timestamptz', nullable: false })
    expireAt!: Date;

    // 스토어에 등록된 구매 목록 아이템을 가리키는 ID
    @Column({ nullable: false })
    itemId!: string;

    @Column({ type: 'timestamptz', nullable: false })
    purchasedAt!: Date;

    // DB에 첫 삽입된 날짜
    @CreateDateColumn()
    createdAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    @OneToMany(() => Payment, (payment) => payment.Membership)
    payment: Payment[];
}
