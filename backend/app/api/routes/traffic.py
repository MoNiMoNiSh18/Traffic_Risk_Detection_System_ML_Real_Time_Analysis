from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user
from app.services.traffic_service import get_live_traffic

router = APIRouter(
    prefix="/api/v1",
    tags=["Traffic"]
)


@router.get("/live-traffic")
def live_traffic(
    latitude: float,
    longitude: float,
    current_user=Depends(get_current_user)
):
    return get_live_traffic(
        latitude,
        longitude
    )