import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CreateCloudflareDto } from './dto/create-cloudflare.dto';
import { envSchema } from 'src/app/configs/env/env.config';

@Injectable()
export class CloudflareService {
  uploadImage(cover: any) {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(CloudflareService.name);
  private readonly r2: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor() {
    const env = envSchema.parse(process.env);

    // Cloudflare R2 endpoint format: https://<account-id>.r2.cloudflarestorage.com
    const endpoint = env.R2_ACCOUNT_ID
      ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : undefined;

    this.r2 = new S3Client({
      region: 'auto', // Cloudflare R2 always uses "auto"
      endpoint,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? '',
      },
    });

    this.bucket = env.R2_BUCKET ?? '';
    this.publicUrl = env.R2_PUBLIC_BASE ?? '';
  }

  /**
   * Create signed upload URL (FE uploads directly)
   */
  async create(dto: CreateCloudflareDto) {
    const { filename, contentType } = dto;

    // Generate unique key for file
    const key = `assignments/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    // Signed URL (1 hour)
    const uploadUrl = await getSignedUrl(this.r2, command, {
      expiresIn: 3600,
    });

    return {
      uploadUrl,
      fileUrl: `${this.publicUrl}/${key}`,
      key,
    };
  }

  /**
   * Upload file buffer directly to R2
   */
  async uploadFile(
    file: { buffer: Buffer; originalname: string; mimetype: string },
    folder: string = 'uploads',
  ): Promise<{ fileUrl: string; key: string }> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.r2.send(command);
    this.logger.debug(`File uploaded successfully: ${key}`);

    return {
      fileUrl: `${this.publicUrl}/${key}`,
      key,
    };
  }

  /**
   * Generate signed DOWNLOAD URL
   */
  async getSignedUrl(filename: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: filename,
    });

    return getSignedUrl(this.r2, command, { expiresIn: 3600 });
  }
}
