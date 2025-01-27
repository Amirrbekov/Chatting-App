import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChannelMessage } from "src/channel/entity/channelMessage.entity";


@Entity()
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @ManyToOne(() => User, (user) => user.id)
    createdBy: User;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToMany(() => User, (user) => user.channels)
    @JoinTable()
    public members: User[];

    @OneToMany(() => ChannelMessage, (channelMessage) => channelMessage.channel)
    messages: ChannelMessage[];
}