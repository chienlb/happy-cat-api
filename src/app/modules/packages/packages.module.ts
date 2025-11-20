import { forwardRef, Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { UsersModule } from '../users/users.module';
import { Package, PackageSchema } from './schema/package.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationCodesModule } from '../invitation-codes/invitation-codes.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Package.name, schema: PackageSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => InvitationCodesModule),
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule { }
