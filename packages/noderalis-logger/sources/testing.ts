import Winston from 'winston';
import Chalk from 'chalk';
import Center from 'center-align';

console.log(Winston.config.syslog.levels);

// Needs to pad the levels so that the spacing around the levels is consistent across logs

const noderalisErrorLogFormat = Winston.format.printf((info) => {
	let log = Chalk`[${info.timestamp}] `;
	log += Chalk`{red ${Center(info.level.toUpperCase(), 12)}} `;
	log += `${info.label}: `;
	log += `${info.message}`;

	return log;
});

const noderalisLogFormat = Winston.format.printf((info) => {
	return `[${info.timestamp}] ${info.level.toUpperCase()} ${info.label}: ${
		info.message
	}`;
});

const logger = Winston.createLogger({
	levels: Winston.config.syslog.levels,
	format: Winston.format.combine(
		Winston.format.label({ label: 'Noderalis::Logger::Error' }),
		Winston.format.timestamp(),
		noderalisLogFormat
	),
	defaultMeta: { service: 'user-service' },
	transports: [
		new Winston.transports.File({
			filename: 'log/error.log',
			level: 'error',
		}),
		new Winston.transports.File({
			filename: 'log/access.log',
			level: 'http',
		}),
	],
});

logger.add(
	new Winston.transports.Console({
		format: noderalisErrorLogFormat,
	})
);

logger.log({ level: 'emergency', message: 'Logger instantiated!' });
logger.log({ level: 'warning', message: 'Logger instantiated!' });
logger.log('notice', 'Silly log');
logger.error('Holy shit batman!');
