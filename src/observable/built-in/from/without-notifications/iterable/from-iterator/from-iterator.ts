import { noop } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

/**
 * WARN use with caution: it's possible that you subscribe twice to the same Iterator, in this case the emitted values probably won't be what you expect
 */
export function fromIterator<GValue>(
  iterator: Iterator<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let result: IteratorResult<GValue>;
    while (!(result = iterator.next()).done) {
      emit(result.value);
    }
    return noop;
  };
}
