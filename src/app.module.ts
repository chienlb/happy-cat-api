import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './app/modules/users/users.module';
import { TokensModule } from './app/modules/tokens/tokens.module';
import { ProvincesModule } from './app/modules/provinces/provinces.module';
import { DistrictsModule } from './app/modules/districts/districts.module';
import { SchoolsModule } from './app/modules/schools/schools.module';
import { ClassesModule } from './app/modules/classes/classes.module';

@Module({
  imports: [
    UsersModule,
    TokensModule,
    ProvincesModule,
    DistrictsModule,
    SchoolsModule,
    ClassesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
