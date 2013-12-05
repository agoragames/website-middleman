---
title: py-amqplib with Large messages
author: Aaron Westendorf
---
At the core of our Hydra platform is AMQP, currently we are using the py-amqplib driver. It has worked well up to this point. We recently had a requirement to send large messages through AMQP, this is where the driver failed us. The following are couple benchmarks and fix to get around the issue.

```python
>>> from amqplib import client_0_8 as amqp
>>> import time

>>> conn = amqp.connection.Connection()
>>> chan = conn.channel()
>>> msg = amqp.Message("1"\*(1048576\*100))
>>> s = time.time(); chan.basic_publish(msg); print time.time() - s
54.5186219215
```

 Most of the 54 seconds above was being used in packing the message. This is caused by the following code:

```python
def write_method(self, channel, method_sig, args, content=None):
  payload = pack('>HH', method_sig[0], method_sig[1]) + args

  self.dest.write_frame(1, channel, payload)

  if content:
    body = content.body
    payload = pack('>HHQ', method_sig[0], 0, len(body)) + \
    content._serialize_properties()

  self.dest.write_frame(2, channel, payload)

  while body: # HH', method_sig[0], method_sig[1]) + args

    self.dest.write_frame(1, channel, payload)

  if content:
    body = content.body
    payload = pack('>HHQ', method_sig[0], 0, len(body)) + \
    content._serialize_properties()

  self.dest.write_frame(2, channel, payload)

  for payload in self._chunk_body(body, self.frame_max - 8):
    self.dest.write_frame(3, channel, payload)
```

 If we run the same test as above with the patched writer_method here is the result:

```python
>>> from amqplib import client_0_8 as amqp
>>> import time

>>> conn = amqp.connection.Connection()
>>> chan = conn.channel()
>>> msg = amqp.Message("1"\*(1048576\*100))
>>> s = time.time(); chan.basic_publish(msg); print time.time() - s
0.23295211792
```
