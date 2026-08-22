import os
import httpx
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY")


def get_live_traffic(latitude: float, longitude: float):

    if not TOMTOM_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="TomTom API key is not configured."
        )

    url = (
        "https://api.tomtom.com/"
        "traffic/services/4/flowSegmentData/"
        "absolute/10/json"
    )

    params = {
        "key": TOMTOM_API_KEY,
        "point": f"{latitude},{longitude}",
        "unit": "kmph"
    }

    try:
        response = httpx.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        flow = data.get("flowSegmentData")

        if not flow:
            raise HTTPException(
                status_code=404,
                detail="No traffic data available for this location."
            )

        current_speed = flow.get("currentSpeed")
        free_flow_speed = flow.get("freeFlowSpeed")

        if current_speed is None or free_flow_speed is None:
            raise HTTPException(
                status_code=404,
                detail="Traffic speed data unavailable."
            )

        congestion_ratio = (
            current_speed / free_flow_speed
            if free_flow_speed > 0
            else 1
        )

        # Convert congestion into a 0-100 traffic-density estimate.
        traffic_density = round(
            max(0, min(100, (1 - congestion_ratio) * 100))
        )

        return {
            "latitude": latitude,
            "longitude": longitude,
            "current_speed": current_speed,
            "free_flow_speed": free_flow_speed,
            "congestion_ratio": round(
                congestion_ratio,
                3
            ),
            "traffic_density": traffic_density
        }

    except httpx.HTTPError as error:
        raise HTTPException(
            status_code=502,
            detail=f"Traffic service unavailable: {str(error)}"
        )