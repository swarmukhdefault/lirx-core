import { createEventListener, IRemoveEventListener } from '@lirx/utils';
import { isAbortSignal } from '../is/is-abort-signal';

/**
 * Creates an AbortController which will be aborted if/when one of the 'signals' is aborted
 */
export function createAbortControllerFromAbortSignals(
  signals: readonly AbortSignal[],
): AbortController {
  const abortController: AbortController = new AbortController();

  for (let i = 0, l = signals.length; i < l; i++) {
    const signal: AbortSignal = signals[i];
    if (isAbortSignal(signal)) {
      if (signal.aborted) {
        abortController.abort();
        return abortController;
      }
    } else {
      throw new TypeError(`Expected AbortSignal at index #${i}`);
    }
  }

  /* no signal aborted yet */

  const end = () => {
    for (let i = 0, l = unsubscribeSignalList.length; i < l; i++) {
      unsubscribeSignalList[i]();
    }
    unsubscribeOwnSignal();
  };

  // in the case of our abortController.signal is aborted, it's no more required to listen to 'abort' from input 'signals'
  const unsubscribeOwnSignal: IRemoveEventListener = createEventListener(abortController.signal, 'abort', end);

  const unsubscribeSignalList: IRemoveEventListener[] = signals.map((signal: AbortSignal) => {
    return createEventListener(signal, 'abort', () => {
      end();
      abortController.abort();
    });
  });

  return abortController;
}
