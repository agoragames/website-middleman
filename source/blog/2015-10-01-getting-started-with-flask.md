---
title: Getting Started With Flask
author: David Czarnecki
---

Over the last year and a half, I've been working with
[Flask](http://flask.pocoo.org/) on a large project.
Flask is a "microframework for Python based on Werkzeug,
Jinja 2 and good intentions." I figured it would be a
good time to distill down some of the knowledge gained in
taking Flask through rapid development and test
iterations.

### Boilerplate

I wanted to choose a starting point with Flask development
that would have sensible defaults and an application
structure that I felt could evolve in a reasonable way as
the application grew in scope from its initial prototype.
Looking at a number of Flask template projects on GitHub,
I finally settled on [Flask Empty](https://github.com/italomaia/flask-empty).
Flask Empty has changed a bit since I first used it as you can
now use cookiecutter to point to the Flask Empty repository on
GitHub, give your project a name, and it will setup the
basic Flask project structure for you.

Flask Empty will setup a number of default environments for
you to start using. I changed their default environment names
from `dev` and `prod` to `development` and `production` and
added a `test` environment. All of that should be pretty
familiar, if but slightly different in your preferred naming
convention.

For the most part, all of our requirements were in the
common requirements file. All other environments merely
included the common requirements file using `-r common.pip`.
In development we included requirements such as
[chai](https://github.com/agoragames/chai), [freezegun](https://github.com/spulec/freezegun), and [honcho](https://github.com/nickstenning/honcho) that we'd use only in testing the application.

### Libraries

As far as libraries used in this application, they're
pretty standard for a JSON API using MySQL with a small
number of asynchronous tasks run via Celery. Of note:

* [Flask-SQLAlchemy](http://flask-sqlalchemy.pocoo.org/2.0/) - For interaction with MySQL
* [SQLAlchemy-Utils](http://sqlalchemy-utils.readthedocs.org/en/latest/index.html) - A collection of useful additions to SQLAchemy
* [Flask-Migrate](http://flask-sqlalchemy.pocoo.org/2.0/) - "SQLAlchemy database migrations for Flask applications using Alembic"
* [Celery](http://www.celeryproject.org/) - "Asynchronous task queue/job queue based on distributed message passing"
* [requests](http://docs.python-requests.org/en/latest/) - A better HTTP library than Python's standard urllib2
* [marshmallow](https://marshmallow.readthedocs.org/en/latest/) - "ORM/ODM/framework-agnostic library for converting complex datatypes, such as objects, to and from native Python datatypes"

Until starting on this project, I was unaware of Python's
support for extra requirements for a project. For example,
in our requirements file, we have the following:

~~~
requests[security]==2.7.0
~~~

This will pull in extra security-related requirements
for the requests library. You can see where this is
defined in the requests `setup.py` [here](https://github.com/kennethreitz/requests/blob/master/setup.py#L71-L73).

### Blueprints

As I knew this application would grow to provide a number
of distinct services with some shared common code, being able
to support a more modular application layout with
[Flask Blueprints](http://flask.pocoo.org/docs/0.10/blueprints/)
made sense. Since this was a JSON API application, there
was no need for views, so the layout and contents of each
blueprint application differs slightly from the boilerplate in
Flask Empty. I changed ours to be as follows:

~~~

/blueprint
    __init__.py
    application.py
    models.py
    serializers.py
    tasks.py
~~~


* `__init__.py` imports the app from the `application.py` file:

~~~python

from .application import app
~~~

* `application.py` contains all of the API methods
* `models.py` has all of the SQLAlchemy models used by the API
* `serializers.py` contains any serializers appropriate for transforming
  models to be serialized to JSON
* `tasks.py` has any specific asynchronous celery tasks used in the blueprint

### Zero Downtime Deploys

As I've had extensive experience running our Ruby applications
under unicorn, I used gunicorn to run this Python application.
We can achieve zero downtime deploys with gunicorn by sending
a USR2 signal to the master process and a QUIT to the old master
process once the new master and workers have been spun up. I
put together a gist detailing [Zero downtime deploys with gunicorn](https://gist.github.com/czarneckid/e657f2e2c8059b9a1395) last year.

The important part of that gist is the `pre_fork` function in
the gunicorn configuration file.

~~~python

def pre_fork(server, worker):
    old_pid_file = '{}/pids/unicorn.pid.oldbin'.format(os.getcwd())

    if os.path.isfile(old_pid_file):
        with open(old_pid_file, 'r') as pid_contents:
            try:
                old_pid = int(pid_contents.read())
                if old_pid != server.pid:
                    os.kill(old_pid, signal.SIGQUIT)
            except Exception as err:
                pass

pre_fork=pre_fork
~~~


You might also want to include the `setproctitle` library
in your requirements so that you can use the `proc_name`
configuration option in gunicorn for better process
discovery.

For example:

~~~

someuser 13617     1  0 Sep25 ?        00:01:15 gunicorn: master [project-name]
someuser 13635 13617  0 Sep25 ?        00:01:23 gunicorn: worker [project-name]
someuser 13637 13617  0 Sep25 ?        00:01:54 gunicorn: worker [project-name]
someuser 13639 13617  0 Sep25 ?        00:01:53 gunicorn: worker [project-name]
~~~

### Transactional Testing with SQLAlchemy

After the project had been in development for about 6
months (maybe longer), it was clear that one bottleneck in
our development process was in testing. Our test suite was
approaching 10 minutes to run the entire suite. We were able
to run individual test files, but we would have to run the
full test suite before pushing our changes up to ensure we
didn't break any of the larger application. Being able to
run individual test files was a band-aid, not a long-term
solution. In the end, we setup our project to use
transactional testing with the database. This meant we were
not dropping and then creating all the database tables each
test. Coming from a Ruby and Rails background where this is
standard practice, I had to set this up to work with the
particulars of our test suite.

There's a page in the SQLAlchemy documentation that
describes this situation, [Joining a Session into an External Transaction (such as for test suites)](http://sqlalchemy.readthedocs.org/en/latest/orm/session_transaction.html?highlight=transaction%20test#joining-a-session-into-an-external-transaction-such-as-for-test-suites). A number of posts I found useful
when developing the particulars for our environment are:

* [Unit testing SQLAlchemy apps](http://alextechrants.blogspot.com/2013/08/unit-testing-sqlalchemy-apps.html)
* [Fast and flexible unit tests with live Postgres databases and fixtures](https://gist.github.com/inklesspen/4504383)
* [Rollback Many Transactions between tests in Flask](http://stackoverflow.com/questions/26224624/rollback-many-transactions-between-tests-in-flask)

The last post there contained the useful tidbit of
knowledge to know that if we have an API call that will
perform a rollback of the current transaction, that we
need to start a nested transaction within the test code.
For example:

~~~python

    def test_something(self):
        # setup code to create some data in the DB
        db.session.begin_nested()
        response = self.client.post(
            '/blueprint/',
            data=json.dumps(dict(key=value)),
            headers=client_key_headers())
        # If the API call results in a rollback, the data
        # in the DB before the begin_nested() call will
        # still be there.
        #
        # All of the database data is cleared at the
        # end of the test.
~~~


By migrating to using transactional testing, I was able
to bring the time to run our full test suite from 10
minutes to around 30 seconds.

~~~

(project-name)@orth ➜  project-name python manage.py -c Test test
........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
----------------------------------------------------------------------
Ran 488 tests in 34.686s

OK
~~~


And for that band-aid for running a single test file,
should you need it:

~~~python

class Test(Command):

    """
    Run tests
    """

    start_discovery_dir = "tests"

    def get_options(self):
        return [
            Option('--start_discover', '-s', dest='start_discovery',
                   help='Directory to look for tests in',
                   default=self.start_discovery_dir),
            Option('--pattern', '-p', dest='pattern',
                   help='Pattern to search for features',
                   default=None)
        ]

    def run(self, start_discovery, pattern):
        import unittest2

        if os.path.exists(start_discovery):
            argv = [config.project_name, "discover"]
            argv += ["-s", start_discovery]

            if pattern:
                pattern = pattern if pattern.endswith(".py") else pattern + ".py"
                print(" *** Filtering by '%s'" % pattern)
                argv += ["-p", pattern]



            unittest2.main(argv=argv)
        else:
            print("Directory '%s' was not found in project root." %
                  start_discovery)
~~~

### Random Tidbits

I did notice that logging of international characters was
throwing errors for us, so I had to add the following to
the boilerplate code that is setup by Flask Empty:

~~~python

def configure_logger(app, config):
    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    # Other logging setup
~~~


For naming our internal decorators, the following convention
was chosen:

~~~python

def decorator_name(api_function):
    @wraps(api_function)
    def decorated_decorator_name_function(*args, **kwargs):
        # Do some useful work
        return api_function(*args, **kwargs)
    return decorated_decorator_name_function
~~~


This made it easier for debugging exceptions that we log
into Sentry when we had multiple decorators being used
around a single API call.

### Conclusion

This is a very high-level dump of some things I learned
using Flask for the past year and change. I might distill
this into a more concrete sample application. However,
I think there are still some useful bits of knowledge
for you to jumpstart your own development with Flask.
