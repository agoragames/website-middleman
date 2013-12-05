---
title: The Postman Always Rings Twice
author: David Czarnecki
---
My colleague [@logankoester](https://twitter.com/#!/logankoester) posed the following question in our team chat room: "Can the Github bot notify HipChat on wiki updates as well? I mean, wikis are just git repos, right? I am equally interested in documentation changes as in software changes."

 It is possible to do this in a little bit of a roundabout way. Read on to see how I did this with [Hudson](http://hudson-ci.org/), our Continuous Integration server.



 - We have the [Jenkins HipChat plugin](https://github.com/jlewallen/jenkins-hipchat-plugin) installed and configured in Hudson.

 - Grab the Wiki Git Access URL for your project, e.g. git@github.com:myorganization/my-project.wiki.git

 - Create a new project in Hudson to monitor the project's Wiki Git repository. Relevant items to setup in the project would be as follows:

 Project name: Identify in the project name that it is the Wiki for your project so as to not be confused with actual project software notifications.

 Source code management: Set to git and use the Wiki Git Access URL for your project here.

 Branches to build: \*\*

 Poll SCM: I set to check every 30 minutes. Example:

 \*/30 \* \* \* \*

In the Post-build actions: check the box for HipChat notification and set the name of the room to the one where notifications on Wiki changes should be sent to.

And you're done! If there are no changes to the wiki since the last poll, you won't get any notices from Hudson. If there are changes to the wiki since the last poll, a notification will be posted to HipChat. Folks can then click the link in Hudson to see the list of changes.

You can find more hilarity over on my Twitter account, [@CzarneckiD](http://twitter.com/czarneckid).
