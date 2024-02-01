//=========== SmoothScroll ============//
const smoothScroll = () => {
	// スクロールリンク取得
	const targets = document.querySelectorAll('a[href^="#"]');
	if(targets.length === 0){
		return;
	};

	// イージング設定
	function easing(x){
		// easeInOutQuad
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    };

	// スクロール速度
	const animeSpeed = 600;
	const scrollBusyClass = 'is-scroll-busy';
	const bodyClassList = document.body.classList;

	// クリックイベント設定
	targets.forEach(target => {
		target.addEventListener('click', event => {
			event.preventDefault();

			// スクロールイベント重複防止
			if(bodyClassList.contains(scrollBusyClass)){
				return;
			};
			bodyClassList.add(scrollBusyClass);

			// hrefから遷移先を取得
			const href = target.getAttribute('href');
            let scrollStopTarget = null;
			let selector = href;

			// #top（HTMLの仕様でページの最上部へ戻るアンカーリンク）が手動設定されているかチェック
			// https://html.spec.whatwg.org/multipage/browsing-the-web.html#scroll-to-the-fragment-identifier
            if(href === '#top'){
                scrollStopTarget = document.querySelector(href);
            };

		    // #topが手動設定されていない場合はhrefから遷移先を取得
            if(!scrollStopTarget){
				// #や#topの場合はページの最上部へ戻るbodyを遷移先に設定
				selector = (href === '#' || href === '#top') || href === '' ? 'body' : href;
                scrollStopTarget = document.querySelector(selector);
            };

			// 遷移先が存在しない場合は処理しない
			if(!scrollStopTarget){
				bodyClassList.remove(scrollBusyClass);
				return;
			};

			// 現在のスクロール量
			const scrollTop = window.scrollY;

			let scrollStopTop = 0;

			if(selector === 'html'){
				scrollStopTop = -scrollTop;
			}else{
				// スクロール位置の調整
				// scroll-margin-top、scroll-padding-topを取得。相対値による小数点は四捨五入
				const scrollStopTargetStyles = getComputedStyle(scrollStopTarget);
				const scrollPaddingTop = scrollStopTargetStyles.scrollPaddingTop;
				const shiftPosition = Math.round(parseFloat(scrollStopTargetStyles.scrollMarginTop)) + Math.round(parseFloat(scrollPaddingTop === 'auto' ? 0 : scrollPaddingTop));
				// 移動先取得
				scrollStopTop = scrollStopTarget.getBoundingClientRect().top - shiftPosition;
			};


			// アニメーション開始時間
			let start;

			// スクロールアニメーション関数
			const startAnime = () => {
				requestAnimationFrame(mainAnime);
			};

			const mainAnime = timestamp => {
				// イベント発生後の経過時間
				// start未定義時のみtimestampを代入することで一度だけstartに数値を格納する
				if(start === undefined){
					start = timestamp;
				};

				// 経過時間を監視
				const elapsedTime = timestamp - start;

				// アニメーション終了処理
				if(elapsedTime > animeSpeed){
					// 実行中class削除
					bodyClassList.remove(scrollBusyClass);

					// 処理を終了
					return;
				};

				// 進捗度を算出してイージングを適用
				// elapsedTimeを0からanimeSpeedの値で正規化（0〜1の値に変換）
				const elapsedTimeNorm = elapsedTime / animeSpeed;

				// 位置設定
				const scrollY = scrollTop + scrollStopTop * easing(elapsedTimeNorm);

				// スクロール処理
				window.scrollTo(
					0,
					scrollY
				);
				startAnime();
			};

			// アニメーション初回呼び出し
			startAnime();
		});
	});
};

// スムーススクロール関数呼び出し
smoothScroll();


//=========== 横棒グラフ ============//
$('#chart').on('inview', function(event, isInView){  // 画面上に入ったらグラフを描画
    if(isInView){
        var ctx = document.getElementById("chart");  // グラフを描画したい場所のid

        var chart = new Chart(ctx, {
            type: 'horizontalBar',  // グラフのタイプ
        
            data: {  // グラフのデータ
                labels: ["HTML", "CSS", "JavaScript", "Python"],  // データの名前

                datasets: [
                    {
                        label: '習熟度',
                        data: [9, 7, 5, 4],

                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 205, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)"
                        ],

                        borderColor: [
                            "rgb(255, 99, 132)",
                            "rgb(255, 159, 64)",
                            "rgb(255, 205, 86)",
                            "rgb(75, 192, 192)"
                        ],

                        borderWidth: 1
                    }
                ]
            },

            options: {  // グラフのオプション 
                scales: {
                    xAxes: [  // グラフ縦軸（X軸）設定
                        {
                            ticks: {
                                beginAtZero: true,  // 0からスタート
                                suggestedMax: 10,   // 最大が10
                                suggestedMin: 0,    // 最小が0
                                stepSize: 1,        // １づつ数値が刻まれる
                                callback: function(value){
                                    return value;  // 数字で表示     
                                }
                            }
                        }
                    ],

                    yAxes: [  // グラフ横（Y軸）設定
                        {
                            barPercentage: 0.75,  // バーの太さ
                            ticks: {
                                fontSize: 20
                            }
                        }
                    ]
                }
            }
        });       
    };
});