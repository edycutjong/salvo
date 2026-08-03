# Salvo — developer harness. OFFLINE is the always-green, zero-credential path.
PY := .venv/bin/python

.PHONY: help sync lint test e2e security-scan ci

help:
	@echo "Salvo make targets:"
	@echo "  make sync           # uv sync --extra dev"
	@echo "  make lint           # ruff check ."
	@echo "  make test           # pytest (OFFLINE)"
	@echo "  make e2e            # boot the API + probe /healthz"
	@echo "  make security-scan  # pip-audit dependency scan"
	@echo "  make ci             # lint + test (the CI hard gate, locally)"

sync:
	uv sync --extra dev

lint:
	ruff check .

test:
	OFFLINE=1 $(PY) -m pytest

e2e:
	@echo "🎭 API E2E: boot uvicorn, probe /healthz..."
	OFFLINE=1 $(PY) -m uvicorn app.main:app --port 8000 & \
	  SERVER_PID=$$!; sleep 3; \
	  curl -fsS http://127.0.0.1:8000/healthz && echo " ✅ healthz"; \
	  kill $$SERVER_PID

security-scan:
	@echo "=== PIP AUDIT ==="
	$(PY) -m pip install --quiet pip-audit && $(PY) -m pip_audit || true

ci: lint test
	@echo "✅ Local CI hard gate green"
