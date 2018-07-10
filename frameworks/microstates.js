const { generateDraft, reducer, MAX, MODIFY_FACTOR } = require("../mock");
const { create } = require("microstates");

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
