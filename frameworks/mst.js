const { types } = require("mobx-state-tree");
const { generateDraft, reducer } = require("../mock");
// declaring the shape of a node with the type `Todo`
const TreeNode = types.map(
  types.union(types.late(() => TreeNode), types.frozen)
);
const Items = types
  .model("Items", {
    items: types.array(
      types.model({
        todo: types.string,
        done: types.boolean,
        someThingCompletelyIrrelevant: types.array(types.number)
      })
    )
  })
  .actions(state => ({
    update() {
      reducer(state.items);
    }
  }));
// creating a tree based on the "Todo" type, with initial data:

suite("mst", function() {
  bench("create", function() {
    const store = Items.create({ items: generateDraft() });
  });
  const store = Items.create({ items: generateDraft() });

  bench("modify", function() {
    store.update();
  });
});
