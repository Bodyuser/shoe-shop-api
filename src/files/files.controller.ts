import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from './files.service'
import { FileResponse } from './types/file.response'
import { Auth } from '@/auth/decorators/auth.decorator'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  
  @Post()
  @HttpCode(200)
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  async UploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string
  ): Promise<FileResponse> {
    return this.filesService.SaveFiles(file, folder)
  }
}
