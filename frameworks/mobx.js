const { generateDraft, reducer, MODIFY_FACTOR, MAX } = require("../mock");
const { observable, transaction } = require("mobx");

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
