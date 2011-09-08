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
from google.appengine.ext import webapp

from django.utils import simplejson as json

class Author(db.Model):
    name = db.StringProperty()

class Pomodoro(db.Model):
    author = db.ReferenceProperty(Author,collection_name = 'pomodoros')
    content = db.StringProperty(multiline=False)
    status = db.StringProperty(multiline=False)
    feedback_text = db.StringProperty(multiline=False)
    feedback_rating = db.IntegerProperty()
    item_type = db.StringProperty(multiline=False)
    date = db.DateTimeProperty(auto_now_add=True)


class MainPage(webapp.RequestHandler):
    def get(self):
        self.redirect("/"+gibberish.gibberish())

class JSONDump(webapp.RequestHandler):
    def get(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        authors = db.GqlQuery("SELECT * "
                            "FROM Author WHERE name = '%s' "
                            % self.request.get('author'))
        if authors.count(limit=2) > 0:
            pomodoros = authors[0].pomodoros
            pomodoros.order('-date')
        else:
            pomodoros = []

        pomodoro_list = []

        for pomodoro in pomodoros:
            pomodoro_list.append({
                'id':str(pomodoro.key().id()),
                'user':pomodoro.author.name,
                'content':cgi.escape(pomodoro.content) if pomodoro.content else "",
                'date':pomodoro.date.isoformat(),
                'feedback_rating':(cgi.escape(pomodoro.feedback_rating)
                    if pomodoro.feedback_rating else -1),
                'feedback_text':(cgi.escape(pomodoro.feedback_text)
                    if pomodoro.feedback_text else ""),
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

class PomodoroCreator(webapp.RequestHandler):
    def get(self):
        pom = Pomodoro()
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        try:
            authors = db.GqlQuery("SELECT * "
                                "FROM Author WHERE name = '%s' "
                                % self.request.get('author'))
            pom.author = authors[0]
        except IndexError:
            author = Author()
            author.name = self.request.get('author')
            author.put()
            pom.author = author

        pom.content = self.request.get('content')
        pom.status = "new"
        pom.author.name = self.request.get('author')
        if self.request.get('item_type') in ["pomodoro","break"]:
            pom.item_type = self.request.get('item_type')
        pom.put()
        pomodoro_dict = {
            'id':str(pom.key().id()),
            'user':pom.author.name,
            'content':cgi.escape(pom.content) if pom.content else "",
            'date':pom.date.isoformat(),
            'item_type':(cgi.escape(pom.item_type) if pom.item_type
                else "")
            }
        self.response.out.write(json.dumps(pomodoro_dict))

class AuthorRename(webapp.RequestHandler):
    def get(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        authors = db.GqlQuery("SELECT * "
                            "FROM Author WHERE name = '%s' "
                            % self.request.get('oldname'))
        if authors.count(limit=2) > 0:
            author = authors[0]
            author.name = self.request.get('newname')
            author.put()
        self.redirect('/')

class StatsGetter(webapp.RequestHandler):
    pass

class StatusChanger(webapp.RequestHandler):
    def get(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        pomodoros = db.GqlQuery("SELECT * "
                                "FROM Pomodoro WHERE __key__ = KEY('Pomodoro', %i)"
                                % int(self.request.get('id')))
        pom = pomodoros[0]
        pom.status = "complete"
        pom.feedback_text = self.request.get('feedback_text')
        pom.feedback_rating = int(self.request.get('feedback_rating'))
        pom.put()
        self.redirect('/')


application = webapp.WSGIApplication([
  ('/', MainPage),
  ('/save', PomodoroCreator),
  ('/complete', StatusChanger),
  ('/rename', AuthorRename),
  ('/json', JSONDump),
  ('/delete', PomodoroDeleter)
], debug=True)


def main():
    wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
    main()
