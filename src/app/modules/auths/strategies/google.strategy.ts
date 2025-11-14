import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_REDIRECT_URI as string,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {

        const user = {
            provider: 'google',
            email: profile.emails[0].value,
            fullname: profile.displayName,
            avatar: profile.photos[0].value,
            googleId: profile.id,
        };

        done(null, user);
    }
}
