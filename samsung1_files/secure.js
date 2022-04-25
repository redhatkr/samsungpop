/**
 * secure.js
 * @version : 0.1
 * @authors : TD2179 ky.cho adcapsule soft
 * @require : jquery-1.10.2.min.js
 * @require : reset.js
 * @require : astx2.min.js : $Revision: 15561
 */

"use strict";
// 보안모듈설정
var secure = {};
secure.config = {
	e2e: {	// ASTx2
		windows: ["/ux/js/secure/astx.js", "/modules/ahnlab/js/astx2.js","/modules/ahnlab/js/astx2_custom.js"]	// TODO: 배포시 min 버전 적용
		, delay: 750
//		, windows: ["/modules/ahnlab/js/astx2.min.js","/modules/ahnlab/js/astx2_custom.js"]
		, mobile: ["/sscommon/transkey_mobile/transkeyDotCom.js", "/ux/js/secure/secureTranskey.js"]	// 가상키패드 관련. // TODO: 배포시 min 버전 적용
	}, cert: {	// koscom
		windows: ["/ux/js/secure/cert.js?cb=" + window._CACHE_BUSTER, "/modules/koscom/js/app/vestsign.js?cb=" + window._CACHE_BUSTER,"/modules/koscom/js/app/js/koscom.js?cb=" + window._CACHE_BUSTER, "/modules/koscom/js/app/activexAdp.js?cb=" + window._CACHE_BUSTER]
		, mobile: ["/ux/js/secure/appfree.js?cb=" + window._CACHE_BUSTER, "/sscommon/js/appfree/appfreeCommon.js?cb=" + window._CACHE_BUSTER, "/sscommon/js/appfree/appfreeExec.js?cb=" + window._CACHE_BUSTER, "/sscommon/js/appfree/appfreeFirewall.js?cb=" + window._CACHE_BUSTER, "/sscommon/js/appfree/appfreeSiteAuth.js?cb=" + window._CACHE_BUSTER]
	}, sign: {		// OTP, 보안카드
		windows: "/ux/js/secure/sign.js"
		, mobile : "/ux/js/secure/sign.js"
	}
};

$.extend(secure, {
	e2e: {
		delay: 750
		, isLoaded: function() {
			return (typeof $ASTX2 != "object");
		}
		, init: function (){
			this.reload();
		}, reload: function () {
			//_common.open_loading();
			var _e2e = this;
			// PC : e2e, Mobile : 가상키패드
			_e2e.add();

			var scripts = secure.config.e2e[checkSecureConfType];
			var deferredItems = $.map(scripts, function (url) {
				return $.getScript(url);
			});
			deferredItems.push($.Deferred(function (deferred) {
				$(deferred.resolve);
			}));
			$.when.apply($, deferredItems).done(function () {
				$.extend(_e2e, e2e);
				_e2e.checkInstalled();
			}).fail(function (a, b, c) {
				logger.debug(a);
				logger.debug(b);
				logger.debug(c);
			});
			//_common.close_loading();
		
		}, add: function() {
			var isMobile = userClient.isMobile;
			var isWindows = userClient.os == "WINDOWS";

			// e2e 관련 Attribute 생성 및 DOM Element 추가.
			if (!isMobile && isWindows) {
				if (typeof $ASTX2 != "object") {
					$("input").not(":password").each(function (index, item) {
						if( $(item).attr("e2e_type") ==1 && $(item).attr("type") =="hidden") {
							$(item).after($('<input type="hidden" class="_clearText" name="' + $(item).attr("name") + '_dummy' + '"/>').hide());	//.css("visibility", "hidden"));
						} else {
							$(item).attr("e2e_type", "0");
						}
					});
					$("input:password._clearText").each(function (index, item) {
						$(item).attr("e2e_type", "0");
					});
					$("input:password").not("._clearText").each(function (index, item) {	// 패스워드폼 적용
						$(item).attr("e2e_type", "1");
						$(item).parent().addClass("pw_box");
						// 비밀번호 저장 및 자동 입력 방지 (크롬 안먹음;)
						$(item).after($('<input type="password" class="_clearText" name="' + $(item).attr("name") + '_dummy' + '"/>').hide());	//.css("visibility", "hidden"));
					});
				}
			}else if(isMobile){}	
		}
	}, cert: {
		reload: function () {
			var _cert = this;
			var deferred = $.Deferred();

			// 코스콤
			if (! userClient.isMobile) {
				if (typeof ytMain != "object") {
					var scripts = secure.config.cert[checkSecureConfType];
					$.getScript(scripts[0], function () {
						$.getScript(scripts[1], function () {
							$.getScript(scripts[2], function () {
								$.getScript(scripts[3], function () {
									deferred.resolve();
								});
							});
						});
					});
				};

			// 앱프리
			} else {
				if (typeof appfreeInit != "function") {
					var scripts = secure.config.cert[checkSecureConfType];
					$.getScript(scripts[0], function () {
						$.getScript(scripts[1], function () {
							$.getScript(scripts[2], function () {
								$.getScript(scripts[3], function () {
									$.getScript(scripts[4], function () {
										deferred.resolve();
									});
								});
							});
						});
					});
				};
			};
			return deferred.promise();
		}, init: function () {
			var _cert = this;
			var deferred = $.Deferred();
			if (!_cert.hasOwnProperty("loaded")) {
				this.reload().then(function () {
					$.extend(_cert, cert);
					_cert.reinit().then(function () {
						deferred.resolve(_cert);
					});
				});
			} else {
				deferred.resolve(_cert);
			}
			return deferred.promise();
		}
	},
	sign: {
		init: function (options) {
			options = options || {};
			options = $.extend(options, this.defaultOptions);
			var _sign = this;
			var deferred = $.Deferred();
			this.reload(options).then(function (response, $sign) {
				deferred.resolve(response, $sign);
			});
			return deferred.promise();
		}, reload: function (options) {
			var _this = this;
			var deferred = $.Deferred();
			var scripts = secure.config.sign[checkSecureConfType];
			$.getScript(scripts).done(function () {
				sign.reinit(options).then(function (response, $sign) {
					$.extend(_this, sign);
					deferred.resolve(response, $sign);
				});
			});
			return deferred.promise();
		}, defaultOptions: {
			acntNo: ""
			, userId: ""
			, macAddr: ""
			, hddUniqNo: ""
			, entityId: ""
			, useCert: false
			, is2Question: false	// 2Question 여부
		}, close: function (options) {
			options = options || {};
			options = $.extend(options, this.defaultOptions);			
			var scripts = secure.config.sign[checkSecureConfType];
			$.getScript(scripts).done(function () {
				sign.closeClick();
			});			
		}
	}
});

// Short Alias Mapping
var sse = secure.e2e;
var sss = secure.sign;
var ssc = secure.cert;

/** wrapping */

var SignOrder = function (ptext, callback, cancel_callback) {
	//공통 인증 서명 (축약 서명)
	ssc.simpleSign (ptext, callback, cancel_callback);
};

// 공통 일회 인증 서명
var SignOrderPwOneTimeYN = function (ptext, callback, cancel_callback) {
	ssc.oneTimePwSign(ptext, callback, cancel_callback);
};

//공통 일회 인증 서명
var SignOrderPwOneTimeYN2 = function (ptext, callback, cancel_callback) {
	ssc.oneTimePwSign2(ptext, callback, cancel_callback);
};

// 공통 인증 서명(서명창 나오지 않음)
var SignOrderNoPw = function (ptext, callback, cancel_callback) {
	ssc.noPwSign(ptext, callback, cancel_callback);
};

// 보안토큰(HSM) 인증서 결과값 추출 - 모바일에서는 false
var getVerifyResult = function () {
	return ssc.verifyResult;
};

/**
 * 윈도우 PC용 맥정보 가져오기
 * @returns {hdsn: '', hkey: '', mac: '', nkey: '', old_hdsn: '', old_hkey: '', old_mac: '', old_nkey: ''};
 */
var getMacAddress = function () {
	return ssc.pcInfo;
};

/**
 * 윈도우 PC 정보 조회
 * 기존과 동일하게 certform 에 세팅
 * @param frmName PC 정보를 세팅할 폼명, 미정의 시 certform
*/
var GetPCIdentity = function (callback, frmName) {
	frmName = frmName || 'certform';

	if($('form[name="' + frmName + '"]').length == 0){
		$('body').append('<form name="' + frmName + '" id="' + frmName + '" ></form>');
	}
	var $f = $.form(frmName);

	ssc.getPCIdentity(function(tmpPcIdentity) {
		var tmpInfo = tmpPcIdentity;

		/** 기존 맥/hdd 셋팅은 신규추출방식의 값으로 셋팅해야한다. */
		$f.val('mac', tmpInfo.mac);				// 네트워크 어댑터 물리적주소
		$f.val('nkey', tmpInfo.nkey);			// MAC 정보 식별자(28byte)
		$f.val('hdsn', tmpInfo.hdsn);			// 하드디스크 고유번호(Serial No)
		$f.val('hkey', tmpInfo.hkey);			// 하드디스크 정보 식별자(28byte)

		$f.val('old_mac', tmpInfo.old_mac);		// 네트워크 어댑터 물리적주소
		$f.val('old_nkey', tmpInfo.old_nkey);	// MAC 정보 식별자(28byte)
		$f.val('old_hdsn', tmpInfo.old_hdsn);	// 하드디스크 고유번호(Serial No)
		$f.val('old_hkey', tmpInfo.old_hkey);	// 하드디스크 정보 식별자(28byte)

		if(typeof callback != 'undefined' && typeof callback == 'function'){
			callback();
		}
		return;
	});
};

/**
 * 공인인증 서명 - PC 및 모바일 환경에 따라 실행
 *
 * 태블릿(모바일)에서도 같은 동작 할 경우는 콜백을 반드시 설정하여 콜백으로 이후 처리를 진행해야합니다.
 * 태블릿에서는 동작이 필요없는 경우는 콜백이 아닌 리턴을 받아 처리하셔도 됩니다.
 *
 * @param plainValue 서명할 데이터(선택)
 * @param dn 인증서명(선택)
 * @param passwd 공인인증서 비밀번호(선택)
 * @param bOnlySign 서명만 할것인지 여부(생략하거나 false 일 경우 dn과 신원정보까지 반환)
 * @param callback (필수) 지정된 콜백함수로 결과를 리턴합니다.
 * 			반환 배열 {error:false, errorCode:'', errorMsg:'', ptext:'', rtn:'', dn:'', rValue:'', macInfo:{}};
 * 			macInfo 배열은 다음과 같습니다.
 * 			{mac : '', nkey : '', hdsn : '', hkey : ''}
 */
var doSigning = function ( plainValue, _dn, passwd, bOnlySign, callback) {
	logger.debug(':::: THIS doSigning ::::: ', _dn);

	// 코스콤
	if(! userClient.isMobile){
		ssc.doSigning(plainValue, _dn, passwd, bOnlySign).then(function (rtn) {
			if(typeof callback != 'undefined'){
				callback(rtn);
			}
		});

	// 앱프리
	} else {
		ssc.doSigning(plainValue, _dn, passwd, bOnlySign, callback);
	}
};

/**
 * 앱프리 호출 후 해당 정보담아 설정된 콜백 실행
 * appfreeExec.js 파일의 afcallback 과 afcancel_callback 함수 제일 하단에 아래 함수를 호출하도록 수정
 * 아이폰 : signInfo = { uuid, wifimac }
 * 안드로이드 : signInfo = { deviceId, serialno, androidid, imei, imsi, simserialno, phoneno, wifimac }
 * @param signInfo
 * @param success (true: 서명 성공, false: 서명 실패)
 */
var af_run_after = function (signInfo, success) {
	try{
		ssc.afRunAfter(signInfo, success);
	}catch(e){}
}

function getStrLen(str) {
	if(str == null || str == '') {
		return 0;
	}

	var strlen = 0;
	for(var i=0 ; i<str.length ; i++) {
		var c = str.charCodeAt(i);

		if(c <= 0x00ff) strlen++;
		else strlen+=2;
	}

	return strlen;
}

function setString(value, size) {

	if(typeof(value) == undefined) {
		alert("존재하지 않는 값입니다. - secure.js : setString()");
		return;
	}

	value = value.trim();
	var len = getStrLen(value);

	if(len > size)  return false;

	for(var i=len ; i<size ; i++) {
		value = value + " ";
	}

	return value;
}

function setZeroString(value, size) {
	var len = getStrLen(value);
	var val = "";

	if(len > size) {
		return false;
	}

	for(var i=0 ; i<size-len ; i++) {
		val = val + "0";
	}

	val = val + value;
	return val;
}

var checkSecureConfType = client.isMobile == true ? "mobile" : client.os.toLowerCase() == "windows" ? "windows" : "etc";

// initialize
$(document).ready(function () {
	var isMobile = userClient.isMobile;
	var isWindows = userClient.os == "WINDOWS";

	if (!isMobile && isWindows) {
		var checkSecure = (typeof isCheckInstalled == "undefined") ? (typeof needSecure == "undefined" || needSecure == "" ? false : needSecure) : isCheckInstalled;

		if (checkSecure) {
			try {
				if (typeof _common != "undefined") {
					_common.open_loading();
				}
				sse.init();	// e2e 기본 적용
				ssc.init().done(function () {
					if (typeof _common != "undefined") {
						_common.close_loading();
					}
					$("body").data("sscLoaded", true);
					var callback = $("body").data("sscCallback");	// 공인인증 콜백 요청
					if (typeof callback == "function") {
						callback();
					}
				}); // 공인인증 기본적용
				
				//레포트샵 필요 페이지 여부
				if(typeof reportPage != "undefined"){
					var installedReport = top.installedReport || 0;
					var installedReportOz = top.installedReportOz || 0;
					if(reportPage == "crpt" && installedReport < 2 ){
						installH2OVersionCheck();
					} else if(reportPage == "crpt" && typeof(reportType) != "undefined"){
						if(reportType == "H2O" && installedReport < 2){
							installH2OVersionCheck();
						} else if (reportType == "OZ" && installedReportOz < 2) {
							installH2OVersionCheck();
						}
					}
				}
			}catch(e){}
		}
	} else if (isMobile) {
		// 앱프리 기본 적용
		try{
			if (typeof _common != "undefined") {
				_common.open_loading();
			}
			ssc.init().done(function () {
				if (typeof _common != "undefined") {
					_common.close_loading();
				}
				$("body").data("sscLoaded", true);
				var callback = $("body").data("sscCallback");	// 공인인증 콜백 요청
				if (typeof callback == "function") {
					callback();
				}
			}); // 공인인증 기본적용

		} catch(e){}
		
		// 모바일일때 가상키패드 적용 secure.js
		try {
			// e2e 기본 적용
			sse.init();
		}catch(e){}
	}
	
});

//버전체크 기능은 하지 않고, 뷰잉전 선처리할 것만 처리. 버전체크는 RSVerCheck에서
function reportProc(callback){
	//xp여부 체크 + 파이어폭스여부 체크 (xp에서는 파이어폭스만 가능)
	if(client.isXp == "xp"){
		//layer로 변경
		if(client.isFireFox != "Firefox"){
			//alert("고객님께 알려 드립니다.\n해당 서비스는 윈도우 XP에서는 [파이어폭스 브라우저]만 사용 가능합니다. (IE, 크롬 등 사용 불가)");
			SSP.modalView.centerBox($("#xpReportNotice"), $('#wrap'));
			return;
		}
	}
	
	if (typeof _common != "undefined") {
		//loadingClose는 RSVerCheck.jsp..
		_common.open_loading();
	}
	//설치 url
	/*
	$("#downloadH2OBtn").click(function(){
		if( typeof(reportType) != "undefined"){
			if(reportType =="H2O"){
				window.open("/report/uri/Module/ReportShop520_Web_withMarkAny.exe");
			} else {
				window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
			}
		} else {
			window.open("/report/uri/Module/ReportShop520_Web_withMarkAny.exe");
		}
	});*/
	// 레포트 타입인경우 callback 검사 후 실행 : callback (출력버튼 동작함수)
	if (typeof callback == "function") {
		var installedReport = top.installedReport || 0;
		var installedReportOz = top.installedReportOz || 0;
		if( top.installedReport >= 1 ||  top.installedReportOz >= 1){
			callback.call();
		} else {
			if( userClient.isMobile ){
				callback.call();
			} else {
				_common.close_loading();
				installH2OVersionCheck(callback);
			}
		}
	}
}

function installH2OVersionCheck(callback) {
	// 0: 둘다 미설치, 1: 레포트만설치, 2: 둘다 설치
	var installedReport = top.installedReport || 0;
	var installedReportOz = top.installedReportOz || 0;
	//var args = arguments;
	//xp여부 체크 + 파이어폭스여부 체크 (xp에서는 파이어폭스만 가능)
	if(client.isXp == "xp"){
		//layer로 변경
		if(client.isFireFox != "Firefox"){
			//alert("고객님께 알려 드립니다.\n해당 서비스는 윈도우 XP에서는 [파이어폭스 브라우저]만 사용 가능합니다. (IE, 크롬 등 사용 불가)");
			SSP.modalView.centerBox($("#xpReportNotice"), $('#wrap'));
			return;
		}
	}
	if (typeof _common != "undefined") {
		_common.open_loading();
	}
	
	$("body").data("installedReportCallback", function (installedReport) {
		var object = $("body").data("installedReportCallbackObject");
		if((reportPage == "crpt" && installedReport < 2) || (reportPage == "rpt" && installedReport < 1)){
			if(typeof(SSP) != "undefined"){
				SSP.modalView.centerBox($("#downloadH2OModule"));
			} else {
				//영문일경우 다운로드 페이지 이동
				if(location.href.indexOf("/eng/") > -1 ){
					openMenu('M1231759893234','/eng/login/security_install02.pop');
				}
			}
			//설치 url
			$("#downloadH2OBtn").click(function(){
				if(typeof(reportType) != "undefined"){
					if( reportType =="H2O"){
						window.open("/report/uri/Module/ReportShop520_Web_withMarkAny.exe");
						return;
					} else {
						if(typeof(object) != "undefined"){
							if(object.report !=0 && object.markany != 0 && object.epsbroker != 0){
								//전체설치
								window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
							} else if(object.report !=0 && object.markany != 0){
								//전체설치
								window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
							} else if (object.report != 0) {
								// 오즈만 설치
								window.open("/modules/report/file/SetupOZViewer.exe");
							} else if (object.markany != 0 || object.epsbroker != 0) {
								//마크애니만 설치
								window.open("/modules/report/file/MAWS_SamsungPopOz_Setup.exe");
							}
						} else if( typeof(top.installedReportObject) != "undefined") {
							if(object.report !=0 && object.markany != 0 && object.epsbroker != 0){
								//전체설치
								window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
							} else if(object.report !=0 && object.markany != 0){
								//전체설치
								window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
							} else if (object.report != 0) {
								// 오즈만 설치
								window.open("/modules/report/file/SetupOZViewer.exe");
							} else if (object.markany != 0 || object.epsbroker != 0) {
								//마크애니만 설치
								window.open("/modules/report/file/MAWS_SamsungPopOz_Setup.exe");
							}
						} else {
							window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
						}
					}
				} else {
					if(typeof(object) != "undefined"){
						if(object.report !=0 && object.markany != 0 && object.epsbroker != 0){
							//전체설치
							window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
						} else if(object.report !=0 && object.markany != 0){
							//전체설치
							window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
						} else if (object.report != 0) {
							// 오즈만 설치
							window.open("/modules/report/file/SetupOZViewer.exe");
						} else if (object.markany != 0 || object.epsbroker != 0) {
							//마크애니만 설치
							window.open("/modules/report/file/MAWS_SamsungPopOz_Setup.exe");
						}
					} else if( typeof(top.installedReportObject) != "undefined") {
						if(object.report !=0 && object.markany != 0 && object.epsbroker != 0){
							//전체설치
							window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
						} else if(object.report !=0 && object.markany != 0){
							//전체설치
							window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
						} else if (object.report != 0) {
							// 오즈만 설치
							window.open("/modules/report/file/SetupOZViewer.exe");
						} else if (object.markany != 0 || object.epsbroker != 0) {
							//마크애니만 설치
							window.open("/modules/report/file/MAWS_SamsungPopOz_Setup.exe");
						}
					} else {
						window.open("/modules/report/file/MAWS_SamsungPopOz_Total_Setup.exe");
					}
				}
			});
		}
		if(typeof(reportType) != "undefined"){
			if( reportType =="H2O"){
				top.installedReport = installedReport;
			} else {
				top.installedReportOz = installedReport;
			}
		}else {
			top.installedReport = installedReport;
		}
		top.installedReportObject = object;
		// 레포트 타입인경우 callback 검사 후 실행 : callback (출력버튼 동작함수)
		if (typeof callback == "function" && reportPage == "rpt" && installedReport >= 1) {
			_common.close_loading();
			callback.call();
		}
		if (typeof _common != "undefined") {
			_common.close_loading();
			parent.$("#frmPrint").attr("src","/sscommon/jsp/pop/print.content.jsp");
		}
	});
	if( typeof(reportType) != "undefined"){
		if(reportType =="H2O"){
			parent.$("#frmPrint").attr("src", "/common/checkReport.pop");
		} else{
			parent.$("#frmPrint").attr("src", "/common/checkReportOz.pop");
		}
	} else {
		parent.$("#frmPrint").attr("src", "/common/checkReportOz.pop");
	}
}