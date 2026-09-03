import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("files")
@Controller("files")
export class FilesController {
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file?: { originalname?: string; size?: number }) {
    return {
      id: crypto.randomUUID(),
      filename: file?.originalname,
      size: file?.size,
    };
  }
}
