---
title: Random Number Entropy, Xen, and You
author: Jeff Hagadorn
---
Here at Agora Games, we are strong proponents of cloud computing for a number of reasons. The ability to scale outward quickly in a time of need continuously aids our processes, encouraging rapid growth and timely response when load increases past the threshold of what our infrastructure can handle. As such, we tend to run most of our applications on scalable cloud providers.

Recently, we decided to move one of our older sites to Rackspace Cloud, which is a relative newcomer to the cloud market who uses Xen for their hypervisor of choice. Here at Agora, we use an efficient application stack that consists of NGINX, which proxies back to haproxy, which in turn load balances to many FastCGI app servers on our backend in order to do the heavy PHP lifting in the most efficient way possible. We have been very happy with the results so far.

After deploying this old site on these shiny new cloud hosts, everything appeared to work great. The site was faster than ever, we had brought all of the web server configs up to date (translated from Apache, which was used on the old hardware based servers), and tuned everything to be lightning quick. Finally, the celebrated day to flip the switch came...

...and the site fell flat on its face within seconds.  All of the servers were idle, memory usage was minimal, there were no IO bottlenecks -- we were stumped.

Eventually, we took out an engineer's best friend -- strace. Upon running stracing the php threads, we found that each site load was polling from `/dev/random`, which these days is about as far from a best practice as you can get. Examining the entropy pool, it turned out that it was continuously draining, and waiting to refill, and some old Crypt routines were to blame. We instructed php-mcrypt to use `/dev/urandom` by way of ﻿﻿﻿﻿`MCRYPT_DEV_URANDOM`, and pushed the site live again. Suddenly, all servers went green. Success!

To get down to it, the problem is with Xen and how it's virtual drivers work. Apparently, the virtual drivers do not add to the entropy pool for the system's random number generator, causing the pool to empty extremely quickly. The Xen team has known about this problem for a number of years, however it appears they have not fixed it. Using /dev/urandom, which one should always do anyway, eliminates this problem by providing a nonblocking source for random seeding. Yet more proof that going over old code and fixing bad practice can often prove beneficial. :)
