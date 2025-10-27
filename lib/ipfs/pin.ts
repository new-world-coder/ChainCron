export async function pinToIPFS(content: string) {
  const PINATA_KEY = process.env.PINATA_KEY;
  const PINATA_SECRET = process.env.PINATA_SECRET;
  
  if (!PINATA_KEY || !PINATA_SECRET) return null;
  
  try {
    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: { 
        'Content-Type':'application/json', 
        'pinata_api_key': PINATA_KEY, 
        'pinata_secret_api_key': PINATA_SECRET 
      },
      body: content
    });
    
    if (!res.ok) {
      throw new Error(`IPFS pin failed: ${res.statusText}`);
    }
    
    const json = await res.json();
    return json.IpfsHash;
  } catch (error) {
    console.error('IPFS pin error:', error);
    return null;
  }
}

