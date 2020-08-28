import Winston from 'winston';

export class Logger {
	private static container = new Winston.Container();

	constructor() {}

	static addLogger(loggerName: string): void {
		this.container.add(loggerName);
	}
}
