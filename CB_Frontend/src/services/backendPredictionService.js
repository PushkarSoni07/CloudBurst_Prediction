const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/+$/, '');

export class BackendApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'BackendApiError';
    this.status = status;
  }
}

async function requestJson(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new BackendApiError(`Could not connect to the prediction API at ${API_BASE_URL}.`);
  }

  if (!response.ok) {
    let detail = `Prediction API request failed (${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body.detail === 'string') detail = body.detail;
    } catch {
      // Keep the HTTP status message when the response has no JSON body.
    }
    throw new BackendApiError(detail, response.status);
  }

  return response.json();
}

export function fetchLatestPrediction(signal) {
  return requestJson('/predictions/latest', { signal });
}

export function fetchModelInfo(signal) {
  return requestJson('/model-info', { signal });
}

export function predictAtLocation({ latitude, longitude }, signal) {
  return requestJson('/predict/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude }),
    signal
  });
}
