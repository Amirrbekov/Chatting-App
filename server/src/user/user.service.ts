import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
    private readonly uploadPath = path.join(
        __dirname,
        '..', '..',
        'uploads', 
        'avatars'
      );

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async getUserByField(field: string, value: string | number) {
        const user = await this.userRepository.findOne({ where: { [field]: value } })
        return user
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        await this.userRepository.update(id, updateUserDto);
        return this.userRepository.findOne({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async uploadAvatar(userId: string, file: Express.Multer.File): Promise<User> {
        const user = await this.getUserByField('id', userId);
      
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const filename = `avatar-${uniqueSuffix}${ext}`;
        const filePath = path.join(this.uploadPath, filename);
      
        fs.writeFileSync(filePath, file.buffer);
        console.log('File saved to:', filePath);
      
        user.avatarUrl = `/avatars/${filename}`;
        const updatedUser = await this.userRepository.save(user);
        
        return updatedUser;
      }

    async deleteAvatar(userId: string): Promise<User> {
        const user = await this.getUserByField('id', userId);

        if (user.avatarUrl) {
            const filePath = path.join(this.uploadPath, path.basename(user.avatarUrl));

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            user.avatarUrl = null;
            return this.userRepository.save(user);
        }

        return user;
    }
}
