import csv
from collections import defaultdict

path = r'C:\Users\USER FAZIL\.gemini\antigravity\brain\149135cf-be49-45a8-8161-05db76020f93\.user_uploaded\media_1794221508525_c173c479.csv'
with open(path, 'r', encoding='utf-8') as f:
    trades = list(csv.DictReader(f))

by_year = defaultdict(lambda: {'count': 0, 'gross': 0.0, 'friction': 0.0, 'net': 0.0, 'wins': 0})
for t in trades:
    if t['engine'] == 'MTF_SWING_LONG':
        yr = t['entry_date'][:4]
        g = float(t['gross_pnl_inr'])
        fr = float(t['friction_inr'])
        n = float(t['net_pnl_inr'])
        by_year[yr]['count'] += 1
        by_year[yr]['gross'] += g
        by_year[yr]['friction'] += fr
        by_year[yr]['net'] += n
        if n > 0:
            by_year[yr]['wins'] += 1

print(f"{'Year':6} | {'Trades':6} | {'Gross INR':12} | {'Fric INR':11} | {'Net INR':12} | {'WinRate':7}")
print('-'*65)
for yr in sorted(by_year.keys()):
    d = by_year[yr]
    wr = (d['wins'] / d['count']) * 100 if d['count'] > 0 else 0
    print(f"{yr:6} | {d['count']:6} | {d['gross']:12,.2f} | {d['friction']:11,.2f} | {d['net']:12,.2f} | {wr:6.2f}%")
