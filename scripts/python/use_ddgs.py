import re
from duckduckgo_search import DDGS
import time

file_path = r"c:\Users\91704\fetc-website\src\data\allUniversitiesData.js"

with open(file_path, "r", encoding='utf-8') as f:
    content = f.read()

ddgs = DDGS()

def get_url(name):
    query = f"{name} official university website"
    try:
        results = [r for r in ddgs.text(query, max_results=3)]
        for r in results:
            url = r['href']
            if "wikipedia" in url or "facebook" in url or "instagram" in url or "youtube" in url or "linkedin" in url or "twitter" in url:
                continue
            return url
    except Exception as e:
        print(f"Error {name}: {e}")
    time.sleep(1) # Be nice to DDG
    return "#"


replacements = 0
def repl(match):
    global replacements
    full_str = match.group(0)
    name = match.group(1)
    
    link = get_url(name)
    if link != "#":
        print(f"Mapped: {name} -> {link}")
        replacements += 1
        return full_str.replace('link: "#"', f'link: "{link}"')
    
    print(f"Failed: {name}")
    return full_str

updated_content = re.sub(r'\{ name:\s*"([^"]+)",[^}]*link:\s*"#"[^}]*\}', repl, content)

with open(file_path, "w", encoding='utf-8') as f:
    f.write(updated_content)

print(f"Total updated: {replacements}")
