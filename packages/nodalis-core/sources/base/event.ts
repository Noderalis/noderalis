import { Disposable, IDisposable } from '../service-impl/lifecycle';

export interface Event<EventType> {
	(
		listener: (e: EventType) => any,
		thisArgs?: any,
		disposables?: IDisposable[]
	): IDisposable;
}

// TODO:GRIM `vs/base/common/event,ts`
export namespace Event {
	export const None: Event<any> = () => Disposable.None;

	/**
	 * Given an event, returns another event which only fires once.
	 * @param event The event to fire once.
	 */
	export function once<EventType>(event: Event<EventType>): Event<EventType> {
		return (listener, thisArgs = null, disposables?) => {
			let didFire = false;
			let result: IDisposable;

			result = event(
				(e) => {
					if (didFire) return;
					else if (result) result.dispose();
					else didFire = true;

					return listener.call(thisArgs, e);
				},
				null,
				disposables
			);

			if (didFire) result.dispose();

			return result;
		};
	}
}
