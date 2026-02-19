# Contributing to Organic Sabzi Wala

Welcome to the team! We follow a structured workflow to ensure code quality and stability.

## Branching Strategy

We use the following branches for collaboration:

- **`master`**: The stable production-ready code. Do not push directly to master.
- **`frontend`**: Main branch for all frontend development.
- **`backend`**: Main branch for all backend development.
- **`ui-management`**: Dedicated branch for UI/UX refinements and design system updates.

## Workflow

1.  **Pull the latest changes** for your respective branch:
    ```bash
    git checkout frontend  # or backend / ui-management
    git pull origin frontend
    ```

2.  **Create a feature branch** (Optional but recommended for large tasks):
    ```bash
    git checkout -b feature/login-page-revamp
    ```

3.  **Make your changes** and commit them:
    ```bash
    git add .
    git commit -m "feat: updated login page design"
    ```

4.  **Push to remote**:
    ```bash
    git push origin feature/login-page-revamp
    ```

5.  **Create a Pull Request (PR)** to merge into `frontend` / `backend`.

## Environment Setup

1.  **Frontend**:
    - Copy `frontend/.env.example` to `frontend/.env`.
    - Run `npm install` and `npm run dev`.

2.  **Backend**:
    - Copy `backend/.env.example` to `backend/.env`.
    - Fill in the required API keys (Ask the team lead for credentials).
    - Run `pip install -r requirements.txt`.
    - Run `python manage.py runserver`.

## Code Style

- **Frontend**: Use functional React components with hooks. TailwindCSS for styling.
- **Backend**: Follow PEP 8 guidelines for Python code.

Happy Coding! 🥦
