# DiaGuard

**AI‑Powered Diabetes Risk Prediction Platform**

> Predict | Explain | Recommend

---

## Overview

DiaGuard is an end‑to‑end web application that helps users **predict** their risk of developing diabetes, **understand** which factors drive that risk through **explainable AI (SHAP & LIME)**, and receive **personalized** lifestyle recommendations. Built as a Computer Science capstone, DiaGuard demonstrates modern full‑stack development, machine‑learning engineering, and a user‑centric approach to transparency in healthcare.

---

## Key Features

-   **Risk Prediction API** – Recall‑optimized Random Forest wrapped behind a Django REST endpoint.
-   **Explainability** – SHAP (global & local) + LIME visualizations embedded directly in the UI.
-   **Recommendation Engine** – Rule‑based mapping from modifiable risk factors to actionable tips.
-   **Secure Auth** – Token‑based registration, login, logout, and password hashing.
-   **History & Trends** – Saves past predictions and visualizes progress over time.
-   **Modern UI** – Responsive React + Tailwind with protected routes and animated page transitions.

---

## Architecture

| Layer          | Role                             | Technology                           |
| -------------- | -------------------------------- | ------------------------------------ |
| **View**       | Single‑page application & charts | React, Vite, Tailwind CSS, Recharts  |
| **Controller** | API routing & business logic     | Django 5, Django REST Framework      |
| **Model**      | ML inference, XAI, database      | Scikit‑learn, SHAP, LIME, PostgreSQL |

> The system follows an MVC pattern inside a classic client‑server architecture. Requests flow **browser → React → REST API → Django services → ML engine → DB**, with responses returning JSON payloads or pre‑rendered SHAP plots.

---

## Tech Stack

-   **Frontend:** React @ Vite · Tailwind CSS · Axios · React Router
-   **Backend:** Django · Django REST Framework
-   **Machine Learning:** Scikit‑learn · Pandas · NumPy · SHAP · LIME
-   **Database:** PostgreSQL

---

## Getting Started

### 1 · Clone

```bash
git clone git@github.com:kzeen/diaguard.git
cd diaguard
```

### 2 · Local Environment

```bash
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd backend
touch .env # Set DB creds, secret key, and CORS_ALLOWED_ORIGINS
python manage.py migrate
python manage.py runserver
```

```bash
cd ../frontend
touch .env # Set VITE_API_URL (=http://127.0.0.1:8000/api for example)
npm install
npm run dev # http://localhost:5173
```

---

## Usage

1. Sign up or log in.
2. Navigate to **New Prediction** and fill out the health form.
3. View the **Risk Score**, then click **View Explanation** to see SHAP & LIME insights.
4. Browse **Recommendations** tailored to your top modifiable factors.
5. Check **History** to track changes over time.

> **Disclaimer:** DiaGuard is **not** a medical device and should **not** replace professional diagnosis. Always consult a qualified healthcare provider.

---

## Acknowledgements

-   **Dataset:** _Diabetes prediction dataset_ – Mohammed Mustafa, Kaggle.
-   **XAI Inspiration:** Lundberg & Lee (2017) SHAP · Ribeiro et al. (2016) LIME.
-   **UI Icons:** [Lucide](https://lucide.dev)

---

## Contact

Karl Zeeny – [@kzeen](https://github.com/kzeen/) – [karlzeeny@gmail.com](mailto:karlzeeny@gmail.com)

Project Link: [https://github.com/kzeen/diaguard](https://github.com/kzeen/diaguard)
