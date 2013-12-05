---
title: 'SSH on OS X: mounting a remote directory easily'
author: Armando DiCianno
---
There are many things you can do quickly, and easily, once you have your ssh keys automatically added to your keychain on OSX. One of the more fun things is using MacFUSE to allow you to automatically mount a directory on a remote machine, as if it was a remote share in Finder. This post will show you how.



 **CAVEAT**: before attempting the steps in this post, please reference [my last post](http://blog.agoragames.com/2010/11/17/ssh-keys-agents-and-automation/) about how to setup your ssh keys on OS X.

* * *
First, dowload and install [MacFuse](http://code.google.com/p/macfuse/) if you don't have it yet. You may have it if you've installed 3rd party products like VMware. A good place to check is System Preferences — if you see a control panel for it, click on it, and if it's above version 2.0, then you're good to go. You can download MacFUSE [here](http://code.google.com/p/macfuse/downloads/list), if you don't have it yet.

 For the rest of this document, I've generally followed the instructions laid out [here](http://code.google.com/p/macfuse/wiki/MACFUSE_FS_SSHFS), which you may want to referenced.

 Run the following sequence of commands in Terminal. Note that you can change the location of "MYDIR", to a spot you prefer. You will need Subversion (svn) installed. The installation of svn is beyond the scope of this post, but consider installing it via [MacPorts](http://www.macports.org/). **UPDATE**: It was pointed out to me that subversion actually ships with OS X, at /usr/bin/svn, so you probably have it installed already.

 {% gist 705731 %}

 That was pretty straightforward. Now you're ready to test mounting the remote directory. You're going to need a remote server that you can already ssh into. I use the Bash variables VOLNAME and SRVNAME as the name of the folder I want to create locally, and the remote server name, respectively. You'll need to edit these to your liking and needs.

 {% gist 705741 %}

 Awesomesauce, looks like everything worked. Now, let's automate things a bit, and make a little GUI app that you can click on to mount the share in AppleScript. I've not made this AppleScript too advanced, so make sure to use the fully expanded commands from above. Open "AppleScript Editor", and enter the following code.

 {% gist 705745 %}

 After you've entered that code into "AppleScript Editor", you're going to want to save it twice.
- Save As -> File Format: Script , for reference.
- Save As -> File Formar: Applicaiton (to run)

Save the application version to somewhere handy for you, such as your Desktop.

 For extra bonus points, here's what I do:
- Find a small image, via screen shot, or otherwise, and save it to your Desktop.
- Open the image in Preview, Select All, and Copy.
- Context-click on your AppleScript-saved-as-Application, and select "Get Info"
- Click once on the small icon at the top of the pane that opens.
- Paste.
... and _voilà!_, you have a handy, easily referencable application-type icon, that you can click on to mount your remote share.
Enjoy, my friends!
