
# 🚀 Micro FrontEnd Dashboard (Vite Edition)

A high-performance Micro Frontend (MFE) architecture built using **Vite** and **Native ESM Federation**. This project demonstrates how to orchestrate multiple React applications using a shared state management layer.

## 🏗️ Architecture

This project uses a **Shell/Remote** pattern. Instead of Webpack's Module Federation, it utilizes `@originjs/vite-plugin-federation` to handle runtime module loading via standard ES Modules.

### The Ecosystem
* **Shell (Host):** Port `5000` — The container app that stitches everything together.
* **Finance App (Remote):** Port `5001` — Handles financial data visualizations.
* **Trends App (Remote):** Port `5002` — Manages market trends and analytics.
* **Shared Store:** A shared library (`@mfe/store`) that ensures state synchronization across all apps.

---

## 🛠️ Tech Stack

* **Bundler:** [Vite](https://vitejs.dev/)
* **Federation:** `@originjs/vite-plugin-federation`
* **UI Framework:** React 18+
* **State Management:** Shared instance via `@mfe/store`

---

## 🚀 Getting Started

<Steps>
### Install Dependencies
Run this in the root of the monorepo:
```bash
npm install
