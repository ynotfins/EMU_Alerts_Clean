const fetch = require('node-fetch');

async function main(){
  const token = process.argv[2];
  if (!token) { 
    console.error('Usage: node tools/send-push.js <ExpoPushToken>'); 
    process.exit(1); 
  }
  
  const payload = {
    to: token,
    sound: 'default',
    title: 'EMU Alerts',
    body: 'Server-driven push test 🚨',
    data: { screen: '/(tabs)/index' }
  };
  
  try {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method:'POST', 
      headers:{ 'Content-Type':'application/json' }, 
      body: JSON.stringify(payload)
    });
    
    console.log('Status:', res.status);
    const response = await res.text();
    console.log('Response:', response);
  } catch (error) {
    console.error('Error sending push:', error);
  }
}

main().catch(e => { 
  console.error(e); 
  process.exit(1); 
});