import { Injectable } from '@nestjs/common';
import { AttachmentAddDto } from './dto/attachment-add.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from './attachments.model';

@Injectable()
export class AttachmentsService {
	constructor(
		@InjectModel(Attachment)
		private repoAttachment: typeof Attachment
	){}

	async createAttachment(dto: AttachmentAddDto) {
		const attachment = await this.repoAttachment.create(dto)
		return attachment.id
	}
}
