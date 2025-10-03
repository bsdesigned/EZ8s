<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Header Row -->
    <div class="container-fluid py-3 border-bottom">
      <div class="row align-items-center">
        <div class="col-3"></div>
        <div class="col-6">
          <h1 contenteditable="true" class="text-center" @blur="updateActivity">{{ activity }}</h1>
        </div>
        <div class="col-3 text-end">
          <div class="d-flex align-items-center justify-content-end gap-2">
            <span class="h4 mb-0 font-monospace">{{ formatTime(timeLeft) }}</span>
            <button v-if="!isRunning" @click="startTimer" class="btn btn-success btn-sm">Start</button>
            <button v-if="isRunning" @click="pauseTimer" class="btn btn-warning btn-sm">Pause</button>
            <button @click="resetTimer" class="btn btn-danger btn-sm">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Display Row -->
    <div class="container-fluid flex-grow-1 py-4">
      <div class="row g-3 h-100">
        <div 
          v-for="(section, index) in sections" 
          :key="index"
          class="col-md-3 col-sm-6"
          style="height: 50%;"
        >
          <div 
            class="card h-100 position-relative" 
            :class="{ 'border-primary': selectedSection === index, 'border-warning border-3': isFlashing }"
            @click="selectSection(index)"
            style="cursor: pointer; min-height: 200px; max-height: 300px;"
          >
            <button 
              v-if="section.history.length > 0"
              @click.stop="goBackSection(index)"
              class="btn btn-sm btn-outline-secondary position-absolute"
              style="top: 5px; right: 5px; z-index: 10; padding: 2px 6px;"
              title="Go back to previous version"
            >
              ←
            </button>
            <div class="card-body p-2 overflow-auto" style="font-size: 0.85rem;">
              <div class="text-center text-muted" v-if="!section.content">
                Section {{ index + 1 }}
              </div>
              <div v-else v-html="section.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Prompt Row -->
    <div class="container-fluid py-3 border-top bg-light mt-auto">

      <div class="row">
        <div class="col-12">
          <div class="d-flex gap-2">
            <input 
              v-model="prompt" 
              type="text" 
              class="form-control" 
              placeholder="Describe what you want to create..."
              @keyup.enter="generateContent"
              :disabled="isGenerating"
            >
            <button 
              @click="generateContent" 
              class="btn btn-primary"
              :disabled="!prompt.trim() || selectedSection === null || isGenerating"
            >
              {{ isGenerating ? 'Generating...' : 'Generate' }}
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activity: 'My Activity',
      sections: Array(8).fill(null).map(() => ({ content: '', prompt: '', history: [] })),
      selectedSection: null,
      prompt: '',
      timeLeft: 480,
      isRunning: false,
      isFlashing: false,
      timer: null,
      flashTimer: null,
      apiKey: localStorage.getItem('hfApiKey') || '',
      isGenerating: false,
      showApiKeyInput: false
    }
  },
  methods: {
    updateActivity(event) {
      this.activity = event.target.textContent
    },
    selectSection(index) {
      this.selectedSection = index
      this.prompt = this.sections[index].prompt || ''
    },
    async generateContent() {
      if (this.selectedSection === null || !this.prompt.trim()) return
      
      this.isGenerating = true
      
      try {
        const section = this.sections[this.selectedSection]
        
        // Save current content to history before generating new content
        if (section.content) {
          section.history.unshift({ content: section.content, prompt: section.prompt })
          // Keep only last 3 versions
          if (section.history.length > 3) {
            section.history = section.history.slice(0, 3)
          }
        }
        
        // Save current prompt
        section.prompt = this.prompt
        
        // Check if running locally (development)
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        
        if (isLocal) {
          // Direct Gemini API call for local development
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCJ5MjdGcW3cJQUf1Pk0G78ZxGpAg2K8go`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Create compact HTML content using Bootstrap 5 classes for: "${this.prompt}". 

Constraints:
- Content must fit in a small card (200-300px height)
- Use small Bootstrap components (btn-sm, small text, compact spacing)
- Maximum 3-5 elements total
- Use classes like: p-1, m-1, small, btn-sm, badge, list-group-item-sm
- Keep text concise and minimal
- Return ONLY the HTML code without explanations
- Do not wrap in markdown code blocks or \`\`\`html tags

Example good sizes: small buttons, badges, short lists (2-3 items), mini forms, compact alerts.`
                }]
              }],
              generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7
              }
            })
          })
          
          if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.status}`)
          }
          
          const data = await response.json()
          const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || `<div class="alert alert-info">${this.prompt}</div>`
          section.content = this.cleanHtmlResponse(rawContent)
        } else {
          // Use Vercel API route for production
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prompt: this.prompt
            })
          })
          
          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
          }
          
          const data = await response.json()
          section.content = this.cleanHtmlResponse(data.content)
        }

      } catch (error) {
        console.error('Generation failed:', error)
        alert('Failed to generate content. Please try again.')
      } finally {
        this.isGenerating = false
      }
    },
    goBackSection(sectionIndex) {
      const section = this.sections[sectionIndex]
      if (section.history.length === 0) return
      
      const previousVersion = section.history.shift()
      
      // Save current version to history
      section.history.unshift({ content: section.content, prompt: section.prompt })
      
      // Restore previous version
      section.content = previousVersion.content
      section.prompt = previousVersion.prompt
      
      // Update prompt input if this section is currently selected
      if (this.selectedSection === sectionIndex) {
        this.prompt = previousVersion.prompt
      }
    },
    cleanHtmlResponse(text) {
      if (!text) return text
      // Remove markdown code block formatting
      return text
        .replace(/^```html\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()
    },
    saveApiKey() {
      localStorage.setItem('hfApiKey', this.apiKey)
      this.showApiKeyInput = false
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    startTimer() {
      this.isRunning = true
      this.timer = setInterval(() => {
        this.timeLeft--
        if (this.timeLeft % 60 === 0) {
          this.flashWarning()
          this.playSound()
        }
        if (this.timeLeft <= 0) {
          this.pauseTimer()
          this.playTimeUpSound()
        }
      }, 1000)
    },
    pauseTimer() {
      this.isRunning = false
      clearInterval(this.timer)
    },
    resetTimer() {
      this.pauseTimer()
      this.timeLeft = 480
    },
    flashWarning() {
      this.isFlashing = true
      setTimeout(() => {
        this.isFlashing = false
      }, 1000)
    },
        playSound() {
      // Create a simple beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch (error) {
        console.log('Audio not supported')
      }
    },
    playTimeUpSound() {
      // Create a ding sound for time up
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 1200
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 1.5)
      } catch (error) {
        console.log('Audio not supported')
      }
    }
  }
}
</script>
