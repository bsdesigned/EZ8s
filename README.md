# EZ8s - AI-Powered Productivity Timer

A Vue.js productivity application that combines an 8-minute timer with AI-generated content sections to help you stay focused and organized during work sessions.

## 🚀 Features

### ⏱️ Smart Timer
- **8-minute countdown timer** with start/pause/reset controls
- **Audio alerts** every minute with beep sound
- **Visual feedback** with border flash animations on all sections
- **Time-up notification** with distinct ding sound

### 🎯 Interactive Grid
- **8 content sections** in a responsive 2x4 grid layout
- **Click to select** sections with visual highlighting
- **Dynamic content display** with Bootstrap styling
- **Responsive design** that works on all screen sizes

### 🤖 AI Content Generation
- **Google Gemini integration** for high-quality HTML generation
- **Bootstrap 5 focused** - generates proper components and classes
- **Smart prompting** - optimized for web development content
- **Dual environment support** - works locally and in production

### 📝 Customizable Activity
- **Editable activity title** - click to rename your session
- **Persistent across sessions** with local storage

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, Bootstrap 5, Vite
- **AI**: Google Gemini 1.5 Flash API
- **Deployment**: Vercel with serverless functions
- **Audio**: Web Audio API for sound generation

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 16+
- Google Gemini API key (free at [Google AI Studio](https://aistudio.google.com/))

### Local Development
```bash
# Clone the repository
git clone <your-repo-url>
cd EZ8s

# Install dependencies
npm install

# Add your Gemini API key to src/App.vue (line 111)
# Replace: AIzaSyCNUokwcdh1UrXRKwpc3KavhimIMcK5zsk

# Start development server
npm run dev
```

### Production Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variable: `GEMINI_API_KEY=your_api_key_here`
4. Deploy!

## 📖 How to Use

1. **Set your activity**: Click the title to rename your work session
2. **Start the timer**: Click the green "Start" button
3. **Select a section**: Click any of the 8 grid sections
4. **Generate content**: Type a description and click "Generate"
5. **Stay focused**: Timer alerts keep you on track

### Example Prompts
- "create a todo list with checkboxes"
- "make a pricing table with 3 tiers"
- "build a contact form with validation styling"
- "create a progress bar showing project status"

## 🏗️ Architecture

### Environment Detection
The app automatically detects whether it's running locally or in production:
- **Local**: Direct Gemini API calls from browser
- **Production**: Secure API calls through Vercel serverless functions

### File Structure
```
EZ8s/
├── src/
│   ├── App.vue          # Main application component
│   └── main.js          # Vue app initialization
├── api/
│   └── generate.js      # Vercel serverless function for AI
├── index.html           # Entry point
├── package.json         # Dependencies and scripts
└── vite.config.js       # Build configuration
```

## 🔧 Configuration

### Timer Settings
- Default: 8 minutes (480 seconds)
- Alerts: Every 60 seconds
- Sounds: 800Hz beep (alerts), 1200Hz ding (completion)

### AI Settings
- Model: Gemini 1.5 Flash
- Max tokens: 1000
- Temperature: 0.7
- Focus: Bootstrap 5 HTML generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Message Format
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code restructuring
- `test:` adding tests
- `chore:` maintenance tasks

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Google Gemini for AI content generation
- Bootstrap team for the CSS framework
- Vue.js community for the reactive framework
- Vercel for seamless deployment