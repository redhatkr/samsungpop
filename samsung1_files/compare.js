(function() {

	$.compare = {
		isCertLoginRequired : false,
		xuseYn : "",
		selectFundArr : "",
		/** 선택된 펀드 코드 */
		isDontBuy : "",
		/** 구매 불가 펀드 코드 */
		selectFundArrCnt : 0,
		/** 선택된 펀드 코드 숫자. */
		elsCartTotalCount : 0,
		init : function() {
			/**
			 * @fundType ELS/DLS : elsdls FUND : fund
			 */
			$.compare.dockTab();
		},
		/* Total Count - 공통 */
		dockTotalCnt : function(COOKIENM, TOTALID) {
			var fund_cookie = $.cookie(COOKIENM);
			var totalCnt = 0;
			if ((fund_cookie != undefined)) fund_cookie = JSON.parse(fund_cookie);
			else fund_cookie = [];
			
			totalCnt = fund_cookie.length;
			$(TOTALID).html("(" + totalCnt + ")");
			
			if (userlogin != false) {
				var $f = $.form('frmDockSlide');
				$.cs.ajax({
					type : 'post',
					url : '/ux/kor/finance/els/myels/myInterest.do',
					dataType : 'json',
					data : $f.toParameterString('getmyInterestGoods', true),
					success : function(data) {
						$.compare.elsCartTotalCount = data.result.totalCount;
						$("#elsCartTotal").html("(" + $.compare.elsCartTotalCount + ")");
					},
					loadingStart : true,
					loadingEnd : true
				});
			}
		},
		/* 탭메뉴 -공통 */
		dockTab : function() {

			$(".toast_article").each(function() {
				$(".toast_article .btn_toast_open em").text("토스트 배너 열기"); // 웹접근성 0-16 오류 수정

				$(this).find(".toastBtn li>a").click(function(e) {

					/* 탭 이동시 체크한 데이터 초기화 */
					$.compare.isDontBuy = '';
					$.compare.selectFundArr = '';
					$.compare.selectFundArrCnt = 0;
					
					$("input:checkbox[name=dockChk]").prop("checked", false);

					var toast_length = $(this).parent().index();

					$(".toastBtn li").removeClass("current");
					$(".toastBtn li a").attr("title","");// 웹접근성 0-19 오류 수정
					$(this).parent().addClass("current");
					$(this).attr("title","현재탭");// 웹접근성 0-19 오류 수정


					$(".toastTarget").hide();
					$(".toastTarget").eq(toast_length).show();
					$(".toast_article .btn_toast_open").addClass("close");
					$(".toast_article .btn_toast_open em").text("토스트 배너 닫기"); // 웹접근성 0-16 오류 수정

					/* 첫번째 탭 클릭시 */
					if (toast_length == '0') {
						/* ELS/DLS페이지일경우 */
						if (fundType == 'elsdls') {
							$.compare.getElsData('elsTodayProduct', 'lately');
						} else if (fundType == 'fund') {
							$.compare.getFundCookieData('fundDetailCookie');
						}
						/* 두번째 탭 클릭시 */
					} else if (toast_length == '1') {
						if (fundType == 'elsdls') {
							$.compare.getElsData('elsCompData', 'compare');
						} else if (fundType == 'fund') {
							$.compare.getFundCookieData('fundCompData');
						}
						/* 세번째 탭 클릭시 */
					} else if (toast_length == '2') {
						if (fundType == 'elsdls') {
							$.compare.getElsCart();
						} else if (fundType == 'fund') {
							if (isLogin()) {
								$.compare.getFundCartData();
							} else {
								$.compare.noData(fundType, 'Cart');
							}
						}
					}
				});

				$(".toast_article .btn_toast_open").click(function() {
					if ($(this).hasClass("close")) {
						$(this).removeClass("close");
						$(this).find("em").text("토스트 배너 열기"); // 웹접근성 0-16 오류 수정
						$(".toastBtn li").removeClass("current");
						$(".toastBtn li a").attr("title","");// 웹접근성 0-19 오류 수정
						$(".toastTarget").hide();
					} else {
						$(this).addClass("close");
						$(this).find("em").text("토스트 배너 닫기"); // 웹접근성 0-16 오류 수정
						$(".toastBtn li").eq(0).addClass("current");
						$(".toastBtn li").eq(0).find("a").attr("title","현재탭");// 웹접근성 0-19 오류 수정
						$(".toastTarget").eq(0).show();

						/* ELS/DLS (+, - 버튼 눌렀을때 탭 0 show) */
						if (fundType == 'elsdls') {
							$.compare.getElsData('elsTodayProduct', 'lately');
						} else if (fundType == 'fund') {
							$.compare.getFundCookieData('fundDetailCookie');
						}
					}
				});
			});

			// 금융상품 맞춤형배너 닫기
			$(".customize_article .btn_close").click(function() {
				$(this).parent().hide();
			});

		},
		/***********************************************************************
		 * ELS / DLS 최근 본 상품 / 상품비교 데이터 가져오기
		 **********************************************************************/
		getElsData : function(COOKIENM, tabBtnID) {
			var els_cookie = $.cookie(COOKIENM);

			if ((els_cookie != null) || (typeof els_cookie != 'undefined')) {
				els_cookie = JSON.parse(els_cookie);
				$("#btn" + tabBtnID).show();
			}
			var _target = null;

			if (COOKIENM == 'elsTodayProduct') {
				_target = $('#elsLatelyList');

			} else if (COOKIENM == 'elsCompData') {
				_target = $('#elsCompareList');
			}
			
			_target.empty();

			$.compare.setElsDlsGoods(els_cookie, _target);
		},

		/***********************************************************************
		 * ELS / DLS 장바구니
		 **********************************************************************/
		getElsCart : function() {
			var $f = $.form('frmDockSlide');

			var _target = $('#elsCartList');
			_target.empty();
			
			if (userlogin == false) {
				_target.append($.compare.noData('elsdls', 'Cart'));
			} else {
				$.cs.ajax({
					type : 'post',
					url : '/ux/kor/finance/els/myels/myInterest.do',
					dataType : 'json',
					data : $f.toParameterString('getmyInterestGoods', true),
					success : function(data) {
						$.compare.setElsDlsGoods(data, _target);
					},
					loadingStart : true,
					loadingEnd : true
				});
			}
		},

		setElsDlsGoods : function(data, _target) {
			var resultErr = '';

			if (_target.selector == '#elsCompareList') {
				resultErr = $.compare.noData('elsdls', 'Compare');
			} else if (_target.selector == '#elsLatelyList') {
				resultErr = $.compare.noData('elsdls', 'Lately');
			} else if (_target.selector == '#elsCartList') {
				resultErr = $.compare.noData('elsdls', 'Cart');
			}

			if (($.util.isEmpty(data)) || (typeof data == 'undefined')) {
				_target.append(resultErr);
				_common.reinit_ui();
			} else {
				ISCD = '';
				rowNum = 0;
				var totalCount = 0;

				if (_target.selector == '#elsCartList') {
					var result = data.result;
					totalCount = result.totalCount;
					
					$.compare.elsCartTotalCount = totalCount;
					$("#elsCartTotal").html("(" + $.compare.elsCartTotalCount + ")");
					
					if (totalCount > 0) {

						$("#btncart").show();

						for ( var i = 0; i < totalCount; i++) {
							
							var datas = result.list[i];

							ISCD = datas.ISCD;
							ISCD_TYPE_CODE = datas.ISCD_TYPE_CODE; // 2: 청약중인상품, 1:청약완료상품
							REC_ISCD_YN = datas.REC_ISCD_YN;
							NEW_ISCD_YN = datas.NEW_ISCD_YN;
							
							rowNum = i;

							$.compare.searchDetail(rowNum, _target, ISCD, ISCD_TYPE_CODE);
						}
					} else {
						_target.append(resultErr);
						_common.reinit_ui();
					}
				} else {
					totalCount = data.length;

					if (totalCount > 0) {

						/*
						 * 여기작업해서 테스트 if (_target.selector == '#elsLatelyList') {
						 * $("#btnlately").show(); } else if (_target.selector ==
						 * '#elsCompareList') { $("#btncompare").show(); }
						 */

						for ( var i = parseInt(totalCount); i--;) {

							ISCD = data[i].code;
							ISCD_TYPE_CODE = data[i].type; // 2: 청약중인상품, // 1:청약완료상품
							REC_ISCD_YN = "";
							NEW_ISCD_YN = "";
							rowNum = totalCount - parseInt(i);

							$.compare.searchDetail(rowNum, _target, ISCD, ISCD_TYPE_CODE);
						}
					} else {
						_target.append(resultErr);
						_common.reinit_ui();
					}
				}
			}
		},

		searchDetail : function(rowNum, target, ISCD, ISCD_TYPE_CODE) {
			var $f = $.form('frmDockSlide');
			
			if (ISCD_TYPE_CODE == '' || ISCD_TYPE_CODE == '0' || typeof (ISCD_TYPE_CODE) == 'undefined') {
				ISCD_TYPE_CODE = "1";
			}

			$f.val('ISCD', ISCD);
			$f.val('ISCD_TYPE_CODE', ISCD_TYPE_CODE);

			$.cs.ajax({
				type : 'post',
				url : '/ux/kor/finance/els/saleGoods/view.do',
				dataType : 'json',
				async : false,
				data : $f.toParameterString('getGoodsPreview', true),
				success : function(data) {
					$.compare.setGoodsPreview(data, ISCD, rowNum, target, ISCD_TYPE_CODE);
				},
				loadingStart : true,
				loadingEnd : true
			});
		},

		/* ELS 리스트 출력 */
		setGoodsPreview : function(data, ISCD, rowNum, _target, ISCD_TYPE_CODE) {
			var errMsg = data.errMsg;
			var trMsg = data.trMsg;
			var result = data.result;
			var tabName = _target.selector;

			var resultStr = '';

			if (!$.util.isEmpty(errMsg)) {
				// alert(errMsg);
				$.els.deleteCookies(ISCD, 'comp');
				//$.els.setCartAd(ISCD);
			} else if (!$.util.isEmpty(trMsg)) {
				// alert(trMsg);
				$.els.deleteCookies(ISCD, 'comp');
				//$.els.setCartAd(ISCD);
			} else {
				var _outRec1 = result.outRec1;
				var _outRec2 = result.outRec2;
				
				if (!$.util.isEmpty(_outRec1)) {

					PRDT_NAME = $.trim(_outRec1.PRDT_NAME); 					/** 상품명, VARCHAR(90) * */
					ONLN_SBSN_YN = $.trim(_outRec1.ONLN_SBSN_YN);					/** 온라인여부, VARCHAR(1) * */
					PRDT_RISK_RTNG_CODE = $.trim(_outRec1.PRDT_RISK_RTNG_CODE);					/** 상품위험등급코드, CHAR(1) * */
					PRNL_GRNT_YN = $.trim(_outRec1.PRNL_GRNT_YN);					/** 원금보장여부, CHAR(1) * */
					A_ELS_SECT_CODE = $.trim(_outRec1.A_ELS_SECT_CODE);					/** ELS구분코드, CHAR(1) * */
					INVT_FRCT_PRFT_CTNT = $.trim(_outRec1.INVT_FRCT_PRFT_CTNT);					/** 투자예상수익내용, VARCHAR(150) * */
					PRDT_TYPE_NAME = $.trim(_outRec1.PRDT_TYPE_NAME);					/** 상품유형명, VARCHAR(90) * */
					UNAS_CTNT = $.trim(_outRec1.UNAS_CTNT);					/** 기초자산내용, VARCHAR(120) * */
					STRD_SCRS_DSCN_IFMN_CTNT = $.trim(_outRec1.STRD_SCRS_DSCN_IFMN_CTNT);					/** 구조화증권설명정보내용, CHAR(1) * */
					SBSN_STRT_DATE = $.trim(_outRec1.SBSN_STRT_DATE);					/** 청약시작일자, CHAR(8) * */
					SBSN_END_DATE = $.trim(_outRec1.SBSN_END_DATE);					/** 청약종료일자, CHAR(8) * */
					A_SBSN_ALWD_YN = $.trim(_outRec1.A_SBSN_ALWD_YN);					/** 청약가능여부, CHAR(1) * */
					UNAS_CTNTTemp = UNAS_CTNT.replace(/,/gi, '<br>');					/** 기초자산내용, VARCHAR(120) * */
					STRD_SCRS_RDMN_MANS_SECT_CODE = $.trim(_outRec1.STRD_SCRS_RDMN_MANS_SECT_CODE);	/** 구조화증권상환방식구분코드, CHAR(1) * */
					STRD_SCRS_PRDT_TYPE_CODE = $.trim(_outRec1.STRD_SCRS_PRDT_TYPE_CODE);	/** 구조화증권상품유형코드, CHAR(3) * */
					ISSD_DATE = $.trim(_outRec1.ISSD_DATE);	/** 발행일자, CHAR(8) * */
					XPRN_DATE = $.trim(_outRec1.XPRN_DATE);				/** 만기일자, CHAR(8) * */
					MAXM_LOSS_RATE = "-" + $.trim(_outRec1.MAXM_LOSS_RATE);

					if (PRNL_GRNT_YN == 'Y') {
						PRNL_GRNT_YNTemp = '원금보장';
					} else if (PRNL_GRNT_YN == 'N') {
						PRNL_GRNT_YNTemp = '원금비보장';
					}

					if (ISCD_TYPE_CODE != '3') {
						if( nowDay > $.els.dateFormat(SBSN_END_DATE)){
							ISCD_TYPE_CODE = '1'; // 판매완료
						} else {
							ISCD_TYPE_CODE = '2'; // 판매중
						}
					}

					/* 상품명 */
					var PRDT_NAME_CVT = $.els.goodsTypeFun(PRDT_NAME,A_ELS_SECT_CODE, PRNL_GRNT_YN);

					resultStr += '<li data-fundCd=' + ISCD + '>';
					resultStr += '	<span><input type="checkbox" name="dockChk" value="' + ISCD + '" data-attr="' + ISCD_TYPE_CODE + '" title="' + PRDT_NAME_CVT + ' 선택" onclick="javascript:$.compare.selectFund(this);"></span>';
					resultStr += '	<dl>';
					resultStr += '		<dt style="width:13%"><a href="javascript:_common.showElsDlsDetail(\'' + ISCD + '\', \'' + ISCD_TYPE_CODE 	+ '\')">' + PRDT_NAME_CVT + '</a></dt>';
					
					/* 예상수익률 */
					if (INVT_FRCT_PRFT_CTNT.indexOf("(") > 1) {
						var split1 = INVT_FRCT_PRFT_CTNT.substring(0,INVT_FRCT_PRFT_CTNT.indexOf("("));
						var split2 = INVT_FRCT_PRFT_CTNT.substring((INVT_FRCT_PRFT_CTNT.indexOf("(")),INVT_FRCT_PRFT_CTNT.length);

						resultStr += '	<dd style="width:19%" class="rate"><strong>특정조건 충족시</strong><br><span class="rise">' + split1 + ' ' + split2 + '</span></dd>';
						resultStr += '	<dd style="width:20%" class="rate"><strong>조건 미충족시 최대 손실률</strong><br><span class="rise">'+parseFloat(MAXM_LOSS_RATE).toFixed(2)+'%</span></dd>';
					} else {
						resultStr += '	<dd style="width:19%" class="rate"><strong>특정조건 충족시</strong><br>' + (INVT_FRCT_PRFT_CTNT.length > 0 ? '<span class="rise">' + INVT_FRCT_PRFT_CTNT + '</span>' : '<span>-</span>') + '</span></dd>';
						resultStr += '	<dd style="width:20%" class="rate"><strong>조건 미충족시 최대 손실률</strong><br>' + (INVT_FRCT_PRFT_CTNT.length > 0 ? '<span class="rise">' + parseFloat(MAXM_LOSS_RATE).toFixed(2) + '%</span>' : '<span>' + parseFloat(MAXM_LOSS_RATE).toFixed(2) + '%</span>') + '</span></dd>';
					}
					
					if (PRNL_GRNT_YN == 'Y') {
						resultStr += '	<dd style="width:15%" class="pay"><span class="ico_pay">원금지급</span></dd>';
					} else {
						resultStr += '	<dd style="width:15%" class="pay"><span class="ico_pay knockIn">원금비보장</span></dd>';
					}
					resultStr += '		<dd style="width:18%" class="risk"><strong>위험도</strong><span class="deps' + PRDT_RISK_RTNG_CODE + '">' + $.els.riskFormatNew(PRDT_RISK_RTNG_CODE,PRNL_GRNT_YN,STRD_SCRS_RDMN_MANS_SECT_CODE, "RISK") + '</span></dd>';
					/* 청약중 */
					if (nowDay > $.els.dateFormat(SBSN_END_DATE)) {
						resultStr += '	<dd style="width:11%" class="btn">청약완료</dd>';
					} else {
						resultStr += "	<dd style='width:11%' class=\"btn\"><button type=\"button\" class=\"btnSmall red\" onclick=\"javascript:$.compare.subscribeGoFun('" + ISCD + "','"+PRDT_RISK_RTNG_CODE+"');\">청약</button></dd>";
					}
					if (tabName != '#elsCartList') {
						resultStr += "		<dd style='width:4%' class=\"del\"><button type=\"button\" title=\"삭제\" onclick=\"$.compare.listDelete('elsdls', '"+ ISCD	+ "', '"+ tabName+ "');\">삭제</button></dd>";
					} else {
						resultStr += "		<dd style='width:4%' class=\"del\"><button type=\"button\" title=\"삭제\" onclick=\"$.compare.deleteCart('" + ISCD + "');\">삭제</button></dd>";
					}

					resultStr += '	</dl>';
					resultStr += '</li>';

					_target.append(resultStr);
				}
				_common.reinit_ui();
			}
		},
		subscribeGoFun : function(iscd,PRDT_RISK_RTNG_CODE) {

			if ($.compare.isCertLoginRequired || $.compare.xuseYn == "Q") {
				//confirmCertLogin(encodeURIComponent('/ux/kor/finance/els/elsSubscribe/subscribeGoContainer.do?RETURN_ISCD=' + iscd + '&SUBSCRIBEYN=Y'));
				confirmCertLogin(encodeURIComponent('/ux/kor/finance/els/elsSubscribe/subscribeGoContainer.do?RETURN_ISCD=' + iscd ));
				return;
				// confirmCertLogin(encodeURIComponent(location.href+'?ISCD=' +
				// iscd + '&SUBSCRIBEYN=Y'));
				// return false;
				/*if (confirm("본인 여부를 확인하기 위한 공인인증서가 필요한 업무입니다.\n공인인증서를 이용하여 다시 로그인 하시기 바랍니다.\n다시 로그인 하시겠습니까?")) {

					var locPath = '/ux/kor/finance/els/elsSubscribe/subscribeGoContainerStep2.do';

					var param = '?ISCD=' + iscd + '&openMenuCode='
							+ 'M1290558199343' + '&openMenuUrl='
							+ encodeURIComponent(encodeURIComponent(locPath));

					openLogin('RETURN_MENU_CODE=' + 'M1290558199343'
							+ '&RETURN_MENU_URL=' + locPath
							+ encodeURIComponent(param));
					return;
				} else {
					return;
				}*/
			} else {
				/*var $f = $.form('frmDockSlide');
				$f.val('ISCD', iscd);
				$f.val('MENU_CODE', 'M1290558199343');
				$f.action = '/ux/kor/finance/els/elsSubscribe/subscribeGoContainerStep2.do';
				$f.submit();*/

				$.compare.mrktLayerPop(iscd,PRDT_RISK_RTNG_CODE);

			}
		},

		searchTrgtMrkt : function(iscd,PRDT_RISK_RTNG_CODE){
            var MDRP_PSBL_YN = $("[name=MDRP_PSBL_YN]:checked").val();
            var RISK_PREF_POPN_CODE = $("[name=RISK_PREF_POPN_CODE]:checked").val();

            if(MDRP_PSBL_YN == undefined || MDRP_PSBL_YN == ""){
                alert("투자하시려는 자금의 성향에 체크해주세요.");
                return;
            }

            if(RISK_PREF_POPN_CODE == undefined || RISK_PREF_POPN_CODE == ""){
                alert("고객님께서 금번 투자하려는 자금의 위험 성향을 체크해주세요.");
                return;
            }

            if(RISK_PREF_POPN_CODE == "3" && PRDT_RISK_RTNG_CODE != "1"){
                alert("투자수익을 고려하나 원금 보존이 더 중요를 선택하신 경우\n '초저위험등급' 상품만 청약 가능합니다.\n선택하신 상품은 청약이 불가합니다.");
                SSP.modalView.boxClose($('#mrktLayerPop'),'');
                return;
            }

            var $f = $.form('frmDockSlide');
            $f.val('ISCD', iscd);
            $f.val('RISK_PREF_POPN_CODE', RISK_PREF_POPN_CODE);
            $f.val('MDRP_PSBL_YN', MDRP_PSBL_YN);

            $.cs.ajax({
                    type : 'post',
                    url : '/ux/kor/finance/els/elsSubscribe/subscribeGoContainerStep.do',
                    data : $f.toParameterString('getTrgtMrktData'),
                    dataType : 'json',
                    loadingStart : true,
                    loadingEnd : true,
                    success : function(r){
                        if(!$.util.isEmpty(r.errorMsg) || !$.util.isEmpty(r.trMsg)){
                            if (!$.util.isEmpty(r.errorMsg)) alert(r.errorMsg);
                            if (!$.util.isEmpty(r.trMsg)) alert(r.trMsg);
                        }else{
                            if(!$.util.isEmpty(r.result)){
                                $f.val('ISCD', iscd);
                                $f.val("MENU_CODE", 'M1290558199343');
                                $f.val('TRGT_MRKT_EQTY_SECT_CODE',r.result.TRGT_MRKT_EQTY_SECT_CODE);
                                $f.action = '/ux/kor/finance/els/elsSubscribe/subscribeGoContainerStep2.do';
                                $f.cSubmit();
                            }
                           SSP.modalView.boxClose($('#mrktLayerPop'),'');
                        }
                    }
            });

        },
        mrktLayerPop : function(iscd,PRDT_RISK_RTNG_CODE){

            var resultStr =  '';
            //alert(PRDT_RISK_RTNG_CODE);

            $("#mrktLayerPop").remove();

            resultStr += '<div class="modalPop uxpop" id="mrktLayerPop">';
            resultStr += '	<div class="mbg"><!-- 배경화면 내용없음 --></div>';
            resultStr += '	<div class="popSection">';
            resultStr += '		<div class="head reHead">';
            resultStr += '			<h1>자금의 성향 및 위험성향 파악 안내</h1>';
            resultStr += '		</div><!-- //head  -->';
            resultStr += '		<!-- 본문내용 시작 -->';
            resultStr += '		<div class="cont">';
            resultStr += '			<p class="mgb20">고객님께서 투자하시고자 하는 자금의 성향 및 위험성향이 어떠하신지 확인하고자 합니다.</p>';
            resultStr += '			<p class="mgb10">1. 투자하시려는 자금의 성향에 체크해주세요.</p>';
            resultStr += '            <div class="terms_area" style="padding: 5px;padding-left: 30px;">';
            resultStr += '				<ol class="provisionAgreement mgl10">';
            resultStr += '					<li><label for="MDRP_PSBL_YN1"><input type="radio" id="MDRP_PSBL_YN1" name="MDRP_PSBL_YN" value="Y"> 만기 이전 중도환매할 수 있음</label></li>';
            resultStr += '					<li><label for="MDRP_PSBL_YN2"><input type="radio" id="MDRP_PSBL_YN2" name="MDRP_PSBL_YN" value="N"> 만기까지 보유 예정</label></li>';
            resultStr += '				</ol>';
            resultStr += '            </div>';

            resultStr += '			<p class="mgb10 mgt20">2. 고객님께서 금번 투자하려는 자금의 위험 성향을 체크해주세요</p>';
            resultStr += '            <div class="terms_area" style="padding: 5px;padding-left: 30px;">';
            resultStr += '				<ol class="provisionAgreement mgl10">';
            resultStr += '					<li><label for="RISK_PREF_POPN_CODE1"><input type="radio" id="RISK_PREF_POPN_CODE1" name="RISK_PREF_POPN_CODE" value="1"> 손실 위험이 있더라도 투자수익이 중요</label></li>';
            resultStr += '					<li><label for="RISK_PREF_POPN_CODE2"><input type="radio" id="RISK_PREF_POPN_CODE2" name="RISK_PREF_POPN_CODE" value="2"> 원금 보존을 고려하나 투자수익이 더 중요</label></li>';
            resultStr += '					<li><label for="RISK_PREF_POPN_CODE3"><input type="radio" id="RISK_PREF_POPN_CODE3" name="RISK_PREF_POPN_CODE" value="3"> 투자 수익을 고려하나 원금 보존이 더 중요</label></li>';
            resultStr += '				</ol>';
            resultStr += '            </div>';


            resultStr += '            <div class="btnArea">';
            resultStr += '                <a href="javascript:void(0)" class="btnLarge blue" onclick="$.compare.searchTrgtMrkt(\''+iscd+'\',\''+PRDT_RISK_RTNG_CODE+'\')">확인</a>';
            resultStr += '            </div>';
            resultStr += '		</div><!-- //cont -->';
            resultStr += '		<button type="button" name="" id="modalClose" class="closeBtn" onclick=""><em class="hidden">모달팝업 닫힘</em></button>';
            resultStr += '	</div><!-- //popSection  -->';
            resultStr += '</div><!-- //modalPop  -->';

            //$(resultStr).insertBefore("#wrap");
            SSP.modalView.centerBox($(resultStr).insertBefore("#wrap"));
            _common.reinit_ui();


        },

		/* 펀드 최근본상품/상품비교 리스트 출력 */
		getFundCookieData : function(COOKIENM) {

			var $f = $.form("frmDockSlide");
			$f.empty("pension");
			var fundCd = "";
			var fund_cookie = $.cookie(COOKIENM);

			if (fund_cookie != undefined || fund_cookie != null) {
				fund_cookie = JSON.parse(fund_cookie);

				var maxFund = fund_cookie.length;
				var minFund = 0;

				if (maxFund > 10)
					minFund = maxFund - 10;

				for ( var i = maxFund; i > minFund; i--) {
					if (fund_cookie[i - 1].code != undefined) {
						if (fundCd == "") fundCd = fund_cookie[i - 1].code;
						else fundCd = fundCd + "@" + fund_cookie[i - 1].code;
					}
				}
			}

			$f.val("latelyFundCode", fundCd);
			$f.val("setCookieFlag", "Y");

			if (COOKIENM == 'fundDetailCookie') {
				$.compare.getFundList('Lately');
			} else if (COOKIENM == 'fundCompData') {
				$.compare.getFundList('Compare');
			}
		},

		/* 펀드 장바구니 리스트 출력 */
		getFundCartData : function() {

			var $f = $.form("frmDockSlide");

			$('#frmDockSlide input[name^=zrn_FUND_CD_]').remove();
			$('#frmDockSlide input[name=PrdtAlis]').remove();

			var fundCd = "";
			var GropNo = $("#GropNoSelBottom>option:selected").val();

			if (GropNo == "")
				return;
			$f.val('GropNo', GropNo);
			$f.val("pension", $f.val("parmaPension"));
			$f.val("latelyFundCode", fundCd);
			$f.val("setCookieFlag", "Y");

			$.cs.ajax({
				url : '/ux/kor/finance/wish/wishGoods/bottomFundList.do',
				data : $f.toParameterString('', false),
				dataType : 'json',
				loadingStart : true,
				loadingEnd : true,
				success : function(data) {
					if (data.errMsg != "") {
						alert(data.errMsg);
						return;
					}

					if (typeof (data.igv1101p) != "undefined") {
						var len = data.igv1101p.outRec2.length;

						var str = '';

						for ( var i = 0; i < len; i++) {
							var outRec2 = data.igv1101p.outRec2[i];
							if (fundCd == "")
								fundCd = $.util.trim(outRec2.FUND_CODE);
							else
								fundCd = fundCd + "@" + $.util.trim(outRec2.FUND_CODE);

							str = '<input type="hidden" name="zrn_FUND_CD_' + $.util.trim(outRec2.FUND_CODE) + '"  value="' + outRec2.ZRN_FUND_CD.trim() + '"/>';
							$('#frmDockSlide').append(str);
						}

						$f.val("latelyFundCode", fundCd);
						$f.val("setCookieFlag", "Y");
						$.compare.getFundList('Cart');
					} else {
						alert("장바구니 그룹에 등록된 상품이 없습니다.");
						return;
					}
				}
			});
		},

		/*
		 * @fund 리스트 셋팅 param1 : tabName별 id 매칭
		 */
		getFundList : function(tabName) {
			var $f = $.form("frmDockSlide");

			// $f.val("isTrade", 'Y');
			$f.val("currentPage", 1);
			$f.val("rowsPerPage", 10);
			$("#fund" + tabName + "List").empty();

			$.cs.ajax({
						async : true,
						url : '/ux/kor/finance/fund/search/listLoad.do',
						data : $f.toParameterString('', false),
						success : function(data) {
							if (typeof data.errorMsg != 'undefined') {
								$.compare.noData(fundType, tabName);
								return;
							}

							if (typeof (data.list) != "undefined") {

								$("#maxTrdDtP").html("기준일자 : " + $.util.dateFormat(data.maxTrdDt,'yyyy-MM-dd'));

								var totalMath = 0;
								var cnt = data.list.length;
								var totalCount = data.totalCount;
								var currentPage = $f.val("currentPage");
								var rowsPerPage = $f.val("rowsPerPage");

								if (totalCount == 0) totalMath = 1;
								else totalMath = Math.ceil(totalCount/ rowsPerPage);

								$("#fund" + tabName + "Total").html("(" + totalCount + ")");

								for ( var i = 0; i < cnt; i++) {

									var list = data.list[i];
									var isFlag = false;
									if (list.HTSBuyPossYN == "Y" && list.NewPossYN == "Y") isFlag = true;

									var str = '';

									if (!isFlag) {
										if ($.compare.isDontBuy == "") $.compare.isDontBuy = list.FundCd;
										else $.compare.isDontBuy = $.compare.isDontBuy + "@" + list.FundCd;
									}

									str += '<li data-fundCd=' + list.FundCd + '>';
									str += '	<label><input type="checkbox" name="dockChk" value="' + list.FundCd + '" title="' + list.FundKrNm + ' 선택" style="opacity: 0;" onclick="javascript:$.compare.selectFund(this);"></label>';
									str += '	<dl>';
									str += '		<!-- deps1 = 매우낮음, deps2 = 낮음, deps3= 중간, deps4 = 높음, deps5= 매우높음  -->';
									str += '		<dt><a href="javascript:_common.showFundDetail(\''+ list.FundCd+ '\');">'+ list.FundKrNm + (list.OnlineYN == 'Y' ? '(온라인)' : '') + '</a></dt>';
									str += '		<dd class="rate"><strong>3개월 수익률</strong>' + $.compare.printYield(list.YIELD_3M, 'span', '%')	+ '</dd>';

									var rtngAgnyRtngValu = list.rtngAgnyRtngValu;
									str += '		<dd class="risk"><strong>위험도</strong>';
									if (rtngAgnyRtngValu == "1") str += '<span class="deps1">매우낮음</span>';
									if (rtngAgnyRtngValu == "2") str += '<span class="deps2">낮음</span>';
									if (rtngAgnyRtngValu == "3") str += '<span class="deps3">중간</span>';
									if (rtngAgnyRtngValu == "4") str += '<span class="deps4">높음</span>';
									if (rtngAgnyRtngValu == "5") str += '<span class="deps5">매우높음</span>';
									str += '		</dd>';

									str += '		<dd class="sum"><strong>총규모</strong><span>' + BondUtil.to_percent(list.fundClasSum / 100000000,2)+ '억원</span></dd>';
									str += "		<dd class=\"del\"><button type=\"button\" title=\"삭제\" onclick=\"$.compare.listDelete('fund', '" + list.FundCd + "', '" + tabName + "');\">삭제</button></dd>";
									str += '	</dl>';
									str += '</li>';

									$("#fund" + tabName + "List").append(str);
								}

							} else {
								$.compare.noData(fundType, tabName);
							}
							_common.reinit_ui();
						},
						loadingStart : true,
						loadingEnd : true
					});
		}/** loadList */
		,
		/**
		 * @cookie 삭제 - 공통 param1: fund or ELS/DLS param2 : fund code param3 :
		 *         tab구분
		 */
		listDelete : function(listType, fundCd, tab) {

			var fund_cookie = null;
			var COOKIENM = '';
			var TOTALID = '';
			if (listType == 'fund') {
				if (tab.toLowerCase() == 'lately') {
					COOKIENM = 'fundDetailCookie';
					TOTALID = '#fundLatelyTotal';
				} else if (tab.toLowerCase() == 'compare') {
					COOKIENM = 'fundCompData';
					TOTALID = '#fundCompareTotal';
				} else if (tab.toLowerCase() == 'cart') {
					$.compare.cartDelete(fundCd);
					return;
				}
			} else if (listType == 'elsdls') {
				if (tab.indexOf('elsLatelyList') > -1) {
					COOKIENM = 'elsTodayProduct';
					TOTALID = '#elsLatelyTotal';
				} else if (tab.indexOf('elsCompareList') > -1) {
					COOKIENM = 'elsCompData';
					TOTALID = '#elsCompareTotal';
				}
			}

			fund_cookie = $.cookie(COOKIENM);
			if (fund_cookie != undefined)
				fund_cookie = JSON.parse(fund_cookie);
			else
				fund_cookie = [];

			var cookie_cnt = fund_cookie.length;

			var temp_fund_cookie = fund_cookie.slice(0);
			var fundCdArr = '';

			if ((typeof fundCd != 'undefined') || fundCd.length > 0) {

				for ( var i = cookie_cnt; i--;) {
					if (fund_cookie[i].code == fundCd) {
						temp_fund_cookie.splice(i, 1);
						break;
					}
				}
				$.cookie(COOKIENM, null, {
					expires : -1,
					path : '/'
				});
				$.cookie(COOKIENM, JSON.stringify(temp_fund_cookie), {
					expires : 7,
					path : '/'
				});

				$("[data-fundCd=" + fundCd + "]").remove();
				$.compare.dockTotalCnt(COOKIENM, TOTALID);
				
				if (listType == 'fund') {
					if (tab.toLowerCase() == 'lately') {
						if ($("#fundLatelyList li").length < 1) {
							$.compare.noData('fund','Lately');
						}
					} else if (tab.toLowerCase() == 'compare') {
						if ($("#fundCompareList li").length < 1) {
							$.compare.noData('fund','Compare');
						}
					}	
				} else if (listType == 'elsdls') {
					if ($(tab + " li").length < 1) {
						if (tab.indexOf('elsLatelyList') > -1) {
							$(tab).html($.compare.noData('elsdls','lately'));
						} else if (tab.indexOf('elsCompareList') > -1) {
							$(tab).html($.compare.noData('elsdls','compare'));	
						}
					}					
				}
			}
		},
		/* 장바구니 삭제 -ELS */
		deleteCart : function(fundCd) {
			var $f = $.form('frmDockSlide');

			if (fundCd != "" && fundCd.length > 0) {

				$f.val('ISCD', fundCd);
				$f.val('INS_DEL_TYP', '1');

				$.cs.ajax({
					type : 'post',
					url : '/ux/kor/finance/els/myels/myInterest.do',
					dataType : 'json',
					async : false,
					data : $f.toParameterString('adminMyInterestGoods', true),
					success : function(data) {
						if (!$.util.isEmpty(data.errorMsg)) {
							alert(data.errorMsg);
							return;
						}
						$("[data-fundCd=" + fundCd + "]").remove();
						$.compare.elsCartTotalCount = $.compare.elsCartTotalCount - 1;
						$("#elsCartTotal").html("("+$.compare.elsCartTotalCount+")");
						if ($("#elsCartList li").length < 1) {
							$("#elsCartList").html($.compare.noData('elsdls','cart'));
						}
					},
					loadingStart : false,
					loadingEnd : false
				});
			}
		},

		/* 장바구니 담기 -ELS */
		setInterest : function() {
			var msgFlag = false;
			var iscd = '', iscdType = '';

			$("input[name=dockChk]").each(function() {

				if ($(this).is(":checked") == true) {
					if (iscd == '')
						iscd = $(this).val();
					else
						iscd += "," + $(this).val();

					if (iscdType == '')
						iscdType = $(this).data("attr");
					else
						iscdType += "," + $(this).data("attr");

					msgFlag = true;
				}
			});

			if (!msgFlag) {
				alert('장바구니에 담으실 상품을 선택해 주세요.');
				return;
			} else {
				var $f = $.form("frmDockSlide");
				if (userlogin == true) {
					$f.val('ISCD', iscd);
					$f.val('INS_DEL_TYP', '2'); // 1 : delete , 2 : insert
					$f.val('ISCD_TYPE_CODE', iscdType); // 1: 청약완료, 2 : 청약중

					$.cs.ajax({
						type : 'post',
						url : '/ux/kor/finance/els/myels/myInterest.do',
						dataType : 'json',
						async : false,
						data : $f.toParameterString('adminMyInterestGoods', false),
						success : function(data) {

							if (!$.util.isEmpty(data.errorMsg)) {
								if (confirm(data.errorMsg + '\n지금 확인하시겠습니까?')) {
									$.els.interestMove();
								}
							} else {
								try {
									initDockCall('cart');
								} catch (e) {
								}

								if (confirm('장바구니에 등록되었습니다.\n지금 확인하시겠습니까?')) {
									$.els.interestMove();
								}
							}
						},
						loadingStart : false,
						loadingEnd : false
					});
				} else {
					if (confirm('로그인 후 이용 가능합니다. \n지금 로그인하시겠습니까?')) {
						var locPath = location.pathname;
						var param = '?ISCD='
								+ $f.val('ISCD')
								+ '&openMenuCode='
								+ getMenuCode()
								+ '&openMenuUrl='
								+ encodeURIComponent(encodeURIComponent(locPath));

						openLogin('RETURN_MENU_CODE=' + getMenuCode()
								+ '&RETURN_MENU_URL=' + locPath
								+ encodeURIComponent(param));
					}
				}
			}
		},

		/* 상품비교 -ELS */
		openComparePopup : function(viewType,_this) {
			// 기준일자
			var objVal = '';
			var objCode = '';
			var idxVal = 0;

			$('input[name=dockChk]:checked').each(function(objIdx) {

				if (objVal == '')
					objVal += $(this).val();
				else
					objVal += "," + $(this).val();

				if (objCode == '')
					objCode += $(this).data('attr');
				else
					objCode += "," + $(this).data('attr');

				idxVal = objIdx;
			});

			if (idxVal < 1) {
				alert('비교상품을 선택해주세요.\n비교는 4개까지 가능합니다.');
				return;
			} else if (idxVal > 3) {
				alert('상품비교는 최대 4개까지 가능합니다.\n다시 선택해 주시기 바랍니다.');
				return;
			} else {
				var subscribeBtn = 'Y';
				var myGoodsBtn = 'Y';
				param1 = 'search';
				param2 = 'goodsCompPopup';
				$.els.compareLayer(objVal, objCode, subscribeBtn, myGoodsBtn, param1, param2, nowDay, 'dock', viewType,_this);
			}
		},

		/* 상품비교 - FUND */
		dockFundCompare : function() {
			var chkArr = $.compare.selectFundArr;
			var chkCnt = $.compare.selectFundArrCnt;

			BondUtil.fundCompare(chkArr, chkCnt);
		},

		/* 장바구니로 이동 - ELS */
		goInterest : function() {
			var $f = $.form("frmDockSlide");
			$f.val('MENU_CODE', 'M1395020218691');
			$f.action = "/ux/kor/finance/els/myels/myInterest.do";
			$f.cSubmit();
		},

		/* printYield - 수익률 처리 */
		printYield : function(str, tag, surfix) {

			if ($.util.isEmpty(str))
				return "-";

			var returnStr = "";

			var f1 = $.util.toFloat(str);

			if (f1 > 0) returnStr = "<" + tag + " class=\"rise\">"+ BondUtil.to_percent(f1, 2) + surfix + "</" + tag + ">";
			else if (f1 < 0) returnStr = "<" + tag + " class=\"drop\">" + BondUtil.to_percent(f1, 2) + surfix + "</" + tag + ">";
			else returnStr = "<" + tag + " class=\"keep\">" + BondUtil.to_percent(f1, 2) + surfix + "</" + tag + ">";

			return returnStr;
		},
		/* 빈데이터 처리 - 공통 */
		noData : function(type, tabName) {
			var str = '';

			if (tabName.toLowerCase() == 'lately') {
				str += '<li class="no_data">최근 본 상품이 없습니다.</li>';
			} else if (tabName.toLowerCase() == 'compare') {
				str += '<li class="no_data">비교한 상품이 없습니다.</li>';
			} else if (tabName.toLowerCase() == 'cart') {
				if (userlogin == false) {
					str += '<li class="no_data">로그인 후 장바구니 조회가 가능합니다. <br><br>';
					str += "<button type=\"button\" class=\"btnSmall blue\" onclick=\"window.openMenuFromUtil('LOGIN-CERTMODE');\">로그인</button></li>";
				} else {
					str += '<li class="no_data">등록된 상품이 없습니다.</li>';
				}
			}
			if (fundType == 'fund') {
				$("#fund" + tabName + "List").append(str);
			} else {
				return str;
			}
		},
		/* 체크박스 값 셋팅 - 공통 */
		selectFund : function(thisObj) {

			if (thisObj.checked) {
				if ($.compare.selectFundArr == "") {
					$.compare.selectFundArr = thisObj.value;
					$.compare.selectFundArrCnt = $.compare.selectFundArrCnt + 1;
				} else {
					if ($.compare.selectFundArr.indexOf(thisObj.value) == -1) {
						$.compare.selectFundArr = $.compare.selectFundArr + "@" + thisObj.value;
						$.compare.selectFundArrCnt = $.compare.selectFundArrCnt + 1;
					}
				}
			} else {
				if ($.compare.selectFundArr != "") {
					var selectFundArrImsi = $.compare.selectFundArr.split("@");
					var selectFundArrTemp = "";

					for ( var i = 0; i < selectFundArrImsi.length; i++) {
						if (selectFundArrImsi[i] != thisObj.value) {
							if (selectFundArrTemp == "") selectFundArrTemp = selectFundArrImsi[i];
							else selectFundArrTemp = selectFundArrTemp + "@" + selectFundArrImsi[i];
						}
					}
					$.compare.selectFundArrCnt = $.compare.selectFundArrCnt - 1;
					$.compare.selectFundArr = selectFundArrTemp;
				}
			}

		},

		interGroupList : function() {
			var $f = $.form('frmDockSlide');

			$('#frmDockSlide input[name^=zrn_FUND_CD_]').remove();
			$('#frmDockSlide input[name=PrdtAlis]').remove();

			$.cs.ajax({
				url : '/ux/kor/finance/fund/trade/interGroupList.do',
				dataType : 'json',
				loadingStart : true,
				loadingEnd : true,
				success : function(data) {
					if (data.errMsg != '') {
						alert(data.errMsg);
						return;
					}
	
					if (typeof (data) != 'undefined') {
						var outRec1 = data.outRec1;
						var len = outRec1.length;
	
						$('#GropNoSelBottom').empty();
						if (len <= 0) {
							$('#GropNoSelBottom').append('<option value="">장바구니 그룹이 없습니다.</option>');
						} else {
							for ( var i = 0; i < len; i++) {
								$('#GropNoSelBottom').append('<option value="' 	+ outRec1[i].INTE_FUND_GROP_NO.trim() + '">' + outRec1[i].INTE_FUND_GROP_NAME.trim() + '</option>');
							}
						}
						_common.reinit_ui();
					}
				}
					});
		},

		cartDelete : function(FUNDCD) {
			var $f = $.form('frmDockSlide');
			var hiddHtml = '';
			$('form[name=frmDockSlide] input[name^=zrn_FUND_CD_]').each(function(a) {
				if ($(this).attr('name') != 'zrn_FUND_CD_' + FUNDCD) {
					hiddHtml += '<input type="hidden" name="PrdtAlis" value="' + $(this).val() + '">';
				}
			});
			$("#frmDockSlide").append(hiddHtml);
			$f.val('FUND_ARR', FUNDCD);
			$f.val('GropNoSel', $("#GropNoSelBottom>option:selected").val());
			$.cs.ajax({
				url : '/ux/kor/finance/wish/wishGoods/interGroupFundDel.do',
				data : $f.toParameterString('', false),
				dataType : 'json',
				loadingStart : true,
				loadingEnd : true,
				success : function(data) {
					if (data.errMsg != '') {
						alert(data.errMsg);
						return;
					}

					alert('삭제되었습니다.');
					$.compare.getFundCartData();
				}
			});

		}
	};
})();