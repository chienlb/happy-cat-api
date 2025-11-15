import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { envSchema } from 'src/app/configs/env/env.config';
import { Logger } from '@nestjs/common';

export interface JwtPayload {
    userId: string;
    fullname: string;
    username: string;
    email: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor() {
        const env = envSchema.parse(process.env);
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: env.JWT_ACCESS_TOKEN_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        this.logger.log(`JwtStrategy validate: ${JSON.stringify(payload)}`);
        return {
            userId: payload.userId,
            fullname: payload.fullname,
            username: payload.username,
            email: payload.email,
            role: payload.role,
        };
    }
}
