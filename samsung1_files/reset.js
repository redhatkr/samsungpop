/**
 * reset.js
 * @version : 0.1
 * @authors : TD2179 ky.cho adcapsule soft
 */

// Common Settings
var config = {
	isSecure: false
	, isDebug: false
}
// Prototype Function
String.prototype.has = function (q) {return this.indexOf(q) > -1};			// has(Contains) 구현
String.prototype.contains = function (q) {return this.has(q)};				// Contains 구현
String.prototype.startWith = function (q) {return this.indexOf(q) > -1};	// startWith 구현
String.prototype.account = function () {var s = this.replaceAll("-", "");return s.substring(0, s.length- 2) + "-" + s.substring(s.length -  2);};	//계좌번호 표현식 처리 구현
String.prototype.number = function (decimal) {var prefix='';if(this.charAt(0)==='-'){prefix='-'};var u_dec = ('\\u'+('0000'+('.'.charCodeAt(0).toString(16))).slice(-4));var regex_dec_num = new RegExp('[^'+u_dec+'0-9]','g');var regex_dec = new RegExp(u_dec,'g');return Number(prefix + "" + this.replace(regex_dec_num, '' ).replace(regex_dec, '.' ));};	// 숫자형변환

if (!Object.hasOwnProperty("keys")) {
	Object.keys = function (obj) {
		var result = [];
		for (var keys in obj) {
			result.push(keys);
		}
		return result;
	};
}

// IE8 Array.filter 추가
if (!Array.prototype.filter) {
	Array.prototype.filter = function (f) {
		"use strict";
		if (this === void 0 || this === null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof f !== "function") {
			throw new TypeError();
		}
		var res = [];
		var thisp = arguments[1];
		for (var i = 0; i <len; i++) {
			if (i in t) {
				var val = t[i];
				if (f.call(thisp, val, i, t)) {
					res.push(val);
				}
			}
		}
		return res;
	}
}

// Client Info
var client = {
	init: function () {
		var _this = this;
		_this.userAgent = navigator.userAgent;
		_this.platform = String(navigator.platform).toLowerCase();
		_this.os = _this.platform.has("macintel") ? "MAC" : _this.platform.has("linux") ? "LINUX" : "WINDOWS";
		_this.isXp = _this.userAgent.indexOf('Windows NT 5.1') > 0 ? "xp" : "notXp";
		_this.isFireFox = _this.userAgent.indexOf('Firefox') > 0 ? "Firefox" : "Other";
		_this.isMobile =
				(_this.userAgent.match(/iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null
					|| _this.userAgent.match(/LG|SAMSUNG|Samsung/)!=null) && _this.userAgent.match(/MALGJS/) == null && _this.userAgent.match(/LG_UA/) == null;
		$("body").data("client", this);
	}, ableNPAPI: function () {
		// TODO: Chrome NPAPI 지원 버전 확인 및 검증 필요
		return this.os == "WINDOWS" && !this.isMobile;
	}
};client.init();
var userClient = client;
var logger = {
	isAbleConsole: function () {
		try{
			return typeof(window.console)!='undefined' && window.console && window.console.log && window.console.error;
		} catch(e){
			return false;
		};
	}, isDecorate: true
	, decorate: {
		prefix: " ────────────────────────────────────────"
		, suffix: "────────────────────────────────────────────────"
	}, error: function (msg) {
		if (this.isAbleConsole()) {
			/*
			if (this.isDecorate) {console.error("[ERROR]" + this.decorate.prefix);}
			console.error(msg);
			console.error(arguments);
			if (this.isDecorate) {console.error(this.decorate.suffix);}
			*/
		}
	}, info: function (msg) {
		if (this.isAbleConsole()) {
			if (this.isDecorate) {console.log("[INFO ]" + this.decorate.prefix);}
			console.log(msg);
			console.log(arguments);
			if (this.isDecorate) {console.log(this.decorate.suffix);}
		}
	}, debug: function (msg) {
		if (config.isDebug && this.isAbleConsole()) {
			try{
                    if (this.isDecorate) {console.log("[DEBUG]" + this.decorate.prefix);}
                                console.log.apply(console, arguments);
                    if (this.isDecorate) {console.log(this.decorate.suffix);}
                } catch(e){

                    return;
                };




		}
	}
};
var setCookie = function( name, value, expiredays ) {
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + ";domain=.samsungpop.com;path=/; expires=" + todayDate.toGMTString() + ";";
};

var getCookie = function (key) {
	var allcookies = document.cookie;
	var cookies = allcookies.split("; ");
	for ( var i = 0; i < cookies.length; i++) {
		var keyValues = cookies[i].split("=");
		if (keyValues[0] == key) {
			return unescape(keyValues[1]);
		}
	}
	return "";
};

var checkKrInput = function(item, event) {
	var regexp= /[a-z0-9]|[\[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"\\]/g;
	var value = $(item).val();
	if(regexp.test(value)) {
		$(item).val(value.replace(regexp,''));
	} 
};

var pwdInpWrap = function(displayValue , obj){
	var txtVal = $(obj).val();
	if (displayValue == 'block' || (displayValue == 'none' && txtVal == '')) {
		$('.idpw_del').css('display', displayValue);
	}
	
};

var pwdInitialize = function( id , frm){
	var $f  = $.form(frm);
	$f.empty(id);
	$('[name=pwd]').focus();	
} ;

$(function () {
	$(".krOnly").css("ime-mode", "active").keyup(function (event) {
		checkKrInput(this, event);
	});
});


// 주민번호 검증
var ssnCheck = function ($ssn1, $ssn2){
	var ssn1 = $ssn1.val();
	var ssn2 = $ssn2.val();
	var ssn = ssn1 + ssn2;
	if(ssn1  ==''){alert("주민등록번호를 정확하게 입력해주세요.");$ssn1.focus();return false;}
	if(ssn2  ==''){alert("주민등록번호를 정확하게 입력해주세요.");$ssn2.focus();return false;}
	if(ssn.length!=13){alert ("주민등록번호를 '-' 를 제외한 13자리 숫자로 입력하세요.");$ssn1.focus();return false;}
	if(isNaN(ssn)){alert("주민등록번호는 숫자만 입력이 가능합니다.");$ssn1.focus();return false;}
	if((ssn1.length==6) &&(ssn2.length==7)){
		a = new Array(13);
		for (var i=0; i < 13; i++) {a[i] = parseInt(ssn.charAt(i));}
		var k = 11 - (((a[0] * 2) + (a[1] * 3) + (a[2] * 4) + (a[3] * 5) + (a[4] * 6) + (a[5] * 7) + (a[6] * 8) + (a[7] * 9) + (a[8] * 2) + (a[9] * 3) + (a[10] * 4) + (a[11] * 5)) % 11);
		if (k > 9){k -= 10;}
		if (k == a[12]){return true;}else{alert ("잘못된 주민등록번호 입니다.\n\n다시 입력해 주세요.");$ssn1.value = "";$ssn1.focus();return false;}
	}
}