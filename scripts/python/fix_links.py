import re
import os

file_path = r"c:\Users\91704\fetc-website\src\data\allUniversitiesData.js"

with open(file_path, "r", encoding='utf-8') as f:
    content = f.read()

# Hardcoded true URLs for the ones user specifically requested
url_overrides = {
    # UK
    "Middlesex University London": "https://www.mdx.ac.uk/",
    "Ravensbourne University": "https://www.ravensbourne.ac.uk/",
    "University of Wales Trinity Saint David (UWTSD)": "https://www.uwtsd.ac.uk/",
    
    # Europe
    "Aix Marseille Universite": "https://www.univ-amu.fr/",
    "Berlin School of Business and Innovation": "https://www.berlinsbi.com/",
    "Burgundy School of Business": "https://www.bsb-education.com/",
    "College De Paris": "https://www.collegedeparis.fr/",
    "De Vinci University": "https://www.devinci.fr/",
    "EADA Business School": "https://www.eada.edu/",
    "EU Business School": "https://www.euruni.edu/",
    "GISMA University of Applied Sciences": "https://www.gisma.com/",
    "ICN Business School": "https://www.icn-artem.com/",
    "Schiller International University": "https://schiller.edu/",
    "University of Europe for Applied Sciences": "https://www.ue-germany.com/",
    "University of Lyon": "https://www.universite-lyon.fr/",

    # USA
    "American Collegiate": "https://www.american.edu/",
    "California State University Monterey Bay": "https://csumb.edu/",
    "Foothill Deanza": "https://www.fhda.edu/",
    "Hawai Pacific University": "https://www.hpu.edu/",
    "Long Island University Brooklyn": "https://liu.edu/brooklyn",
    "Texas A&M University-Corpus Christi": "https://www.tamucc.edu/",

    # Canada
    "Algoma University": "https://algomau.ca/",
    "College Avalon": "https://collegeavalon.com/",
    "Cypress College": "https://www.cypresscollege.edu/",
    "International Business University": "https://ibu.ca/",
    "Laurentian University": "https://laurentian.ca/",
    "PLC": "https://plvan.com/",
    "Red Deer Polytechnic": "https://rdpolytech.ca/",
    "Western Community College": "https://westerncommunitycollege.ca/",
    "York College of Applied Science": "https://yorkcas.ca/",
    "Yorkville University": "https://www.yorkvilleu.ca/",

    # Australia
    "The University of Newcastle Australia": "https://www.newcastle.edu.au/",

    # Ireland
    "IBAT College Dublin": "https://www.ibat.ie/",
    "Maynooth university": "https://www.maynoothuniversity.ie/",
    "National College of Ireland": "https://www.ncirl.ie/",
    "Trinity College Dublin": "https://www.tcd.ie/",
    "TU Dublin": "https://www.tudublin.ie/",
    "University of Ireland Galway": "https://www.universityofgalway.ie/",

    # Dubai
    "De Montfort University (DMU)": "https://www.dmu.ac.uk/dubai/",
    "GBS": "https://gbs.ac.ae/",
    "Middlesex University": "https://www.mdx.ac.ae/",
    "RIT": "https://www.rit.edu/dubai/"
}

def clean_name(name):
    # Remove Griffith Logo Ireland "Logo"
    if name == "Griffith Logo Ireland":
        return "Griffith College"
    if "University Texas a&m USA" == name:
        return "Texas A&M San Antonio"
    
    # Remove region suffixes safely
    n = name
    for suffix in ["_Australia", "_Canada", "_USA", "_UK", "-uk", "_France", ", France", "_Germany", "_Spain", "_Italy", "_Dubai", "_Ireland"]:
        n = n.replace(suffix, "")
    
    # Remove underscores
    n = n.replace("_", " ")
    
    return n.strip()


def repl(match):
    full_str = match.group(0)
    original_name = match.group(1)
    
    # Fix name
    cleaned_name = clean_name(original_name)
    
    # We also check if we have a URL override mapping for the original or cleaned name
    override_url = url_overrides.get(cleaned_name) or url_overrides.get(original_name)
    
    # Replace name in the string
    # E.g. { name: "Algoma University_Canada", image: img_25, link: "#", exclusive: false }
    
    # Doing a simple string manipulation
    # Find link inside the matched block
    link_match = re.search(r'link:\s*"([^"]+)"', full_str)
    if not link_match:
        return full_str
        
    current_link = link_match.group(1)
    
    new_link = current_link
    if override_url:
        new_link = override_url
        
    # Build final string
    # Replace only the first occurrence of name to avoid breaking var_names if they match
    s_new = re.sub(rf'name:\s*"{re.escape(original_name)}"', f'name: "{cleaned_name}"', full_str)
    
    if new_link != current_link:
        s_new = re.sub(r'link:\s*"[^"]+"', f'link: "{new_link}"', s_new)
        
    return s_new

updated_content = re.sub(r'\{ name:\s*"([^"]+)",\s*image:\s*[^,]+,\s*link:\s*"[^"]+",\s*exclusive:\s*(true|false)\s*\}', repl, content)

with open(file_path, "w", encoding='utf-8') as f:
    f.write(updated_content)

print("Updated links and names!")
