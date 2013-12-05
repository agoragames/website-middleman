---
title: Porting Legacy Applications to Modern Systems
author: Jason LaPorte
---
_(Or, an adventure in pain!)_

 Let me preface this little article by saying I did **not** write the app I am now porting to our new network. I know noting about its specific intricacies, and furthermore, I know nothing specifically about gettext, file_column, or attachment_fu. So, I dove into this project with a sort of wanton abandon that is fairly characteristic of much of the work I do. Any obviously stupid mistakes below thus really happened.

 Let me also preface this with the fact that this Rails app is old. Version 1.2.3 old. So, as always, YMMV.

 Finally, I really wish attachment_fu had proper documentation.
## Installing GetText 1.10.0
We don't really like GetText around here, but, at the time, it was the only option. Getting it running off of a local copy (so I wouldn't have to pollute other projects with it) was less difficult than I expected. Go to your vendor/gems directory and issue:
gem unpack gettext
 This assumes you have gettext 1.10.0 installed locally. I think adding a VERSION=1.10.0 will handle it if you have multiple gettext versions laying around. After that, I merely needed to add the following to config/environment.rb to make sure the gem loaded:
GETTEXT_GEM_DIR = "#{File.expand_path(RAILS_ROOT)}/vendor/gems/gettext-1.10.0"
 $LOAD_PATH.reject { |path| path =~ /gettext/ }
 $LOAD_PATH << GETTEXT_GEM_DIR
 $LOAD_PATH << File.join(GETTEXT_GEM_DIR, 'lib')
 $LOAD_PATH << File.join(GETTEXT_GEM_DIR, 'ext', 'gettext')
 require File.join(GETTEXT_GEM_DIR, 'lib', 'gettext.rb')
 Ta-da!
## Replacing File_Column With Attachment_Fu
After doing the above and booting up a test server, I get the following fun error:
no such file to load -- RMagick
 There is no way I am ever installing RMagick onto our nice, new, beautiful infrastructure. I want things done right, here. I also don't want to have to be paranoid about memory leaks, especially for legacy applications. So, we have to get rid of it.

 This problem is caused by our use of file_column, an old-but-effective way of easily adding file uploading support into a Rails app. The modern _de facto_ standard for this seems to be attachment_fu, which uses the much-better-designed ImageScience instead of RMagick.

 So, let's gut this fish.
### Remove File_Column.

$ svn rm vendor/plugins/file_column
### Install ImageScience.

$ sudo apt-get -y install libfreeimage3 libfreeimage-dev
 $ sudo gem install image_science
### Install Attachment_Fu.

$ script/plugin install http://svn.techno-weenie.net/projects/plugins/attachment_fu/
 After installing attachment_fu, I powered back up script/server to check the next fun error:
undefined method `file_column' for Clan:Class
 This is expected: file_column is gone, so the app can't possibly know what a file_column is. Now, we have to get into the nitty-gritty of tweaking the app.
### Adapting the Application to Attachment_Fu.
Let's start in app/models/clan.rb, to which I was directed by the aforementioned error:
$ grep file_column app/models/clan.rb
 No output. The words file_column don't appear in that class. Not what I expected.

 In the time-honored tradition of killing a cockroach with a shotgun, I then turned my sights on the entire app directory:
$ grep -R file_column app
 The only results that turn up happen to be in app/views, leaving me perplexed. A quick conversation with the project lead informs me that this application uses "skeletons", or appable_plugins, which was an absolutely horrible idea that we thankfully no longer use. In essence, it allows you to wrap pieces of functionality into a self-contained plugin, which is duck-punched onto your application when it starts. It is great from a code-reuse perspective, but horrible from a KISS and maintenance standpoint, which is why we no longer use it.

 Except that every now and again, it comes back to bite you in the ass when you least expect it.

 Anyway, checking the skeletons quickly turns up what I am looking for:
$ grep -R file_column vendor/skeletons/clan_skeleton
 vendor/skeletons/clan_skeleton/app/models/clan.rb: file_column :avatar_image, :magick => { :size => "64x64!"}
 So, there is where I have to make the first incision. I changed it as follows:
# file_column :avatar_image, :magick => { :size => "64x64!"}
 # validates_filesize_of :avatar_image, :in => 0..40.kilobytes

 has_attachment :content_type => :image,
 :storage => :file_system,
 :max_size => 40.kilobytes,
 :resize_to => '64x64!'

 validates_as_attachment
 Time to restart the server and try again. (I don't honestly expect it to work: there are (at least!) a lot of views that use file_column methods. It is easiest to just hack at them one at a time until everything works, though!)

 I spent the next couple hours digging through the innards of attachment_fu, only to discover that I had written :filesystem, above, instead of :file_system (note the underscore). Make sure you spell things correctly, people, or you'll be in for a world of self-induced hurt. (The above snippet shows things the correct way, so you, my beloved internet, won't inadvertently copy-and-paste yourself into hell.)

 Once I had properly spelled everything, though, I met with success: the front page of the site loaded! Clicking on just about anything yielded a failure, as anticipated:
undefined method `url_for_file_column' for #<#<Class:0x7f7d7f3006c0>:0x7f7d7f300670>
 The views didn't work, but the fix wasn't horrible. Generally speaking, I simply searched and replaced the following:
url_for_file_column(X, 'avatar_image')
 with:
X.public_filename
 Also, along with this, I modified the clan table's SQL schema to accomodate attachment_fu:
ALTER TABLE clans CHANGE avatar_image filename VARCHAR(255) DEFAULT NULL;
 ALTER TABLE clans ADD (content_type VARCHAR(255) DEFAULT NULL,
 size INT DEFAULT NULL,
 width INT DEFAULT NULL,
 height INT DEFAULT NULL);
 Thankfully, this was pretty easy to do, since the clans table was very small for this particular title. If it were larger, I would create a separate table and do a
SELECT \* FROM clans INSERT INTO clans_temp
 sort of thing. (Yes, I know that it is very evil to hack the SQL directly instead of using migrations. This app is sufficiently old that I cannot guarantee that its migrations even work; I'm already spending a lot of time trying to port this app, I don't want to spend much more trying to make it perfect. If it weren't a legacy application, however, I would do things a bit more cleanly.)

 At this point, virtually everything on the site worked. Avatars (once moved to the proper new directories) showed up just fine. The only remaining error came from trying to upload a new avatar image. Solving this essentially boiled down to a complex series of hacks to blend attachment_fu into the remainder of the existing codebase; none of which were particularly complex or interesting (generally involving changing the names a form parameters from the previous :avatar_image to the new :uploaded_data, like this:)
<%#= file_column_field 'clan', 'avatar_image' %>
 <%= file_field_tag :uploaded_data %>
 Doing all this left me with one final application error, received when actually performing the file upload:
Content type is not included in the list
 content type can't be blank
 Validations are complaining. After tinkering with attachment_fu's code for a while, I discover that there is a method that attachment_fu adds to your ActiveRecords (uploaded_data=), which sets content_type and other miscellaneous variables. And, clearly, this wasn't getting called.

 Turns out I was getting bitten by multipart forms. By tossing a quick
puts params.inspect
 into the code, I quickly saw where my problem lay. Notice the following bit from our clans controller's update method:
@clan.update_attributes(params[:clan])
 Unfortunately for me, the uploaded data is in params[:uploaded_data], and not in params[:clan][:uploaded_data]. While there's a cleaner fix, the following hack suits our purposes fine and allows me to finish up this 20-hour hackfest:
params[:clan][:uploaded_data] = params[:uploaded_data]
 So, after all of this code mangling, we finally had our app ready to move to a new, lighter-weight infrastructure, ultimately saving us money. A very frustrating few days, but they will pay for themselves. All that remains is integrating into a new infrastructure, and switching over the DNS.
