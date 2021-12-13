import * as fs from 'fs';
import * as path from 'path';

export const HandleStaticPath = (pathname, mask, cb) => {
	const __dirname = path.resolve()
	fs.mkdir(path.resolve(__dirname, pathname), mask, function(err) {
		if (err) {
			if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
			else cb(err); // something else went wrong
		} else cb(null); // successfully created folder
	});
}

export const getRandomFileName = () => {
	return Array(24).fill(null).map(() =>
		(Math.round(Math.random() * 16)).toString(16)).join('')
}
