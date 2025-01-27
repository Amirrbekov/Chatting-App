import { Channel } from "src/channel/entity/channel.entity";
import { Message } from "src/message/entity/message.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    public displayName: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    public username: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    avatarUrl: string;

    @OneToMany(() => Message, (message) => message.sender)
    sentMessages: Message[];
  
    @OneToMany(() => Message, (message) => message.receiver)
    receivedMessages: Message[];
  
    @ManyToMany(() => Channel, (channel) => channel.members)
    public channels: Channel[];
    
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
    })
    updatedAt: Date;
}