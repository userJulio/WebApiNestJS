import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { AutheticationGuard } from './guards/authetication/authetication.guard';
import { LoginResponse } from './dto/interfaces/login-response.dto';
import { Usuarios } from './entities/usuarios.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  Login(@Body() logindto:LoginRequestDto){

    return this.authService.login(logindto);
  }

  @Post('/register')
  RegistroUsuario(@Body() registro:RegisterRequestDto){

    return this.authService.registroUsuarios(registro);
  }

  @UseGuards(AutheticationGuard)
  @Get('/listar')
  findAll(@Request() req: Request) {
    const user= req['user'];
    console.log("usuario logeado:",user);
    return this.authService.findAll();
  }

  @UseGuards(AutheticationGuard)
  @Get('/checktoken')
  checkToken(@Request() req: Request){
    const user= req['user'] as Usuarios;
    console.log("userid",user._id);
    const objLoginResponse:LoginResponse={
      user,
      token: this.authService.getJWTtoken({id: user._id })
    }
    return Promise.resolve(objLoginResponse);
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
