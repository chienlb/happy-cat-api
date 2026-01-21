import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      callbackURL: process.env.FACEBOOK_REDIRECT_URI as string,

      // Facebook cần profileFields để trả dữ liệu
      profileFields: ['id', 'displayName', 'emails', 'photos'],

      // Scope hợp lệ
      scope: ['email', 'public_profile'],

      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const email = profile?.emails?.[0]?.value || null; // Facebook có thể không trả email

    const avatar =
      profile?.photos?.[0]?.value ||
      `https://graph.facebook.com/${profile.id}/picture?type=large`;

    const fullname =
      profile?.displayName ||
      profile?.name?.givenName ||
      profile?.name?.familyName ||
      'Facebook User';

    const user = {
      provider: 'facebook',
      facebookId: profile.id,
      email,
      fullname,
      avatar,
    };

    // Nếu email không có — tùy bạn xử lý
    if (!email) {
      // Nếu muốn reject:
      // return done(new UnauthorizedException('Không lấy được email từ Facebook'), false);

      return done(null, user);
    }

    done(null, user);
  }
}
