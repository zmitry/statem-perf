const { generateDraft, reducer } = require("./mock");
const { createStore: efStore, createEvent: efAction } = require("effector");
const { path } = require("pathon");

const MAX = 1000;
const MODIFY_FACTOR = 0.5;

// require("./frameworks/parket");
require("./frameworks/redux");
require("./frameworks/mst");
require("./frameworks/mobx");

suite("noop", function() {
  bench("create", function() {
    generateDraft();
  });

  const sta = generateDraft();
  bench("modify", function() {
    reducer(sta);
  });
});
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
