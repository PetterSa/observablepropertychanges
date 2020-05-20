import {Observable, Subscriber} from 'rxjs';

export default function ObservablePropertyChanges<AnyObject extends new (...args: any[]) => object>(anyObject: AnyObject) {
    return class ClassWithPropertyObserver extends anyObject {
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
