# ContentPilot (ContentAIx)

ContentPilot is a LinkedIn content automation platform that helps users generate, schedule, and publish posts automatically using AI.  
It supports account connection, post drafting, scheduling, background publishing, retries, and rate-limiting using a queue-based architecture.

---

## 🚀 Features

- 🔐 User authentication & LinkedIn OAuth
- 🤖 AI-generated LinkedIn posts & titles
- 📝 Draft creation & management
- ⏰ Post scheduling (UTC-based)
- 📤 Automated LinkedIn publishing
- 🔁 Retry & failure tracking
- ⚙️ Background worker using BullMQ
- 🚦 Rate-limited publishing (LinkedIn safe)
- 🐳 Fully Dockerized setup

---

## 🧩 Tech Stack

### Web (Main App)
- Next.js (App Router)
- Node.js
- TypeScript
- MySQL
- LinkedIn OAuth
- AI API (for content generation)

### Background Processing
- BullMQ
- Redis
- Dedicated Worker Service

### Infrastructure
- Docker
- Docker Compose

---

## 📁 Project Structure

```

.
├── main/                  # Next.js application
│   ├── app/
│   ├── lib/
│   ├── modules/
│   └── package.json
│
├── worker/                # BullMQ worker service
│   ├── index.ts
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md

````

---

## ⚙️ Environment Variables

Create a `.env` file at the project root using `.env.example`.

### `.env.example`
```env
# MySQL
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=

# Redis
REDIS_HOST=redis
````

⚠️ Never commit `.env` files or secrets to GitHub.

---

## ▶️ Run Locally (Docker)

### 1. Clone the repository

### 2. Create `.env`

```bash
cp main/.env.example main/.env
```

Fill in the values.

### 3. Start all services

```bash
docker compose up --build
```

This will start:

* MySQL
* Redis
* Worker service

---

## 🔄 Background Job Processing

* Scheduled posts are stored in MySQL
* Jobs are pushed to BullMQ (Redis)
* Worker consumes jobs with:

  * Concurrency control
  * Rate limiting (e.g. 1 post / 15 sec)
  * Automatic retries
* Failed jobs are tracked and retryable

---

## 📊 Job States (BullMQ)

* waiting
* active
* completed
* failed
* delayed

Failures include:

* error message
* attempt count
* last attempt timestamp

---

## 🔁 Retry Strategy

* Automatic retries handled by BullMQ
* Manual retry possible via API (planned)
* Safe failure handling to avoid duplicate posts

---

## 🛡 Best Practices Used

* UTC-based scheduling
* Queue-based publishing (no cron loops)
* Worker isolation (scalable)
* Dockerized infrastructure
* Clean separation of concerns
* Git-safe secret management

---

## 🚧 Current Scope

* Single LinkedIn account per user
* LinkedIn only (no Twitter / Instagram yet)
* MVP-focused architecture (scalable)

---

## 🔮 Future Enhancements

* Bull Board UI for job monitoring
* Manual retry UI
* Multi-platform support
* Usage limits per subscription plan
* Analytics & posting insights

---

## 👤 Author

Rajeev Bhardwaj
Full-stack Developer (Node.js, Next.js, AI intregations, Distributed Systems)