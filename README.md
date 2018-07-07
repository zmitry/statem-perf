## state management perf profiling

```
              pathon
          22,322 op/s » create
           2,380 op/s » modify

                      redux
          41,565 op/s » create
           3,081 op/s » modify

                      mobx
              54 op/s » create
           2,530 op/s » shallow wrap
           2,847 op/s » modify

                      effector
           2,916 op/s » create
           1,867 op/s » modify

                      microstates
           2,466 op/s » create
           2,347 op/s » create simple subs
               6 op/s » update
               4 op/s » update 2
               9 op/s » update 3
           7,852 op/s » update 4
```
