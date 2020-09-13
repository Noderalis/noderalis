import { ServicesAccessor } from './instantiation';
import { InstantiationService } from './instantiationService';

export class ServiceCollection {
	private _entries = new Map();

	constructor(...entries: [any, any][]) {
		for (let [id, service] of entries) {
			this.set(id, service);
		}
	}

	public set(id, instanceOrDescriptor) {
		const result = this._entries.get(id);
		this._entries.set(id, instanceOrDescriptor);

		return result;
	}

	public has(id) {
		return this._entries.has(id);
	}

	public get(id) {
		return this._entries.get(id);
	}
}

class ServiceTestMain {
	public main() {
		this.startup([]);
	}

	private async startup(args) {
		const [instantiationService] = this.createServices();

		try {
			// Init primary services
			await instantiationService.invokeFunction(async accessor=>{
				try {
					await this.initServices()
				}catch(error) {
					throw error
				}
			})

			// Startup
			await instantiationService.invokeFunction(async accessor=>{
				return instantiationService.createInstance()
			})
		} catch (error) {
			instantiationService.invokeFunction(this.quit, error);
		}
	}

	private createServices() {
		const services = new ServiceCollection();

		return [new InstantiationService(services)];
	}

	private initServices(){
		return Promise.all([])
	}

	private quit(accessor: ServicesAccessor, reason?: Error) {
		let exitCode = 0;

		if (reason) {
			exitCode = 1;
			console.log(reason);
		}
	}
}

const serviceTest = new ServiceTestMain();
serviceTest.main();
