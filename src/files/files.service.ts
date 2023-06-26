import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import { v4 } from 'uuid'
import { FileResponse } from './types/file.response'

@Injectable()
export class FilesService {
	async SaveFiles(
		file: Express.Multer.File,
		folder: string = 'defaults'
	): Promise<FileResponse> {
		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder)
		
		const uuid = v4()
		
		const rs = file.originalname.split('.')[1]
		await writeFile(`${uploadFolder}/${uuid}.${rs}`, file.buffer)
		return {
			url: `/uploads/${folder}/${uuid}.${rs}`,
			name: `${uuid}.${rs}`,
		}
	}
}
