(()=>{"use strict";const r="s";let a=new class{constructor(){this.array=this.clear()}clear(){return[...Array(10)].map((()=>Array(10).fill("")))}placeShip(a,t,e,s){for(let l=0;l<e;++l)s?this.array[t+l][a]=r:this.array[t][a+l]=r}receiveAttack(a,t,e){this.array[t][a]==r?(this.array[t][a]="x",e.hit()):this.array[t][a]="o"}allShipsSunk(){for(let a=0;a<10;++a)for(let t=0;t<10;++t)if(this.array[a][t]==r)return!0;return!1}};a.placeShip(0,0,2,!0),console.log(a.array[0][0]),console.log(a.array[1][0])})();