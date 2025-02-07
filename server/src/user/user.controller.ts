import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post()
    create(@Body() createUserDto: RegisterDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll() {
      return this.userService.getAllUsers();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.userService.getUserByField("id", id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.userService.remove(id);
    }

    @Post(':id/avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @Param('id') userId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.userService.uploadAvatar(userId, file);
    }

    @Delete(':id/avatar')
    async deleteAvatar(@Param('id') userId: string) {
        return this.userService.deleteAvatar(userId);
    }
}
