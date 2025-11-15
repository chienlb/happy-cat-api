import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_REDIRECT_URI as string,
            scope: ['openid', 'email', 'profile'],
            passReqToCallback: false, // đổi về false nếu bạn không dùng req
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {

        // LẤY EMAIL AN TOÀN
        const email =
            profile?.emails?.[0]?.value ||
            profile?._json?.email ||
            null;

        if (!email) {
            return done(new UnauthorizedException('Google không trả email về'), false);
        }

        // LẤY AVATAR AN TOÀN
        const avatar =
            profile?.photos?.[0]?.value ||
            profile?._json?.picture ||
            null;

        const user = {
            provider: 'google',
            googleId: profile.id,
            email,
            fullname: profile.displayName,
            avatar,
        };

        done(null, user);
    }
}
