'use strict';
const execa = require('execa');
const gifsicle = require('gifsicle');
const isGif = require('is-gif');

module.exports = (options = {}) => async input => {
	if (!Buffer.isBuffer(input)) {
		throw new TypeError(`Expected \`input\` to be of type \`Buffer\` but received type \`${typeof input}\``);
	}

	if (!isGif(input)) {
		return input;
	}
	const args = ['--no-warnings', '--no-app-extensions', `--crop=${options.f1},${options.f2}+${options.w}`, '-b'];

	if (options.interlaced) {
		args.push('--interlace');
	}

	if(options.w > 200){
		args.push('--resize=200x200');
	}

	if (options.optimizationLevel) {
		args.push(`--optimize=${options.optimizationLevel}`);
	}

	if (options.colors) {
		args.push(`--colors=${options.colors}`);
	}

	const {stdout} = await execa(gifsicle, args, {
		encoding: null,
		input
	});

	return stdout;
};
