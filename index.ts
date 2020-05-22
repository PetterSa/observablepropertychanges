import {Observable, Subscriber} from 'rxjs';

export interface WithPropertyObserver {
    observableForProperty(property: keyof this): Observable<this[keyof this]>;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export default function ObservablePropertyChanges<AnyClass extends Constructor>(anyClass: AnyClass) {
    return class ClassWithPropertyObserver extends anyClass implements WithPropertyObserver {
        private propertySubscribers = new Map<keyof this, Subscriber<this[keyof this]>[]>();

        constructor(...props: any[]) {
            super(...props);

            return new Proxy(this, {
                set: (target, property: keyof this, value) => {
                    if (this.propertySubscribers.has(property)) {
                        this.propertySubscribers.get(property).forEach(subscriber => subscriber.next(value));
                    }
                    Reflect.set(target, property, value);
                    return true;
                }
            });
        }

        observableForProperty(property: keyof this): Observable<this[keyof this]> {
            return new Observable(subscriber => {
                if (!this.propertySubscribers.has(property)) {
                    this.propertySubscribers.set(property, []);
                }
                this.propertySubscribers.get(property).push(subscriber);
                return () => {
                    const indexToRemove = this.propertySubscribers.get(property).indexOf(subscriber);
                    this.propertySubscribers.get(property).splice(indexToRemove, 1);
                };
            });
        }
    };
}
