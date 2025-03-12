import { useRef, useState } from "react";

type Options = {
  commitEvery?: number;
  throttle?: number;
  debounce?: number;
  maxHistory?: number;
};

export function useHistoryState<T>(
  initialState: T,
  options: Options = {}
): [
    T,
    (setter: T | ((prevState: T) => T)) => void,
    () => void,
    () => void,
    () => void
  ] {
  const {
    throttle = 0,
    debounce = 0,
    commitEvery = 1,
    maxHistory = Infinity,
  } = options;

  const [_state, _setState] = useState<T>(initialState);
  const [_history, _setHistory] = useState<T[]>([initialState]);
  const [_historyIndex, _setHistoryIndex] = useState<number>(0);
  const [shouldWait, setShouldWait] = useState<boolean>(false);
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const changeCounter = useRef(0);

  function updateHistory(newVal: T) {
    _setHistory((prevHistory) => {
      const newHistory = [...prevHistory.slice(0, _historyIndex + 1), newVal];
      let newIndex = _historyIndex + 1;
      if (newHistory.length > maxHistory) {
        newHistory.shift();
        if (newIndex > newHistory.length - 1) newIndex = newHistory.length - 1;
      }
      _setHistoryIndex(newIndex);
      console.log(newHistory);
      return newHistory;
    });

    changeCounter.current = 0;
  }

  function setState(setter: T | ((prevState: T) => T)): void {
    const newVal =
      typeof setter === "function"
        ? (setter as (prevState: T) => T)(_state)
        : setter;

    _setState(newVal);

    changeCounter.current += 1;

    if (debounce > 0) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      setDebounceTimeout(
        setTimeout(() => {
          if (changeCounter.current >= commitEvery) updateHistory(newVal);
        }, debounce)
      );
    } else if (throttle > 0) {
      if (shouldWait) return;
      if (changeCounter.current >= commitEvery) updateHistory(newVal);
      setShouldWait(true);
      setTimeout(() => {
        setShouldWait(false);
      }, throttle);
    } else {
      if (changeCounter.current >= commitEvery) updateHistory(newVal);
    }
  }

  function undo(): void {
    _setHistoryIndex((prevIndex) => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1;
        _setState(_history[newIndex]);

        return newIndex;
      }
      return prevIndex;
    });
  }

  function redo(): void {
    _setHistoryIndex((prevIndex) => {
      if (prevIndex < _history.length - 1) {
        const newIndex = prevIndex + 1;
        _setState(_history[newIndex]);
        return newIndex;
      }
      return prevIndex;
    });
  }

  function clear(): void {
    _setHistory([initialState]);
    _setHistoryIndex(0);
  }

  return [_state, setState, undo, redo, clear];
}