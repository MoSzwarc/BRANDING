const CREAM='#F8F6F1', CHAR='#2C2C2C', GOLD='#C4A35A', NAVY='#0A1628', MUTE='#7A7A74';
const R = (n)=> (Math.random()*2-1)*n;

function sline(ctx,x1,y1,x2,y2,color,w){
  ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=w; ctx.lineCap='round';
  ctx.moveTo(x1,y1);
  ctx.quadraticCurveTo((x1+x2)/2+R(0.6),(y1+y2)/2+R(0.6),x2,y2);
  ctx.stroke();
}
function spath(ctx,pts,color,w,close){
  ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=w; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++){
    const [x,y]=pts[i], [px,py]=pts[i-1];
    ctx.quadraticCurveTo((px+x)/2+R(0.5),(py+y)/2+R(0.5),x,y);
  }
  if(close) ctx.closePath();
  ctx.stroke();
}
// refined pen circle: a true arc, opened at a slight gap and closed with a short overlap,
// with one gentle low-frequency deviation — round, not lumpy.
function scircle(ctx,cx,cy,r,color,w){
  const start = Math.random()*Math.PI*2;
  const wob = 0.4 + Math.random()*0.3;      // total deviation in px, tiny
  const ph = Math.random()*Math.PI*2;
  ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=w; ctx.lineCap='round';
  const steps=64;
  for(let i=0;i<=steps;i++){
    const t=i/steps, a=start + t*(Math.PI*2 + 0.18);   // slight overlap at the join
    const rr = r + Math.sin(a*2+ph)*wob;
    const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr;
    i? ctx.lineTo(x,y) : ctx.moveTo(x,y);
  }
  ctx.stroke();
}
function sfillTri(ctx,pts,color){
  ctx.beginPath(); ctx.fillStyle=color;
  ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]);
  ctx.closePath(); ctx.fill();
}
function arrowHead(ctx,x,y,ang,color,s){
  s=s||7;
  sfillTri(ctx,[[x,y],[x-Math.cos(ang-0.4)*s,y-Math.sin(ang-0.4)*s],[x-Math.cos(ang+0.4)*s,y-Math.sin(ang+0.4)*s]],color);
}

/* ---- house mark: the real Fit4Global figure (site logo, 4 paths, viewBox 649x608) ---- */
const MARK_PATHS = [
 "M621.002 344.988C614.326 378.995 602.112 410.542 585.708 440.466C573.068 463.523 558.135 485.006 540.736 504.823C521.452 526.787 499.533 545.552 474.43 560.398C448.016 576.019 419.528 586.365 389.318 592.039C358.16 597.891 326.836 598.768 295.323 596.111C291.198 595.763 289.389 593.635 288.938 589.865C284.904 556.145 284.502 522.418 289.148 488.727C294.145 452.495 304.68 417.941 320.659 385.008C331.551 362.559 345.013 341.726 361.253 322.932C386.169 294.096 411.693 265.774 437.396 237.633C460.664 212.159 478.231 183.213 492.039 151.792C493.077 149.43 494.346 147.169 495.508 144.861C496.028 144.917 496.547 144.973 497.067 145.029C497.235 146.556 497.78 148.153 497.515 149.601C490.779 186.403 479.717 221.799 460.134 253.859C446.8 275.688 432.118 296.715 417.573 317.779C398.132 345.934 390.853 377.232 391.992 410.964C393.175 446.026 402.54 479.224 414.701 511.805C416.097 515.546 418.093 517.169 422.274 515.249C459.627 498.102 494.24 476.853 523.137 447.248C537.241 432.798 548.368 416.106 558.358 398.569C576.568 366.6 589.769 332.826 595.336 296.38C601.975 252.917 597.241 210.537 582.543 169.083C573.989 144.955 562.493 122.36 549.471 100.443C548.759 99.2452 548.195 97.9602 547.563 96.716C547.897 96.4402 548.232 96.1645 548.567 95.8887C549.393 96.6337 550.398 97.2537 551.02 98.142C567.044 121.035 584.763 142.809 597.408 167.942C612.194 197.332 621.725 228.268 625.055 261.092C627.899 289.139 626.578 316.939 621.002 344.988Z",
 "M53.3295 154.336C63.1209 135.23 74.2828 117.493 87.6357 101.229C88.2902 101.584 88.9447 101.94 89.5991 102.295C87.9518 105.764 86.5002 109.343 84.6267 112.685C66.2195 145.52 54.0883 180.531 48.029 217.664C44.2047 241.101 42.6929 264.681 44.8535 288.346C46.9975 311.827 52.9837 334.41 61.8063 356.307C75.9949 391.521 96.6666 422.547 122.866 449.76C149.261 477.177 179.409 499.611 214.77 514.468C216.149 515.047 217.436 515.841 218.806 516.443C223.322 518.426 225.375 517.614 227.517 513.123C247.147 471.948 253.721 428.693 249.637 383.337C247.329 357.702 237.976 335.58 222.692 315.186C185.343 265.35 158.701 210.209 142.765 149.969C142.294 148.189 142.713 144.731 143.726 144.27C146.827 142.858 148.361 145.399 149.46 148.072C158.928 171.094 171.041 192.713 184.578 213.543C200.632 238.246 220.191 260.035 240.932 280.838C261.184 301.15 280.615 322.178 296.067 346.517C299.096 351.289 301.667 356.351 304.48 361.262C306.821 365.349 305.816 369.155 303.962 373.145C289.4 404.496 277.983 436.942 270.652 470.754C263.157 505.319 259.93 540.157 264.82 575.421C265.505 580.361 266.575 585.246 267.36 590.174C268.105 594.848 266.753 596.257 262.317 595.131C232.226 587.496 203.188 577.212 175.702 562.48C150.143 548.781 127.131 531.793 106.559 511.519C89.1775 494.389 74.4101 475.099 61.949 454.1C43.501 423.011 29.4133 390.118 22.1058 354.6C14.8726 319.443 15.2016 284.154 21.3648 248.858C27.1323 215.828 37.8469 184.472 53.3295 154.336Z",
 "M279.199 137.163C291.564 130.566 303.653 124.237 315.608 117.66C319.764 115.374 323.444 115.819 327.395 117.947C363.121 137.188 398.878 156.372 434.609 175.604C436.283 176.505 437.795 177.709 439.382 178.772C439.322 179.279 439.262 179.787 439.201 180.294C436.593 180.729 434 181.355 431.374 181.568C417.437 182.699 403.493 183.749 389.548 184.781C382.723 185.286 381.623 186.214 381.266 193.236C380.971 199.052 380.673 204.906 380.996 210.708C382.195 232.225 376.355 252.319 368.363 271.821C361.233 289.221 348.007 298.718 328.84 299.824C310.135 300.904 293.297 297.206 280.599 282.296C271.964 272.158 267.568 259.955 264.83 247.112C260.876 228.563 260.516 209.779 261.56 190.942C261.799 186.625 260.97 183.737 256.01 183.45C250.45 183.128 247.923 184.88 247.549 190.064C246.915 198.862 246.446 207.674 246.037 216.486C245.898 219.486 245.286 221.938 241.67 221.754C238.374 221.586 237.138 219.4 237.138 216.32C237.137 206.826 237.203 197.33 237.101 187.837C237.024 180.694 236.003 179.759 228.963 179.731C222.467 179.705 215.971 179.748 209.475 179.708C207.863 179.698 206.251 179.484 204.313 178.507C228.647 163.688 253.98 150.906 279.199 137.163Z",
 "M86.9915 209.034C81.1782 228.672 75.4808 247.937 69.8508 266.974C66.2455 256.482 73.5037 200.625 86.8281 167.25C99.7139 134.974 118.17 106.46 143.243 82.3333C228.051 0.725121 343.722 -8.9871 430.634 33.7032C538.396 86.634 574.85 178.514 573.979 265.551C572.994 262.209 571.843 258.906 571.049 255.519C562.067 217.186 548.691 180.694 526.229 147.983C505.665 118.034 479.632 93.9929 448.33 75.5722C421.08 59.5362 392.035 48.5482 360.717 43.7379C332.147 39.3497 303.646 39.6689 275.275 45.2028C230.129 54.0086 190.541 74.1888 156.224 104.613C127.479 130.097 106.453 161.116 92.0363 196.669C90.4123 200.674 88.7513 204.664 86.9915 209.034Z"
].map(d=>new Path2D(d));

function drawMark(ctx, cx, cy, s){
  // s: 1 => mark spans ~100px. viewBox 649x608, centre ~ (324,300)
  ctx.save();
  ctx.translate(cx, cy);
  const k = (100*s)/649;
  ctx.scale(k, k);
  ctx.translate(-324, -300);
  ctx.fillStyle = CHAR;
  MARK_PATHS.forEach(p=> ctx.fill(p));
  ctx.restore();
}

/* ---- per-course hand-sketched objects, drawn centred on (cx,cy), ~size px ---- */
const OBJ = {
  eca(ctx,cx,cy,k){ // speech bubble + rising waveform
    spath(ctx,[[cx-20*k,cy-16*k],[cx+20*k,cy-16*k],[cx+20*k,cy+8*k],[cx-6*k,cy+8*k],[cx-14*k,cy+18*k],[cx-12*k,cy+8*k],[cx-20*k,cy+8*k]],CHAR,2.4,true);
    const bx=[-12,-5,2,9,15], bh=[6,12,20,10,15];
    bx.forEach((x,i)=> sline(ctx,cx+x*k,cy-1*k,cx+x*k,cy-1*k-bh[i]*k, i===2?GOLD:CHAR, 3.2));
  },
  ecp(ctx,cx,cy,k){ // two facing bubbles — the 1:1
    spath(ctx,[[cx-22*k,cy-18*k],[cx+4*k,cy-18*k],[cx+4*k,cy+2*k],[cx-10*k,cy+2*k],[cx-16*k,cy+11*k],[cx-15*k,cy+2*k],[cx-22*k,cy+2*k]],CHAR,2.4,true);
    spath(ctx,[[cx-2*k,cy+2*k],[cx+22*k,cy+2*k],[cx+22*k,cy+20*k],[cx+8*k,cy+20*k],[cx+16*k,cy+28*k],[cx+2*k,cy+20*k],[cx-2*k,cy+20*k]],GOLD,2.4,true);
    sline(ctx,cx-16*k,cy-9*k,cx-4*k,cy-9*k,CHAR,1.8);
    sline(ctx,cx+2*k,cy+11*k,cx+16*k,cy+11*k,GOLD,1.8);
  },
  beia(ctx,cx,cy,k){ // briefcase in motion
    spath(ctx,[[cx-18*k,cy-6*k],[cx+18*k,cy-6*k],[cx+18*k,cy+16*k],[cx-18*k,cy+16*k]],CHAR,2.4,true);
    spath(ctx,[[cx-7*k,cy-6*k],[cx-7*k,cy-13*k],[cx+7*k,cy-13*k],[cx+7*k,cy-6*k]],CHAR,2.2);
    sline(ctx,cx-18*k,cy+4*k,cx+18*k,cy+4*k,GOLD,2);
    for(let i=0;i<3;i++) sline(ctx,cx-22*k-i*7,cy+2*k+i*5,cx-30*k-i*7,cy+2*k+i*5,GOLD,1.8);
  },
  db(ctx,cx,cy,k){ // iceberg — the culture running below the waterline
    // waterline
    sline(ctx,cx-26*k,cy-3*k,cx+26*k,cy-3*k,MUTE,1.6);
    // visible tip (above)
    spath(ctx,[[cx-9*k,cy-3*k],[cx-2*k,cy-15*k],[cx+8*k,cy-3*k]],CHAR,2.4,true);
    // the mass below — gold, faceted
    spath(ctx,[[cx-16*k,cy-3*k],[cx+18*k,cy-3*k],[cx+22*k,cy+10*k],[cx+9*k,cy+22*k],[cx-11*k,cy+20*k],[cx-20*k,cy+7*k]],GOLD,2.4,true);
    sline(ctx,cx-4*k,cy-3*k,cx+2*k,cy+14*k,GOLD,1.5);
    sline(ctx,cx+9*k,cy-3*k,cx+13*k,cy+9*k,GOLD,1.5);
  },
  cm(ctx,cx,cy,k){ // rising bars + trend
    const bx=[-18,-6,6,18], bh=[10,20,15,30];
    bx.forEach((x,i)=> sline(ctx,cx+x*k,cy+18*k,cx+x*k,cy+(18-bh[i])*k, i===3?GOLD:CHAR, 5));
    spath(ctx,[[cx-20*k,cy+6*k],[cx-6*k,cy-6*k],[cx+6*k,cy+0*k],[cx+20*k,cy-16*k]],GOLD,2);
    arrowHead(ctx,cx+20*k,cy-16*k,-0.9,GOLD,7);
  },
  hr(ctx,cx,cy,k){ // three people, linked — the lead one gold
    const n=[[0,-15],[-17,11],[17,11]];
    sline(ctx,cx+n[0][0]*k,cy+n[0][1]*k,cx+n[1][0]*k,cy+n[1][1]*k,NAVY,1.6);
    sline(ctx,cx+n[0][0]*k,cy+n[0][1]*k,cx+n[2][0]*k,cy+n[2][1]*k,NAVY,1.6);
    sline(ctx,cx+n[1][0]*k,cy+n[1][1]*k,cx+n[2][0]*k,cy+n[2][1]*k,NAVY,1.6);
    n.forEach((p,i)=>{ const c=i===0?GOLD:CHAR, X=cx+p[0]*k, Y=cy+p[1]*k;
      scircle(ctx,X,Y-2*k,5*k,c,2.4);
      spath(ctx,[[X-8*k,Y+9*k],[X-5*k,Y+4*k],[X+5*k,Y+4*k],[X+8*k,Y+9*k]],c,2.4); });
  },
  lg(ctx,cx,cy,k){ // container + route
    spath(ctx,[[cx-16*k,cy-2*k],[cx+16*k,cy-2*k],[cx+16*k,cy+18*k],[cx-16*k,cy+18*k]],CHAR,2.4,true);
    for(let i=-1;i<=1;i++) sline(ctx,cx+i*8*k,cy-2*k,cx+i*8*k,cy+18*k,CHAR,1.6);
    spath(ctx,[[cx-22*k,cy-16*k],[cx-4*k,cy-22*k],[cx+14*k,cy-12*k],[cx+24*k,cy-20*k]],GOLD,2);
    arrowHead(ctx,cx+24*k,cy-20*k,-0.6,GOLD,7);
  },
  fl(ctx,cx,cy,k){ // a prism with depth: ray in -> through the body -> spectrum out
    const A=[cx-16*k,cy+15*k], B=[cx+14*k,cy+15*k], C=[cx-2*k,cy-17*k];
    const dx=11*k, dy=-4*k, B2=[B[0]+dx,B[1]+dy], C2=[C[0]+dx,C[1]+dy];
    // exit face (quad, seen at an angle) — faint wash so it reads as a surface
    ctx.save();
    ctx.beginPath(); ctx.moveTo(B[0],B[1]); ctx.lineTo(C[0],C[1]); ctx.lineTo(C2[0],C2[1]); ctx.lineTo(B2[0],B2[1]); ctx.closePath();
    ctx.fillStyle='rgba(196,163,90,0.14)'; ctx.fill(); ctx.restore();
    // depth edges
    spath(ctx,[C,C2],CHAR,1.7); spath(ctx,[B,B2],CHAR,1.7); spath(ctx,[C2,B2],CHAR,1.7);
    // front face
    spath(ctx,[A,B,C],CHAR,2.4,true);
    // the ray: in through the left face, across the body, out the right face
    const P1=[cx-9*k,cy-1*k], P2=[cx+8*k,cy+4*k];
    sline(ctx,cx-40*k,cy-7*k,P1[0],P1[1],CHAR,2);
    sline(ctx,P1[0],P1[1],P2[0],P2[1],CHAR,2);
    // spectrum fan from the exit point
    const ang=[-0.34,-0.14,0.06,0.26,0.46];
    ang.forEach(a=> sline(ctx,P2[0],P2[1], P2[0]+Math.cos(a)*26*k, P2[1]+Math.sin(a)*26*k, GOLD, a===0.06?2.6:1.9));
  },
  mg(ctx,cx,cy,k){ // globe with curved meridians + mortarboard
    const gy=cy+7*k, r=15*k;
    scircle(ctx,cx,gy,r,CHAR,2.4);
    ctx.save(); ctx.strokeStyle=CHAR; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.ellipse(cx,gy,r*0.42,r,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-r,gy); ctx.lineTo(cx+r,gy); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx,gy,r,r*0.5,0,Math.PI,0,true); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx,gy,r,r*0.5,0,0,Math.PI); ctx.stroke();
    ctx.restore();
    sfillTri(ctx,[[cx,cy-22*k],[cx+17*k,cy-16*k],[cx,cy-10*k]],CHAR);
    sfillTri(ctx,[[cx,cy-22*k],[cx-17*k,cy-16*k],[cx,cy-10*k]],CHAR);
    sline(ctx,cx,cy-10*k,cx,cy-14*k,CHAR,1.6);
    spath(ctx,[[cx+14*k,cy-16*k],[cx+17*k,cy-9*k],[cx+16*k,cy-4*k]],GOLD,1.6);
    ctx.beginPath(); ctx.fillStyle=GOLD; ctx.arc(cx+16*k,cy-3*k,2*k,0,Math.PI*2); ctx.fill();
  },
  ptm(ctx,cx,cy,k){ // note on a staff
    for(let i=-2;i<=2;i++) sline(ctx,cx-22*k,cy+i*6*k,cx+22*k,cy+i*6*k,MUTE,1.4);
    ctx.beginPath(); ctx.fillStyle=GOLD; ctx.ellipse(cx-6*k,cy+8*k,6*k,4.4*k,-0.3,0,Math.PI*2); ctx.fill();
    spath(ctx,[[cx-0.5*k,cy+7*k],[cx+1*k,cy-16*k]],GOLD,2.4);
    spath(ctx,[[cx+1*k,cy-16*k],[cx+11*k,cy-20*k]],GOLD,2.4);
  }
};

const COURSES=[
  {key:'eca', name:'Executive Communication Academy', cat:'Standalone program', obj:'a speech bubble with a voice rising inside it', slug:'executive-communication-academy'},
  {key:'ecp', name:'Executive Coaching Package', cat:'One-to-one engagement', obj:'two bubbles facing — the conversation between two', slug:'executive-coaching-package'},
  {key:'beia', name:'Business English in Action', cat:'Self-paced program', obj:'a briefcase, already in motion', slug:'business-english-in-action'},
  {key:'db', name:'Brazil Unpacked: The Cultural Operating System', sub:'Culture, Power, and Professional Judgment for International Professionals', cat:'Standalone program', obj:'an iceberg — the culture running below the waterline', slug:'brazil-unpacked'},
  {key:'cm', name:'EGC · Capital Markets', cat:'Executive Global Communication', obj:'four bars rising, the last one gold', slug:'egc-capital-markets'},
  {key:'hr', name:'EGC · HR & Talent', cat:'Executive Global Communication', obj:'three linked figures, the lead one gold', slug:'egc-hr-talent'},
  {key:'lg', name:'EGC · Logistics', cat:'Executive Global Communication', obj:'a container under a plotted route', slug:'egc-logistics'},
  {key:'fl', name:'Interpretive Leadership', sub:'Leading Through Ambiguity, Bias, Culture, and AI', cat:'Standalone program', obj:'a prism — one situation in, a fan of readings out', slug:'interpretive-leadership'},
  {key:'mg', name:'Meet & Greet', cat:'Standalone program', obj:'the canonical cue — mortarboard over a globe', slug:'meet-and-greet'},
  {key:'ptm', name:'Portuguese through Music', cat:'Standalone program', obj:'a single note lifting off the staff', slug:'portuguese-through-music'}
];

function paper(ctx,w,h){
  ctx.fillStyle=CREAM; ctx.fillRect(0,0,w,h);
  ctx.globalAlpha=.5;
  for(let y=28;y<h;y+=26) sline(ctx,14,y,w-14,y, '#E7E1D2', 1);
  ctx.globalAlpha=1;
}

function drawIcon(canvas, co, px, withObject){
  const dpr=2; canvas.width=px*dpr; canvas.height=px*dpr; canvas.style.width=px+'px'; canvas.style.height=px+'px';
  const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);
  const S=px/96;
  ctx.fillStyle=CREAM; ctx.fillRect(0,0,px,px);
  // navy drop crescent (lower-right only) then a clean charcoal keyline
  ctx.save();
  ctx.translate(1.8*S,1.8*S);
  ctx.beginPath(); ctx.arc(px/2, px/2, 40*S, Math.PI*0.08, Math.PI*0.72);
  ctx.strokeStyle=NAVY; ctx.lineWidth=2.4*S; ctx.lineCap='round'; ctx.stroke();
  ctx.restore();
  scircle(ctx, px/2, px/2, 40*S, CHAR, 2.4*S);
  if(withObject){
    ctx.save(); ctx.translate(0,-7*S); OBJ[co.key](ctx, px/2, px/2, 0.52*S); ctx.restore();
    drawMark(ctx, px/2, px/2+25*S, 0.28*S);
  } else {
    drawMark(ctx, px/2, px/2, 0.58*S);
  }
}

function drawCover(canvas, co){
  const W=1500, H=600, dpr=1.4;
  canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width='100%';
  const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);
  paper(ctx,W,H);
  // inner hand frame
  spath(ctx,[[48,48],[W-48,48],[W-48,H-48],[48,H-48]],CHAR,2,true);
  // object, right, in a sketched frame
  spath(ctx,[[1015,130],[1400,130],[1400,470],[1015,470]],CHAR,2,true);
  ctx.save(); ctx.translate(1207,300); ctx.scale(2.95,2.95); OBJ[co.key](ctx,0,0,1); ctx.restore();
  // divider
  sline(ctx,935,150,935,450,GOLD,1.5);
  // mark, top-left
  drawMark(ctx, 132, 128, 0.66);
  // type
  ctx.textBaseline='alphabetic';
  ctx.fillStyle=GOLD; ctx.font='700 26px "Caveat", cursive';
  ctx.fillText(co.cat, 210, 130);
  ctx.fillStyle=NAVY; ctx.font='700 60px "Cormorant Garamond", Georgia, serif';
  const words=co.name.split(' '); let lines=[],cur='';
  for(const w of words){ if((cur+' '+w).trim().length>20 && cur){lines.push(cur);cur=w;} else cur=(cur+' '+w).trim(); }
  if(cur)lines.push(cur);
  let ty=262; lines.forEach(l=>{ ctx.fillText(l,210,ty); ty+=62; });
  sline(ctx,214,ty-22,214+250,ty-22,GOLD,3);
  if(co.sub){
    ctx.fillStyle=CHAR; ctx.font='italic 600 22px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(co.sub, 210, ty+18);
  }
  ctx.fillStyle=MUTE; ctx.font='600 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('FIT4GLOBAL LEARNING SYSTEMS', 210, H-90);
}
