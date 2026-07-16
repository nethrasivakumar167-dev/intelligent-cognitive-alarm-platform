from unittest.mock import patch

import app.db.session as session_module


def test_build_engine_falls_back_to_sqlite_when_postgres_unavailable():
    class FakeEngine:
        def __init__(self, url, **kwargs):
            self.url = url
            self.kwargs = kwargs

        def connect(self):
            if str(self.url).startswith("postgresql"):
                raise RuntimeError("db down")
            return self

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

    def fake_create_engine(url, **kwargs):
        return FakeEngine(url, **kwargs)

    with patch.object(session_module, "create_engine", side_effect=fake_create_engine):
        engine = session_module._build_engine()

    assert str(engine.url).startswith("sqlite")
