export function toRad(n:number){ return (n*Math.PI)/180; }

export function haversine(lat1:number, lon1:number, lat2:number, lon2:number){
  const R = 6371e3; // meters
  const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c; // meters
}

export function humanDistance(meters:number, unit:'mi'|'km'='mi'){
  const km = meters/1000; 
  const mi = km*0.621371;
  return unit==='mi' ? `${mi.toFixed(mi<10?1:0)} mi` : `${km.toFixed(km<10?1:0)} km`;
}