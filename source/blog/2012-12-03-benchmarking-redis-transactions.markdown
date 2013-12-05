---
title: Benchmarking Redis Transactions
author: David Czarnecki
---
I recently released version 3.0.0 of our [leaderboard](https://github.com/agoragames/leaderboard) library. The library is a semantic wrapper around Redis sorted sets to store and interact with the leaderboard data. When I first released the library, I had put a section in the README on [Performance Metrics](https://github.com/agoragames/leaderboard#performance-metrics). This provided a useful benchmark from which to gauge performance regressions that might be introduced when adding new functionality.

 I re-ran the benchmarks on my MacBook Pro, 2.5 GHz Intel Core i7, 8 GB 1333 MHz DDR3, Mountain Lion 10.8.2, Ruby 1.9.3-p327, Redis 2.6.7, redis gem 3.0.2, Redis persistence disabled.

 By default, the code will [use a Redis transaction to rank a member](https://github.com/agoragames/leaderboard/blob/master/lib/leaderboard.rb#L108-L128) in the leaderboard. This is to accommodate being able to optionally store data alongside the leaderboard. However, in hindsight, the common case may just be ranking (or updating) a  member in the leaderboard without this data.

 Time to insert 10 million records w/ Redis transactions per insert: **23 minutes**

 It seems like Redis transactions, where they're really not needed, is having a performance impact. I removed the transaction parts of the rank_member method in the library temporarily and re-ran the benchmark code.

 Time to insert 10 million records w/o Redis transactions per insert: **13 minutes**

 This number makes more sense to me and is inline with the original benchmark time of 15 minutes accounting for faster hardware, updated Redis version and updated Redis client library. Awhile back, however, I specifically added a few methods to do [bulk insert of member data in a leaderboard](https://github.com/agoragames/leaderboard/blob/master/lib/leaderboard.rb#L221-L242). I modified and re-ran the benchmark code to rank members in the leaderboard, 1 million per transaction.

 Time to insert 10 million records w/ Redis transaction inserting 1 million records at a time: **7 minutes**

 When I initially re-ran the benchmark against the leaderboard 3.0.0 code, it felt slower, but I needed actual numbers to backup that feeling. Now I can benchmark the code again if I decide to add in a conditional to not use a Redis transaction in the rank_member method if optional data is not supplied.

  
