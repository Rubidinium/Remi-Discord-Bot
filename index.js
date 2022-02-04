const date2 = new Date();
date2.setMonth(1, 3);
date2.setHours(19, 9);

console.log(date2.getTime());
console.log(Date.now());

console.log(date2.getTime() - Date.now());

setTimeout(() => {
  console.log(date2.toISOString());
}, date2.getTime() - Date.now() - 1000 * 60 * 5);
