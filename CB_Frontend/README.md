# BurstWatch

BurstWatch is a React and Vite dashboard for weather visualization and a
next-day extreme-rainfall model estimate.

## Requirements

- Node.js
- npm
- Python 3.11 for the prediction backend
- A WeatherAPI.com API key for live weather observations

## Setup

### Frontend

Open PowerShell and run:

```powershell
Set-Location 'D:\MAJOR PROJECT\files\BurstWatch-Cloudburst-Prediction-System-main'
npm install
Copy-Item .env.example .env
npm run dev
```

The dashboard opens at `http://localhost:5173`. In `.env`, `VITE_API_BASE_URL`
selects the prediction API and defaults to `http://127.0.0.1:8000`. Set
`VITE_WEATHERAPI_KEY` to a WeatherAPI.com key for live current conditions and
hourly forecasts. If the key is missing or the provider request fails, the
dashboard uses generated fallback values marked **Demo/Offline data**. These
are not live observations. The dashboard's local risk score, feature bars,
map convective overlay, and event scenarios are also demo/simulated content,
separate from the backend prediction. Vite exposes `VITE_` variables in browser code; only use a key
intended for client-side use and restrict it with your provider. Never put the
backend admin key in the frontend `.env`.

### Prediction backend

In a second PowerShell window:

```powershell
Set-Location 'D:\MAJOR PROJECT\files\cloudburst-backend'
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
# Set ADMIN_API_KEY in .env only if you need the protected admin endpoints.
uvicorn app.main:create_app --factory --env-file .env --host 127.0.0.1 --port 8000 --reload
```

API documentation is at `http://127.0.0.1:8000/docs`. The dashboard calls
`POST /predict/location`, a public route that does not require an admin key.
The backend CORS defaults already allow the Vite
development origin `http://localhost:5173`. For another frontend origin, add it
to `CORS_ORIGINS` in the backend `.env` and restart the API.

The dashboard sends the selected map coordinates to
`POST /predict/location`. The backend fetches hourly Open-Meteo data, prepares
the model features, and runs the existing saved model. Its response is an
uncalibrated next-day extreme-rainfall score/probability estimate with a
threshold, target date, and data-quality warnings. The model was trained for
the Dehradun region; validity elsewhere has not been established. It is not
verified cloudburst detection or an evacuation recommendation. This estimate
is separate from WeatherAPI.com observations shown in the live-weather panel.
Map weather layers use configured provider raster tiles and RainViewer radar;
the original convective overlay and event scenarios are demo/simulated and are
not sourced detections or operational alerts.

## Other commands

- `npm run build` — build the production bundle
- `npm run preview` — preview the production bundle locally
- `npm run lint` — run ESLint
