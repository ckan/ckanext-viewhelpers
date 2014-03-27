import ckan.plugins as p


class ViewHelpers(p.SingletonPlugin):
    p.implements(p.ITemplateHelpers)
    p.implements(p.IConfigurer, inherit=True)

    def update_config(self, config):
        p.toolkit.add_resource('public', 'viewhelpers')

    def get_helpers(self):
        return {'remove_linebreaks': _remove_linebreaks,
                'get_filter_values': _get_filter_values}


def _remove_linebreaks(string):
    '''Convert a string to be usable in JavaScript'''
    return str(string).replace('\n', '')


def _get_filter_values(resource):
    ''' Tries to get out filter values so they can appear in dropdown list.
    Leaves input as text box when the table is too big or there are too many
    distinct values.  Current limits are 5000 rows in table and 500 distict
    values.'''

    data = {
        'resource_id': resource['id'],
        'limit': 5001
    }
    result = p.toolkit.get_action('datastore_search')({}, data)
    # do not try to get filter values if there are too many rows.
    if len(result.get('records', [])) == 5001:
        return {}

    filter_values = {}
    for field in result.get('fields', []):
        if field['type'] != 'text':
            continue
        distinct_values = set()
        for row in result.get('records', []):
            distinct_values.add(row[field['id']])
        # keep as input if there are too many distinct values.
        if len(distinct_values) > 500:
            continue
        filter_values[field['id']] = [{'id': value, 'text': value}
                                      for value
                                      in sorted(list(distinct_values))]
    return filter_values
