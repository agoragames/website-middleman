---
title: Large files with NGINX, GZip, and SSL
author: Jason LaPorte
---
I ran into an interesting issue today when deploying a crappy password change app I wrote as an exercise in rails. It turns out that by default, NGINX has a gzip buffer size of 4 \* 4k/8k, with the bit size depending on what platform the service is running on.



As a result,

4 \* 4k = 16384 bytes (16KB)
4 \* 8k = 32768 (32KB)

After gzip, when converted to be plain text, the amount of data returned to the browser nearly doubles (about 52KB in the case of larger). The default javascript library included by rails for AJAX (prototype.js) is 127k, which led me to find this limit.

And so, getting to the point, the limit applied to the gzip buffer needs to be increased within NGINX's config files for each site that will use a file larger than these pre-set sizes. You can do so using the following:

  **gzip_buffers 16 8k**

This will set the buffer size to 16 \* 8k, or 128KB -- the uncompressed size of the library, eliminating the issue.

In the future if you find NGINX truncating large files for no apparent reason, this is likely why.

**EDIT** -- In NGINX versions post 0.7.28, the default limit of gzip_buffers has been increased to 32 \* 4 or 16 \* 8 (rounding out to 128K, as noted above) depending on platform. It may be wise to double check any configs you may have to ensure you are not explicitly setting a lesser value, or upgrade NGINX if needed.

