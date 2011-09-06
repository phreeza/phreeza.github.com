# Based on script by Greg Haskins posted on stackoverflow
# http://stackoverflow.com/questions/5501477/any-python-password-generators-that-are-readable-and-pronounceable/5502875#5502875

import string
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

# you could trow in number combinations, maybe capitalized versions... 

def gibberish():
    return ''.join([
        random.sample(initial_consonants, 1)[0],
        random.sample(vowels, 1)[0],
        random.sample(pre_consonants, 1)[0],
        random.sample(endings, 1)[0]
        ])
