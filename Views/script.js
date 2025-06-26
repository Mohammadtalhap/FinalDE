function scrollToDemo() {
  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

async function performSearch() {
    const dest = document.getElementById('destCountry').value.trim();
    const home = document.getElementById('homeCountry').value.trim();

    const res = await fetch(`http://localhost:3000/api/search?destination=${dest}&home=${home}`);
    const users = await res.json();

    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (users.length === 0) {
      container.innerHTML = '<p class="placeholder">No users found matching your search.</p>';
      return;
    }

    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'user-card';
      card.innerHTML = `
        <h4>${user.username}</h4>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>From:</strong> ${user.home_country}</p>
        <p><strong>Going to:</strong> ${user.destination_country}</p>
      `;
      container.appendChild(card);
    });
}

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