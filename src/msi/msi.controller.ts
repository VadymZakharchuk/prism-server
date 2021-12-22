import { Controller } from '@nestjs/common';
import { MsiService } from './msi.service';

@Controller('msi')
export class MsiController {
	constructor(private msiService: MsiService) {}
}
