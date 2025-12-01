"""
Advanced Emissions Tracking Script using CodeCarbon + eco2AI Concepts
----------------------------------------------------------------------
This script demonstrates detailed emissions tracking
for different workloads, as well as eco2AI-inspired energy modeling.

Features:
- Multiple computational scenarios
- CodeCarbon real-time emissions tracking
- eco2AI-style CPU/GPU/RAM estimation
- CO2 computation with configurable carbon intensity
- Device awareness & workload simulation
"""

from codecarbon import EmissionsTracker
import time
import random
import psutil
import math

print("\n=== Starting Advanced Emissions Tracking Session ===\n")

# ----------------------------------------------------
# 1. CodeCarbon Real Emissions Tracking
# ----------------------------------------------------

tracker = EmissionsTracker(measure_power_secs=1)
tracker.start()

# Workload A: Heavy math simulation
total = 0
for i in range(6_000_000):
    total += (i ** 1.5) % 97

emission_a = tracker.stop()
print(f"Workload A (Heavy Math) Emissions: {emission_a} kg")


# ----------------------------------------------------
# 2. Second Workload Tracking
# ----------------------------------------------------
tracker.start()

arr = [random.random() for _ in range(2_000_000)]
arr.sort()

emission_b = tracker.stop()
print(f"Workload B (Sorting) Emissions: {emission_b} kg")


# ----------------------------------------------------
# 3. eco2AI-Style Detailed Modeling
# ----------------------------------------------------

def gpu_energy(duration_s, watts=250, util=0.75):
    return (watts * util * duration_s) / 3600

def cpu_energy(duration_s, tdp=65, util=0.45):
    return (tdp * util * duration_s) / 3600

def ram_energy(duration_s, gb=16):
    return (0.375 * gb * duration_s) / 3600

def total_energy(duration_s):
    g = gpu_energy(duration_s)
    c = cpu_energy(duration_s)
    r = ram_energy(duration_s)
    return g + c + r, g, c, r

durations = [round(random.uniform(1, 8), 2) for _ in range(5)]

print("\n=== eco2AI Modeled Energy ===")
for d in durations:
    total, g, c, r = total_energy(d)
    print(f"Duration {d}s → Total {total:.4f} kWh (GPU {g:.4f}, CPU {c:.4f}, RAM {r:.4f})")

# ----------------------------------------------------
# 4. CO2 Emission Estimation
# ----------------------------------------------------

def co2_estimate(energy_kwh, carbon_intensity=0.45, pue=1.2):
    return energy_kwh * carbon_intensity * pue

print("\n=== Modeled CO2 Estimates ===")
for d in durations:
    total, _, _, _ = total_energy(d)
    print(f"{d}s → CO2: {co2_estimate(total):.4f} kg")

print("\nSimulation Completed Successfully.\n")