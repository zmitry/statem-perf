## state management perf profiling

```
                      pathon
          23,091 op/s » create
           2,274 op/s » modify

                      redux
          21,070 op/s » create
           2,553 op/s » modify

                      mobx
              49 op/s » create
          10,289 op/s » shallow wrap
           2,808 op/s » modify
           2,974 op/s » modify transaction
           2,994 op/s » modify transaction shallow

                      effector
           2,760 op/s » create
           2,820 op/s » modify

                      microstates
           2,693 op/s » create
           2,316 op/s » create simple subs
               6 op/s » update
               4 op/s » update 2
               8 op/s » update 3
              14 op/s » update 4
           7,273 op/s » empty call
```
