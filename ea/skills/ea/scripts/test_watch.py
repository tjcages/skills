import unittest
from watch import compare

class WatchTests(unittest.TestCase):
    def test_reviewed_and_unchanged_are_quiet(self):
        row = {'id': 'one', 'sha': 'a', 'reviewed_sha': 'a'}
        self.assertEqual(compare([row], []), [])
        self.assertEqual(compare([dict(row, sha='b')], [dict(row, sha='b')]), [])

    def test_new_revision_and_errors_report(self):
        row = {'id': 'one', 'sha': 'b', 'reviewed_sha': 'a'}
        self.assertEqual(compare([row], []), [row])
        error = {'id': 'one', 'error': 'unavailable'}
        self.assertEqual(compare([error], [error]), [error])

    def test_recovery_does_not_hide_new_revision(self):
        row = {'id': 'one', 'sha': 'b', 'reviewed_sha': 'a'}
        self.assertEqual(compare([row], [{'id': 'one', 'error': 'failed'}]), [row])
