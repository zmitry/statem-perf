const { generateDraft } = require("./mock");
const { observable } = require("mobx");
const { createStore, combineReducers } = require("redux");
const { createStore: efStore, createEvent: efAction } = require("effector");
const { create } = require("microstates");
const MAX = 1000;
const MODIFY_FACTOR = 0.5;

const reducer = (draft = generateDraft()) => {
  const newDraft = draft.concat([]);
  for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
    newDraft[i] = Object.assign({}, newDraft[i], { done: Math.random() });
  }
  return newDraft;
};

function makeRecReducer(i) {
  if (i === 20) {
    return (d = 2) => 2;
  }
  return combineReducers({
    [i]: makeRecReducer(i + 1)
  });
}
suite("redux", function() {
  bench("create", function() {
    const store = createStore((d = null) => d, generateDraft());
    store.dispatch({ type: "any" });
  });

  const reducerMap = {};
  for (let i = 0; i < 300; i++) {
    reducerMap[i] = (d = 4) => 2;
  }
  const rootReducer = combineReducers({
    a: combineReducers({
      b: combineReducers({
        c: reducer
      })
    })
  });
  let store;

  bench("modify complex reducer", function() {
    store = createStore(rootReducer);
    store.subscribe(() => {});
    store.dispatch({ type: "init" });
  });
});

suite("mobx", function() {
  bench("create", function() {
    const data = observable.array(generateDraft());
  });

  bench("shallow wrap", function() {
    const data = observable.array(generateDraft(), { deep: false });
  });
  const data = observable(generateDraft());

  bench("modify", function() {
    const mutate = draft => {
      for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
        draft[i].done = Math.random();
      }
    };
    mutate(data);
  });
});

suite("effector", function() {
  bench("create", function() {
    const toggle = efAction("");
    const state = efStore(generateDraft());
    state.on(toggle, (_, p) => p);
  });

  const toggle = efAction("");
  const state = efStore(generateDraft());
  state.on(toggle, reducer);

  bench("modify", function() {
    toggle();
  });
});

class Item {
  constructor() {
    this.done = Boolean;
    this.todo = String;
  }
  updateTodo() {
    return this.todo.set(Math.random());
  }
}
class Items {
  constructor() {
    this.items = [Item];
  }

  update() {
    let update = this;
    for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
      update = this.items[i].todo.set(Math.random());
    }
    return update;
  }
  update2() {
    let update = this;
    for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
      update = this.items[i].updateTodo();
    }
    return update;
  }
  update3() {
    return this.items.set(reducer(this.items.state));
  }
  update4() {
    // return this.items.set(this.items.state);
  }
}

suite("microstates", function() {
  bench("create", function() {
    const toggle = efAction("");
    const store = create(Items, { items: generateDraft() });
  });

  bench("create simple subs", function() {
    const toggle = efAction("");
    const store = create(Items, { items: generateDraft() });
    store["@@observable"]().subscribe(() => {});
  });

  const store = create(Items, { items: generateDraft() });
  bench("update", function() {
    store["@@observable"]().subscribe(() => {});
    store.update();
  });
  const store2 = create(Items, { items: generateDraft() });
  bench("update 2", function() {
    store2["@@observable"]().subscribe(() => {});
    store2.update2();
  });

  const store3 = create(Items, { items: generateDraft() });
  bench("update 3", function() {
    store3["@@observable"]().subscribe(() => {});
    store3.update3();
  });
  bench("update 4", function() {
    store3["@@observable"]().subscribe(() => {});
    store3.update4();
  });
});
