function scrollToDemo() {
  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

async function performSearch(loadAll = false) {
  const dest = document.getElementById('destCountry')?.value.trim() || '';
  const home = document.getElementById('homeCountry')?.value.trim() || '';

  let url = 'http://localhost:3000/api/search';

  if (!loadAll && (dest || home)) {
    url += `?destination=${encodeURIComponent(dest)}&home=${encodeURIComponent(home)}`;
  }

  const res = await fetch(url);
  const users = await res.json();

  const container = document.getElementById('searchResults');
  container.innerHTML = '';

  if (!users.length) {
    container.innerHTML = '<p class="placeholder">No users found matching your search.</p>';
    return;
  }

  users.forEach(user => {
  const card = document.createElement('div');
  card.className = 'profile-card';

  card.innerHTML = `
    <div class="profile-header">
      <img src="https://www.w3schools.com/howto/img_avatar.png" class="avatar" alt="User Avatar">
      <div>
        <h4>${user.username}</h4>
        <p>${user.email}</p>
      </div>
    </div>
    <div class="profile-details">
      <p><strong>From:</strong> ${user.home_country}</p>
      <p><strong>Going to:</strong> ${user.destination_country}</p>
    </div>
    <button class="connect-btn" onclick="connectToUser('${user.email}')">Connect</button>
  `;

  container.appendChild(card);
});

}

async function connectToUser(targetEmail) {
  const currentUserEmail = localStorage.getItem('userEmail'); // or get from session

  if (!currentUserEmail) {
    alert('You must be logged in to connect.');
    return;
  }

  const res = await fetch('http://localhost:3000/api/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: currentUserEmail,
      to: targetEmail
    })
  });

  const result = await res.json();
  alert(result.message);
}

function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(sec => {
              sec.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');

            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            // Load default users if search tab is opened
            if (sectionId === 'search') {
                performSearch(true);
            }
}


function logout() {

  alert("Logged out");
  localStorage.clear();
  window.location.href = "login.html";
}

        // Populate profile from localStorage
const user = JSON.parse(localStorage.getItem('profile')) || {
  username: 'John Doe',
  email: 'john@example.com',
  homeCountry: 'India',
  destinationCountry: 'Canada'
};

// document.getElementById('signupForm').addEventListener('submit', function (e) {
//   e.preventDefault();

//   const data = {
//     username: document.getElementById('username').value.trim(),
//     email: document.getElementById('email').value.trim(),
//     password: document.getElementById('password').value.trim(),
//     homeCountry: document.getElementById('homeCountry').value.trim(),
//     destinationCountry: document.getElementById('destinationCountry').value.trim(),
//   };

//   // Basic client-side validation
//   if (!data.username || !data.email || !data.password || !data.homeCountry || !data.destinationCountry) {
//     alert('Please fill out all fields.');
//     return;
//   }

//   if (data.password.length < 6) {
//     alert('Password must be at least 6 characters.');
//     return;
//   }

//   console.log("Form submitted successfully:", data);

//   // Placeholder for sending data to backend or database
//   alert('Signup successful! (In future, this will save to the database)');
// });


// document.getElementById('signupForm').addEventListener('submit', async function (e) {
//   e.preventDefault();

//   const data = {
//     username: document.getElementById('username').value.trim(),
//     email: document.getElementById('email').value.trim(),
//     password: document.getElementById('password').value.trim(),
//     homeCountry: document.getElementById('homeCountry').value.trim(),
//     destinationCountry: document.getElementById('destinationCountry').value.trim(),
//   };

//   const res = await fetch('http://localhost:3000/api/signup', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data)
//   });

//   const result = await res.json();
//   alert(result.message);
// });