import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { LoginDto } from './dto/login.dto';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {
    ({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign(
      { id: user._id },
      { secret: process.env.JWT_SECRET },
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return { user: userWithoutPassword, token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('invalid email or password');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('invalid email or password');
    }
    const token = this.jwtService.sign(
      { id: user._id },
      { secret: process.env.JWT_SECRET },
    );
    return { token };
  }
}
