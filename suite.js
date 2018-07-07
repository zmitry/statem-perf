const { generateDraft } = require("./mock");
const { observable } = require("mobx");
const { createStore } = require("redux");
const { createStore: efStore, createEvent: efAction } = require("effector");
const { create } = require("microstates");
const { path } = require("pathon");

const MAX = 1000;
const MODIFY_FACTOR = 0.5;

const reducer = (draft = generateDraft()) => {
  const newDraft = draft.concat([]);
  for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
    newDraft[i] = Object.assign({}, newDraft[i], { done: Math.random() });
  }
  return newDraft;
};

suite("pathon", function() {
  bench("create", function() {
    const pRoot = path("root", generateDraft());
    pRoot.watch(() => {});
  });

  const pRoot = path("root", generateDraft());
  pRoot.watch(() => {});

  bench("modify", function() {
    for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
      pRoot
        .path(i)
        .path("done")
        .set(Math.random());
    }
  });
});

suite("redux", function() {
  bench("create", function() {
    const store = createStore((d = null) => d, generateDraft());
    store.dispatch({ type: "any" });
  });

  const store = createStore(reducer);

  bench("modify", function() {
    store.subscribe(() => {});
    store.dispatch({ type: "init" });
  });
});

suite("mobx", function() {
  bench("create", function() {
    observable.array(generateDraft());
  });

  bench("shallow wrap", function() {
    observable.array(generateDraft(), { deep: false });
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
    const store = create(Items, { items: generateDraft() });
  });

  bench("create simple subs", function() {
    const store = create(Items, { items: generateDraft() });
    store["@@observable"]().subscribe(() => {});
  });

  const store = create(Items, { items: generateDraft() });
  bench("update", function() {
    store.update();
  });
  const store2 = create(Items, { items: generateDraft() });
  bench("update 2", function() {
    store2.update2();
  });

  const store3 = create(Items, { items: generateDraft() });
  bench("update 3", function() {
    store3.update3();
  });
  bench("update 4", function() {
    store3.update4();
  });
});
