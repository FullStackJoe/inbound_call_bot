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
