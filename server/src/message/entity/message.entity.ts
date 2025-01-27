import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.sentMessages)
    sender: User

    @ManyToOne(() => User, (user) => user.receivedMessages)
    receiver: User

    @Column()
    content: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @Column({ default: false })
    isRead: boolean;

    @Column({ default: 'text' })
    messageType: string;
}