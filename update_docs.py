import re

docs_path = r"d:\KaranH\(00)Projects\internships related\docs\handbook\milestone-01\week-02\DEV_5_TASKS.md"
alarms_path = r"d:\KaranH\(00)Projects\internships related\intelligent-cognitive-alarm-planner\mobile\src\screens\AlarmsScreen.js"
home_path = r"d:\KaranH\(00)Projects\internships related\intelligent-cognitive-alarm-planner\mobile\src\screens\HomeScreen.js"
profile_path = r"d:\KaranH\(00)Projects\internships related\intelligent-cognitive-alarm-planner\mobile\src\screens\ProfileScreen.js"

with open(docs_path, 'r', encoding='utf-8') as f:
    doc_content = f.read()

with open(alarms_path, 'r', encoding='utf-8') as f:
    alarms_code = f.read()

with open(home_path, 'r', encoding='utf-8') as f:
    home_code = f.read()

with open(profile_path, 'r', encoding='utf-8') as f:
    profile_code = f.read()

# Replace AlarmsScreen
new_alarms_md = f"```javascript\n{alarms_code}\n```"
doc_content = re.sub(r"#### \*\*File: `apps/mobile/src/screens/AlarmsScreen\.js`\*\*.*?(?=---|\n## 🧪)", 
                     f"#### **File: `apps/mobile/src/screens/AlarmsScreen.js`**\n{new_alarms_md}\n\n", 
                     doc_content, flags=re.DOTALL)

# Add HomeScreen and ProfileScreen before Verification
new_sections = f"""---

### **Subtask 5.5: Mobile Home Screen**

#### **File: `apps/mobile/src/screens/HomeScreen.js`**
```javascript
{home_code}
```

---

### **Subtask 5.6: Mobile Profile Screen**

#### **File: `apps/mobile/src/screens/ProfileScreen.js`**
```javascript
{profile_code}
```

"""

doc_content = doc_content.replace("## 🧪 Verification & Testing Steps", f"{new_sections}\n## 🧪 Verification & Testing Steps")

with open(docs_path, 'w', encoding='utf-8') as f:
    f.write(doc_content)
    
print("Documentation updated successfully.")
