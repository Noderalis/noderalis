# @nodalis/logger

> https://www.scalyr.com/blog/rails-logger/

Logger is built on top of [Winston](https://github.com/winstonjs/winston).

## Nodalis::Config::Logger

- location: where the logs are stored (default "\<rootDir\>/logs").
- color: whether or not Logger uses Chalk in the terminal (default true).

## How it Works

Logs should be stored in `<rootDir>/log/`, subsequently the logs generated should be stored in their environment directories, and each log should rotate. At the end of each month, logs should be archived and moved into `<logDir>/<env>/archive/`. This allows for the best readability and traversal for the developers.
