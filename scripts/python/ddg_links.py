import re
import requests
from bs4 import BeautifulSoup
import time

file_path = r"c:\Users\91704\fetc-website\src\data\allUniversitiesData.js"

with open(file_path, "r", encoding='utf-8') as f:
    content = f.read()

def get_url(name):
    query = f"{name} official university website link"
    url = f"https://html.duckduckgo.com/html/?q={requests.utils.quote(query)}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        res = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(res.text, 'html.parser')
        # find the first result link
        for a in soup.find_all('a', class_='result__url'):
            href = a.get('href')
            if href:
                # DuckDuckGo links are sometimes wrapped in /l/?uddg=
                if 'uddg=' in href:
                    href = href.split('uddg=')[1].split('&')[0]
                    href = requests.utils.unquote(href)
                if "wikipedia" in href or "facebook" in href or "instagram" in href or "youtube" in href or "linkedin" in href or "twitter" in href:
                    continue
                return href
    except Exception as e:
        print(f"Error {name}: {e}")
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
