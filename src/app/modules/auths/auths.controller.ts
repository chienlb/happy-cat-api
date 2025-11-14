import { Controller, Post, Body, Logger, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ok } from 'src/app/common/response/api-response';
import {
  LogoutAllDevicesAuthDto,
  LogoutDeviceAuthDto,
  LogoutNotDeviceAuthDto,
} from './dto/logout-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auths')
@Controller('auths')
export class AuthsController {
  private readonly logger = new Logger(AuthsController.name);

  constructor(private readonly authsService: AuthsService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'Register a new user',
    type: RegisterAuthDto,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          fullname: 'Nguyen Van A',
          username: 'nguyenvana',
          email: 'nguyenvana@gmail.com',
          password: '123456',
          birthDate: '2015-09-15',
          role: 'parent',
          phone: '0912345678',
          gender: 'male',
          typeAccount: 'email',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    if (
      !registerAuthDto.username ||
      !registerAuthDto.email ||
      !registerAuthDto.password
    ) {
      throw new Error('Missing required fields: username, email, or password');
    }
    this.logger.log(`Registering user: ${registerAuthDto.username}`);
    const result = await this.authsService.register(registerAuthDto);
    return ok(result, 'User registered successfully', 201);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    description: 'Login a user',
    type: LoginAuthDto,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          email: 'nguyenvana@example.com',
          password: '123456',
          deviceId: '1234567890',
          typeDevice: 'android',
          typeLogin: 'email',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const result = await this.authsService.login(loginAuthDto);
    return ok(result, 'User logged in successfully', 200);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email' })
  @ApiBody({
    description: 'Verify email',
    type: String,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          codeVerify: '123456',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async verifyEmail(@Body() codeVerify: string) {
    const result = await this.authsService.verifyEmail(codeVerify);
    return ok(result, 'Email verified successfully', 200);
  }

  @Post('resend-verification-email')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiBody({
    description: 'Resend verification email',
    type: String,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          email: 'nguyenvana@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Verification email resent successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async resendVerificationEmail(@Body() email: string) {
    const result = await this.authsService.resendVerificationEmail(email);
    return ok(result, 'Verification email resent successfully', 200);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({
    description: 'Forgot password',
    type: String,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          email: 'nguyenvana@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async forgotPassword(@Body() email: string) {
    const result = await this.authsService.forgotPassword(email);
    return ok(result, 'Password reset email sent successfully', 200);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    description: 'Reset password',
    type: String,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          codeVerify: '123456',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async resetPassword(@Body() codeVerify: string, @Body() password: string) {
    const result = await this.authsService.resetPassword(codeVerify, password);
    return ok(result, 'Password reset successfully', 200);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({
    description: 'Change password',
    type: String,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          email: 'nguyenvana@example.com',
          password: '123456',
          codeVerify: '123456',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async changePassword(
    @Body() email: string,
    @Body() password: string,
    @Body() codeVerify: string,
  ) {
    const result = await this.authsService.changePassword(
      email,
      password,
      codeVerify,
    );
    return ok(result, 'Password changed successfully', 200);
  }

  @Post('logout-all-devices')
  @ApiOperation({ summary: 'Logout all devices' })
  @ApiBody({
    description: 'Logout all devices',
    type: String,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          userId: '1234567890',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Logout all devices successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async logoutAllDevices(
    @Body() logoutAllDevicesAuthDto: LogoutAllDevicesAuthDto,
  ) {
    const result = await this.authsService.logoutAllDevices(
      logoutAllDevicesAuthDto,
    );
    return ok(result, 'Logout all devices successfully', 200);
  }

  @Post('logout-device')
  @ApiOperation({ summary: 'Logout device' })
  @ApiBody({
    description: 'Logout device',
    type: String,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          userId: '1234567890',
          deviceId: '1234567890',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Logout device successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async logoutDevice(@Body() logoutDeviceAuthDto: LogoutDeviceAuthDto) {
    const result = await this.authsService.logoutDevice(logoutDeviceAuthDto);
    return ok(result, 'Logout device successfully', 200);
  }

  @Post('logout-not-device')
  @ApiOperation({ summary: 'Logout not device' })
  @ApiBody({
    description: 'Logout not device',
    type: String,
    examples: {
      normal: {
        summary: 'Example of a normal user',
        value: {
          userId: '1234567890',
          deviceId: '1234567890',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Logout not device successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async logoutNotDevice(
    @Body() logoutNotDeviceAuthDto: LogoutNotDeviceAuthDto,
  ) {
    const result = await this.authsService.logoutNotDevice(
      logoutNotDeviceAuthDto,
    );
    return ok(result, 'Logout not device successfully', 200);
  }

  @ApiOperation({ summary: 'Google login' })
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return ok('Redirecting to Google...', 'Redirecting to Google...', 200);
  }

  @ApiOperation({ summary: 'Google callback' })
  @Get("google/callback")
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = await this.authsService.loginWithGoogle(req.user);

    return res.redirect(`http://localhost:3001/success?token=${accessToken}`);
  }

  @ApiOperation({ summary: 'Google one tap' })
  @Post('google/one-tap')
  async googleOneTap(@Body('credential') credential: string) {
    const result = await this.authsService.googleOneTap(credential);
    return ok(result, 'Google one tap successfully', 200);
  }

  @ApiOperation({ summary: 'Facebook login' })
  @Get('facebook/login')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return ok('Redirecting to Facebook...', 'Redirecting to Facebook...', 200);
  }

  @ApiOperation({ summary: 'Facebook callback' })
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = await this.authsService.loginWithFacebook(req.user);
    return res.redirect(`http://localhost:3001/success?token=${accessToken}`);
  }
}
