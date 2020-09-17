import { URI } from 'packages/nodalis-core/sources/base/uri';
import { Event } from 'packages/nodalis-core/sources/base/event';
import { createDecorator } from 'packages/nodalis-core/sources/service-impl/instantiation';
import { IDisposable } from 'packages/nodalis-core/sources/service-impl/lifecycle';

export const IFileService = createDecorator<IFileService>(`fileService`);

// TODO:GRIM
export interface IFileService {
	readonly _serviceBrand: undefined;

	readonly onDidFileSystemProviderRegister: Event<unknown>;
	readonly onDidFileSystemProviderChangeCapabilities: Event<unknown>;
	readonly onWillActivateFileSystemProvider: Event<unknown>;
	readonly onDidFilesChange: Event<unknown>;
	readonly onDidRunOperation: Event<unknown>;

	registerProvider: (scheme: string, provider: unknown) => IDisposable;
	activateProvuder: (scheme: string) => Promise<void>;
	canHandleResource: (resource: URI) => boolean;
	hasCapability: () => boolean;
	resolve: (resource: URI, options: unknown) => Promise<any>;
	resolve: (resource: URI, options?: unknown) => Promise<unknown>;
}
