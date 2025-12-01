"""
LLM Energy & CO2 Analytics Module (Research-Style)
--------------------------------------------------
This module simulates energy and CO2 analytics for different LLMs and
creates research-style visualizations. It is intended for use as part 
of an AI Sustainability Study.

Includes:
- Synthetic dataset generation
- Statistical summaries
- Multiple chart types
- Correlation heatmaps
- Efficiency scoring
- Data export
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from datetime import datetime

# -----------------------------
# 1. Generate Synthetic Dataset
# -----------------------------
np.random.seed(42)

models = ["GPT-4", "Claude 3", "Grok 1.5", "Llama-3"]
categories = ["General", "Coding", "Math", "Reasoning", "Physics"]

rows = []

for i in range(600):
    model = np.random.choice(models)
    category = np.random.choice(categories)

    base_emission = {
        "GPT-4": 3.0,
        "Claude 3": 2.4,
        "Grok 1.5": 4.2,
        "Llama-3": 1.1
    }[model]

    difficulty_multiplier = np.random.uniform(1.0, 3.5)
    co2_grams = base_emission * difficulty_multiplier
    tokens = int(np.random.uniform(30, 2500))
    energy_kwh = co2_grams / 500    # Fake linear model

    rows.append([
        i+1, model, category, tokens, energy_kwh, co2_grams
    ])

df = pd.DataFrame(rows, columns=[
    "ID", "Model", "Category", "Tokens", "Energy_kWh", "CO2_grams"
])

print("\nDataset Generated with", len(df), "rows.\n")

# -----------------------------
# 2. Summary Statistics
# -----------------------------
summary = df.groupby("Model").agg({
    "Energy_kWh": "mean",
    "CO2_grams": "mean",
    "Tokens": "mean"
}).round(3)

print("=== SUMMARY STATISTICS ===\n")
print(summary)

# -----------------------------
# 3. Create Output Directory
# -----------------------------
out_dir = "analytics_outputs"
os.makedirs(out_dir, exist_ok=True)

# -----------------------------
# 4. Visualizations
# -----------------------------

# Bar Chart
plt.figure(figsize=(8,5))
sns.barplot(x=summary.index, y=summary["CO2_grams"])
plt.title("Average CO2 Emission Per Query")
plt.ylabel("CO2 (grams)")
plt.tight_layout()
plt.savefig(f"{out_dir}/avg_co2_per_model.png")

# Correlation Heatmap
plt.figure(figsize=(6,5))
sns.heatmap(df[["Tokens", "Energy_kwh", "CO2_grams"]].corr(), annot=True, cmap="coolwarm")
plt.title("Correlation Heatmap")
plt.tight_layout()
plt.savefig(f"{out_dir}/correlation_heatmap.png")

# Line Plot (Sorted)
df_sorted = df.sort_values("Tokens")
plt.figure(figsize=(9,5))
plt.plot(df_sorted["Tokens"], df_sorted["CO2_grams"])
plt.xlabel("Tokens")
plt.ylabel("CO2 grams")
plt.title("CO2 vs Token Count")
plt.tight_layout()
plt.savefig(f"{out_dir}/co2_vs_tokens.png")

# Pie Chart
plt.figure(figsize=(6,6))
df["Category"].value_counts().plot.pie(autopct="%1.1f%%")
plt.title("Category Distribution")
plt.tight_layout()
plt.savefig(f"{out_dir}/category_distribution.png")

# -----------------------------
# 5. Efficiency Score
# -----------------------------
df["Efficiency_Score"] = (1000 / (df["CO2_grams"])) + (df["Tokens"] / 500)

df.to_csv(f"{out_dir}/research_dataset.csv", index=False)

print("\nAll graphs and dataset exported to:", out_dir)