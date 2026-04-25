// ThumbAI - Viral Thumbnail Generator
// Powered by Nano Banana 2 AI

const wizardData = {
  niche: '',
  topic: '',
  emotion: '',
  style: '',
  text: '',
  color: '#FFFFFF'
};

// Wizard navigation
const optionBtns = document.querySelectorAll('.option-btn');
const nextBtns = document.querySelectorAll('.btn-next');

optionBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    this.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    const step = this.closest('.wizard-step');
    const nextBtn = step.querySelector('.btn-next');
    if (nextBtn) nextBtn.disabled = false;
    const key = step.dataset.step === '1' ? 'niche' : 'emotion';
    wizardData[key] = this.dataset.value;
  });
});

nextBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const currentStep = document.querySelector('.wizard-step.active');
    const currentNum = parseInt(currentStep.dataset.step);
    
    if (currentNum === 2) {
      const topic = document.getElementById('videoTopic');
      if (topic) wizardData.topic = topic.value;
    }
    
    currentStep.classList.remove('active');
    const nextStep = document.querySelector(`[data-step="${currentNum + 1}"]`);
    if (nextStep) nextStep.classList.add('active');
  });
});

// Color selection
const colorDots = document.querySelectorAll('.color-dot');
colorDots.forEach(dot => {
  dot.addEventListener('click', function() {
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    this.classList.add('active');
    wizardData.color = this.dataset.color;
  });
});

// Generate thumbnail
const generateBtn = document.getElementById('generateBtn');
if (generateBtn) {
  generateBtn.addEventListener('click', async () => {
    const thumbText = document.getElementById('thumbText');
    if (thumbText) wizardData.text = thumbText.value;
    
    // Show result step
    document.querySelector('.wizard-step.active').classList.remove('active');
    document.querySelector('[data-step="result"]').classList.add('active');
    
    await renderThumbnail();
  });
}

// Render thumbnail using Canvas
async function renderThumbnail() {
  const canvas = document.getElementById('thumbCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 1280, 720);
  grad.addColorStop(0, '#667eea');
  grad.addColorStop(1, '#764ba2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1280, 720);
  
  // Add pattern overlay
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, 1280, 720);
  
  // Text
  const text = wizardData.text || `${wizardData.niche.toUpperCase()}: ${wizardData.topic.substring(0,60)}`;
  
  ctx.font = 'bold 120px Inter, sans-serif';
  ctx.fillStyle = wizardData.color;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap
  const words = text.split(' ');
  let lines = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 1100) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  
  const lineHeight = 140;
  const startY = 360 - (lines.length * lineHeight) / 2;
  
  lines.forEach((line, i) => {
    ctx.strokeText(line, 640, startY + i * lineHeight);
    ctx.fillText(line, 640, startY + i * lineHeight);
  });
  
  // Emoji based on emotion
  const emojiMap = {
    curiosity: '🤔',
    shock: '😱',
    fomo: '🔥',
    inspiration: '💡',
    fear: '😰',
    humor: '😂',
    trust: '🤝',
    excitement: '🚀'
  };
  
  const emoji = emojiMap[wizardData.emotion] || '🎯';
  ctx.font = '180px Arial';
  ctx.fillText(emoji, 1100, 600);
  
  // Watermark
  ctx.font = '24px Inter';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.textAlign = 'right';
  ctx.fillText('Made with ThumbAI', 1250, 690);
}

// Download function
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const canvas = document.getElementById('thumbCanvas');
    const link = document.createElement('a');
    link.download = `thumbai-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// Regenerate
const regenBtn = document.getElementById('regenerateBtn');
if (regenBtn) {
  regenBtn.addEventListener('click', () => {
    document.querySelector('[data-step="result"]').classList.remove('active');
    document.querySelector('[data-step="1"]').classList.add('active');
  });
}
