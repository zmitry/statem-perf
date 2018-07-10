const { generateDraft, reducer } = require("../mock");
const model = require("parket");
// model returns a "constructor" function
const Model = model("Model", {
  // name is used internally for serialization
  initial: () => ({
    items: []
  }),
  actions: state => ({
    update() {
      state.items = reducer(state.items);
    }
  })
});

suite("parket", () => {
  bench("create", function() {
    const instance = Model({ items: generateDraft() });
  });
  const instance = Model({ items: generateDraft() });

  bench("modify", function() {
    instance.update();
  });
});
