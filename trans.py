#!/usr/bin/env python3
from openpyxl import load_workbook
import pinyin
import json
import sys
import os


def parse_xlsx(xlsx_file: str):
    d = []
    wb = load_workbook(xlsx_file)
    ws = wb.active
    for row in ws[f'2:{ws.max_row}']:
        if row[1].value is None:
            break
        d.append({
            'money': row[0].value and int(row[0].value) or 0,
            'song': row[1].value.strip(),
            'singer': row[2].value and row[2].value.strip() or '',
            'link': row[3].value and row[3].value.strip() or '',
            'tags': [pinyin.get_initial(row[1].value.strip()[:1], delimiter='').upper()[:1]] + (row[4].value and [x.upper() for x in row[4].value.replace('，', ',').strip().split(',')] or []),
            'remark': row[5].value and row[5].value.strip() or '',
        })
    return d


if __name__ == '__main__':
    data = parse_xlsx(sys.argv[1] if len(sys.argv) > 1 else input('pull xlsx file here:'))
    with open(os.path.join('src', 'assets', 'data.json'), 'w', encoding='utf-8') as f:
        json.dump({'data': data}, f, separators=(',', ':'))
    print(json.dumps({'data': data}, indent=4))
