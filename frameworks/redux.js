const { generateDraft, reducer } = require("../mock");
const { createStore } = require("redux");
suite("redux", function() {
  const id = (d = null) => d;
  bench("create", function() {
    const store = createStore(id, generateDraft());
    store.dispatch({ type: "any" });
  });
  const store = createStore(reducer);
  bench("modify", function() {
    store.subscribe(() => {});
    store.dispatch({ type: "init" });
  });
});
