/**
 * FIFA World Cup Scoreboard Control Panel
 * Manages scoreboard state and broadcasts updates to overlay
 */

class ScoreboardControl {
    constructor() {
        this.state = {
            homeTeam: 'Argentina',
            awayTeam: 'France',
            homeScore: 0,
            awayScore: 0,
            matchTime: 0,
            matchPeriod: 2,
            stoppageTime: 0,
            homeYellowCards: 0,
            homeRedCards: 0,
            awayYellowCards: 0,
            awayRedCards: 0,
            homeLogo: null,
            awayLogo: null,
            matchActive: false
        };

        this.presetTeams = [
            { name: 'Argentina', logo: 'https://flagcdn.com/256x192/ar.png' },
            { name: 'Brazil', logo: 'https://flagcdn.com/256x192/br.png' },
            { name: 'France', logo: 'https://flagcdn.com/256x192/fr.png' },
            { name: 'Germany', logo: 'https://flagcdn.com/256x192/de.png' },
            { name: 'Spain', logo: 'https://flagcdn.com/256x192/es.png' },
            { name: 'England', logo: 'https://flagcdn.com/256x192/gb.png' },
            { name: 'Italy', logo: 'https://flagcdn.com/256x192/it.png' },
            { name: 'Netherlands', logo: 'https://flagcdn.com/256x192/nl.png' },
            { name: 'Belgium', logo: 'https://flagcdn.com/256x192/be.png' },
            { name: 'Portugal', logo: 'https://flagcdn.com/256x192/pt.png' },
            { name: 'Mexico', logo: 'https://flagcdn.com/256x192/mx.png' },
            { name: 'Japan', logo: 'https://flagcdn.com/256x192/jp.png' }
        ];

        this.initializeBroadcastChannel();
        this.loadStateFromLocalStorage();
        this.attachEventListeners();
        this.updateUI();
        this.createPresetTeams();
    }

    /**
     * Initialize BroadcastChannel for communication with overlay
     */
    initializeBroadcastChannel() {
        try {
            this.channel = new BroadcastChannel('fifa-scoreboard');
            console.log('BroadcastChannel initialized');
        } catch (error) {
            console.warn('BroadcastChannel not supported:', error);
            this.channel = null;
        }
    }

    /**
     * Attach event listeners to form inputs
     */
    attachEventListeners() {
        // Team names
        document.getElementById('homeTeamName').addEventListener('change', () => {
            this.state.homeTeam = document.getElementById('homeTeamName').value.toUpperCase() || 'HOME';
            this.broadcastUpdate();
            this.updateUI();
        });

        document.getElementById('awayTeamName').addEventListener('change', () => {
            this.state.awayTeam = document.getElementById('awayTeamName').value.toUpperCase() || 'AWAY';
            this.broadcastUpdate();
            this.updateUI();
        });

        // Team logos
        document.getElementById('homeLogo').addEventListener('change', () => {
            this.state.homeLogo = document.getElementById('homeLogo').value || null;
            this.broadcastUpdate();
        });

        document.getElementById('awayLogo').addEventListener('change', () => {
            this.state.awayLogo = document.getElementById('awayLogo').value || null;
            this.broadcastUpdate();
        });

        // Scores
        document.getElementById('homeScore').addEventListener('change', () => {
            this.state.homeScore = parseInt(document.getElementById('homeScore').value) || 0;
            this.broadcastUpdate();
            this.updateUI();
        });

        document.getElementById('awayScore').addEventListener('change', () => {
            this.state.awayScore = parseInt(document.getElementById('awayScore').value) || 0;
            this.broadcastUpdate();
            this.updateUI();
        });

        // Match time
        document.getElementById('matchMinutes').addEventListener('change', () => {
            this.updateMatchTime();
        });

        document.getElementById('matchSeconds').addEventListener('change', () => {
            this.updateMatchTime();
        });

        document.getElementById('matchPeriod').addEventListener('change', () => {
            this.state.matchPeriod = parseInt(document.getElementById('matchPeriod').value);
            this.broadcastUpdate();
            this.updateUI();
        });

        // Cards
        document.getElementById('homeYellow').addEventListener('change', () => {
            this.state.homeYellowCards = parseInt(document.getElementById('homeYellow').value) || 0;
            this.updateCardsDisplay();
        });

        document.getElementById('homeRed').addEventListener('change', () => {
            this.state.homeRedCards = parseInt(document.getElementById('homeRed').value) || 0;
            this.updateCardsDisplay();
        });

        document.getElementById('awayYellow').addEventListener('change', () => {
            this.state.awayYellowCards = parseInt(document.getElementById('awayYellow').value) || 0;
            this.updateCardsDisplay();
        });

        document.getElementById('awayRed').addEventListener('change', () => {
            this.state.awayRedCards = parseInt(document.getElementById('awayRed').value) || 0;
            this.updateCardsDisplay();
        });

        // Stoppage time
        document.getElementById('stoppageTime').addEventListener('change', () => {
            this.state.stoppageTime = parseInt(document.getElementById('stoppageTime').value) || 0;
        });
    }

    /**
     * Create preset team buttons
     */
    createPresetTeams() {
        const container = document.getElementById('presetTeams');
        container.innerHTML = '';

        this.presetTeams.forEach(team => {
            const btn = document.createElement('button');
            btn.className = 'btn preset-btn';
            btn.textContent = team.name;
            btn.onclick = (e) => {
                e.preventDefault();
                // Toggle between home and away
                if (this.lastPresetClick === 'away') {
                    this.setTeam('home', team);
                    this.lastPresetClick = 'home';
                } else {
                    this.setTeam('away', team);
                    this.lastPresetClick = 'away';
                }
            };
            container.appendChild(btn);
        });
    }

    /**
     * Set team from preset
     */
    setTeam(position, team) {
        if (position === 'home') {
            this.state.homeTeam = team.name.toUpperCase();
            this.state.homeLogo = team.logo;
            document.getElementById('homeTeamName').value = team.name;
            document.getElementById('homeLogo').value = team.logo;
        } else {
            this.state.awayTeam = team.name.toUpperCase();
            this.state.awayLogo = team.logo;
            document.getElementById('awayTeamName').value = team.name;
            document.getElementById('awayLogo').value = team.logo;
        }

        this.broadcastUpdate();
        this.updateUI();
    }

    /**
     * Update match time from input fields
     */
    updateMatchTime() {
        const minutes = parseInt(document.getElementById('matchMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('matchSeconds').value) || 0;
        this.state.matchTime = minutes * 60 + seconds;
        this.broadcastUpdate();
        this.updateUI();
    }

    /**
     * Increment score
     */
    incrementScore(team) {
        if (team === 'home') {
            this.state.homeScore++;
            document.getElementById('homeScore').value = this.state.homeScore;
        } else {
            this.state.awayScore++;
            document.getElementById('awayScore').value = this.state.awayScore;
        }
        this.broadcastUpdate();
        this.updateUI();
    }

    /**
     * Decrement score
     */
    decrementScore(team) {
        if (team === 'home') {
            this.state.homeScore = Math.max(0, this.state.homeScore - 1);
            document.getElementById('homeScore').value = this.state.homeScore;
        } else {
            this.state.awayScore = Math.max(0, this.state.awayScore - 1);
            document.getElementById('awayScore').value = this.state.awayScore;
        }
        this.broadcastUpdate();
        this.updateUI();
    }

    /**
     * Start match timer
     */
    startTimer() {
        this.broadcast('TIMER_START');
    }

    /**
     * Stop match timer
     */
    stopTimer() {
        this.broadcast('TIMER_STOP');
    }

    /**
     * Reset match timer
     */
    resetTimer() {
        this.broadcast('TIMER_RESET');
    }

    /**
     * Update stoppage time
     */
    updateStoppageTime() {
        this.state.stoppageTime = parseInt(document.getElementById('stoppageTime').value) || 0;
        this.broadcastUpdate();
    }

    /**
     * Update cards display
     */
    updateCardsDisplay() {
        this.renderCardDisplay('homeYellow', this.state.homeYellowCards);
        this.renderCardDisplay('homeRed', this.state.homeRedCards);
        this.renderCardDisplay('awayYellow', this.state.awayYellowCards);
        this.renderCardDisplay('awayRed', this.state.awayRedCards);
    }

    /**
     * Render card display
     */
    renderCardDisplay(type, count) {
        const container = document.getElementById(type + 'Display');
        container.innerHTML = '';

        const cardClass = type.includes('Yellow') ? 'yellow-card' : 'red-card';
        const icon = type.includes('Yellow') ? '🟨' : '🟥';

        for (let i = 0; i < count; i++) {
            const card = document.createElement('div');
            card.className = `card-icon ${cardClass}`;
            card.textContent = icon;
            container.appendChild(card);
        }
    }

    /**
     * Update cards
     */
    updateCards(team) {
        if (team === 'home') {
            this.state.homeYellowCards = parseInt(document.getElementById('homeYellow').value) || 0;
            this.state.homeRedCards = parseInt(document.getElementById('homeRed').value) || 0;
        } else {
            this.state.awayYellowCards = parseInt(document.getElementById('awayYellow').value) || 0;
            this.state.awayRedCards = parseInt(document.getElementById('awayRed').value) || 0;
        }

        this.broadcastUpdate();
        this.updateCardsDisplay();
    }

    /**
     * Play goal animation
     */
    playGoalAnimation(team) {
        this.broadcast('GOAL_ANIMATION', { team });

        // Visual feedback
        const btn = event.target;
        btn.style.opacity = '0.5';
        setTimeout(() => {
            btn.style.opacity = '1';
        }, 200);
    }

    /**
     * Update UI from state
     */
    updateUI() {
        document.getElementById('homeTeamName').value = this.state.homeTeam;
        document.getElementById('awayTeamName').value = this.state.awayTeam;
        document.getElementById('homeScore').value = this.state.homeScore;
        document.getElementById('awayScore').value = this.state.awayScore;

        // Update score display
        document.getElementById('scoreDisplay').textContent = `${this.state.homeScore} : ${this.state.awayScore}`;

        // Update timer display
        const minutes = Math.floor(this.state.matchTime / 60);
        const seconds = this.state.matchTime % 60;
        document.getElementById('timerDisplay').textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        document.getElementById('matchMinutes').value = minutes;
        document.getElementById('matchSeconds').value = seconds;
        document.getElementById('matchPeriod').value = this.state.matchPeriod;

        // Update cards display
        this.updateCardsDisplay();

        // Save state
        this.saveStateToLocalStorage();
    }

    /**
     * Reset all to defaults
     */
    resetAll() {
        if (confirm('Reset all settings to defaults?')) {
            this.state = {
                homeTeam: 'Argentina',
                awayTeam: 'France',
                homeScore: 0,
                awayScore: 0,
                matchTime: 0,
                matchPeriod: 2,
                stoppageTime: 0,
                homeYellowCards: 0,
                homeRedCards: 0,
                awayYellowCards: 0,
                awayRedCards: 0,
                homeLogo: null,
                awayLogo: null,
                matchActive: false
            };

            this.broadcastUpdate();
            this.updateUI();
        }
    }

    /**
     * Export settings as JSON
     */
    exportSettings() {
        const dataStr = JSON.stringify(this.state, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scoreboard-settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import settings from JSON
     */
    importSettings(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                this.state = { ...this.state, ...imported };
                this.broadcastUpdate();
                this.updateUI();
                alert('Settings imported successfully!');
            } catch (error) {
                alert('Error importing settings: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    /**
     * Broadcast state update
     */
    broadcastUpdate() {
        this.broadcast('STATE_UPDATE', this.state);
    }

    /**
     * Send broadcast message
     */
    broadcast(type, data = {}) {
        if (this.channel) {
            try {
                this.channel.postMessage({ type, data });
            } catch (error) {
                console.error('Error broadcasting:', error);
            }
        }

        // Also save to localStorage as fallback
        if (type === 'STATE_UPDATE') {
            this.saveStateToLocalStorage();
        }
    }

    /**
     * Save state to localStorage
     */
    saveStateToLocalStorage() {
        try {
            localStorage.setItem('fifaScoreboardState', JSON.stringify(this.state));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Load state from localStorage
     */
    loadStateFromLocalStorage() {
        try {
            const saved = localStorage.getItem('fifaScoreboardState');
            if (saved) {
                const loaded = JSON.parse(saved);
                this.state = { ...this.state, ...loaded };
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
}

// Initialize control panel
let scoreboardControl;
document.addEventListener('DOMContentLoaded', () => {
    scoreboardControl = new ScoreboardControl();
    console.log('FIFA World Cup Scoreboard Control Panel initialized');
});
