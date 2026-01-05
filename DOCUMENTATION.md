# AI Social Studio - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Solution Architecture](#solution-architecture)
4. [Technology Stack](#technology-stack)
5. [Features](#features)
6. [Pricing Plans](#pricing-plans)
7. [API Design](#api-design)
8. [Setup & Installation](#setup--installation)
9. [Deployment](#deployment)
10. [Future Roadmap](#future-roadmap)

---

## 🎯 Project Overview

**AI Social Studio** is a unified web application that transforms uploaded images and videos into ready-to-post social media content with minimal user effort. It leverages AI for caption generation, image editing, media enhancement, and supports direct posting to social platforms.

**Live Demo:** https://ai-media-uploader-32coo3ylg-rajeevs-projects-b809f2fb.vercel.app/

---

## 🔍 Problem Statement

Content creators, marketers, and businesses face repetitive tasks:
- Writing captions and hashtags manually
- Editing or enhancing images and videos
- Posting the same content to multiple platforms

Existing tools are either **too complex**, **expensive**, or **solve only one part of the workflow**.

**Our Solution:** A single, unified platform that handles the entire content-to-post pipeline.

---

## 🏗️ Solution Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                   │
│  ┌─────────┐  ┌─────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Upload  │→ │ Action Grid │→ │ AI Features  │→ │  Output   │ │
│  │  Zone   │  │ (4 Options) │  │ (Processing) │  │ (Results) │ │
│  └─────────┘  └─────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (n8n Workflows)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐ │
│  │  Caption   │  │   Image    │  │   Media    │  │  Social   │ │
│  │ Generation │  │   Editor   │  │  Enhancer  │  │  Poster   │ │
│  └────────────┘  └────────────┘  └────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AI SERVICES                               │
│  OpenAI GPT-4V  │  Stability AI  │  Replicate  │  Graph API    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite 7** | Build Tool |
| **CSS Modules** | Scoped Styling |
| **Lucide React** | Icon Library |
| **LocalStorage** | History Persistence |

### Backend (Designed for n8n)
| Component | Service |
|-----------|---------|
| **Workflow Automation** | n8n |
| **Caption AI** | OpenAI GPT-4 Vision |
| **Image Editing** | Stability AI / Replicate |
| **Video Enhancement** | Replicate |
| **Social Posting** | Meta Graph API / YouTube Data API |

### DevOps
| Service | Purpose |
|---------|---------|
| **GitHub** | Version Control |
| **Vercel** | Deployment & Hosting |

---

## ✨ Features

### 1. Media Upload
- Drag & drop or click to upload
- Supports JPG, PNG, MP4
- Real-time preview
- Replace media functionality

### 2. Caption & Hashtags Generation
- AI-powered caption generation
- Platform-optimized hashtags
- Customizable tone settings
- Copy to clipboard
- Save to library

### 3. Image Editing
- Text-based edit instructions
- Example prompts provided
- Before/after comparison
- Download edited image

### 4. Media Enhancement
- Auto-improves clarity & colors
- Noise reduction
- Optional upscaling
- Works on images & videos

### 5. Social Media Posting
- Instagram support
- YouTube support
- Post confirmation with link
- Success notifications

---

## 💳 Pricing Plans (Feature Gating)

| Feature | Starter | Pro | Ultimate |
|---------|:-------:|:---:|:--------:|
| Caption Generation | ✅ | ✅ | ✅ |
| Image Editing | ❌ | ✅ | ✅ |
| Media Enhancement | ❌ | ✅ | ✅ |
| Social Posting | ❌ | ❌ | ✅ |

**Implementation:** Logical feature restriction is implemented in `src/config/planCapabilities.js`. Locked features display upgrade prompts.

---

## 🔌 API Design

### Endpoint Structure
The frontend communicates with n8n via webhook endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/webhook/generate-caption` | POST | Generate caption + hashtags |
| `/webhook/edit-image` | POST | AI image editing |
| `/webhook/enhance-media` | POST | Quality enhancement |
| `/webhook/post-social` | POST | Publish to platforms |

### Request Format
```javascript
// Example: Caption Generation
POST /webhook/generate-caption
Content-Type: multipart/form-data

{
  "media": <File>,
  "tone": "professional",
  "platform": "instagram",
  "includeEmojis": true
}
```

### Response Format
```javascript
// Example: Caption Response
{
  "success": true,
  "caption": "✨ Capturing moments that matter...",
  "hashtags": ["photooftheday", "instagood", "creative"]
}
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development
```bash
# Clone repository
git clone https://github.com/rajeevmps/ai-media-uploader.git
cd ai-media-uploader

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create `.env` file:
```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

---

## 🌐 Deployment

### Production URL
https://ai-media-uploader-32coo3ylg-rajeevs-projects-b809f2fb.vercel.app/

### CI/CD Pipeline
```
Local Code → GitHub Push → Vercel Auto-Deploy
```

Every push to `main` branch triggers automatic deployment.

---

## 🗺️ Future Roadmap

### Phase 2: Full Backend Integration
- [ ] Set up n8n cloud instance
- [ ] Integrate OpenAI GPT-4 Vision for captions
- [ ] Add Stability AI for image editing
- [ ] Implement Instagram Graph API posting

### Phase 3: Advanced Features
- [ ] Bulk processing (multiple files)
- [ ] Scheduled posting
- [ ] Analytics dashboard
- [ ] Team collaboration

### Phase 4: Mobile App
- [ ] React Native mobile app
- [ ] Offline mode support
- [ ] Push notifications

---

## 📁 Project Structure

```
ai-media-uploader/
├── src/
│   ├── components/
│   │   ├── features/     # Core feature components
│   │   ├── layout/       # App layout (Sidebar, Header)
│   │   ├── ui/           # Reusable UI components
│   │   └── workflow/     # Workflow management
│   ├── config/           # Feature flags & plans
│   ├── context/          # React Context (Auth)
│   ├── hooks/            # Custom hooks
│   ├── services/         # API & storage services
│   └── styles/           # Global styles
├── public/               # Static assets
└── package.json
```

---

## 🎖️ API Choice Justification

### Why OpenAI GPT-4 Vision for Captions?
- Best-in-class image understanding
- Natural language generation
- Supports multiple tones/styles
- Cost-effective at scale

### Why Stability AI for Image Editing?
- InstructPix2Pix for text-based editing
- High-quality outputs
- Reasonable API pricing
- Fast processing times

### Why n8n for Backend?
- Visual workflow automation
- Easy third-party integrations
- Webhook support for frontend
- No-code friendly
- Self-hostable option

### Why Vercel for Deployment?
- Native Vite support
- Free tier with generous limits
- Automatic CI/CD from GitHub
- Global CDN distribution

---

## 👨‍💻 Author

**Rajeev**
- GitHub: [@rajeevmps](https://github.com/rajeevmps)
- Email: mpsrajeev@gmail.com

---

## 📄 License

This project is created for educational/evaluation purposes.
