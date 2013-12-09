---
title: Spelunking into your logs with Splunk
author: Tim Jones
---
At Agora we're experimenting with Splunk as a error collection and reporting tool.  The idea is that all our services will spit out error information to syslog which will be picked up and indexed by Splunk.  Splunk will be configured to display info about recent errors, email summaries of those errors and generally be the starting point for discovering problems with our systems.  In our previous infrastructure error collection and reporting was handled on a per-project basis.  As we're now moving to a more service oriented approach that involves a small number of generic but highly configurable services deployed over a large number nodes we needed something different.  Splunk seems ideal for this.  It accepts a number of different data sources ranging from syslog to raw log files to inputs from random UDP and TCP ports so we can easily integrate with systems we've written and, more importantly, those we haven't.  It also has the summary and reporting capabilities we were looking for so we can chart errors over time periods, dig for trends and see which services are acting up.



 The biggest problem I've had so far while working with Splunk is the documenation.  There are a lot of options and the documentation for those options is spread out over a number of distinct manuals.  Some options are poorly documented or not at all and often it's not clear, even once you've found the proper option, where/how the option should be used.  The following is an attempt to lay out some of those problems I ran into and what the solutions are so you don't have to go looking yourself.  This list will likely continue to grow over the coming weeks and months.

1. **Extracting fields from search results**

 Splunk automatically extracts certain fields from your search results.  This is all well and good but what if you want to pull out your own values?  As an example we stick a field into our syslog output that indicates what service the log entry came from.  This would be extremely handy since we'd then be able to filter out entries for a particular services, build charts with color coding based around the services and so on.  It turns out this is pretty easy.  Although this functionality is mentioned in the 'User Manual' most of the ral documentation for the commands used can be found in the 'Search Manual' (grrrr).  The portion in the User Manual can be found by search for 'Extract fields with search commands'.  For the command information look for 'rex' in the 'Search Commands' section of the Search Reference.Anywho, the trick is in the 'rex' command.  This can be chained onto your search request (something else that was not obvious) like many other Splunk commands:

  
sourcetype="syslog" foo | rex field=_raw "[0-9a-z]{2} err \[(?<service>.\*?)\]"
  

 The rex command takes a regular expression and produces fields based on matches.  The field option specifies which of Splunk's default fields you want to match against (search in the Splunk manuals for 'Use default and internal fields' for a list of all available fields).  The regex in this case matches two alphanumeric characters followed by the string 'err' followed by a service name in brackets.  The ?<service> notation in parentheses indicates a match that should be saved in the 'service' field.

 Once your search has been executed you should see that you can now filter on whatever fields you extracted, create charts with them, etc.
2. **Extracting only those results that have a particular field**

 So you've created a regex to extract certain fields from your result set but the results that don't match your regex are still in the result set.  How do you filter those out?  The solution is actually pretty simple:

    <your_original_search> | rex <your regex> | search your_field="\*"

 Likewise you can find those that didn't match by negating the lookup:

    <your_original_search> | rex <your regex> | search NOT your_field="*"

3. **Changing indices for search**

 By default your searches will only hit the 'main' index.  If you've created your own index it won't be searched by default.  To use your index in a particular search just add it to the search string:

    index=my_index foo NOT bar

 To add your index to the default list so you don't have to modify every search you'll need to modify your roles a bit.  Visit the Roles page in the Manager, select your role (probably user or admin if you haven't made any modifications here, and scroll down to the 'Default indexes' list.
4. **Displaying the body of a message in an event table**

 In our main dashboard we wanted to show a list of the 5 most recent errors.  This actually turned out to be more difficult than you might have expected.  The date, host, and a few other pieces of data showed up fine but for the life of me I couldn't figure out how to get the body of the log message to show up in the table.  There is a special field called _raw for each result but adding that to the table had no effect.  In the end my solution was to create a regexp against my search results that extracted a parameter called 'body'.

 Search:

    sourcetype="syslog" err | rex field=_raw "[0-9a-z]{2} err \[(?<service>.*?)\] (?<body>.*)"

 Event Table:

    <table>
    <title>Most recent service errors</title>
    <searchName>Service errors with body</searchName>
    <option name="count">5</option>
    <fields>_time,host,body</fields>
    </table>

The events table:

![events](uploads/2009/10/events.png)

5. **Changing the default app**

 With a normal install the launcher is the default app.  This gets kind of annoying after a while.  To change it to your own app you can adjust the default_namespace option in $SPLUNK_HOME/etc/apps/user-prefs/local/user-prefx.conf.

    default_namespace = my_app

6. **Email alerts**

 Email alerts are built around scheduled searches.  When saving or editing a search you're given the option to provide a schedule for it.  Change this option so that the search is run on some interval and additional options will appear including one to send an email alert.  Additionally you can modify the search to only include a certain time range.  These features are very handy when used in combination.  Schedule your search to run every 30 minutes and adjust the start time to -30m and you'll get alerts about all errors that occurred during that time.

 Mail settings themselves can be found in Manager -> Email alert settings.
7. **Stacked time-based charts**

 Took me a while to sort out this one.  The first thing you need to do is group your data into larger time periods.  If you have one column for each second your graph is going to be pretty useless.  Instead you should consolidate your data into large groups such as one per minute or one per hour.  I've found that dividing your time range by roughly 30 gives the best graphs.  To actually perform this grouping you need to add the 'span' option to your search:

    sourcetype="syslog" foo NOT bar | timechart span=1h count

 This will produce a count of all the items containing foo and not bar for syslog in intervals of one hour.

 Next you need to stack the resulting groups.  Annoyingly this is done at the view layer.  In my case I was adding it to my dashboard.  The relevant lines looked similar to the following:

    <chart>
    <searchName>Service errors in the last 24 hours</searchName>
    <title>Service errors in the last 24 hours</title>
    <option name="charting.chart">column</option>
    <option name="charting.chart.stackMode">stacked</option>
    </chart>

 There is a reference for all these options in the Splunk docs.  Search for 'Custom charting configurations'.

 The end result looks something like this:

 ![errors](uploads/2009/10/errors.png)

8. **Edit everything manually**

 The Splunk Manager interface is rather clunky (not entirely the developer's fault, there are a lot of interdependent options) so after a while you'll likely get sick of it.  That's perfectly fine.  All the options are written out to config files per app.  All your changes are written out to $SPLUNK_HOME/etc/apps/<your_app>/local and override those options in $SPLUNK_HOME/etc/apps/<your_app>/default.  The default directory can be used as a handy reference for available options as well.  Note that some system wide options such as indices and roles are written out to $SPLUNK_HOME/etc/system/local.
9. **Don't delete the 'user' role**

 If you do you'll be sad as it breaks everything.  I'd attempted to remove the role and replace it with our own modified version.  The result was that every page I visited gave me a "Client not authorized" error.  To resolve the problem delete the 'disabled = 1' line from $SPLUNK_HOME/etc/system/local/authorize.conf.
10. **Adding output to syslog(-ng)**

 As mentioned previously our Splunk setup is largely based on syslog but because we want to have raw syslog files in addition to having them indexed by Splunk we allow syslog to write the logs to disk and then have Splunk watch the created files.  Some information such as facility and log level get lost during this process with most default syslog configurations.  To resolve this we did a little bit of reconfiguring to our syslog installs.First, it's important to note that we actually use syslog-ng rather than vanilla syslog.  Syslog-ng has some handy options for templating output as of 1.5.3.  For each destination you can specify a template function:

    destination df_syslog { file("/var/log/syslog" template("$FULLDATE $FULLHOST $TAG $LEVEL $MESSAGE\n") template_escape(no)); };

 FULLDATE includes the year in the timestamp.  FULLHOST provides the hostname.  TAG is a hex encoding of the facility and level.  $LEVEL is a text representation of the level.  $MESSAGE is obviously just the message.  The template_escape(no) directive says that quotes should not be escaped.  Also note the newline at the end of the template.  Without it your output will be rather unreadable.

 And for reference the default appears to be similar to:

    "$DATE $FULLHOST $MESSAGE\n" template_escape(no)
