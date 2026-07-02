# Cognitive Alarm App

This is a full-stack application designed to build better wake-up habits through cognitive challenges. The project uses a monorepo structure, containing both the React frontend and FastAPI backend.

## 🚀 Getting Started

To get this running on your local machine, run the following commands:

**1. Clone the repository:**

```bash
git clone https://github.com/Shadow-sama287/intelligent-cognitive-alarm-platform.git

cd cognitive-alarm-app
```

**2. Start the Backend:**

```bash
cd backend
python -m venv .venv

source .venv/bin/activate
# On Windows: .venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload
```

**3. Start the Frontend:**
Open a new terminal in the root folder:

```bash
cd frontend
npm install
npm run dev
```

---

# Git Workflow & Branching Strategy

To prevent merge conflicts and keep our `main` branch stable, we use a strict feature-branching workflow. **No one is allowed to commit directly to the `main` branch.**

### Branch Naming Convention

Every time you pick up a task, create a new branch using this exact format:
`<your-name>/<type>/<short-description>`

**Types to use:**

- `feat/` - For new features (e.g., `karan/feat/user-auth`)
- `fix/` - For bug fixes (e.g., `karan/fix/cors-error`)
- `docs/` - For documentation updates (e.g., `karan/docs/api-endpoints`)

### The Daily Workflow

**1. Always start by syncing with main:**
Before writing any code, make sure you have the latest updates:

```bash
git checkout main
git pull origin main
```

**2. Create your workspace:**
Create your named branch for the specific task you are working on:

```bash
git checkout -b <your-name>/<type>/<feature-name>
# Example: git checkout -b karan/feat/database-schema
```

**3. Commit and Push:**
As you work, save your progress to your remote branch:

```bash
git add .
git commit -m "Brief description of what you changed"
git push origin <your-name>/<type>/<feature-name>
```

**4. Pull Request (PR):**
When your task is complete, go to GitHub and open a Pull Request to merge your branch into `main`.

- **Rule:** Your PR must be reviewed and approved by at least one other team member before it can be merged.
- Once merged, delete your feature branch and pull the fresh `main` to start your next task.
