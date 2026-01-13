# 🌙 NoorRecite

> A modern, open-source Quran web application built with Next.js, TypeScript, and Tailwind CSS

NoorRecite is a fast, accessible, and distraction-free Quran reading experience designed for Muslims worldwide. Built with performance and user experience in mind, it provides structured ayah navigation, translations, tafsir, and reading progress tracking.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- 📖 **Complete Quran Text** - All 114 Surahs with Arabic text and translations
- 🎯 **Reading Tracker** - Track verses read, time spent, and maintain reading streaks
- 📊 **Progress Dashboard** - Visualize your daily reading activity with charts
- 🔍 **Search** - Search across the entire Quran
- 🔖 **Bookmarks** - Save and organize your favorite verses
- 📝 **Tafsir Integration** - Access scholarly interpretations
- 🌐 **Multiple Translations** - Read in various languages
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- ⚡ **Fast Performance** - Built with Next.js 15 and Turbopack
- 🤖 **AI Features** - Powered by Google Gemini for enhanced learning

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YKhan142008/noor-recite.git
cd noor-recite
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (Optional - for user data persistence)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI (Optional - for AI features)
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

> **Note**: The app works without these environment variables, but some features like cloud sync and AI assistance will be disabled.

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:9002](http://localhost:9002)

## 📁 Project Structure

```
noor-recite/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── read/         # Quran reading pages
│   │   ├── search/       # Search functionality
│   │   └── bookmarks/    # Bookmarks page
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard widgets
│   │   ├── layout/       # Layout components
│   │   ├── read/         # Reading interface
│   │   ├── search/       # Search components
│   │   └── ui/           # Reusable UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and data
│   │   ├── tafsir/       # Tafsir data
│   │   └── translations/ # Translation files
│   └── ai/               # AI integration (Genkit)
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 9002 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run genkit:dev` | Start Genkit AI development server |

## 🔧 Configuration

### Port Configuration

The app runs on port **9002** by default. To change this, edit `package.json`:

```json
"scripts": {
  "dev": "next dev --turbopack -p YOUR_PORT"
}
```

### Tailwind CSS

Customize the theme in `tailwind.config.ts`. The project uses a custom color palette optimized for Quran reading.

### Firebase Setup (Optional)

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy your config to `.env.local`
4. Update Firebase rules for security

## 🎨 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) (optional)
- **AI**: [Google Gemini](https://ai.google.dev/) via [Genkit](https://firebase.google.com/docs/genkit)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure `npm run typecheck` passes
- Test on multiple browsers

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Quran text from [Tanzil Project](https://tanzil.net/)
- Translations from various authenticated sources
- UI inspiration from modern Islamic apps
- Community contributors and testers

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/YKhan142008/noor-recite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YKhan142008/noor-recite/discussions)

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Built with ❤️ for the Muslim community**
