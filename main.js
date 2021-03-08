function setup() {
  createCanvas(400, 400);
  // ブロックを生成してblocks変数に詰める
  for (let i = 0; i < 12; i++) {
    let p = new Vec2(90 * (i % 4) + 50, 50 * floor(i / 4) + 50);
    blocks.push(new Block(p, 20));
  }
}
function gameover() {
  var canvas = document.getElementById('defaultCanvas0')
  var elm = document.getElementById('gameover');
  canvas.remove();
  elm.textContent = 'gameover';
  elm.style.background = '#FF0000';
  elm.style.width = '1000px'
  elm.style.height = '100px'
  elm.style.fontSize = '50px'

}

class Vec2 {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }
  // このベクトルと、引数のベクトルbの和を計算する
  add(b) {
    let a = this;
    return new Vec2(a.x + b.x, a.y + b.y);
  }
  // このベクトルを実数s倍したベクトルを計算する
  mul(s) {
    let a = this;
    return new Vec2(s * a.x, s * a.y);
  }
  // このベクトルの大きさを求める
  mag() {
    let a = this;
    return sqrt(a.x ** 2 + a.y ** 2);
  }
  // このベクトルと引数のベクトルbの差を求める
  sub(b) {
    let a = this;
    return new Vec2(a.x - b.x, a.y - b.y);
  }
  // このベクトルを正規化したベクトルを求める
  norm() {
    let a = this;
    return a.mul(1 / a.mag());
  }
  // このベクトルと引数のベクトルbの、ドット積（内積）を求める
  dot(b) {
    let a = this;
    return a.x * b.x + a.y * b.y;
  }
  // このベクトルの反射ベクトルを求める。
  // wは、法線ベクトルとする（大きさは問わない）
  reflect(w) {
    let v = this;
    let cosTheta = v.mul(-1).dot(w) / (v.mul(-1).mag() * w.mag());
    let n = w.norm().mul(v.mag() * cosTheta);
    let r = v.add(n.mul(2));
    return r;
  }
}

class Ball {
  constructor(_p, _v, _r) {
    this.p = _p; //ボールの中心の位置ベクトル
    this.v = _v; //ボールの速度ベクトル
    this.r = _r; //ボールの半径
  }
}

class Block {
  constructor(_p, _r) {
    this.p = _p; //ブロックの中心の位置ベクトル
    this.r = _r; //ブロックの半径
  }
}

class Paddle {
  constructor(_p, _r) {
    this.p = _p; //パドルの中心の位置ベクトル
    this.r = _r; //半径
  }
}

// ボールを作る
let ball = new Ball(
  new Vec2(200, 300),
  new Vec2(240, -60),
  15
);

// ブロックを作る
let blocks = [];
//point変数
let point = 0;

let paddle_size = 30;
// パドルを作る
let paddle = new Paddle(new Vec2(200, 320), paddle_size);

function draw() {
  // ボールを移動させる
  ball.p = ball.p.add(ball.v.mul(1 / 60));

  // ボールが左端か右端に来たら反射
  if ((ball.p.x < 15) || (ball.p.x > 385)) {
    ball.v.x = -ball.v.x;
  }
  // ボールが上端に来たら反射
  if ((ball.p.y < 15)) {
    ball.v.y = -ball.v.y;
  }
  if (ball.p.y > 385) {
    gameover();
  }

  // ボールとブロックの衝突判定
  for (let block of blocks) {
    let d = block.p.sub(ball.p).mag(); //距離
    if (d < (ball.r + block.r)) {
      // ぶつかっていたら、ボールの速度を反射させる
      let w = ball.p.sub(block.p);
      let r = ball.v.reflect(w);
      ball.v = r;
      // ブロックを消す
      blocks.splice(blocks.indexOf(block), 1);
      point += 1;
      paddle.r -= 2;
      //音を鳴らす
      var botton = document.getElementById('botton');
      if (botton.checked) {
        var music = new Audio('select03.mp3');
        music.play();  // 再生
        //music.pause();  // 一時停止
      }
    }
  }

  // パドルの操作
  paddle.p.x = mouseX;

  // ボールとパドルの衝突判定
  let d = paddle.p.sub(ball.p).mag(); //距離
  if (d < (ball.r + paddle.r)) {
    // ぶつかっていたら、ボールの速度を反射させる
    let w = ball.p.sub(paddle.p);
    let r = ball.v.reflect(w);
    ball.v = r;
    // めりこみ防止
    ball.p = paddle.p.add(w.norm().mul(ball.r + paddle.r));
  }

  // 画面を塗りつぶす（消去）
  background(220);
  // ボールを描画
  circle(ball.p.x, ball.p.y, 2 * ball.r);
  // ブロックを描画
  for (let b of blocks) {
    circle(b.p.x, b.p.y, 2 * b.r);
  }
  // パドルを描画
  circle(paddle.p.x, paddle.p.y, 2 * paddle.r);
  //文字の描画  
  textSize(32);
  text(point, 1, 31);
}
