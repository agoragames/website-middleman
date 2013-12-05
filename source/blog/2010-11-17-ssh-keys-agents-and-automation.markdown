---
title: SSH keys, agents, and automation
author: Armando DiCianno
---
The basis of automating tasks with ssh is setting up your ssh-agent to hold your unlocked keys. Basically, this means never having to type in a password more than once. If you frequently ssh into, run commands on, or copy files to a remote machine, typing in a passphrase over and over gets very tedious.

 This post explores integrating one or multiple ssh keys into a normal OS X user session. You'll learn how to create keys, and add them to your OS X Keychain, so you never need to type in your password, after log in, and still have a high level of security.



 The author Rita Mae Brow (or Albert Einstein, as the consensus is still out, it seems) was the first that said, "Insanity is doing the same thing over and over again but expecting different results." This is a quote I was thinking about today, when I automated another task related to SSH that I commonly do manually: mounting a directory on a remote server over SSH on OS X.

 SSH is one of those protocols that has a very mature suite of tools around it. There are so many wonderful, easy things to do or change that make your workflow more efficient if you use SSH. SSH has first class support in GNU/Linux distributions and Mac OSX, and it can be configured readily into a streamlined workflow.

 I use OS X at work, and GNU/Linux on my home machines. This post represents the little bit of learning I had to do to make my nice, automated Linux setup work well on OS X at work. I'm going to go over the basics of ssh key management on OS X in this post, and follow up in another post with mounting a remote directory

* * *
First, you should already be using ssh to log into remote machines! Hopefully, you're already using ssh keys. If not, here's a quick example about how to setup your first key. The username on my machine is ' [fafhrd](http://en.wikipedia.org/wiki/Fafhrd_and_the_Gray_Mouser)', but you should replace that with your own username in the following examples. So, open up Terminal, and ...


 {% gist 703566 %}

 Let's use ssh-add to check the keys in the agent. Note that for some commands, I use the full path. If you're running an install of ssh from [MacPorts](http://www.macports.org/) or [Gentoo Prefix](http://www.gentoo.org/proj/en/gentoo-alt/prefix/), you may have to use the full path as well to get the built-in OS X version; this only matters for adding keys.


 {% gist 703572 %}

 Do you not see any return value? Let's add your key to the agent. In my case, I'm going to add a second key, as well. The following commands will add your keys to the ssh-agent daemon (background process). However, we also want to add the keys to the OS X keychain, so that they're automatically unlocked for you when you log in, so we add the -K flag. This flag does not exist on a stock openssh install, only on the ssh that ships with OS X. Without that flag, the key is only added to the currently running ssh-agent. Note that I'm adding both my keys, and you may just have one. (If your key is already in the keychain, there's no harm adding it again.)


 {% gist 703574 %}

 At this point, it's important to reboot. Alternatively, if you feel comfortable killing all instances of ssh-agent that are running, you may do so, log out, and log back in. After doing either, open Terminal again, and check for your keys.


 {% gist 703576 %}

 Great! keychain automatically unlocked the keys for you. Okay, it's time to try it out! If you haven't copied your public keys to your remote server, you should do so now. Your public key is most likely located at ~/.ssh/id_dsa.pub (or id_rsa.pub). Please be sure to use the .pub file, and not the private key! You will want to append (and not necessarily replace) the public key into the file ~/.ssh/authorized_keys, on the remote side.


 {% gist 703577 %}

 ... and test:


 {% gist 703582 %}

 Nice! The uname command ran on the remote server, and retuned it's data. You should not have been prompted for your password as the credentials are coming straight from your agent.

 So what have you actually accomplished? All commands that can use ssh, bundled with the ssh tools (e.g. scp, sftp) or otherwise (e.g. rsync, git, svn), will now never prompt you for your ssh passphrase. This should speed up your workflow, and allow your to automate more of your work. One caveat, though: make sure to lock your workstation when you leave your desk, if you're in an untrusted environment, as someone can open up Terminal, and log into your remote servers easily. However, for the flexibility this automation provides, it's a worthwhile tradeoff.

 Let's take this one step further. Want to type even less, by avoiding the "myname@" portion of the ssh command? Create or edit ~/.ssh/config to look like the following.


 {% gist 703627 %}

 ... and now test without the "myname@" portion.


 {% gist 703634 %}

 The username piece, for any host that matches \*.fake.com, automatically uses "myname". Wow, there's so much win right there, it brings a tear to my eye.

 In my next post, I'm going to go over mounting remount directories over ssh on OS X. Until then: have fun!
