async function createAdopter() {
    console.log('Creating Adopter');
    await fetch(`${host}/adopter`, {
      method: 'POST',
      body: JSON.stringify({
        first_name: `${document.getElementById('firstName').value}`,
        last_name: `${document.getElementById('lastName').value}`,
        address: `${document.getElementById('address').value}`,
        email: `${document.getElementById('email').value}`,
        cell: `${document.getElementById('cell').value}`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  }