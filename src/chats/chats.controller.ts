import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from './chats.model'
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsUserAuth } from '../guards/is-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getRandomFileName, HandleStaticPath } from '../decorators/StaticFilesHandling';
import { extname } from 'path';
import { TokenGetUserID } from '../decorators/TokenGetUserID';

@Controller('files')
export class ChatsController {
	constructor(private chatsService: ChatsService) {}

	@ApiOperation({ summary: 'Сохранить файл, присланный в комнату чата' })
	@ApiResponse({ status: 200, type: Chat })
	@UseGuards(IsUserAuth)
	@Post('/:roomId/:type')
	@UseInterceptors(FileInterceptor('file',
		{
			storage: diskStorage({
				destination: (req, file, callback) => {
					let path = `./public/chats/${req.params.roomId}`;
					HandleStaticPath(path, { recursive: true }, err => { if (err) throw err })
					callback(null, path);
				},
				filename: (req, file, cb) => {
					return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
				}
			})
		}
	))
	uploadMediaContent(
		@Param('roomId') roomId,
		@Param('type') fileType,
		@TokenGetUserID() userId: string,
		@UploadedFile() file: Express.Multer.File) {
		return `http://${process.env.DB_HOST}:${process.env.APP_PORT}/files/${file.path}`
	}

	@ApiOperation({ summary: 'Получить файл из комнаты чата' })
	@ApiResponse({ status: 200, type: Chat })
	@Get('public/chats/:roomId/:fileId')
	async serveAvatar(
		@Param('roomId') roomId,
		@Param('fileId') fileId,
		@Res() res): Promise<any> {
		res.sendFile(fileId, { root: `public/chats/${roomId}`});
	}
}
