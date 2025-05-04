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
