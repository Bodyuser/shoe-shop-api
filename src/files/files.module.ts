import {Module} from '@nestjs/common';
import {ServeStaticModule} from "@nestjs/serve-static";
import {path} from "app-root-path";
import {FilesController} from './files.controller';
import {FilesService} from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: "/uploads"
    })
  ]
})
export class FilesModule {}
