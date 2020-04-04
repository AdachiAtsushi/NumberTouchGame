/**
 * @auther　atsuk0r0
 * @since 2020/04/04
 *
 */

'use strict';

{
  /**
   *
   *
   * @class Panel
   * 【クラスの概要】
   * 初期表示時にボタン押下された際のスタイルで画面上に表示させる。
   * ゲーム開始後、ボタン押下された状態のスタイルを取り除く。
   * パネルを押すごとにチェック処理が走り、最後のボタンを押し終えるとタイマーがストップする。
   */
  class Panel {
    /**
     *Creates an instance of Panel.
     * @param {*} game
     * @memberof Panel
     */
    constructor(game) {
      // 変数の初期化
      this.game = game;

      // 画面上に要素を作成し、スタイルを追加
      this.el = document.createElement('li');
      this.el.classList.add('pressed');

      // クリックイベント実施
      this.el.addEventListener('click', () => {
        // 正しくボタン押下されたかチェックする
        this.check();
      });
    }

    /**
     *
     * @returns
     * @memberof Panel
     *  【処理の内容】
     *  li要素を取得する。
     */
    getEl() {
      return this.el;
    }

    /**
     *
     * @param {*} num
     * @memberof Panel
     * 【処理の内容】
     * ボタン押下のスタイルを削除し、引数の値をボタンの表記（li要素）に反映させる。
     */
    activate(num) {
      // ボタン押下時のスタイルを削除
      this.el.classList.remove('pressed');
      // 引数の値をボタンの表記に反映
      this.el.textContent = num;
    }

    /**
     *
     * @memberof Panel
     * 【処理の内容】
     * 現在保持している値とボタンに表記されている値が同じであるかをチェックする。
     * 最後までボタンを押下し終えたらタイマーを終了させる。
     */
    check() {
      // 現在保持している値とボタンに表記された値が同じ場合
      if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
        // ボタンを押下された際のスタイルをボタンに指定
        this.el.classList.add('pressed');

        this.game.addCurrentNum();

        // 現在保持している値とレベルを2乗した値が同じだった場合（最後のボタンを押し終えた際に）
        if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
          // タイマーをストップさせる
          clearTimeout(this.game.getTimeoutId());
        }
      }
    }
  }

  /**
   *
   *
   * @class Board
   * 【クラスの概要】
   * ボタン押下時のスタイルをしたパネルクラスのインスタンスを
   * レベルを2乗した値の数だけ配列に詰め込んで画面上に表示する。
   */
  class Board {
    /**
     *Creates an instance of Board.
     * @param {*} game
     * @memberof Board
     */
    constructor(game) {
      this.game = game;
      this.panels = [];

      // ゲームのレベルに2乗した値の数だけループ処理を実施
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        // パネルクラスのインスタンスを配列に追加
        this.panels.push(new Panel(this.game));
      }
      // 画面上に子要素を追加
      this.setup();
    }

    /**
     *
     * @memberof Board
     * 【処理内容】
     * 画面上のul要素を取得後、ボタン押下時のスタイルの子要素を画面上に追加
     */
    setup() {
      // 画面上のul要素を取得
      const board = document.getElementById('board');

      // 画面上のulの子要素に追加
      this.panels.forEach((panel) => {
        // ボタン押下時のスタイルのli要素を画面上に追加
        board.appendChild(panel.getEl());
      });
    }

    /**
     *
     * @memberof Board
     * 【処理の内容】
     * 0からレベルを2乗した値未満の値が入った配列を生成する。
     * その配列からランダムに値を取り出してボタンの表記に反映させる。
     */
    activate() {
      // 0からレベルを2乗した値未満を配列に格納する
      const nums = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        nums.push(i);
      }

      this.panels.forEach((panel) => {
        // 配列に格納された値をランダムに切り出して配列を作る。切り出した値が入った配列から値を取得
        // (例: 2を切り出す場合) [1, 2, 3, 4] -> [2] -> 2をnumに代入
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];

        // ボタン押下した際のスタイルを消し、ボタンに数値表記させる
        panel.activate(num);
      });
    }
  }

  /**
   *
   *
   * @class Game
   *  【クラスの概要】
   * ゲームの開始に必要な変数の初期化を行う。
   * スタートボタンを押下した後、時間の計測し画面上に表示する。
   */
  class Game {
    /**
     *Creates an instance of Game.
     * @param {*} level
     * @memberof Game
     */
    constructor(level) {
      // 変数の初期化
      this.level = level;

      // ゲーム開始前のボードを生成
      this.board = new Board(this);

      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined;

      // ボタンのIDを取得後、クリックイベント発火
      const btn = document.getElementById('btn');
      btn.addEventListener('click', () => {
        // ゲーム開始
        this.start();
      });
      // ボードの幅を指定する
      this.setup();
    }

    /**
     *
     * @memberof Game
     * 【処理の内容】
     * 画面の要素を取得後、レベルに応じてボードの幅を指定する。
     */
    setup() {
      // 画面上の要素を取得
      const container = document.getElementById('container');

      let panelWidth = 50;
      let boardPadding = 10;

      // レベルに応じてパネル幅とボードのpaddingを算出して、幅を指定する
      container.style.width = panelWidth * this.level + boardPadding * 2 + 'px';
    }

    /**
     *
     * @memberof Game
     * 【処理の内容】
     * タイマーIDに値が設定されていたらゲームを終了する。
     * タイマーIDに値が設定されていなかったら画面上のボードに数字を表示させる。
     * その後、ゲームの実施時間を計測を開始する。
     */
    start() {
      // タイマーIDに値が入っていたらゲームを終了する。
      if (typeof this.timeoutId !== 'undefined') {
        clearTimeout(this.timeoutId);
      }

      this.currentNum = 0;

      // 画面上のボードに数字の表記させる
      this.board.activate();

      // 現在時刻を取得
      this.startTime = Date.now();

      // 計測開始
      this.runTimer();
    }

    /**
     *
     * @memberof Game
     * 【処理の内容】
     * 時間を計測し、小数点第2位まで算出して画面に表示する。再帰処理を実施。
     */
    runTimer() {
      // 画面上のIDを取得
      const timer = document.getElementById('timer');

      // 現在時刻から計測開始前の時刻の差分を取り出して1000で割った後、小数点第2位の桁まで表示
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);

      // 10ミリ秒ごとに再帰的に呼び出す
      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }

    /**
     *
     *
     * @memberof Game
     *  【処理の内容】
     * 現在保持しているボタンの値を+1する。
     */
    addCurrentNum() {
      this.currentNum++;
    }

    /**
     *
     *
     * @returns
     * @memberof Game
     *  【処理の内容】
     * 現在保持しているボタンの値を取得する。
     */
    getCurrentNum() {
      return this.currentNum;
    }

    /**
     *
     *
     * @returns
     * @memberof Game
     * 【処理の内容】
     * タイマーIDを取得する。
     */
    getTimeoutId() {
      return this.timeoutId;
    }

    /**
     *
     *
     * @returns
     * @memberof Game
     *  【処理の内容】
     * ゲームのレベル、難易度を取得する。
     */
    getLevel() {
      return this.level;
    }
  }

  new Game(5);
}
