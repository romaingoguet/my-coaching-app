// API Base URL - adjust if needed
const API_BASE_URL = 'http://localhost:3000';

// DOM elements
const contentDiv = document.getElementById('content');

async function loadWellnessAndActivities() {
    try {
        // Fetch wellness data and activities in parallel
        const [wellnessResponse, activitiesResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/athlete/wellness`),
            fetch(`${API_BASE_URL}/athlete/activities`)
        ]);

        if (!wellnessResponse.ok || !activitiesResponse.ok) {
            throw new Error('Failed to load data');
        }

        const wellnessData = await wellnessResponse.json();
        const activitiesData = await activitiesResponse.json();

        // Render the content
        renderContent(wellnessData, activitiesData);
    } catch (error) {
        console.error('Error loading data:', error);
        contentDiv.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-600 font-semibold">Error: Failed to load your wellness and activity data</p>
                <p class="text-gray-500 text-sm mt-2">${error.message}</p>
            </div>
        `;
    }
}

function renderContent(wellnessData, activitiesData) {
    // Create sections for wellness and activities
    let html = '';

    // Wellness Section
    html += '<h2 class="text-2xl font-bold text-gray-800 mb-4">💚 Wellness Metrics</h2>';

    if (wellnessData.length > 0) {
        html += createWellnessCards(wellnessData);
    } else {
        html += '<p class="text-gray-500 text-center py-4">No wellness data available yet</p>';
    }

    // Activities Section (this week)
    html += '<h2 class="text-2xl font-bold text-gray-800 mb-4 mt-6">🏃 Weekly Activities</h2>';

    if (activitiesData.length > 0) {
        html += createActivitiesList(activitiesData);
    } else {
        html += '<p class="text-gray-500 text-center py-4">No activities recorded this week yet</p>';
    }

    contentDiv.innerHTML = html;
}

function createWellnessCards(data) {
    const today = new Date().toISOString().split('T')[0];

    // Find the most recent wellness entry
    const latestEntry = data.find(item => item.date === today) || data[data.length - 1];

    return `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            ${createMetricCard('Resting Heart Rate', latestEntry.restingHeartRate, 'bpm', '🫀')}
            ${createMetricCard('HRV (RMSSD)', latestEntry.hrv, 'ms', '❤️')}
            ${createMetricCard('Sleep Duration', formatDuration(latestEntry.sleepSeconds), '', '😴')}
            ${createMetricCard('Sleep Quality', getSleepQualityText(latestEntry.sleepQuality), '', '🌙')}
            ${createMetricCard('Fatigue Level', latestEntry.fatigue, '%', '⚡')}
            ${createMetricCard('Soreness Level', latestEntry.soreness, '%', '💪')}
            ${createMetricCard('Stress Level', latestEntry.stress, '%', '😌')}
            ${createMetricCard('Mood', getMoodText(latestEntry.mood), '', '😊')}
        </div>

        <h3 class="text-xl font-semibold text-gray-700 mb-2">Recent Wellness History</h3>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HRV (ms)</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sleep (hrs)</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fatigue</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Soreness</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stress</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mood</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${data.map(item => `
                        <tr>
                            <td class="px-4 py-3 text-sm">${formatDate(item.date)}</td>
                            <td class="px-4 py-3 text-sm">${item.hrv}</td>
                            <td class="px-4 py-3 text-sm">${(item.sleepSeconds / 3600).toFixed(1)}h</td>
                            <td class="px-4 py-3 text-sm">${item.fatigue}%</td>
                            <td class="px-4 py-3 text-sm">${item.soreness}%</td>
                            <td class="px-4 py-3 text-sm">${item.stress}%</td>
                            <td class="px-4 py-3 text-sm">${getMoodEmoji(item.mood)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function createActivitiesList(activities) {
    return `
        <div class="space-y-4">
            ${activities.map(activity => {
        const date = new Date(activity.date);
        const dayName = getFrenchDayAbbreviation(date.getDay());

        return `
                    <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                        <h3 class="font-semibold text-gray-800">${activity.name || 'Activity'}</h3>
                        <p class="text-sm text-gray-600 mt-1">📅 ${dayName} - ${formatDate(activity.date)}</p>
                        ${activity.distanceMeters ? `<p class="text-sm text-gray-500">🏃 Distance: ${(parseFloat(activity.distanceMeters) / 1000).toFixed(2)} km</p>` : ''}
                        ${activity.durationSeconds ? `<p class="text-sm text-gray-500">⏱️ Duration: ${formatDuration(parseInt(activity.durationSeconds))}</p>` : ''}
                        ${activity.averagePowerWatts ? `<p class="text-sm text-gray-500">⚡ Avg Power: ${parseInt(activity.averagePowerWatts)} W</p>` : ''}
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function getFrenchDayAbbreviation(dayIndex) {
    // dayIndex: 0=Sunday, 1=Monday, ..., 6=Saturday
    const frenchDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return frenchDays[dayIndex];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function createMetricCard(title, value, unit, icon) {
    return `
        <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <h3 class="text-gray-600 text-sm font-medium">${title}</h3>
            <p class="text-2xl font-bold text-gray-800 mt-1">${value}${unit || ''}</p>
        </div>
    `;
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours > 0 ? hours + 'h' : ''}${minutes > 0 ? minutes + 'm' : ''}`.trim();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getSleepQualityText(quality) {
    if (quality === 1) return 'Poor';
    if (quality === 2) return 'Fair';
    if (quality === 3) return 'Good';
    if (quality === 4) return 'Very Good';
    return 'Excellent';
}

function getMoodText(mood) {
    const moods = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];
    return moods[mood - 1] || mood;
}

function getMoodEmoji(mood) {
    const moods = [
        '😫', // Terrible
        '😕', // Bad
        '😐', // Okay
        '🙂', // Good
        '🤩'  // Great
    ];
    return moods[mood - 1] || '😊';
}

// Load data when page loads
loadWellnessAndActivities();