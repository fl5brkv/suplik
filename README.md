# 🗄️ Šuplík

A lightweight CRM system built with Nuxt.

---

## 🎨 Frontend

Powered by Nuxt 3 and Vue 3, styled with Tailwind for a modern, responsive UI.

| Technology              | Description                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| **Nuxt 4 (beta)**       | Framework for SSR and seamless Vue 3 development.                          |
| **Vue 3.5**             | Reactive, component-driven UI development.                                 |
| **TailwindCSS 4**       | Utility-first CSS framework for rapid, customizable styling.               |
| **@nuxt/ui-pro**        | Premium UI component library for Nuxt, optimized for speed and consistency.|
| **@tanstack/vue-table** | Headless table logic for flexible, performant data tables in Vue.          |

---

## 🛠️ Backend

Type-safe, reliable backend with advanced validation and ORM layers for robustness.

| Technology          | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| **Zod**             | Runtime validation library ensuring strong data integrity.    |
| **Drizzle ORM**     | Lightweight SQL ORM for easy database interaction.             |
| **Drizzle Zod**     | Zod-powered schema validation integrated with Drizzle ORM.     |
| **SQLite**          | Compact, fast database solution with minimal overhead.         |
| **Worker-Mailer**   | Email utility optimized for Cloudflare Workers.                |
| **Mailgun**         | SMTP service for sending confirmation emails.                  |
| **nuxt-auth-utils** | Minimal authentication utilities tailored for Nuxt.           |

---

## 📧 Email Templates

Composable, server-rendered email layouts using Vue and Nuxt.

| Technology          | Description                                        |
| ------------------- | -------------------------------------------------|
| **@vue-email**      | Component-based email rendering system for Vue/Nuxt. |
| **nuxt-nodemailer** | Integrated email sending within Nuxt applications.|

---

## ☁️ Hosting & Deployment

Deployed on advanced cloud infrastructure for speed and reliability.

| Technology     | Description                                          |
| -------------- | ---------------------------------------------------|
| **NuxtHub**    | Platform optimized for deploying Nuxt applications.|
| **Cloudflare** | Global CDN and security services for fast delivery.|
| **Wrangler**   | Tooling for serverless deployment on Cloudflare Workers.|

---

## 📦 Package Management

| Tool     | Version |
| -------- | ------- |
| **pnpm** | 10.8.1  |

---

## 🚀 How to Use

### 👤 Login Credentials

| Role      | Email          | Password  |
| --------- | -------------- | --------- |
| **Admin** | admin@admin.sk | password  |
| **Tech**  | tech@tech.sk   | password  |

---

### 📥 Workflow Overview

1. **Demand Received**  
   New client requests (_demands_) appear in the **Demands** table with unique IDs.  
   _(*Admin*)_

2. **Create Quote & Offer**  
   Admin copies the Demand ID and can create:  
   - **Quote** 
   - **Offer**  
   A confirmation email is sent to the client upon creation.  
   _(*Admin*)_

3. **Assign Technician**  
   Admin assigns a technician to the **Offer** and future **Job** in the Admin panel.  
   _(*Admin*)_

4. **Client Accepts Offer**  
   Client accepts the offer via emailed link, triggering automatic **Job** creation assigned to the technician.  
   _(*System*)_

5. **Job Execution**  
   Technician views assigned jobs, contacts clients via call or SMS, and marks jobs complete.  
   _(*Technician*)_

6. **User Settings**  
   Technician can update personal settings.  
   _(*Technician*)_

---

## 🔧 Admin Capabilities

- Manage all **Demands**, **Quotes**, **Offers**, and **Jobs**  
- Create/manage **Products** and **Services**  
  - Public products appear on client-facing demand creation page  
- Place **Product Orders** with automatic supplier email notifications  
- Assign technicians to offers and jobs  
- Track full demand-to-job lifecycle  

---

## 🧰 Technician Capabilities

- View assigned **Jobs**  
- Call or SMS clients directly from job screen  
- Mark jobs as completed  
- Update personal user settings  

---

## 🌐 Client-Facing View

- Clients receive emails for quote confirmation and offer acceptance  
- View public products/services on demand creation page  
- Interact with quotes and offers via unique emailed links  
