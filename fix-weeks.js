const fs = require('fs');
const filePath = 'app/api/git-private-contributions.json';

// Read the file
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Helper to format a Date to YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Process each year
Object.keys(data.contributionData).forEach(year => {
  const weeks = data.contributionData[year].weeks;
  
  // Process each week
  weeks.forEach(week => {
    const days = week.contributionDays;
    if (days.length === 0) return;
    
    // Find the earliest date in this week
    let firstDate = new Date(days[0].date);
    for (const day of days) {
      const date = new Date(day.date);
      if (date < firstDate) firstDate = date;
    }
    
    // Find the Sunday that starts this week
    const sunday = new Date(firstDate);
    sunday.setDate(sunday.getDate() - sunday.getDay());
    
    // Create a map of existing days
    const existingDays = {};
    for (const day of days) {
      existingDays[day.date] = day;
    }
    
    // Create a complete week (Sunday to Saturday)
    const completeWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      const dateStr = formatDate(date);
      
      if (existingDays[dateStr]) {
        // Use existing data
        completeWeek.push(existingDays[dateStr]);
      } else {
        // Create a new day with zero contributions
        completeWeek.push({
          date: dateStr,
          contributionCount: 0,
          intensity: 0
        });
      }
    }
    
    // Replace the original contribution days
    week.contributionDays = completeWeek;
  });
});

// Write the updated file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Updated JSON file with complete weeks from Sunday to Saturday.');
