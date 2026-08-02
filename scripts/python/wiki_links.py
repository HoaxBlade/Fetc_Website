import re
import traceback
import urllib.request
import urllib.parse
import json

file_path = r"c:\Users\91704\fetc-website\src\data\allUniversitiesData.js"

with open(file_path, "r", encoding='utf-8') as f:
    content = f.read()

# Hardcoded overrides for the exclusives mentioned by user to guarantee them
hardcoded = {
    "Griffith Logo Ireland": "https://www.griffith.ie/",
    "LIM College_USA": "https://www.limcollege.edu/",
    "LSBF Singapore": "https://www.lsbf.edu.sg/",
    "University Texas a&m USA": "https://www.tamusa.edu/",
    "UWS UK": "https://www.uws.ac.uk/",
    "ILA_Italy": "https://www.ilamilan.com/",
    "QA Universities": "https://highereducation.qa.com/",
    "Avila University": "https://www.avila.edu/",
    "LSBU": "https://www.lsbu.ac.uk/"
}

def get_wikipedia_url(name):
    # clean name
    clean_name = re.sub(r'(?i)(_UK|-uk|_Europe|_USA|_Australia|\s+-\s+.*)$', '', name).strip()
    clean_name = clean_name.replace(" ", "_")
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=extlinks&titles={urllib.parse.quote(clean_name)}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        res = urllib.request.urlopen(req, timeout=3).read()
        data = json.loads(res)['query']['pages']
        for page_id in data:
            if page_id == "-1":
                break
            if 'extlinks' in data[page_id]:
                # return the first one that is http and not a generic reference
                for link_obj in data[page_id]['extlinks']:
                    l = link_obj['*']
                    if "http" in l and "Toolserver" not in l and "archive.org" not in l and "facebook." not in l and "twitter." not in l:
                        # try to find official website pattern, or just return first
                        return l
    except Exception as e:
        pass
    
    # Try suffixing "University" if it's broad
    if "University" not in clean_name and "College" not in clean_name:
        clean_name += "_University"
        url = f"https://en.wikipedia.org/w/api.php?action=query&prop=extlinks&titles={urllib.parse.quote(clean_name)}&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            res = urllib.request.urlopen(req, timeout=3).read()
            data = json.loads(res)['query']['pages']
            for page_id in data:
                if page_id == "-1":
                    break
                if 'extlinks' in data[page_id]:
                    for link_obj in data[page_id]['extlinks']:
                        l = link_obj['*']
                        if "http" in l and "archive.org" not in l and "facebook." not in l:
                            return l
        except Exception as e:
            pass
            
    return "#"

replacements = 0
def repl(match):
    global replacements
    full_str = match.group(0)
    name = match.group(1)
    
    if name in hardcoded:
        link = hardcoded[name]
    else:
        link = get_wikipedia_url(name)
        
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
