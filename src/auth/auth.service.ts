import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { Model } from 'mongoose';
import { Usuarios } from './entities/usuarios.entity';
import { LoginRequestDto } from './dto/login-request.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './dto/interfaces';
import { LoginResponse } from './dto/interfaces/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';


@Injectable()
export class AuthService {

constructor( @InjectModel(Usuarios.name)
private  usuaruiModel: Model<Usuarios>,
private jwtService: JwtService){

}

 async create(createAuthDto: CreateAuthDto):Promise<Usuarios> {

try {
  // const usuarioNew=new this.usuaruiModel(createAuthDto);

  // return  await usuarioNew.save();
  const {password, ...userData}=createAuthDto;
  const newUser= new this.usuaruiModel({
    password: bcryptjs.hashSync(password,10),
    ...userData
  });
   await newUser.save();
   const {password:_, ...user}=newUser.toJSON();
   return user;
} catch (error) {
  if(error.code==11000){
    throw new BadRequestException(`${createAuthDto.email}: el email ya existe!!`);
  }
  throw new InternalServerErrorException(`Problema del servidor!!!`);
}
 


  }

  async login(logindto:LoginRequestDto):Promise<LoginResponse>{
      console.log("valore login",logindto);
      const {email,password}=logindto;
      const user= await this.usuaruiModel.findOne({email:email});
      if(!user){
        throw new UnauthorizedException("Credentciales no validas - email");
      }
      if(!bcryptjs.compareSync(password,user.password)){
        throw new UnauthorizedException("Credenciales no validas - password");
      }

      const {password:_, ...rest}=user.toJSON();

      return {
        user: rest,
        token: this.getJWTtoken({id: user.id })
      };
  }

  async registroUsuarios(registrorequest:RegisterRequestDto):Promise<LoginResponse>{

    const{name,email,password}=registrorequest;
    const createAuthdto:CreateAuthDto={
      name,
      email,
      password
    };
    const usuarioCredo= await this.create(createAuthdto);

    const user= await this.usuaruiModel.findOne({email:usuarioCredo.email});
    const {password:_, ...rest}=user.toJSON();
    return {
      user: rest,
      token: this.getJWTtoken({id:user.id})
    }


  }

  getJWTtoken(payload: jwtPayload){
    const token= this.jwtService.sign(payload);
    return token;
  }

  findAll():Promise<Usuarios[]> {
    return this.usuaruiModel.find();
  }



  async findUserById(iduser:string):Promise<Usuarios>{
    const usuario= await this.usuaruiModel.findById(iduser);
    const {password,...rest}=usuario.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
