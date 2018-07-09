//@flow

const { test, beforeAll, afterAll } = require("./benchmark");
const { generateDraft, MAX, MODIFY_FACTOR, reducer } = require("./mock");
const { create } = require("microstates");

afterAll(results => {
  const { printResults } = require("./printResults");
  printResults(results);
});

module.exports.generateDraft = generateDraft;

test("just mutate", prepared => {
  const draft = generateDraft();
  prepared();
  for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
    draft[i].done = true;
  }
  return draft;
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
test("microstates", split => {
  const store = create(Items, { items: generateDraft() });
  split();
  store["@@observable"]().subscribe(() => {});
  return store.update();
});

test("mobx", prepared => {
  const { observable } = require("mobx");
  const data = observable(generateDraft());
  prepared();

  const mutate = draft => {
    for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
      draft[i].done = true;
    }
  };
  mutate(data);
  return data;
});
test("mobx shallow", prepared => {
  const { observable } = require("mobx");
  const data = observable.array(generateDraft());
  prepared();

  const mutate = draft => {
    for (let i = 0; i < MAX * MODIFY_FACTOR; i++) {
      draft[i].done = true;
    }
  };
  mutate(data);
  return data;
});

test("redux", prepared => {
  const { createStore } = require("redux");
  const state = generateDraft();

  const store = createStore(reducer, state);
  store.subscribe(() => {});
  prepared();
  store.dispatch({ type: "init" });
  return store;
});
