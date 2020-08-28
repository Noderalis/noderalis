// // https://nodejs.org/docs/latest-v12.x/api/worker_threads.html
// // https://nodejs.org/docs/latest-v12.x/api/async_hooks.html#async-resource-worker-pool

// /**!
//  * This is a grossly horrible soon-to-be parallelism engine for Webpack configurations.
//  */

// import { AsyncResource } from 'async_hooks';
// import { EventEmitter } from 'events';
// import { cpus } from 'os';
// import { Worker } from 'worker_threads';

// const kTaskInfo = Symbol('kTaskInfo');
// const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

// export class WorkerPoolTaskInfo extends AsyncResource {
//   callback: () => unknown;
//   constructor(callback: any) {
//     super('WorkerPoolTaskInfo');
//     this.callback = callback;
//   }

//   done(error: unknown, result: unknown): void {
//     this.runInAsyncScope(this.callback, null, error, result);
//     this.emitDestroy();
//   }
// }

// export class WorkerPool extends EventEmitter {
//   private threadCount: number;
//   private freeWorkers: Worker[];
//   private workers: Worker[];

//   public constructor(threadCount: number) {
//     super();

//     this.threadCount = threadCount;
//     this.freeWorkers = [];
//     this.workers = [];

//     console.log(`threadCount: ${this.threadCount}`);

//     for (let i = 0; i < threadCount; i++) {
//       this.createWorker();
//     }
//   }

//   private createWorker() {
//     const worker = new Worker(
//       `
//       const { parentPort } = require('worker_threads');
//       parentPort.on('message', (task) => {
//         parentPort.postMessage(task.a + task.b);
//       });
//     `,
//       { eval: true }
//     );

//     worker.on('message', (result) => {
//       worker[kTaskInfo].done(null, result);
//       worker[kTaskInfo] = null;
//       this.freeWorkers.push(worker);
//       this.emit(kWorkerFreedEvent);
//     });

//     worker.on('error', (error) => {
//       if (worker[kTaskInfo]) {
//         worker[kTaskInfo].done(error, null);
//       } else {
//         this.emit('error', error);
//       }
//       this.workers.splice(this.workers.indexOf(worker), 1);
//       this.createWorker();
//     });

//     this.workers.push(worker);
//     this.freeWorkers.push(worker);
//     this.emit(kWorkerFreedEvent);
//   }

//   public runTask(
//     task: unknown,
//     callback: (error: any, result: any) => void
//   ): void {
//     if (this.freeWorkers.length === 0) {
//       this.once(kWorkerFreedEvent, () => this.runTask(task, callback));
//       return;
//     }

//     const worker = this.freeWorkers.pop();
//     worker![kTaskInfo] = new WorkerPoolTaskInfo(callback);
//     worker!.postMessage(task);
//   }

//   public close(): void {
//     for (const worker of this.workers) {
//       worker.terminate();
//     }
//   }
// }

// const pool = new WorkerPool(cpus().length);
// let finished = 0;

// for (let i = 0; i < 10; i++) {
//   pool.runTask({ a: 42, b: 100 }, (error, result) => {
//     console.log(i, error, result);

//     if (++finished === 10) {
//       pool.close();
//     }
//   });
// }
