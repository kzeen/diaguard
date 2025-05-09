import API from "./auth";

// Newest prediction
export const fetchLatestPrediction = async () => {
    const { data } = await API.get("/predictions/latest/");
    return data.length ? data[0] : null;
};

// Full history list
export const fetchAllPredictions = () =>
    API.get("/predictions/all/").then((r) => r.data);

// Placeholder “daily health tip” — replace with backend later
export const fetchHealthTip = () =>
    Promise.resolve({
        tip: "Drink a glass of water before meals; proper hydration helps regulate blood glucose.",
    });

// Create prediction
export const createPrediction = (payload) =>
    API.post("/predictions/", payload).then((r) => r.data.prediction);

export const fetchPredictionDetail = (id) =>
    API.get(`/predictions/${id}/`).then((r) => r.data);

export const fetchPredictionExplanation = (id) =>
    API.get(`/predictions/${id}/explanation/`).then((r) => r.data);

export const fetchPredictionRecs = (id) =>
    API.get(`/predictions/${id}/recommendations`).then((r) => r.data);

export const sendRecFeedback = (predictionId, recId, helpful) =>
    API.post(
        `/predictions/${predictionId}/recommendations/${recId}/feedback/`,
        {
            helpful,
        }
    );

export const fetchPredictionsList = (params = {}) =>
    API.get("/predictions/all/", { params }).then((r) => r.data);

export const fetchPredictionPdf = (id) =>
    API.get(`/predictions/${id}/pdf/`, { responseType: "blob" });
