import bcrypt from "bcrypt";
// @ts-ignore
import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";

const SALT_ROUND = 10;
const TOKEN_SECRET =  "4KP4I4X1QbLr7J4V4fmWHVdISDR3FckP"

const prisma = new PrismaClient()

interface LoginUser {
    email : string,
    password : string
}

interface RegisterUser extends LoginUser {
    name : string,
}

const RegisterUser = async ({email, name, password}: RegisterUser) => {

    if (!email || !name || !password) {
        return {
            success : false,
            message : "Missing required fields"
        };
    }

    const existingUser = await prisma.users.findFirst({
        where: {
            email: email
        }
    });

    if (existingUser) {
        return {
            success: false,
            message: "User already exists"
        };
    }


    const salt = await bcrypt.genSaltSync(SALT_ROUND)
    const hashedPassword = await bcrypt.hashSync(password, salt);


    const user =  await prisma.users.create({
        data: {
            name,
            email,
            password: hashedPassword,
            created_at : new Date()
        }
    });

    return {
        success : true,
        data : user
    };

}

const LoginUser = async ({email, password}:LoginUser) => {

    if (!email || !password) {
        return {
            success : false,
            message : "Missing required fields"
        };
    }


    const user = await prisma.users.findFirst({
        where: {
            email: email
        }
    });

    if (!user) {
        return {
            success: false,
            message: "User not found"
        };
    }

    const passwordMatch = await bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
        return {
            success: false,
            message: "Invalid password"
        };
    }

    return {
        success : true,
        token : jwt.sign({name: user.name}, TOKEN_SECRET, {expiresIn: '1800s'})
    }
}


export {RegisterUser,LoginUser,TOKEN_SECRET}
