## state management perf profiling
```
                      redux
          20,904 op/s » create
          16,397 op/s » modify complex reducer
           1,806 op/s » modify complex reducer rec
       1,555,098 op/s » modify simple

                      mobx
              41 op/s » create
           2,319 op/s » shallow wrap
           2,164 op/s » modify

                      effector
           2,782 op/s » create
           2,828 op/s » modify

                      microstates
           2,242 op/s » create
           1,635 op/s » create simple subs
               6 op/s » update
               4 op/s » update 2
               9 op/s » update 3
           4,560 op/s » update 4
```
