import os
import inspect
import mock
import nose.tools
import pylons.config as config

import ckan.plugins as p


class TestViewHelpers(object):
    @classmethod
    def setup_class(cls):
        p.load('viewhelpers')
        cls.plugin = p.get_plugin('viewhelpers')

    @classmethod
    def teardown_class(cls):
        p.unload('viewhelpers')

    def test_get_helpers_should_define_remove_linebreaks(self):
        helpers = self.plugin.get_helpers()
        assert helpers.get('remove_linebreaks') is not None,\
            'Plugin should define "remove_linebreaks" helper'

    def test_remove_linebreaks_removes_linebreaks(self):
        helpers = self.plugin.get_helpers()
        remove_linebreaks = helpers['remove_linebreaks']

        test_string = 'foo\nbar\nbaz'
        result = remove_linebreaks(test_string)

        assert result.find('\n') == -1,\
            '"remove_linebreaks" should remove line breaks'

    def test_remove_linebreaks_casts_into_str(self):
        helpers = self.plugin.get_helpers()
        remove_linebreaks = helpers['remove_linebreaks']

        class StringLike(str):
            pass

        test_string = StringLike('foo')
        result = remove_linebreaks(test_string)

        strType = ''.__class__
        assert result.__class__ == strType,\
            '"remove_linebreaks" casts into str()'
