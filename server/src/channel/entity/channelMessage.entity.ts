import { Channel } from "src/channel/entity/channel.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ChannelMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Channel, (channel) => channel.messages)
    channel: Channel;

    @ManyToOne(() => User, (user) => user.sentMessages)
    sender: User;

    @Column()
    content: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @Column({ default: 'text' })
    messageType: string;
}