from httpx import AsyncClient

API_KEY = "change-me-in-production"
HEADERS = {"X-API-Key": API_KEY}


async def test_health_no_auth(client: AsyncClient):
    resp = await client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


async def test_unauthorized_no_key(client: AsyncClient):
    resp = await client.get("/api/v1/loads")
    assert resp.status_code == 401


async def test_unauthorized_wrong_key(client: AsyncClient):
    resp = await client.get("/api/v1/loads", headers={"X-API-Key": "wrong"})
    assert resp.status_code == 401


async def test_get_loads_returns_available_only(client: AsyncClient):
    resp = await client.get("/api/v1/loads", headers=HEADERS)
    assert resp.status_code == 200
    data = resp.json()
    # TEST-003 is "booked", so only 2 available loads
    assert data["total"] == 2
    assert len(data["loads"]) == 2
    for load in data["loads"]:
        assert load["status"] == "available"


async def test_get_loads_filter_origin(client: AsyncClient):
    resp = await client.get("/api/v1/loads", headers=HEADERS, params={"origin": "chicago"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["loads"][0]["load_id"] == "TEST-001"


async def test_get_loads_filter_destination(client: AsyncClient):
    resp = await client.get("/api/v1/loads", headers=HEADERS, params={"destination": "miami"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["loads"][0]["load_id"] == "TEST-002"


async def test_get_loads_filter_equipment_type(client: AsyncClient):
    resp = await client.get("/api/v1/loads", headers=HEADERS, params={"equipment_type": "reefer"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["loads"][0]["equipment_type"] == "Reefer"


async def test_get_loads_no_results(client: AsyncClient):
    resp = await client.get("/api/v1/loads", headers=HEADERS, params={"origin": "nonexistent"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 0
    assert data["loads"] == []


async def test_get_loads_pagination(client: AsyncClient):
    resp = await client.get("/api/v1/loads", headers=HEADERS, params={"limit": 1, "offset": 0})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["loads"]) == 1
    assert data["total"] == 2

    resp2 = await client.get("/api/v1/loads", headers=HEADERS, params={"limit": 1, "offset": 1})
    data2 = resp2.json()
    assert len(data2["loads"]) == 1
    assert data2["loads"][0]["load_id"] != data["loads"][0]["load_id"]


async def test_get_load_by_id(client: AsyncClient):
    resp = await client.get("/api/v1/loads/TEST-001", headers=HEADERS)
    assert resp.status_code == 200
    load = resp.json()
    assert load["load_id"] == "TEST-001"
    assert load["origin"] == "Chicago, IL"


async def test_get_load_not_found(client: AsyncClient):
    resp = await client.get("/api/v1/loads/NONEXISTENT", headers=HEADERS)
    assert resp.status_code == 404


async def test_get_all_loads_includes_all_statuses(client: AsyncClient):
    resp = await client.get("/api/v1/loads/all", headers=HEADERS)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 3
    statuses = {load["status"] for load in data["loads"]}
    assert "available" in statuses
    assert "booked" in statuses


async def test_get_all_loads_filter_by_status(client: AsyncClient):
    resp = await client.get("/api/v1/loads/all", headers=HEADERS, params={"status": "booked"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["loads"][0]["status"] == "booked"


async def test_create_load(client: AsyncClient):
    payload = {
        "load_id": "NEW-001",
        "origin": "Seattle, WA",
        "destination": "Portland, OR",
        "pickup_datetime": "2026-04-15T08:00:00Z",
        "delivery_datetime": "2026-04-16T08:00:00Z",
        "equipment_type": "Flatbed",
        "loadboard_rate": 1500.00,
    }
    resp = await client.post("/api/v1/loads", headers=HEADERS, json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["load_id"] == "NEW-001"
    assert data["origin"] == "Seattle, WA"
    assert data["status"] == "available"


async def test_create_load_duplicate(client: AsyncClient):
    payload = {
        "load_id": "TEST-001",
        "origin": "Seattle, WA",
        "destination": "Portland, OR",
        "pickup_datetime": "2026-04-15T08:00:00Z",
        "delivery_datetime": "2026-04-16T08:00:00Z",
        "equipment_type": "Flatbed",
        "loadboard_rate": 1500.00,
    }
    resp = await client.post("/api/v1/loads", headers=HEADERS, json=payload)
    assert resp.status_code == 409


async def test_delete_load(client: AsyncClient):
    resp = await client.delete("/api/v1/loads/TEST-001", headers=HEADERS)
    assert resp.status_code == 200
    assert "deleted" in resp.json()["message"]

    resp2 = await client.get("/api/v1/loads/TEST-001", headers=HEADERS)
    assert resp2.status_code == 404


async def test_delete_load_not_found(client: AsyncClient):
    resp = await client.delete("/api/v1/loads/NONEXISTENT", headers=HEADERS)
    assert resp.status_code == 404
