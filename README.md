# Observable Property Changes
A small utility function that extends the class it is passed with abilities to observe changes to its properties with RxJS

### ⚠ Warning ⚠
Because of strange limitations, using this on a class that has ES private properties will break anything that tries to use them. 

See discussions: 

https://github.com/tc39/proposal-class-fields/issues/106

https://github.com/littledan/proposal-proxy-transparent

https://github.com/rdking/proposal-proxy-transparency/issues

When this gets resolved I will fix this! Looking forward to it!

## Usage example
```shell script
npm i observable-property-changes
```

```ts
import ObservablePropertyChanges, { WithPropertyObserver } from 'observable-property-changes';
class Example {
    prop = 'A value'
}
const ObservableExample = ObservablePropertyChanges(Example);
const observableExample: Example & WithPropertyObserver = new ObservableExample();
observableExample.observableForProperty('prop').subscribe(prop => console.log('Prop changed value to ' + prop))

observableExample.prop = 'Another value';
// This is printed: Prop changed value to Another value
```
