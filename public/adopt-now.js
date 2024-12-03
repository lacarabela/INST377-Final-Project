async function createAdopter() {
    console.log('Creating Adopter');
    await fetch(`${host}/adopter`, {
      method: 'POST',
      body: JSON.stringify({
        person_id: `${document.getElementById('person_id').value}`,
        first_name: `${document.getElementById('firstName').value}`,
        last_name: `${document.getElementById('lastName').value}`,
        address: `${document.getElementById('address').value}`,
        city: `${document.getElementById('city').value}`,
        state: `${document.getElementById('state').value}`,
        zip: `${document.getElementById('zip').value}`,
        email: `${document.getElementById('email').value}`,
        cell: `${document.getElementById('cell').value}`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  }