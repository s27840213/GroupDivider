import os
import json
import gspread


google_sheet_name = '2023第一屆成資盃報名表單 (回覆)'
works_sheet_name = '報名表單'
print(google_sheet_name, works_sheet_name)
gc = gspread.service_account(filename='config/client-secret.json')
sheet = gc.open_by_key(
    '17CC3tep3Zk_6xy9Oghw5reKohQR3PSnf7Id46uwRv0c').worksheet(works_sheet_name)

header_mapping = {
    '時間戳記': 'timestamp',
    '您的名字': 'name',
    '您的系級 (以大學畢業年份為主 e.g. 110，若非成大資工系幫我填 0)': 'graduation_year',
    '贊助金額': 'donation',
    '有什麼意見歡迎提出哦~! 若為親友、伴侶一起參賽，麻煩幫我備註一下系友的名字，避免我們分錯隊伍，感謝!': 'comments',
    '性別': 'gender',
    '亞斯球衣 Size': 'jersey_size',
    '簡易分級(分隊script用)': 'level',
    'Group ID (Same id will in same group)': 'group_id'
}

level_mapping = {
    'SS': 12,
    'S': 10,
    'A': 8,
    'B': 6,
    'C': 4,
    '?': 6,
}

# Get players data from Google Sheet
array = []
for row in sheet.get_all_records():
    renamed_row = {header_mapping.get(
        key, key): value for key, value in row.items()}
    if renamed_row.get('gender') == '':
        renamed_row['gender'] = 'M'
    renamed_row['level'] = level_mapping.get(renamed_row.get('level'))
    array.append(renamed_row)


# Output players' data to JSON in certain folder
output_dir_path = os.environ['OUTPUT_DIR_PATH']
print('Output players\' data to:' + output_dir_path)
if not os.path.exists(output_dir_path):
    os.makedirs(output_dir_path)
with open(f'{output_dir_path}playersData.json', 'w', encoding='UTF-8') as f:
    json.dump(array, f, indent=2, ensure_ascii=False)
