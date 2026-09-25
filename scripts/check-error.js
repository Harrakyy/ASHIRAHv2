const http = require('http');
http.get('http://localhost:3000', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    const idx = data.indexOf('"message":"');
    if (idx !== -1) {
      console.log('MESSAGE:', data.slice(idx + 11, idx + 800));
    }
  });
}).on('error', err => console.log('Network error:', err.message));
