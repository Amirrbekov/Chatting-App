import { IsNotEmpty, IsString, NotContains } from "class-validator"

export class ChannelDto {
    @IsNotEmpty({
        message: 'Name cannot be empty or whitespace'
    })
    @NotContains(' ', {
        message: 'Name cannot be empty or whitespace'
    })
    @IsString({
        message: 'Name must be a string'
    })
    public name?: string
}