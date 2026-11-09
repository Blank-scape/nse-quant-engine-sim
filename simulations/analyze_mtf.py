import csv
from collections import defaultdict

path = r'C:\Users\USER FAZIL\.gemini\antigravity\brain\149135cf-be49-45a8-8161-05db76020f93\.user_uploaded\media_1794221508525_c173c479.csv'
with open(path, 'r', encoding='utf-8') as f:
    trades = list(csv.DictReader(f))

mtf_exits = defaultdict(int)
for t in trades:
    if t['engine'] == 'MTF_SWING_LONG':
        mtf_exits[t['exit_reason']] += 1

print("MTF Swing Long Exit Reasons:")
for r, c in mtf_exits.items():
    print(f"  {r}: {c}")
