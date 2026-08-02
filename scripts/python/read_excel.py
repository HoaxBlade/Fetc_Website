import pandas as pd
import json

try:
    file_path = r"c:\Users\91704\fetc-website\src\assets\Study abroad\university logos and list of university\List of Universities (Logo)_FETC.xlsx"
    dfs = pd.read_excel(file_path, sheet_name=None)
    
    out = {}
    for sheet_name, df in dfs.items():
        # First column is assumed to be the university name
        if not df.empty:
            col = df.columns[0]
            out[sheet_name] = df[col].dropna().astype(str).tolist()
        else:
            out[sheet_name] = []
            
    with open(r"c:\Users\91704\fetc-website\universities.json", "w") as f:
        json.dump(out, f, indent=2)
except Exception as e:
    print(f"Error: {e}")
