from setuptools import setup, find_packages
import sys, os

version = '0.1'

setup(
	name='ckanext-viewhelpers',
	version=version,
	description="Helpers for creating views for CKAN",
	long_description="""\
	""",
	classifiers=[], # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
	keywords='',
	author='Vitor Baptista',
	author_email='vitor.baptista@okfn.org',
	url='https://github.com/ckan/ckanext-viewhelpers',
	license='',
	packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
	namespace_packages=['ckanext', 'ckanext.viewhelpers'],
	include_package_data=True,
	zip_safe=False,
	install_requires=[
		# -*- Extra requirements: -*-
	],
	entry_points=\
	"""
    [ckan.plugins]
	viewhelpers=ckanext.viewhelpers.plugin:ViewHelpers
	""",
)
