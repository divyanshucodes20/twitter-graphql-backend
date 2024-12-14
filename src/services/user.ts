import { prismaClient } from "../lib/db.js";
import {createHmac,randomBytes} from "node:crypto"
import JWT from "jsonwebtoken";

export interface CreateUserPayload{
    firstName:string;
    lastName?:string;
    email:string;
    password:string;
}
export interface GetUserTokenPaylaod{
    email:string;
    password:string;
}

const jwtSecret=process.env.JWT_SECRET||"shabdasjhd";

class UserService{
    private static generateHash(salt:string,password:string
    ){
        const hashedPassword=createHmac('sha256',salt).update(password).digest('hex')
        return hashedPassword;
    }

    public static createUser(payload:CreateUserPayload){
        const {firstName,lastName,email,password}=payload;
        const salt=randomBytes(32).toString("hex");
        const hashedPassword=UserService.generateHash(salt,password);
        return prismaClient.user.create({
            data:{
                firstName,
                lastName,
                email,
                salt,
                password:hashedPassword
            }
        })
    }
    private static getUserByEmail(email:string){
        return prismaClient.user.findUnique({where:{email}});
    }
    public static getUserById(id:string){
        return prismaClient.user.findUnique({where:{id}});
    }
    public static async getUserToken(payload:GetUserTokenPaylaod){
        const {email,password}=payload;
        const user=await UserService.getUserByEmail(email);
        if(!user){
           throw new Error('user not found');
        }
        const userSalt=user.salt;
        const usersHashedPassword=UserService.generateHash(userSalt,password);

        if(usersHashedPassword!==user.password){
            throw new Error('Incorrect Password'); 
        }
        const token=JWT.sign({id:user.id,email:user.email},jwtSecret);
        return token;
    }
    public static decodeJWTToken(token:string){
        return JWT.verify(token,jwtSecret);
    }
}
export default UserService