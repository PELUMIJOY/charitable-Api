"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const dotenv = require("dotenv");
dotenv.config();
let AuthService = exports.AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async signUp(signUpDto) {
        const { name, email, password, AreaOfInterest } = signUpDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                throw new common_1.UnauthorizedException('email already exist');
            }
            const user = await this.userModel.create({
                name,
                email,
                password: hashedPassword,
                AreaOfInterest,
            });
            const token = this.jwtService.sign({ id: user._id }, { secret: process.env.JWT_SECRET });
            const { password: _, ...userWithoutPassword } = user.toObject();
            return { user: userWithoutPassword, token };
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('User already exists');
            }
            throw error;
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('invalid email or password');
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new common_1.UnauthorizedException('invalid email or password');
        }
        const token = this.jwtService.sign({ id: user._id }, { secret: process.env.JWT_SECRET });
        return {
            message: 'Login successful',
            user: {
                Name: user.name,
                Email: user.email,
                id: user._id.toString(),
                token,
            },
        };
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map