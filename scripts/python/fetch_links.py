import json
import re
import urllib.request

file_path = r"c:\Users\91704\fetc-website\src\data\allUniversitiesData.js"
with open(file_path, "r", encoding='utf-8') as f:
    content = f.read()

def get_url(name):
    # clean name for better search
    query_name = re.sub(r'(?i)(_UK|-uk|_Europe|_USA|_Australia|\s+-\s+.*)$', '', name)
    query_name = urllib.parse.quote(query_name)
    url = f"http://universities.hipolabs.com/search?name={query_name}"
    try:
        req = urllib.request.urlopen(url, timeout=3)
        res = json.loads(req.read())
        if len(res) > 0 and 'web_pages' in res[0] and len(res[0]['web_pages']) > 0:
            return res[0]['web_pages'][0]
    except Exception as e:
        pass
    return "#"

# Using regex to find all objects with link: "#" and updating them
def repl(match):
    full_str = match.group(0)
    name = match.group(1)
    link = get_url(name)
    
    if link != "#":
        # replace '#' with the actual link
        return full_str.replace('link: "#"', f'link: "{link}"')
    return full_str

# Regex to match: { name: "Adelphi University", image: img_58, link: "#", exclusive: false }
updated_content = re.sub(r'\{ name:\s*"([^"]+)",[^}]*link:\s*"#"[^}]*\}', repl, content)

with open(file_path, "w", encoding='utf-8') as f:
    f.write(updated_content)

print("Updated links")
