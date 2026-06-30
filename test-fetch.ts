import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://0.0.0.0:3000/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'A beautiful sunset' })
    });
    console.log('Status:', res.status);
    const data = await res.text();
    console.log('Data:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
