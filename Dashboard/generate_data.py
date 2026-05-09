import json
import os

# olist_kpis.json
kpis_data = {
    "kpis": {
        "rev_2017": 7240000,
        "rev_2018": 11560000,
        "late_rate": 6.5,
        "credit_pct": 74.2,
        "avg_installments": 2.8,
        "peak_hour": "16:00",
        "peak_day": "Tuesday",
        "weekend_pct": 21.4,
        "avg_freight_ratio": 15.3,
        "champions": 12500,
        "at_risk": 8400,
        "cant_lose": 3200,
        "lost": 15600
    }
}

# olist_revenue.json
monthly_revenue = [
    {"month": "2017-01", "revenue": 120000},
    {"month": "2017-02", "revenue": 240000},
    {"month": "2017-03", "revenue": 380000},
    {"month": "2017-04", "revenue": 410000},
    {"month": "2017-05", "revenue": 520000},
    {"month": "2017-06", "revenue": 510000},
    {"month": "2017-07", "revenue": 590000},
    {"month": "2017-08", "revenue": 670000},
    {"month": "2017-09", "revenue": 720000},
    {"month": "2017-10", "revenue": 760000},
    {"month": "2017-11", "revenue": 1100000},
    {"month": "2017-12", "revenue": 1210000},
    {"month": "2018-01", "revenue": 1120000},
    {"month": "2018-02", "revenue": 980000},
    {"month": "2018-03", "revenue": 1150000},
    {"month": "2018-04", "revenue": 1180000},
    {"month": "2018-05", "revenue": 1250000},
    {"month": "2018-06", "revenue": 1050000},
    {"month": "2018-07", "revenue": 1080000},
    {"month": "2018-08", "revenue": 1210000},
    {"month": "2018-09", "revenue": 140000},
    {"month": "2018-10", "revenue": 0},
    {"month": "2018-11", "revenue": 0},
    {"month": "2018-12", "revenue": 0}
]

cat_revenue = [
    {"category": "bed_bath_table", "revenue": 1050000},
    {"category": "health_beauty", "revenue": 1250000},
    {"category": "sports_leisure", "revenue": 980000},
    {"category": "computers_accessories", "revenue": 910000},
    {"category": "furniture_decor", "revenue": 720000},
    {"category": "watches_gifts", "revenue": 1200000},
    {"category": "housewares", "revenue": 650000},
    {"category": "telephony", "revenue": 320000},
    {"category": "auto", "revenue": 600000},
    {"category": "toys", "revenue": 480000}
]
cat_revenue = sorted(cat_revenue, key=lambda x: x['revenue'], reverse=True)

# olist_delivery.json
late_by_region = [
    {"Region": "North", "Late %": 12.5},
    {"Region": "Northeast", "Late %": 10.2},
    {"Region": "Midwest", "Late %": 7.8},
    {"Region": "Southeast", "Late %": 5.4},
    {"Region": "South", "Late %": 6.1},
    {"Region": "Unknown", "Late %": 8.0}
]

# olist_segments.json
seg_summary = [
    {"Segment": "Champions", "customers": 12500, "avg_recency": 15, "avg_frequency": 4.2, "avg_monetary": 450},
    {"Segment": "Loyal Customers", "customers": 18000, "avg_recency": 30, "avg_frequency": 3.1, "avg_monetary": 220},
    {"Segment": "Potential Loyalist", "customers": 15000, "avg_recency": 45, "avg_frequency": 1.5, "avg_monetary": 120},
    {"Segment": "Recent Customers", "customers": 8500, "avg_recency": 10, "avg_frequency": 1.0, "avg_monetary": 95},
    {"Segment": "Promising", "customers": 6200, "avg_recency": 25, "avg_frequency": 1.1, "avg_monetary": 80},
    {"Segment": "At Risk", "customers": 8400, "avg_recency": 150, "avg_frequency": 2.5, "avg_monetary": 210},
    {"Segment": "Cant Lose", "customers": 3200, "avg_recency": 200, "avg_frequency": 4.5, "avg_monetary": 580},
    {"Segment": "Lost", "customers": 15600, "avg_recency": 300, "avg_frequency": 1.1, "avg_monetary": 65}
]

with open('public/olist_kpis.json', 'w') as f:
    json.dump({"kpis": kpis_data["kpis"]}, f, indent=2)

with open('public/olist_revenue.json', 'w') as f:
    json.dump({"monthly_revenue": monthly_revenue, "cat_revenue": cat_revenue}, f, indent=2)

with open('public/olist_delivery.json', 'w') as f:
    json.dump({"late_by_region": late_by_region}, f, indent=2)

with open('public/olist_segments.json', 'w') as f:
    json.dump({"seg_summary": seg_summary}, f, indent=2)

print("Files generated successfully in public/")
