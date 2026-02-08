// ===================================
// Global Variables
// ===================================
let noClickCount = 0;
let yesSizeMultiplier = 1;
let isPlaying = false;

// ===================================
// DOM Elements
// ===================================
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const mainContent = document.getElementById('mainContent');
const successScreen = document.getElementById('successScreen');
const heartsContainer = document.getElementById('heartsContainer');
const romanticMusic = document.getElementById('romanticMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const shareBtn = document.getElementById('shareBtn');

// ===================================
// Initialize on Page Load
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Get name from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('name') || 'Sweetheart';
    
    // Set the name in both screens
    document.getElementById('userName').textContent = userName;
    document.getElementById('successName').textContent = userName;
    
    // Create floating hearts background
    createFloatingHearts();
    
    // Add interactive effects to elements
    addInteractiveEffects();
});

// ===================================
// Floating Hearts Background
// ===================================
function createFloatingHearts() {
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 800);
}

// ===================================
// Add Interactive Effects
// ===================================
function addInteractiveEffects() {
    // Make GIF interactive - creates hearts on click
    const gifContainer = document.querySelector('.gif-container');
    gifContainer.addEventListener('click', function(e) {
        createHeartBurst(e.clientX, e.clientY);
    });
    
    // Make sparkles interactive
    document.querySelectorAll('.sparkle').forEach(sparkle => {
        sparkle.addEventListener('click', function(e) {
            createSparkle(e.clientX, e.clientY);
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
    });
    
    // Make virtual gifts interactive (in success screen)
    setTimeout(() => {
        document.querySelectorAll('.gift-item').forEach(gift => {
            gift.addEventListener('click', function() {
                const icon = this.querySelector('.gift-icon');
                const rect = icon.getBoundingClientRect();
                createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            });
        });
    }, 100);
}

// ===================================
// No Button Behavior
// ===================================
// Move away on hover (desktop)
noBtn.addEventListener('mouseenter', function() {
    moveNoButton();
});

// Move away on touch (mobile)
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moveNoButton();
});

// Shrink on click
noBtn.addEventListener('click', function(e) {
    e.preventDefault();
    noClickCount++;
    
    // Shrink the No button
    const newSize = Math.max(0.5, 1 - (noClickCount * 0.15));
    noBtn.style.transform = `scale(${newSize})`;
    
    // Grow the Yes button
    yesSizeMultiplier += 0.3;
    yesBtn.style.transform = `scale(${yesSizeMultiplier})`;
    
    // Add shake animation to card
    document.querySelector('.valentine-card').classList.add('shake-animation');
    setTimeout(() => {
        document.querySelector('.valentine-card').classList.remove('shake-animation');
    }, 500);
    
    // Move the button
    moveNoButton();
});

// Function to move No button to random position
function moveNoButton() {
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate max positions to keep button in view
    const maxX = window.innerWidth - btnRect.width - 50;
    const maxY = window.innerHeight - btnRect.height - 50;
    
    // Generate random position
    const randomX = Math.random() * (maxX - 50) + 25;
    const randomY = Math.random() * (maxY - 50) + 25;
    
    // Apply position
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transition = 'all 0.3s ease';
}

// ===================================
// Yes Button Behavior
// ===================================
yesBtn.addEventListener('click', function() {
    // Trigger immediate confetti burst
    launchConfetti();
    
    // Show success screen with delay
    setTimeout(() => {
        successScreen.classList.add('active');
        
        // Play romantic music automatically
        playMusic();
        
        // Hide main content
        mainContent.style.display = 'none';
        
        // Continue confetti for success screen
        setTimeout(() => {
            launchSuccessConfetti();
        }, 300);
    }, 1000);
});

// ===================================
// Confetti & Hearts Explosion
// ===================================
function launchConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Confetti from left
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff6b9d', '#ffc0d3', '#c471ed', '#ffe5ec', '#ff85a2']
        });
        
        // Confetti from right
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ff6b9d', '#ffc0d3', '#c471ed', '#ffe5ec', '#ff85a2']
        });
    }, 250);
    
    // Big heart burst from center
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 160,
            origin: { y: 0.6 },
            colors: ['#ff6b9d', '#ffc0d3', '#c471ed', '#ffe5ec'],
            shapes: ['circle'],
            scalar: 1.2
        });
    }, 200);
}

// Additional confetti for success screen
function launchSuccessConfetti() {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff6b9d', '#ffc0d3', '#c471ed']
        });
        
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff6b9d', '#ffc0d3', '#c471ed']
        });
    }, 200);
}

// ===================================
// Music Controls
// ===================================
function playMusic() {
    // Set volume to comfortable level
    romanticMusic.volume = 0.5;
    
    // Attempt to play music automatically
    const playPromise = romanticMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            updatePlayPauseButton();
        }).catch(error => {
            // Auto-play was prevented (common on mobile)
            console.log("Auto-play prevented. Music ready to play with button.");
            
            // Automatically try to play when user interacts
            isPlaying = false;
            updatePlayPauseButton();
            
            // Try to play on any user interaction
            const tryPlay = () => {
                if (!isPlaying) {
                    romanticMusic.play().then(() => {
                        isPlaying = true;
                        updatePlayPauseButton();
                        document.removeEventListener('click', tryPlay);
                        document.removeEventListener('touchstart', tryPlay);
                    });
                }
            };
            
            document.addEventListener('click', tryPlay, { once: true });
            document.addEventListener('touchstart', tryPlay, { once: true });
        });
    }
}

// Play/Pause Button
playPauseBtn.addEventListener('click', function() {
    if (isPlaying) {
        romanticMusic.pause();
        isPlaying = false;
    } else {
        romanticMusic.play();
        isPlaying = true;
    }
    updatePlayPauseButton();
});

// Update Play/Pause Button Icon
function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.className = 'fas fa-pause';
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    } else {
        icon.className = 'fas fa-play';
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play';
    }
}

// ===================================
// Share Button
// ===================================
shareBtn.addEventListener('click', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('name') || 'Sweetheart';
    const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(userName)}`;
    const shareText = `💕 Will you be my Valentine? 💕`;
    
    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
        navigator.share({
            title: 'Be My Valentine',
            text: shareText,
            url: shareUrl
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackCopyToClipboard(shareUrl);
        });
    } else {
        // Fallback: Copy to clipboard
        fallbackCopyToClipboard(shareUrl);
    }
});

// Fallback copy to clipboard function
function fallbackCopyToClipboard(text) {
    // Create temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        
        // Show success feedback
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
        shareBtn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
        
        setTimeout(() => {
            shareBtn.innerHTML = originalText;
            shareBtn.style.background = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Could not copy link. Please copy manually: ' + text);
    }
    
    document.body.removeChild(tempInput);
}

// ===================================
// Mobile Touch Optimization
// ===================================
// Prevent default touch behavior to avoid double-tap zoom
let touchStartTime;

document.querySelectorAll('button').forEach(button => {
    // Handle touch events properly
    button.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
        this.classList.add('active');
    }, { passive: true });
    
    button.addEventListener('touchend', function(e) {
        const touchDuration = Date.now() - touchStartTime;
        
        // Only trigger click for quick taps (prevent accidental triggers)
        if (touchDuration < 500) {
            e.preventDefault();
            this.click();
        }
        
        this.classList.remove('active');
    });
    
    button.addEventListener('touchcancel', function() {
        this.classList.remove('active');
    });
});

// Optimize scrolling for success screen on mobile
if (successScreen) {
    let isScrolling = false;
    
    successScreen.addEventListener('touchstart', function() {
        isScrolling = false;
    }, { passive: true });
    
    successScreen.addEventListener('touchmove', function() {
        isScrolling = true;
    }, { passive: true });
    
    successScreen.addEventListener('touchend', function(e) {
        if (!isScrolling && e.target === this) {
            // Tapped on background, create sparkles
            const touch = e.changedTouches[0];
            createSparkle(touch.clientX, touch.clientY);
        }
    });
}

// Prevent pull-to-refresh on mobile when at top of page
let lastTouchY = 0;
let preventPullToRefresh = false;

document.addEventListener('touchstart', function(e) {
    if (e.touches.length !== 1) return;
    lastTouchY = e.touches[0].clientY;
    preventPullToRefresh = window.pageYOffset === 0;
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    const touchY = e.touches[0].clientY;
    const touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;

    if (preventPullToRefresh) {
        // Prevent pull-to-refresh
        if (touchYDelta > 0) {
            e.preventDefault();
        }
    }
}, { passive: false });

// ===================================
// Easter Eggs & Additional Effects
// ===================================
// Add sparkle effect on click anywhere
document.addEventListener('click', function(e) {
    createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = '20px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkleDisappear 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Create heart burst effect
function createHeartBurst(x, y) {
    const hearts = ['❤️', '💕', '💖', '💗', '💓'];
    const numberOfHearts = 8;
    
    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        
        const angle = (Math.PI * 2 * i) / numberOfHearts;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        heart.style.animation = `heartBurst${i} 1s ease-out forwards`;
        
        const keyframes = `
            @keyframes heartBurst${i} {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(1) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(${tx}px, ${ty}px) scale(0.5) rotate(${Math.random() * 360}deg);
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
            styleSheet.remove();
        }, 1000);
    }
}

// Add sparkle disappear animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleDisappear {
        0% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        100% {
            opacity: 0;
            transform: scale(2) translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Custom Message from URL (Optional)
// ===================================
// You can extend this to allow custom messages via URL parameters
const customMessage = new URLSearchParams(window.location.search).get('message');
if (customMessage) {
    document.querySelector('.valentine-subtitle').textContent = decodeURIComponent(customMessage);
}

// ===================================
// Keyboard Navigation Support
// ===================================
document.addEventListener('keydown', function(e) {
    // Press Enter or Y for Yes
    if (e.key === 'Enter' || e.key === 'y' || e.key === 'Y') {
        if (mainContent.style.display !== 'none') {
            yesBtn.click();
        }
    }
    
    // Press N for No
    if (e.key === 'n' || e.key === 'N') {
        if (mainContent.style.display !== 'none') {
            noBtn.click();
        }
    }
    
    // Press Space for Play/Pause music
    if (e.key === ' ' && successScreen.classList.contains('active')) {
        e.preventDefault();
        playPauseBtn.click();
    }
});

// ===================================
// Console Easter Egg
// ===================================
console.log('%c💕 Will you be my Valentine? 💕', 'font-size: 30px; color: #ff6b9d; font-weight: bold; text-shadow: 2px 2px 4px rgba(255, 107, 157, 0.3);');
console.log('%cMade with ❤️ for someone special', 'font-size: 14px; color: #c471ed; font-style: italic;');