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

# memory

```
* just mutate [FLOOR]
  create: 4.07 ms
  update: 41 μs
  heap:
    total 1.6 Mb
    used  1.8 Mb
  rss: 1.6 Mb

* microstates
  create: 4.8 ms
  update: 9.07 s
  heap:
    total 879.8 Mb
    used  826.5 Mb
  rss: 882.7 Mb

* mobx
  create: 197 ms
  update: 1.62 ms
  heap:
    total 8.9 Mb
    used  17.3 Mb
  rss: 8.6 Mb

* mobx shallow
  create: 144 ms
  update: 1.03 ms
  heap:
    total 10.5 Mb
    used  12.9 Mb
  rss: 8.3 Mb

* redux
  create: 31 ms
  update: 440 μs
  heap:
    total 0.0 Mb
    used  1.7 Mb
  rss: -1.4 Mb
```
