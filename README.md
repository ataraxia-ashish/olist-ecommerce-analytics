# Olist Brazilian E-Commerce Analytics Dashboard

An interactive, multi-tab analytics dashboard built on the [Olist Brazilian E-Commerce dataset](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce) from Kaggle. Transforms 100K+ orders into executive-ready insights across revenue, delivery, customer segments, and payment behaviour.

![Dashboard Preview](./assets/preview.png)

> **Live Demo:** [olist-analytics-ashish.netlify.app](https://olist-analytics-ashish.netlify.app/)
---

## Features

### 5 Analytics Tabs

| Tab | What it shows |
|---|---|
| **Overview** | KPI cards with directional sparklines + 4-bullet executive insight panel |
| **Revenue** | Monthly trend, category treemap, YoY growth |
| **Delivery** | On-time vs late breakdown, late orders by region, avg delivery time |
| **Customer Segments** | RFM-based segmentation, segment distribution, scrollable segment table |
| **Payments & Freight** | Payment method split, installment distribution, freight cost analysis |

### Design Decisions
- **Semantic color palette** — indigo = growth, emerald = positive, amber = 2017/warnings, red = negative
- **Dark mode default** with light mode toggle
- **Directional sparklines** on KPI cards using real trend arrays
- **Treemap** for category revenue (more honest than radar chart for this data)
- **Insight callouts** on Delivery and Segments tabs

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Charts:** Recharts
- **Styling:** Tailwind CSS
- **Data:** Pre-processed JSON files (see `/Dashboard/public/data/`)

---

## Project Structure

```
olist-ecommerce-analytics/
├── Dashboard/               # Vite + React source
│   ├── public/
│   │   └── data/            # Pre-processed JSON data files
│   │       ├── olist_kpis.json
│   │       ├── olist_revenue.json
│   │       ├── olist_delivery.json
│   │       └── olist_segments.json
│   ├── src/
│   │   ├── components/      # Tab components, KPI cards, charts
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
├── notebooks/               # Colab analysis notebook
│   └── olist_analysis.ipynb
├── data/                    # Small derived CSVs (safe to commit)
│   ├── olist_category_revenue.csv
│   ├── olist_late_by_region.csv
│   └── olist_monthly_revenue.csv
├── .gitignore
└── README.md
```

---

## Raw Data

The raw Olist dataset (~130MB) is **not included** in this repo due to GitHub file size limits.

Download it from Kaggle: [Brazilian E-Commerce Public Dataset by Olist](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)

The `/notebooks/olist_analysis.ipynb` notebook documents all cleaning, transformation, and feature engineering steps applied before the dashboard data was generated.

---

## Getting Started

```bash
# Clone
git clone https://github.com/ataraxia-ashish/olist-ecommerce-analytics.git
cd olist-ecommerce-analytics/Dashboard

# Install
npm install

# Run dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Data Processing

All analysis was done in Google Colab. Key steps:

1. Merged 9 Olist tables on order/customer/product keys
2. Parsed and engineered delivery timing features
3. RFM scoring for customer segmentation
4. Aggregated to dashboard-ready JSON (split by tab to keep bundle small)

See `/notebooks/olist_analysis.ipynb` for full walkthrough.

---

## Dataset

- **Source:** [Olist Store](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)
- **Period:** Sep 2016 – Oct 2018
- **Size:** ~100K orders, 9 relational tables
- **License:** CC BY-NC-SA 4.0

---

## Author

**Ashish** — BCA (NEP), Sardar Patel University  
GitHub: [@ataraxia-ashish](https://github.com/ataraxia-ashish)
