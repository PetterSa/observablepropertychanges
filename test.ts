import test from 'ava';
import ObservableProperties from './index';

test('Happy path for observableForProperty: Subscribe to changes on a class property with Observable', t => {
    class ClassWithoutObservable {
        constructor(public propertyThatWillChange) {
        }
    }
    const ClassThatCanObserveChangesToItsProperties = ObservableProperties(ClassWithoutObservable);
    const canObserveChangesToItsProperties = new ClassThatCanObserveChangesToItsProperties('This will change');

    t.plan(1);
    const valuePropertyWillChangeTo = "new value!"
    canObserveChangesToItsProperties.observableForProperty('propertyThatWillChange')
        .subscribe(propertyHasChanged => {
            t.assert(propertyHasChanged === valuePropertyWillChangeTo);
        })

    canObserveChangesToItsProperties.propertyThatWillChange = valuePropertyWillChangeTo;
});
