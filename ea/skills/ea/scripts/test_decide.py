import copy
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import urllib.error
import decide

OBS = {"scope": "fixture", "goal": "Open composer", "state": "Composer link visible",
       "actions": {"open_composer": "Open composer"}}


def response(choice="open_composer", confidence=.95):
    return {"model": "jev-test", "answers": {"next_action": {
        "type": "choice", "choice": choice, "confidence": confidence}},
        "usage": {"input_tokens": 100, "output_tokens": 10}}


class DecisionTests(unittest.TestCase):
    def test_valid_input(self):
        self.assertEqual(decide.payload(OBS, "fixture")["model"], "typesafe/jev")

    def test_reject_bad_inputs(self):
        for key, value in [("scope", "other"), ("goal", ""), ("state", "x" * 5001),
                           ("actions", {"done": "bypass"}), ("actions", {"x": ""}),
                           ("actions", {"$(run)": "execute"}), ("actions", [])]:
            with self.subTest(key=key, value=str(value)[:20]):
                obs = {**OBS, key: value}
                with self.assertRaises(ValueError):
                    decide.payload(obs, "fixture")

    def test_envelopes(self):
        value = response()
        for raw in [value, {"result": value}, {"result": {"state": "Completed", "result": value}}]:
            result = decide.parse(raw, OBS["actions"])
            self.assertEqual(result["action"], "open_composer")
            self.assertFalse(result["executed"])

    def test_malformed_provider_values(self):
        for raw in [None, [], {"result": None}, {"result": []}, {"answers": []},
                    {"answers": {"next_action": []}}, {"result": {"state": "Running"}},
                    {"success": False, "result": response()}]:
            self.assertEqual(decide.parse(raw, OBS["actions"])["action"], "escalate")

    def test_invalid_confidence_and_actions(self):
        for confidence in [True, None, "1", -.1, .84, 1.1, float("nan"), float("inf"), 10**1000]:
            self.assertEqual(decide.parse(response(confidence=confidence), OBS["actions"])["action"], "escalate")
        for choice in ["run_shell", [], None]:
            self.assertEqual(decide.parse(response(choice=choice), OBS["actions"])["action"], "escalate")

    def test_done_does_not_execute(self):
        self.assertFalse(decide.parse(response("done"), OBS["actions"])["executed"])

    def test_budget_and_repeat_persist(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "ledger.json"
            decide.reserve(path, OBS, 2)
            with self.assertRaisesRegex(ValueError, "repeated"):
                decide.reserve(path, OBS, 2)
            decide.reserve(path, {**OBS, "state": "Another state"}, 2)
            with self.assertRaisesRegex(ValueError, "budget"):
                decide.reserve(path, {**OBS, "state": "Third state"}, 2)
            self.assertEqual(len(json.loads(path.read_text())["attempts"]), 2)
            self.assertNotIn("Composer link visible", path.read_text())

    def test_task_mismatch(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "ledger.json"
            decide.reserve(path, OBS, 4)
            with self.assertRaisesRegex(ValueError, "mismatch"):
                decide.reserve(path, {**OBS, "goal": "Different task"}, 4)

    def test_provider_error_does_not_retry(self):
        with patch("urllib.request.OpenerDirector.open", side_effect=urllib.error.URLError("secret")) as opener:
            result = decide.decide(decide.payload(OBS, "fixture"), OBS["actions"], "a" * 32, "test")
            self.assertEqual(result["action"], "escalate")
            self.assertEqual(opener.call_count, 1)
            self.assertNotIn("secret", json.dumps(result))

    def test_no_credential_redirect(self):
        self.assertIsNone(decide.NoRedirect().redirect_request(None, None, 302, "", {}, "https://other.example"))


if __name__ == "__main__":
    unittest.main()
