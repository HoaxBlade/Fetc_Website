import re
import time
from googlesearch import search

file_path = r"c:\Users\91704\fetc-website\src\data\allUniversitiesData.js"
with open(file_path, "r", encoding='utf-8') as f:
    content = f.read()

def get_best_url(name):
    query = f"{name} official university website link"
    print(f"Searching for: {name}")
    try:
        # fetch top 5 results
        for url in search(query, num=3, stop=3, pause=2):
            # Try to grab the first clean domain
            if "wikipedia.org" in url or "facebook.com" in url or "linkedin.com" in url or "instagram.com" in url or "youtube.com" in url:
                continue
            print(f"Found: {url}")
            return url
    except Exception as e:
        print(f"Error {name}: {e}")
        time.sleep(2)
    return "#"

replacements_made = 0

def repl(match):
    global replacements_made
    full_str = match.group(0)
    name = match.group(1)
    
    # We only want to process it if we really need to.
    link = get_best_url(name)
    if link != "#":
        replacements_made += 1
        return full_str.replace('link: "#"', f'link: "{link}"')
    return full_str

updated_content = re.sub(r'\{ name:\s*"([^"]+)",[^}]*link:\s*"#"[^}]*\}', repl, content)

with open(file_path, "w", encoding='utf-8') as f:
    f.write(updated_content)

print(f"Replaced {replacements_made} links via Google Search fallback.")
