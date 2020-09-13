import { IInstantiationService } from './instantiation';
import { Disposable } from './lifecycle';
import { ServiceCollection } from './ServiceTest';

export class CodeApplication extends Disposable {
	constructor(
		@IInstantiationService
		private readonly instantiationService: IInstantiationService
	) {
		super();
  }
  
  async startup(): Promise<void> {
		// this.logService.debug('Starting VS Code');
		// this.logService.debug(`from: ${this.environmentService.appRoot}`);
		// this.logService.debug('args:', this.environmentService.args);

		// Spawn shared process after the first window has opened and 3s have passed
		// const sharedProcess = this.instantiationService.createInstance(SharedProcess, machineId, this.userEnv);
		// const sharedProcessClient = sharedProcess.whenIpcReady().then(() => {
		// 	this.logService.trace('Shared process: IPC ready');

		// 	return connect(this.environmentService.sharedIPCHandle, 'main');
		// });
		// const sharedProcessReady = sharedProcess.whenReady().then(() => {
		// 	this.logService.trace('Shared process: init ready');

		// 	return sharedProcessClient;
		// });
		// this.lifecycleMainService.when(LifecycleMainPhase.AfterWindowOpen).then(() => {
		// 	this._register(new RunOnceScheduler(async () => {
		// 		sharedProcess.spawn(await getShellEnvironment(this.logService, this.environmentService));
		// 	}, 3000)).schedule();
		// });

		// Services
		// const appInstantiationService = await this.createServices(machineId, sharedProcess, sharedProcessReady);

		// Create driver
		// if (this.environmentService.driverHandle) {
		// 	const server = await serveDriver(electronIpcServer, this.environmentService.driverHandle, this.environmentService, appInstantiationService);

		// 	this.logService.info('Driver started at:', this.environmentService.driverHandle);
		// 	this._register(server);
		// }

		// Setup Auth Handler
		// this._register(new ProxyAuthHandler());

		// Open Windows
		// const windows = appInstantiationService.invokeFunction(accessor => this.openFirstWindow(accessor, electronIpcServer, sharedProcessClient));

		// Post Open Windows Tasks
		// appInstantiationService.invokeFunction(accessor => this.afterWindowOpen(accessor));

  }
  
  private async createServices(){
    const service = new ServiceCollection()

    // SWITCH platform
    // Set the appropriate `IUpdateService`s i.e.: 
    // 'win32' services.set(IUpdateService, Win32UpdateService), 
    // 'linux' SnapUpdateService or LinuxUpdateService
    // 'darwin' DarwinUpdateService

    // ^^ Useful for figuring out something for Noderalis

    // service.set() WindowsMainService
    // service.set() DialoogMainService
    // etc...

    // tada finally set the services as a child of the CodeApplication... I think.
    // return this.instantiationService.createChild(services)
  }
}
