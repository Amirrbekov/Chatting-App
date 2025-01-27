import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

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
}
