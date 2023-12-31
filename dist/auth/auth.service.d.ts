import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        user: Omit<User, 'password'>;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        user: {
            Name: string;
            Email: string;
            id: string;
            token: string;
        };
    }>;
}
