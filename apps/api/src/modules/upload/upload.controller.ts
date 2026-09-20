import {
  Controller, Post, Delete, Param, Query,
  UseGuards, UseInterceptors, UploadedFile,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiTags('Upload')
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'daily-records' },
      },
    },
  })
  @ApiOperation({ summary: 'Uploader un fichier' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'general',
  ) {
    const url = await this.uploadService.upload(file, folder);
    return { data: { url } };
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Supprimer un fichier' })
  async remove(@Param('key') key: string) {
    await this.uploadService.remove(key);
    return { message: 'Fichier supprime' };
  }
}
