ckanext-viewhelpers
===================

![Build status](https://travis-ci.org/ckan/ckanext-viewhelpers.svg)

This extension adds a few helper methods that are useful for CKAN's views. It
uses the new Resource View developed in
https://github.com/ckan/ckan/tree/1251-resource-view.

Installation
------------

To use it, simply clone this repository and run ```python setup.py install```.
Then add ```viewhelpers``` to your ```ckan.plugins``` in your CKAN config file.
Make sure you add it before the other plugins that depend on it.

Finally, restart your webserver. The helpers are now available for the other
plugins.

Usage
-----

### Filters

When building a visualization, it's often useful to allow the user to filter
the data shown, so she can focus on what's more important to her.

We defined a filtering scheme inspired on [OpenSpending](//openspending.org).
First I'll explain how it works, and then I'll point you to examples where you
can learn how to use it in your visualizations. Say that you have this dataset:

| Country | Forest area (% of land area) | Year |
| ------- | ---------------------------- | ---- |
| Brazil  | 68.0                         | 1990 |
| Brazil  | 66.2                         | 1995 |
| Brazil  | 64.5                         | 2000 |
| Brazil  | 62.7                         | 2005 |
| Brazil  | 61.4                         | 2010 |
| USA     | 32.4                         | 1990 |
| USA     | 32.6                         | 1995 |
| USA     | 32.8                         | 2000 |
| USA     | 33.0                         | 2005 |
| USA     | 33.2                         | 2010 |
| ...     | ...                          | ...  |

> Source: http://data.worldbank.org/indicator/AG.LND.FRST.ZS/countries

This is just a snippet of the dataset. It has data for every country, from 1980
until 2013. Plotting all this data in a single chart (say a line chart)
wouldn't be very useful. You have to filter.

Our filtering works by adding a `filters` parameter to the URL's query string.
For example, if you wanted to see the data just from Brazil, you'd do:

`?filters=Country:Brazil`

> To keep it short, I'm just showing the query string, but keep in mind that
> there's the whole > URL before that (i.e.
> `http://demo.ckan.org/dataset/world-bank/resource/b395830e-8848-4e18-84b2-43dsaf4359`)

What if I wanted both Brazil and USA (but nothing else)?

`?filters=Country:Brazil|Country:USA`

What if I wanted Brazil and USA, but only on 1990 and 2010?

`?filters=Country:Brazil|Country:USA|Year:1990|Year:2010`

In general, the filters are defined as `Key:Value` pairs separated by `|`
(pipes). If you have multiple filters on the same key, it works as a logical
`OR` (i.e. `Country == "Brazil" OR Country == "USA"`). If you have multiple
filters defined on different keys, it works as a logical `AND` (i.e. `Country
== "Brazil" AND Year == "1990"`).

License
-------

Copyright (C) 2014 Open Knowledge Foundation

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
