function fadeOut(elem, speed=2000) {
  if (!elem.style.opacity) elem.style.opacity = 1;
  var outInterval = setInterval(function() {
    elem.style.opacity -= 0.02;
    if (elem.style.opacity <= 0) {
      clearInterval(outInterval);
      elem.style.display='none';
      fadeIn(document.getElementById('contenedor'),1000);
    }
  }, speed/50 );
}
function fadeIn(elem, speed=2000) {
  elem.style.opacity = 0;
  elem.style.display='block';
  var inInterval = setInterval(function() {
    elem.style.opacity = Number(elem.style.opacity)+0.02;
    if (elem.style.opacity >= 1)
      clearInterval(inInterval);
  }, speed/50 );
}
function addClass(el, classNameToAdd){
    el.className += ' ' + classNameToAdd;   
}
function removeClass(el, classNameToRemove){
    var elClass = ' ' + el.className + ' ';
    while(elClass.indexOf(' ' + classNameToRemove + ' ') !== -1){
         elClass = elClass.replace(' ' + classNameToRemove + ' ', '');
    }
    el.className = elClass;
}
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// Setup our new sprite class and pass in the options.
var sound = new Howl({
  src: ['piano_10s_C2-E5.mp3'],
  sprite: {C2: [0,10000], Db2: [10000,20000], D2: [20000,30000], Eb2: [30000,40000], E2: [40000,50000], F2: [50000,60000], Gb2: [60000,70000], G2: [70000,80000], Ab2: [80000,90000], A2: [90000,100000], Bb2: [100000,110000], B2: [110000,120000], C3: [120000,130000], Db3: [130000,140000], D3: [140000,150000], Eb3: [150000,160000], E3: [160000,170000], F3: [170000,180000], Gb3: [180000,190000], G3: [190000,200000], Ab3: [200000,210000], A3: [210000,220000], Bb3: [220000,230000], B3: [230000,240000], C4: [240000,250000], Db4: [250000,260000], D4: [260000,270000], Eb4: [270000,280000], E4: [280000,290000], F4: [290000,300000], Gb4: [300000,310000], G4: [310000,320000], Ab4: [320000,330000], A4: [330000,340000], Bb4: [340000,350000], B4: [350000,360000], C5: [360000,370000], Db5: [370000,380000], D5: [380000,390000], Eb5: [390000,400000], E5: [400000,410000]},
  loop: false,
  onload: function() {
    fadeOut(document.getElementById('loading'),3000);
  }
});
var maxsustain = 10000;
var sustain = 250;
var players = {};
var timouts = {};
var keyboardPlay = function(t,on=1) {
  var n = t.getAttribute('nota');
  var m = t.getAttribute('midi');
  if (on>0) {
    if (n in players && sound.playing(players[n])) {
      sound.stop(players[n]);
      clearTimeout(timouts[n]);
    }
    addClass(t,'marca');
    // console.log("on",m,n);
    players[n] = sound.play(n);
    timouts[n] = setTimeout(function(){
      sound.fade(v, 0, 100, players[n])
      t.removeClass('marca');
      // console.log("STO: ",0,s);
    },maxsustain-200);
    sound.volume(1.0,players[n]);
  } else if (n in players && sound.playing(players[n])) {
    clearTimeout(timouts[n]);
    removeClass(t,'marca');
    var v = sound.volume(null,players[n]);
    if (v<0.8) return;
    // else console.log("volumen",v);
    // console.log("off",m,n);
    var l = Math.round(1000*(sound.duration() - sound.seek( null, players[n] )));
    // console.log('length:',l);
    if (l>sustain) l=sustain;
    if (l<=0) sound.pause(players[n]);
    else sound.fade(v, 0, l, players[n]);
    // sound.pause(players[n]);
  }
};
var keyboardRealDown = function(k,on=1) {
  // Map keyboard keys: C2 to E5
  var mapkeys = {'113':1, '82':2, '119':3, '83':4, '101':5, '114':6, '85':7, '116':8, '86':9, '121':10, '87':11, '117':12, '105':13, '89':14, '111':15, '80':16, '112':17, '218':18, '253':19, '219':20, '223':21, '258':22, '97':23, '122':24, '120':25, '100':26, '99':27, '102':28, '118':29, '98':30, '104':31, '110':32, '106':33, '109':34, '107':35, '220':36, '222':37, '224':38, '221':39, '254':40, '48':41};
  if (k in mapkeys)  var t = document.getElementById('p'+mapkeys[k]);
  else {
    // console.log(k);
    return;
  }
  keyboardPlay(t,on);
}
// DOM READY
document.addEventListener('DOMContentLoaded', function(){
  // Mouse events on teclas
  var tecla = document.getElementsByClassName('tecla');
  for(i=0;i<tecla.length;i++){
    tecla[i].addEventListener('mousedown',function(e){
      // console.log("Down");
      keyboardPlay(this,1);
    });
    tecla[i].addEventListener('mouseup',function(e){
      // console.log("Up");
      keyboardPlay(this,0);
    });
    tecla[i].addEventListener('mouseover',function(e){
      // console.log("Over");
      if (document.getElementById('mouseaction').checked) {
        keyboardPlay(this,1);
      }
    });
    tecla[i].addEventListener('mouseout',function(e){
      // console.log("Out");
      keyboardPlay(this,0);
    });
  }
  // Sustain range
  document.getElementById('sustain').oninput = function() {
    sustain = this.value;
    document.getElementById('sustainVal').innerHTML = (sustain/1000);
  };
  // Key down detect = ON
  document.onkeydown = function (e) {
    e = e || window.event;
    if (e.repeat != undefined) {
      allowed = !e.repeat;
    }
    if (!allowed) return;
    var k = e.keyCode+32;
    // console.log('Down:',e.keyCode, k);
    keyboardRealDown(k,1);
  };
  // Key up detect = OFF
  document.onkeyup = function (e) {
    e = e || window.event;
    if (e.repeat != undefined) {
      allowed = !e.repeat;
    }
    if (!allowed) return;
    var k = e.keyCode+32;
    // console.log('Up:',e.keyCode, k);
    keyboardRealDown(k,0);
  };
}, false);