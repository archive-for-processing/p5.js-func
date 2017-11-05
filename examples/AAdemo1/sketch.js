// I<3DM rld

var gen = new p5.Gen();
var t = 0.;
var doclear;

var h_tab;
var h_algo = "harmonics";
var h_args = [1., 0., 0., 1.];
var h_incr = [0.02, -0.004, 0.011, -0.0093];
var h_np = 128;

var w_tab;
var w_algo = "waveform";
var w_args = ['sine'];
var w_incr = ['sine', 'saw', 'sawdown', 'phasor', 'square', 'rect', 'pulse', 'tri', 'buzz'];
var w_ptr = 0;
var w_np = 256;

var e_tab;
var e_algo = "bpf";
var e_args = [0, 0, 1, 1, 2, 0.8, 9, 0.8, 10, 0];
var e_incr = [[0, 0, 1, 1, 2, 0.8, 9, 0.8, 10, 0], [0, 0, 1, 1, 2, 0], [0, 0, 1, 1, 1.1, 0], [0, 0, 10, 0.8, 11, 0.6, 15, 0.5, 20, 0]];
var e_ptr = 0;
var e_np = 384;

var c_tab;
var c_algo = "chebyshev";
var c_args = [1., 0., 0., 1.];
var c_incr = [0.02, -0.004, 0.011, -0.0093];
var c_np = 512;

var wi_tab;
var wi_algo = "window";
var wi_args = ['hamming'];
var wi_incr = ['hamming', 'vonhann', 'bartlett', 'blackman', 'blackman-harris', 'gaussian', 'kaiser', 'boxcar', 'sinc'];
var wi_ptr = 0;
var wi_np = 768;

var r_tab;
var r_algo = "random";
var r_args = ['linear'];
var r_incr = ['linear', 'low', 'high', 'triangle', 'gaussian', 'cauchy'];
var r_ptr = 0;
var r_np = 1024;

var w_u, h_u, sc;

function setup()
{
  createCanvas(1280, 720);

  w_u = width*0.75;
  h_u = height*0.8;
  sc = 0.4;

}

function draw()
{
  background(255);

  fill(0);

  textSize(24);
  text('var g = new p5.Gen();', width/2, height*0.05);

  scale(sc);


  //harmonics
  h_tab = gen.fillArray(h_algo, h_np, h_args);

  translate(0, 0);
  drawTab(h_tab, h_algo, h_args, h_np);

  for(var j in h_args)
  {
    h_args[j]+=h_incr[j];
    if(h_args[j]>1.0) h_incr[j]*=-1.;
    if(h_args[j]<-1.0) h_incr[j]*=-1.;
  }

  //waveform
  w_tab = gen.fillArray(w_algo, w_np, w_args);

  translate(w_u, 0);
  drawTab(w_tab, w_algo, w_args, w_np);

  w_args = w_incr[w_ptr];
  if(frameCount%120==0) w_ptr = (w_ptr+1) % w_incr.length;

  //envelope
  e_tab = gen.fillArray(e_algo, e_np, e_args);

  translate(-w_u, h_u);
  drawTab(e_tab, e_algo, e_args, e_np);

  e_args = e_incr[e_ptr];
  if(frameCount%100==0) e_ptr = (e_ptr+1) % e_incr.length;

  //cheby
  c_tab = gen.fillArray(c_algo, c_np, c_args);

  translate(w_u, 0);
  drawTab(c_tab, c_algo, c_args, c_np);

  for(var j in c_args)
  {
    c_args[j]+=c_incr[j];
    if(c_args[j]>1.0) c_incr[j]*=-1.;
    if(c_args[j]<-1.0) c_incr[j]*=-1.;
  }

  //window
  wi_tab = gen.fillArray(wi_algo, wi_np, wi_args);

  translate(w_u, 0);
  drawTab(wi_tab, wi_algo, wi_args, wi_np);

  wi_args = wi_incr[wi_ptr];
  if(frameCount%130==0) wi_ptr = (wi_ptr+1) % wi_incr.length;

  //random
  r_tab = gen.fillArray(r_algo, r_np, r_args);

  translate(0, -h_u);
  drawTab(r_tab, r_algo, r_args, r_np);

  r_args = r_incr[r_ptr];
  if(frameCount%200==0) r_ptr = (r_ptr+1) % r_incr.length;

  h_np = 1+(h_np+1) % 1024;
  w_np = 1+(w_np+1) % 1024;
  e_np = 1+(e_np+1) % 1024;
  c_np = 1+(c_np+1) % 1024;
  wi_np = 1+(wi_np+1) % 1024;
  r_np = 1+(r_np+1) % 1024;
}

function drawTab(_tab, _algo, _args, _np)
{
  stroke(0, 0, 0);
  noFill();
  rect(width*0.25, height*0.25, width*0.5, height*0.5);


  noStroke();
  fill(0);

  var as = '';
  if(typeof(_args)=== 'string') as='\''+_args+'\'';
  else {
    as+='[';
    for(var k in _args)
    {
      if(!isNaN(_args[k])&&!Number.isInteger(_args[k])) {
        if(k==_args.length-1) as+=_args[k].toFixed(2); else as+=_args[k].toFixed(2)+', ';
      }
      else {
        if(k==_args.length-1) as+=_args[k]; else as+=_args[k]+', ';
      }
    }
    as = as.trim()+']';

  }
  //text(as, width*0.5, height*0.23);
  //text(_np + " points", width*0.5, height*0.8);
  var ss = 'var t = g.fillArray(\''+_algo + '\', ' + _np + ', ' + as + ');';
  textAlign(CENTER);
  textSize(32);
  text(ss, width*0.5, height*0.82);

  textAlign(RIGHT);
  textSize(24);
  var ma = max(_tab);
  var mi = min(_tab);
  text(mi.toFixed(3), width*0.23, height*0.75);
  text(_algo, width*0.23, height*0.5);
  text(ma.toFixed(3), width*0.23, height*0.25);

  stroke(87, 6, 140);
  fill(226, 225, 221);

  beginShape();
  for(var i = 0;i<_tab.length;i++)
  {
    var x = i/(_tab.length-1)*width*0.5+width*0.25;
    var y = map(_tab[i], mi, ma, height*0.75, height*0.25);
    ellipse(x, y, 5, 5);
    vertex(x, y);
  }
  endShape();
}
