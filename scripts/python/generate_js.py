import os
import glob
import re

directories_map = {
    'AUSTRALIA': 'australia',
    'CANADA': 'canada',       # Maybe add to siteData? Wait, they only have `australia, dubai, europe, ireland, new-zealand, united-kingdom, usa` in `siteData.js`
    'EUROPE': 'europe',
    'UAE': 'dubai',
    'USA': 'usa',
    'UK': 'united-kingdom'
}

exclusive_names = [
    "Texas A&M San Antonio",
    "Griffith College",
    "LSBF",
    "LIM College",
    "University of West of Scotland",
    "ILA",
    "QA Universities",
    "UWS",
    "University Texas a&m"
]

def is_exclusive(name):
    lower_name = name.lower()
    for e in exclusive_names:
        if e.lower() in lower_name:
            return True
    return False

base_path = r"c:\Users\91704\fetc-website\src\assets\Study abroad\university logos and list of university"

output_lines = []
imports = []
country_data = {}

def sanitize_import_name(name):
    # remove invalid characters for js variable
    name = re.sub(r'[^a-zA-Z0-9_]', '', name)
    return name

var_counter = 0

# Also include the Exclusive University Logo folder directly
excl_dir = os.path.join(base_path, "Exclusive University Logo")
if os.path.exists(excl_dir):
    for f in os.listdir(excl_dir):
        if not (f.endswith('.png') or f.endswith('.jpg') or f.endswith('.jpeg')):
            continue
        rel_path = f"../assets/Study abroad/university logos and list of university/Exclusive University Logo/{f}"
        var_name = f"excl_img_{var_counter}"
        var_counter += 1
        imports.append(f'import {var_name} from "{rel_path}";')
        
        # Decide which country it belongs to roughly or just keep it around
        # Based on user list:
        # Griffith College Ireland -> ireland
        # LSBF Singapore -> hmm
        # LIM College USA -> usa
        # UWS UK -> united-kingdom
        # University Texas a&m USA -> usa
        country_key = None
        if 'Griffith' in f:
             country_key = 'ireland'
        elif 'LIM' in f or 'Texas' in f:
             country_key = 'usa'
        elif 'UWS' in f:
             country_key = 'united-kingdom'
        else:
             country_key = 'other' # LSBF Singapore
             
        if country_key not in country_data:
             country_data[country_key] = []
        name = os.path.splitext(f)[0]
        country_data[country_key].append({
             'name': name,
             'var_name': var_name,
             'exclusive': True
        })

for dir_name, mapped_key in directories_map.items():
    dir_path = os.path.join(base_path, dir_name)
    if not os.path.exists(dir_path):
        continue
        
    if mapped_key not in country_data:
        country_data[mapped_key] = []
        
    for f in os.listdir(dir_path):
        if not (f.endswith('.png') or f.endswith('.jpg') or f.endswith('.jpeg')):
            continue
        
        rel_path = f"../assets/Study abroad/university logos and list of university/{dir_name}/{f}"
        var_name = f"img_{var_counter}"
        var_counter += 1
        imports.append(f'import {var_name} from "{rel_path}";')
        
        name = os.path.splitext(f)[0]
        # remove typical suffixes
        name = re.sub(r'(_UK|-uk|_Europe|_USA|\s+-\s+.*)$', '', name, flags=re.IGNORECASE)
        name = name.strip()
        
        country_data[mapped_key].append({
             'name': name,
             'var_name': var_name,
             'exclusive': is_exclusive(name)
        })

output_lines.extend(imports)
output_lines.append("\nexport const allUniversities = {")
for key, items in country_data.items():
    output_lines.append(f'  "{key}": [')
    for item in items:
        excl = "true" if item['exclusive'] else "false"
        output_lines.append(f'    {{ name: "{item["name"]}", image: {item["var_name"]}, link: "#", exclusive: {excl} }},')
    output_lines.append("  ],")
output_lines.append("};")

with open(r"c:\Users\91704\fetc-website\src\data\allUniversitiesData.js", "w", encoding='utf-8') as f:
    f.write("\n".join(output_lines))
