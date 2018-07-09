const { generateDraft, reducer } = require("./mock");
const { observable, transaction } = require("mobx");
const { createStore } = require("redux");
const { createStore: efStore, createEvent: efAction } = require("effector");
const { create } = require("microstates");
const { path } = require("pathon");

const MAX = 1000;
const MODIFY_FACTOR = 0.5;

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
  const data2 = observable(generateDraft());

  bench("modify transaction", function() {
    const mutate = draft => {
      for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
        draft[i].done = Math.random();
      }
    };
    transaction(() => {
      mutate(data2);
    });
  });
  const data3 = observable.array(generateDraft());

  bench("modify transaction shallow", function() {
    const mutate = draft => {
      for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
        draft[i].done = Math.random();
      }
    };
    transaction(() => {
      mutate(data3);
    });
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
    let update = this.items.map(el => el.set(Math.random()));
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
  const store4 = create(Items, { items: generateDraft() });

  bench("update 4", function() {
    store4.items.set(reducer(store3.items.state));
  });
  bench("empty call", function() {
    store3.update4();
  });
});
