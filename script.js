const app = 'Personal Finance Tracker';
const VISITS_KEY = 'personal-finance-tracker-visits';

const padTwoDigits = num => num.toString().padStart(2, "0");

const formatDate = (date, dateDiveder = '-') => {
  return (
    [
      date.getFullYear(),
      padTwoDigits(date.getMonth() + 1),
      padTwoDigits(date.getDate()),
    ].join(dateDiveder) +
    " " +
    [
      padTwoDigits(date.getHours()),
      padTwoDigits(date.getMinutes()),
      padTwoDigits(date.getSeconds()),
    ].join(":")
  );
}

async function getVisitorIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return 'Unknown IP';
    }
}

async function trackVisitor() {
    const ip = await getVisitorIP();
    const time = formatDate(new Date());
    let visits = JSON.parse(localStorage.getItem(VISITS_KEY)) || [];
    visits.push({ip, time, app});
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
    persistVisits();
}

async function persistVisits() {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  // headers.append('mode', 'no-cors');
  const response = await fetch('https://enabled-humpback-lively.ngrok-free.app/save-visits.php', {
    method: 'POST',
    body: JSON.stringify(localStorage.getItem(VISITS_KEY)),
    headers
  });

  if (response.ok === true && response.status === 200) {
    console.log(response);
    localStorage.setItem(VISITS_KEY, JSON.stringify([]));
  }

}

trackVisitor();
