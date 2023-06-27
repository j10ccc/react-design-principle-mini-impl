interface Effect {
  execute: () => void;
  deps: Set<Set<Effect>>
}

const effectStack: Effect[] = [];

const cleanup = (effect: Effect) => {
  effect.deps.forEach(subs => subs.delete(effect));
  effect.deps.clear();
};

const subscribe = (effect: Effect, subs: Set<Effect>) => {
  subs.add(effect);
  effect.deps.add(subs);
};

const useEffect = (callback: () => void) => {
  const execute = () => {
    cleanup(effect);
    effectStack.push(effect);
    try {
      callback();
    } finally {
      effectStack.pop();
    }
  };
  const effect: Effect = {
    execute,
    deps: new Set()
  };
  execute();
};

const useState = <T>(value?: T) => {
  const subs = new Set<Effect>();

  const getter = () => {
    const effect = effectStack[effectStack.length - 1];
    if (effect) {
      subscribe(effect, subs);
    }
    return value;
  };

  const setter = (nextValue: T) => {
    value = nextValue;
    [...subs].forEach(effect => {
      effect.execute();
    });
  };

  return [getter, setter] as [
    state: () => T,
    setState: (nextState: T) => void
  ];
};

const useMemo = <T>(callback: () => T) => {
  const [value, setValue] = useState<T>();
  useEffect(() => setValue(callback()));

  return value;
};


export {
  useState,
  useEffect,
  useMemo
};
