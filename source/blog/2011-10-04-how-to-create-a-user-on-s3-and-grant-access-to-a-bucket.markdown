---
title: 'How to: Create a user on S3 and grant access to a bucket '
author: Brian Corrigan
---
In our never ending quest to spend more time on software creation and less time on software administration [Clarke](http://twitter.com/#!/clarkefoley) and [I](http://twitter.com/#!/genexp) moved our content team from a self managed FTP site to an S3 account.

 Besides, administering an FTP site is so 1971.

 It took an hour or two to figure out the proper permissions, so I'm documenting them here for posterity. Read on if you're interested.

1. Login to the S3 management tool and create a bucket. Write down the name!
2. Login to the [Amazon Identity & Access Management](https://console.aws.amazon.com/iam/home) tool and create a group.
3. Create users and add them to the group you created. Write down the secret key and access key for each user.
4. Edit the group and attach a group policy. Here's the one I used.
5. Download [Cyberduck](http://cyberduck.ch/) - It's cross-platform, open source and is simple to setup and use. While you're there donate a few bucks. `{
    "Statement": [
    {
    "Action": [
    "s3:ListAllMyBuckets"
    ],
    "Effect": "Allow",
    "Resource": "arn:aws:s3:::*"
    },
    {
    "Action": "s3:*",
    "Effect": "Allow",
    "Resource": [
    "arn:aws:s3:::my_bucket",
    "arn:aws:s3:::my_bucket/*"
    ]
    }
    ]
    }`
6. Open up Cyberduck, choose Amazon S3 and test using a Secret Key/Access Key pair.

Done!
