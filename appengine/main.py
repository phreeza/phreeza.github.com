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

import gibberish

from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.ext import webapp

from django.utils import simplejson as json

class Pomodoro(db.Model):
  author = db.StringProperty(multiline=False)
  content = db.StringProperty(multiline=False)
  item_type = db.StringProperty(multiline=False)
  date = db.DateTimeProperty(auto_now_add=True)


class MainPage(webapp.RequestHandler):
  def get(self):
      self.redirect("/"+gibberish.gibberish())

class JSONDump(webapp.RequestHandler):
  def get(self):
    self.response.headers['Access-Control-Allow-Origin'] = '*'
    pomodoros = db.GqlQuery("SELECT * "
                            "FROM Pomodoro WHERE author = '%s' "
                            "ORDER BY date DESC LIMIT 10"
                            % self.request.get('author'))
    pomodoro_list = []
    for pomodoro in pomodoros:
      pomodoro_list.append({
          'id':str(pomodoro.key().id()),
          'user':pomodoro.author,
          'content':cgi.escape(pomodoro.content) if pomodoro.content else "",
          'date':pomodoro.date.isoformat(),
          'item_type':(cgi.escape(pomodoro.item_type) if pomodoro.item_type
              else "")
          })
    self.response.out.write(json.dumps(pomodoro_list))

class PomodoroDeleter(webapp.RequestHandler):
  def post(self):
    self.response.headers['Access-Control-Allow-Origin'] = '*'
    pomodoros = db.GqlQuery("SELECT * "
                            "FROM Pomodoro WHERE __key__ = KEY('Pomodoro', %i)"
                            % int(self.request.get('id')))
    pomodoros[0].delete()
    self.redirect('/')

class Rispen(webapp.RequestHandler):
  def post(self):
    pom = Pomodoro()
    self.response.headers['Access-Control-Allow-Origin'] = '*'

    pom.content = self.request.get('content')
    pom.author = self.request.get('author')
    if self.request.get('item_type') in ["pomodoro","break"]:
        pom.item_type = self.request.get('item_type')
    pom.put()
    self.redirect('/')


application = webapp.WSGIApplication([
  ('/', MainPage),
  ('/save', Rispen),
  ('/json', JSONDump),
  ('/delete', PomodoroDeleter)
], debug=True)


def main():
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
