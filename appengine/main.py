#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import cgi
import datetime
import wsgiref.handlers

from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.ext import webapp

from django.utils import simplejson as json

class Pomodoro(db.Model):
  author = db.StringProperty(multiline=False)
  content = db.StringProperty(multiline=False)
  date = db.DateTimeProperty(auto_now_add=True)


class MainPage(webapp.RequestHandler):
  def get(self):
    self.response.out.write("""<html><body>Not implemented.
        </body>
      </html>""")

class JSONDump(webapp.RequestHandler):
  def get(self):
    self.response.headers['Access-Control-Allow-Origin'] = '*'
    pomodoros = db.GqlQuery("SELECT * "
                            "FROM Pomodoro WHERE author = '%s' " 
                            "ORDER BY date DESC LIMIT 10" % self.request.get('author'))
    pomodoro_list = []
    for pomodoro in pomodoros:
      name = pomodoro.author
      pomodoro_list.append({'user':name,'content':cgi.escape(pomodoro.content),'date':pomodoro.date.isoformat()})

    self.response.out.write(json.dumps(pomodoro_list))

class Rispen(webapp.RequestHandler):
  def post(self):
    pom = Pomodoro()
    self.response.headers['Access-Control-Allow-Origin'] = '*'

    pom.content = self.request.get('content')
    pom.author = self.request.get('author')
    pom.put()
    self.redirect('/')


application = webapp.WSGIApplication([
  ('/', MainPage),
  ('/save', Rispen),
  ('/json', JSONDump)
], debug=True)


def main():
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
