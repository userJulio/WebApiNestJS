import { Usuarios } from "src/auth/entities/usuarios.entity";

export interface LoginResponse{
    user:Usuarios;
    token:string;

}