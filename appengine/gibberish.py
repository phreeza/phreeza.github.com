# Based on script by Greg Haskins posted on stackoverflow
# http://stackoverflow.com/questions/5501477/any-python-password-generators-that-are-readable-and-pronounceable/5502875#5502875

import string
import itertools
import random

initial_consonants = (set(string.ascii_lowercase) - set('aeiou')
                      # remove those easily confused with others
                      - set('qxc')
                      # add some crunchy clusters
                      | set(['bl', 'br', 'cl', 'cr', 'dr', 'fl',
                             'fr', 'gl', 'gr', 'pl', 'pr', 'sk',
                             'sl', 'sm', 'sn', 'sp', 'st', 'str',
                             'sw', 'tr'])
                      )

pre_consonants = (set(string.ascii_lowercase) - set('aeiou')
                    # confusable
                    - set('qxcsj')
                    # crunchy clusters
                    | set(['ct', 'ft', 'mp', 'nd', 'ng', 'nk', 'nt',
                           'pt', 'sk', 'sp', 'ss', 'st'])
                    )

vowels = 'aeiou' # we'll keep this simple

endings = set(['ist','er','on','ette','ian','or'])

# each syllable is consonant-vowel-consonant "pronounceable"
syllables = map(''.join, itertools.product(initial_consonants,
                                           vowels,
                                           pre_consonants,
                                           endings))

# you could trow in number combinations, maybe capitalized versions... 

def gibberish(wordcount, wordlist=syllables):
    return ' '.join(random.sample(wordlist, wordcount))
