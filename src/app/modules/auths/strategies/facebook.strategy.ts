import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
            callbackURL: process.env.FACEBOOK_REDIRECT_URI as string,
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
            provider: 'facebook',
            email: profile.emails[0].value,
            fullname: profile.displayName,
            avatar: profile.photos[0].value,
            facebookId: profile.id,
        };
        done(null, user);
    }
}