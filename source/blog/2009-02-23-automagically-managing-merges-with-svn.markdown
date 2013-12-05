---
title: Automagically Managing Merges with SVN
author: Ola Mork
---
For each Guitar Hero game we have a full trunk/branches/tags structure. Most of the trunks are copied off of their predecessor's trunk. This works pretty well for us, but it can be hairy to merge changes made to the original ( `game-1` ) trunk down to each of its descendants. I found that I was often forgetting to merge to \*all\* of the relevant branches. To mitigate the effects of my amnesia I wrote this, `chmod +x` 'd it and dropped it into my `~/bin` (which happens to be in my `PATH` ):

```ruby
#! /usr/bin/env ruby
repository_host = 'your.svn.repository.host'
working_dirs = ['~/Documents/game-2/trunk',
'~/Documents/game-3/trunk',
'~/Documents/game-4/trunk']

p "usage: $ gh-merge revision [revision revision revision ...]" if ARGV.empty?

ARGV.each do |revision|
  working_dirs.each do |working_dir|
    p "merging #{working_dir}, revision #{revision}"
    `svn merge -c #{revision} \
    svn+ssh://#{repository_host}/agora/game-1/trunk \
    #{working_dir}`
  end
end

working_dirs.each do |working_dir|
  p "committing #{working_dir}"
  `svn ci -m "svn merge -c #{ARGV.join(', ')} \
  svn+ssh://#{repository_host}/agora/game-1/trunk" \
  #{working_dir}`
end
```

The `working_dirs` represent the paths to my working dirs for each branch I want to merge my trunk changes to.

To use I just pass the revisions I want to push to each branch like so:

```
ola$ gh-merge 31774 31775 31780
```

and it merges and commits those revisions to each branch. It assumes you're caching your authentication for svn.
