/**
 * UX 개편 2차 테스트 진행 파일입니다.  suffix  : _front
 * 
 *   
 */

(function(){
	if (typeof isCommonLoaded == "undefined" || !isCommonLoaded) {
		var imports=new Array();
		imports.push({'url':'/js/plugin/plugin.all.min.js', 'cashbuster':false});
		imports.push({'url':'/ux/js/plugin/jquery.extends.cs.pop.js', 'cashbuster':true});
		imports.push({'url':'/js/util/util.all.js', 'cashbuster':false});
		imports.push({'url':'/js/xcms/xcms.history.js', 'cashbuster':true});
		imports.push({'url':'/ux/js/ui/ui.manager_front.js', 'cashbuster':true});
		imports.push({'url':'/ux/js/guide/ui/ui.tab.js', 'cashbuster':true});  //3차 정리
		imports.push({'url':'/ux/js/finance/fund/search/ui.fundSearch.js', 'cashbuster':true}); //3차 정리
		
		for(var a=0, atotal=imports.length; a<atotal; a++){
			document.write('<script src="'+imports[a].url+((imports[a].cashbuster)?'?cb='+window._CACHE_BUSTER:'')+'" charset="utf-8"></'+'script>');
		};
	}
})();

/*************************************************************************************************
 *
 * INITIALIZE.FUNCTION
 *
 *************************************************************************************************/
if (typeof isCommonLoaded == "undefined" || !isCommonLoaded) {
	// 공백 제거
	String.prototype.trim = function() {
		return $.cs.util.trim(this);
	};

	// 공백 체크
	String.prototype.isEmpty = function() {
		return $.cs.util.isEmpty(this);
	};

	// 공백 체크
	String.prototype.replaceAll = function(param1, param2) {
		return $.cs.util.replaceAll(this, param1, param2);
	};
}
// 리턴URL 인코딩처리
window.returnUrlEnc = function(returnUrl){
	return encodeURIComponent(returnUrl);
};

//로그인 확인 창
window.confirmLogin=function(url){
	var message='';
	message+=	'로그인 후 이용 가능합니다.\n';
	message+=	'지금 로그인 하시겠습니까? \n';

	//if(window.confirm(message)){	2014.6.10	박정은과장님 요청으로 비로그인시 confirm 메세지 없앰
		window.openLogin('RETURN_MENU_CODE='+window.getMenuCode()+'&RETURN_MENU_URL='+url);
	//};
};

//로그인 확인 창 with 메뉴코드
window.confirmLoginWithMenuCd=function(url, menuCd){
	window.openLogin('RETURN_MENU_CODE='+menuCd+'&RETURN_MENU_URL='+url);
};

//공동인증 로그인 확인 창
window.confirmCertLogin=function(url) {
	var message='';
	message+='본인 여부를 확인하기 위한 공동인증서가 필요한 업무입니다.\n';
	message+='공동인증서를 이용하여 다시 로그인하시기 바랍니다.\n';
	message+='다시 로그인하시겠습니까?';

	if(window.isLogin()){
		if(window.confirm(message)){
			window.openLogin('/login/login.do?cmd=reLoginCert&RETURN_MENU_CODE='+window.getMenuCode()+'&RETURN_MENU_URL='+url);
		};
	}else{
		if(window.confirm(message)){
			window.openLogin('isCertMode=Y&RETURN_MENU_CODE='+window.getMenuCode()+'&RETURN_MENU_URL='+url);
		};
	};
};


//ID, ID p번호 로그인 확인 창
window.confirmIdPwLogin=function(url) {
	var message='';

	if(window.isLogin()){
		message+='본인 여부를 확인하기 위한 ID, ID비밀번호가 필요한\n';
		message+='업무입니다. ID와 ID비밀번호를 입력하여 다시 로그인\n';
		message+='하시기 바랍니다. 다시 로그인하시겠습니까?';

		if(window.confirm(message)){
			window.openLogin('/login/login.do?cmd=reLoginIdPw&RETURN_MENU_CODE='+window.getMenuCode()+'&RETURN_MENU_URL='+url);
		};
	}else{
		window.openLogin('RETURN_MENU_CODE='+window.getMenuCode()+'&RETURN_MENU_URL='+url);
	};
};


//가상키패드 초기화 - OS에 따라 분기 위해 함수 분리
window.initVirtualKeyPad=function(){
	// 사용하지 않음(secure.js로 이동). 2016.12.07.
	return;
	var interval=0;

	try{
		interval=setInterval(function(){
			if(typeof(TK_requestToken)!='undefined' && typeof(Transkey)!='undefined'){
				setTimeout(function(){
					//window.initTranskey(); //_common.reinit_ui(); //-> initTranskey내부에 선언
					window.initmTranskey(); // ux 개편으로 인해 m 붙은걸로 일단 수정. sw.ju
				}, 10);
				clearInterval(interval);
			};
		}, 10);
	}catch(e){}
};

/**
 * popup 시 듀얼모니터상 ie 버그 제거용 st.kang .
 */

window.popup_params = function() {

    var a = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft;
    var i = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop;
    var g = typeof window.outerWidth!='undefined' ? window.outerWidth : document.documentElement.clientWidth;
    var f = typeof window.outerHeight != 'undefined' ? window.outerHeight: (document.documentElement.clientHeight - 22);
    var h = (a < 0) ? window.screen.width + a : a;
    var left = parseInt(h + ((g - 100) / 2), 100);
    var top = parseInt(i + ((f-100) / 2.5), 100);
    return ',left=' + left + ',screenX=' + left + ',top=' + top;

	/*
	var availaleWidth = window.screen.availWidth
	  , availableHeight = window.screen.availHeight
	  , availableLeft = window.screen.availLeft
	  , modalWidth = (100 > availaleWidth) ? availaleWidth - 80 : 100
      , modalHeight = (100 > availableHeight) ? availableHeight - 80 : 100
      , offsetLeft = (availableLeft) ? availableLeft + ( (availableLeft - modalWidth) / 2 ) : ( (availableLeft - modalWidth) / 2 )
      , offsetTop = ( ( availableHeight - modalHeight ) /2 );		  
	  
      return ',left=' + offsetLeft + ',screenX=' + offsetLeft + ',top=' + offsetTop + ',screenX=' + offsetTop;
	*/
};   

window.popup_params2 = function(xVal, yVal) {

    var a = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft;
    var i = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop;
    var g = typeof window.outerWidth!='undefined' ? window.outerWidth : document.documentElement.clientWidth;
    var f = typeof window.outerHeight != 'undefined' ? window.outerHeight: (document.documentElement.clientHeight - 22);
    var h = (a < 0) ? window.screen.width + a : a;
    var left = parseInt(h + ((g - 100) / 2), 100);
    var top = parseInt(i + ((f-100) / 2.5), 100);
    
    if(isNaN(left)) left=0; 
    if(isNaN(top)) top=0; 
    
    return ',left=' + (left+xVal) + ',screenX=' + (left+xVal) + ',top=' + (top+yVal);

	/*
	var availaleWidth = window.screen.availWidth
	  , availableHeight = window.screen.availHeight
	  , availableLeft = window.screen.availLeft
	  , modalWidth = (100 > availaleWidth) ? availaleWidth - 80 : 100
      , modalHeight = (100 > availableHeight) ? availableHeight - 80 : 100
      , offsetLeft = (availableLeft) ? availableLeft + ( (availableLeft - modalWidth) / 2 ) : ( (availableLeft - modalWidth) / 2 )
      , offsetTop = ( ( availableHeight - modalHeight ) /2 );		  
	  
      return ',left=' + offsetLeft + ',screenX=' + offsetLeft + ',top=' + offsetTop + ',screenX=' + offsetTop;
	*/
};   

/**
 * check-Forward-Login
 *
 * @description - 로그인 권한 판단 체크 후 로그인 페이지 이동 처리
 * @param	{String} auth - 현재 권한 상태값
 *	@param	{String} requiredAuth - 필요로 하는 권한 *
 * 					- cert:공동인증권한,
 * 					- idpw:아이디, 패스워드 권한,
 * 					- full:full 로그인 권한
 *	@param	{String} url - 로그인 후 가져가야 할 parameter
 * @return	{Boolean}
 * 					- true (권한 통과),
 * 					- false (권한이 불충분 해당 로그인 페이지로 이동)
*/
window.checkForwardLogin=function(auth, requiredAuth, url){
	var authArray='';
	var isLogin='';									// 로그인 여부 true
	var xuseYN='';									// 조회전용(Q), 거래전용(Y)  등등
	var isMember='';								// 준회원 이면 true
	var isIdPwLoginRequired='';			// full 인증 안되어 있을경우 true
	var isCertLoginRequired='';				// 공동인증 안되어 있을경우 true

	//입력값 validation
	if(auth.length>0){
		authArray=auth.split('|');
	}else{
		alert('권한이 없습니다.');
		return false;
	};

	if(''==requiredAuth){
		return true;
	};

	isLogin=authArray[0];
	xuseYN=authArray[1];
	isMember=authArray[2];
	isCertLoginRequired=authArray[3];
	isIdPwCertLoginRequired=authArray[4];

	// 비로그인 이거나 준회원 일경우
	if('false'==isLogin || 'true'==isMember){
		window.confirmLogin(url);
		return false;
	};

	switch(String(requiredAuth)){
		// 준회원 요구 조건 일경우
		/*case 'member':
			if('false'==isMember){
				window.openLogin(url);
				return false;
			};
			break;*/

		// 공동인증 권한이 필요한 경우
		case 'cert':
			if('true'==isCertLoginRequired){
				window.confirmCertLogin(url);
				return false;
			};
			break;

		case 'idpw':
			if('false'==isIdPwLoginRequired
					&& 'true' == isIdPwCertLoginRequired){
				// 아이디, 아이디 p번호 필요시
				window.confirmIdPwLogin(url);
				return false;
			};
			break;

		// full 인증 권한이 필요한 경우
		case 'full':
			if('true'==isIdPwCertLoginRequired){
				if('Y'==xuseYN){
					// 거래전용 로그인 일 때
					window.confirmIdPwLogin(url);
					return false;
				}else{
					// 조회전용 로그인 일 때
					window.confirmCertLogin(url);
					return false;
				};
			};
			break;
	};
	return true;
};


//레이어팝업에서 이동하는 경우 메뉴코드를 들고와서 꽂아서 처리.
window.checkForwardLoginWithMenuCd=function(auth, requiredAuth, url, menuCode){
	
	var authArray='';
	var isLogin='';									// 로그인 여부 true
	var xuseYN='';									// 조회전용(Q), 거래전용(Y)  등등
	var isMember='';								// 준회원 이면 true
	var isIdPwLoginRequired='';			// full 인증 안되어 있을경우 true
	var isCertLoginRequired='';				// 공동인증 안되어 있을경우 true

	//입력값 validation
	if(auth.length>0){
		authArray=auth.split('|');
	}else{
		alert('권한이 없습니다.');
		return false;
	};

	if(''==requiredAuth){
		return true;
	};

	isLogin=authArray[0];
	xuseYN=authArray[1];
	isMember=authArray[2];
	isCertLoginRequired=authArray[3];
	isIdPwCertLoginRequired=authArray[4];

	// 비로그인 이거나 준회원 일경우
	if('false'==isLogin || 'true'==isMember){
//		window.confirmLogin(url);
		window.confirmLoginWithMenuCd(url, menuCode);
		return false;
	};

	switch(String(requiredAuth)){
		// 공동인증 권한이 필요한 경우
		case 'cert':
			if('true'==isCertLoginRequired){
				window.confirmCertLogin(url);
				return false;
			};
			break;

		case 'idpw':
			if('false'==isIdPwLoginRequired
					&& 'true' == isIdPwCertLoginRequired){
				// 아이디, 아이디 p번호 필요시
				window.confirmIdPwLogin(url);
				return false;
			};
			break;

		// full 인증 권한이 필요한 경우
		case 'full':
			if('true'==isIdPwCertLoginRequired){
				if('Y'==xuseYN){
					alert("A");
					// 거래전용 로그인 일 때
					window.confirmIdPwLogin(url);
					return false;
				}else{
					alert("B");
					// 조회전용 로그인 일 때
					window.confirmCertLogin(url);
					return false;
				};
			};
			break;
	};
	return true;
};


/*************************************************************************************************
 *
 * INITIALIZE
 *
 *************************************************************************************************/
$(document).ready(function(e){
	try{
		// 1. 메뉴이동
		window.openHome=function(){_common.open_home.apply(_common, arguments);};
		window.openWTS=function(){_common.open_wts.apply(_common, arguments);};
		window.openPension=function(type, option){_common.open_pension.apply(_common, arguments);};
		window.openLogin=function(option){_common.open_login.apply(_common, arguments);};
		window.openLoginX=function(option){_common.open_loginx.apply(_common, arguments);};
		window.openLogout=function(option){_common.open_logout.apply(_common, arguments);};
		window.openDownload=function(option){_common.open_download.apply(_common, arguments);};
		window.openMenu=function(code, option){_common.open_menu.apply(_common, arguments);};
		window.openMenuFromUtil=function(type){_common.open_menu_from_util.apply(_common, arguments);};

		window.getMenuCode=function(){return _common.get_menucode();};
		window.getMenuItem=function(code){return _common.get_menu_item.apply(_common, arguments);};
		window.getMenuInfo=function(code, option){return _common.get_menu_info.apply(_common, arguments);};
		window.getMenuLastCall=function(){return _common.get_menu_last_call.apply(_common, arguments);};
		window.getMenuSmart=function(){return _common.get_menu_smart();}; /* 사용안함 */
		
		//해외주식모의투자로그인 
		window.openLoginGlobalInvest=function(option){_common.open_login_globalInvest.apply(_common, arguments);};

		// 2. 팝업
		window.openMenuPopup=function(code, option, name, callback){_common.open_menu_popup.apply(_common, arguments);};
		window.openPopup=function(url, name, callback){var popup=_common.open_popup.apply(_common, arguments); if(arguments.callee.caller!=null) return popup;}; // <a href="javascript:...">...</a>일 때는 반환 안함
		window.openPopup2=function(url, name, xVal, yVal, callback){var popup=_common.open_popup2.apply(_common, arguments); if(arguments.callee.caller!=null) return popup;}; // <a href="javascript:...">...</a>일 때는 반환 안함
		window.openPopupSize=function(url, name, callback, w, h){var popup=_common.open_popup_size.apply(_common, arguments); if(arguments.callee.caller!=null) return popup;}; // <a href="javascript:...">...</a>일 때는 반환 안함
		window.openWindow=function(url, name, w, h){_common.open_window.apply(_common, arguments);};

		// 3. 로딩
		window.openLoading=function(){_common.open_loading();};
		window.closeLoading=function(){_common.close_loading();};

		// 4. MODAL
		window.openModal=function(type){_common.open_modal.apply(_common, arguments);};
		window.closeModal=function(type){_common.close_modal.apply(_common, arguments);};
		window.setModal=function(type){_common.set_modal.apply(_common, arguments);};

		// 5. ZOOM
		window.zoomIn=function(){_common.zoom(1);};
		window.zoomOut=function(){_common.zoom(-1);};

		// 6. 프린트
		window.printContent=function(){_common.print();};

		// 7. 공지(상단)
		window.showNoticeTop=function(data){_common.show_notice_top(true, data);};
		window.closeNoticeTop=function(){_common.show_notice_top(false);};
		window.toggleNoticeTopState=function(type, bool, seqno){_common.toggle_notice_top_state.apply(_common, arguments);};

		// 8. 매매이탈체크
		window.completeOutcheck=function(){_common.complete_outcheck.apply(_common, arguments);};

		// 10. 로그인 연장
		window.extendLoginTime=function(isajaxcall){_common.extend_login_time.apply(_common, arguments);};

		// 11. 인풋박스 파일 선택
		window.addFileName=function(self){_common.add_file_name(self);};

		switch(String(window.location.port)){
			case '8080':
				// 7. 공통초기화
				_common.init();

				// 8. 로드 종료 체크 (비동기로 전환 후 시점 이중 처리 추가. 204.05.28)
				_common.complete();
				break;

			default:
				$.getScript('/sscommon/jsp/user_info.jsp', function(data){
					$.getScript('/sscommon/jsp/user_session.jsp', function(data){
						// 0. 미디어 타입
						window._media_type=window.getMediaType();

						// 7. 공통초기화
						_common.init();

						// 8. 로드 종료 체크 (비동기로 전환 후 시점 이중 처리 추가. 204.05.28)
						_common.complete();
					});
				});
				break;
		};
	}catch(e){};
});


/*************************************************************************************************
 *
 * COMMON
 *
 *************************************************************************************************/
var popupFocus = true; /*포커스 한번실행을 위한 변수 추가 1211 최웅*/
var _common={
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// VALUES
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	_type:'CONTENT',

	_ui:null,
	_history:null,
	_loading:null,
	_modal:null,
	_notice_top:null,

	_popups:new Array(),
	_zooms:{'min':75, 'max':150, 'current':100},
	_prints:{'initbody':null},
	_resizes:{'id':null, 'sec':100, 'w':null, 'h':null},
	_outcheck:{'bool':false, 'complete':false},

	_issample:false,
	_ispopup:false,
	_iscrop:false,
	_isframeset:false,
	_isie:false,
	_iswts:false,
	_iseng:false,
	_isinit:false,
	_iscomplete:false,
	_gnbDelay :null,
	

	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(){
		var owner=this;
		var ua = navigator.userAgent.toLowerCase();
		if(ua.indexOf("windows nt 5.1") > -1){
			if(location.pathname != "/" && location.pathname != "/published/main/new_main.html" && location.pathname != "/sscommon/jsp/pop/print.content.jsp" && location.pathname != "/published/main/eng_ux_main.html"){
				try{
					top.location.href= "/";
				}catch(e){
					location.href= "/";
				}
				
			}
		}

		// 1. values
		this._isie=(String(ValidationUtil.get_browser_type()).indexOf('msie')!=-1)?true:false; // IE 유무
		this._iswts=(typeof(_IS_WTS)!='undefined' && String(_IS_WTS).toUpperCase()=='Y')?true:false; // WTS 유무
		this._iseng=(window._MEDIA_CODE=='EF')?true:false;
		this._issample=($.getURLParam(window, 'sample')=='Y')?true:false; // 퍼블리싱페이지에서의 링크연결일 때, GNB, FOOTER 숨김 처리 안함

		try{
			this._isframeset=(String(window.parent.document.activeElement.tagName).toUpperCase()=='FRAMESET')?true:false;
		}catch(e){};

		if(!this._issample){
			if(this._isframeset){
				try{
					switch(String(window.parent._common._type).toUpperCase()){
						/**
						 * 링크로 페이지 열 때
						 */
						case 'INDEX':
							this._ispopup=false;
							this._iscrop=top._common._iscrop;
							break;

						/**
						 * 채팅 팝업 케이스 분기
						 */
						default:
							this._ispopup=(window.parent.opener!=null)?true:false;
							this._iscrop=this._ispopup;
							break;
					};
				}catch(e){
					this._ispopup=(window.parent.opener!=null)?true:false;
					this._iscrop=this._ispopup;
				};
			}else{
				if(window.opener!=null){
					this._ispopup=this._iscrop=true;
				}else{
					if(
						window.parent!=window.self &&
						window.parent!=null &&
						window.parent._common!=null
					){
						switch(String(window.parent._common._type).toUpperCase()){
							case 'INDEX':
								this._ispopup=this._iscrop=false;
								break;

							case 'CONTENT':
								this._ispopup=false;
								this._iscrop=true;
								break;
						};
					}else{
						this._ispopup=this._iscrop=false;
					};
				};
			};
		}else{
			this._ispopup=this._iscrop=false;
		};

		// 2-1. update-user-session
		this.update_user_session();

		// 2-2. update-server-name
		this.update_server_name();

		// 3. initialize-UI
		this.init_ui();

		// 4. execute-init-page
		if(typeof(window.initPage)!='undefined') window.initPage();

        // 5. execute-init-PageTransitionFrame-section 바닥페이지를 -> IFRAME 으로 바꿔서 쓸경우에만
        if(typeof(window.initTransFrame)!='undefined') window.initTransFrame();

		// 6. execute-init-footer-section
		if(typeof(window.initFooter)!='undefined') window.initFooter();

		// 7. execute-complete-page (only-use, error_auth.jsp, login.jsp)
		if(typeof(window.completePage)!='undefined' && this._iscrop) window.completePage();



		// 8. re-initialize
		this.reinit();

		// 9. initialize-kdefence
		this.init_kdefence();

		// 10. initialize-transkey
		this.init_transkey();

		// 11. change-flag
		this._isinit=true;
		
		// 12. 심의번호
		$('.hgroup .date').remove();
		$('#container .headArea .head .date').remove();
//		$('#contents, #container .headArea .head').prepend("<span id='dlbrNoSpan' class='date'></span>");
//		$.util.getDlbrNoText("dlbrNoSpan","0", window.getMenuCode());
		$('#contents, #container .headArea .head').prepend("<div id='dlbrNoSpan' class='law-abiding'></div>");
		$.util.getDlbrNoText("dlbrNoSpan","0", window.getMenuCode());
		
		// 13. 접속서버정보
		try {
			var serverFlag = getServerFlag();
			if (top._keyFlag && top._keyFlag != "") {
				top._keyFlag = serverFlag;
			}
		} catch (e){}
	},

	reinit:function(){
		var owner=this;
		var code=$.getURLParam(window, 'MENU_CODE'); //  메뉴코드
		var option=$.getURLParam(window, 'MENU_OPTION'); option=(!ValidationUtil.is_null(option))?decodeURIComponent(option):null; // 메뉴옵션

		// 1. event
		if(this._ispopup){
			if(!this._isframeset){
				// 1. normal
				// 1-1. get-callback-method (opener 에서 자신에게 전달될 정보 취득)
				try{
					var info=window.opener._common.get_infos_popup(window.name);
					if(info!=null) window.executeCallback=info.callback;
				}catch(e){};

				// 1-2. build-history (top 이 아닌 자체 히스토리 관리)
				this.build_histroy();

				// 1-3. event-container-exit
				$('div#popWrap div#popFooter>a:last').attr('href', 'javascript:window.close();');
				
				// popup닫으면서 메인이동 액션 처리하는 경우 분기. popup_updateSign
				if($('div#popWrap div#popFooter>a:last').attr('class')=='close closeGoHome'){
					$('div#popWrap div#popFooter>a:last').attr('href', 'javascript:reIssue();');
				}
				// 1-4. load-content-page
				if(!ValidationUtil.is_null(code)) this.open_menu_frame(code, option);
			}else{
				// 2-1. event-container-exit
				$('div#popWrap div#popFooter>a:last').attr('href', 'javascript:window.parent.close();');
			};

			// resize-window
			this.resize();
			
			// reset title
			var popTitle = $('#popHeader').text();
			if(popTitle != ""){
				popTitle = popTitle + " < 삼성증권 SAMSUNG POP";
				
				$(document).attr('title', popTitle);
			}
			
		}else{
			/**
			 * 전달된 MENU_CODE 값이 있을 경우 top 의 history, title 만 변경
			 * (사용 X : 2014.03.30)
			 * common.top.js에서 replace_url() -> onload 이벤트로이동
			 */
			//if(!ValidationUtil.is_null(code)) top.resetMenu(code, window.location.href);
		};

		// 2. resize-check
		if($('div#contents').length>0 || $('div#popWrap').length>0 || $('div#iframeContents').length>0){
			if(typeof(window._NO_RESIZE)=='undefined' || window._NO_RESIZE!='Y'){
				this._resizes.id=setInterval(function(){
					var w, h;

					if(owner._ispopup){
						w=$('div#popWrap').innerWidth();
						h=$('div#popWrap').innerHeight();
					}else{
						
						//빠른거래 추가("div#iframeContents") - 2014.05.14
						w=($('div#iframeContents').length>0)?$('div#iframeContents').innerWidth():$('div#contents').innerWidth();
						h=($('div#iframeContents').length>0)?$('div#iframeContents').innerHeight():$('div#contents').innerHeight();
					};

					if(owner._resizes.w!=w || owner._resizes.h!=h){
						owner._resizes.w=w;
						owner._resizes.h=h;

						owner.resize();

						//MSIE 7,8 에서 최대화, 최소화 버튼 클릭시
						//onResize 이벤트가 발생하지 않는걸 보안
						var btype=ValidationUtil.get_browser_type();
						if(btype=='msie7' || btype=='msie8'){
							_common.resize_ui();
						};
					};
				}, this._resizes.sec);
			};
		};

		// 3. dictionary
//		var dscope=$('*[data-role=common-ui-footer-dictionary]');
//		if(this._iscrop || this._ispopup){
//			$(dscope).hide();
//		}else{
//			if(window._DICTION_SHOW){
//				$(dscope).show();
//			}else{
//				$(dscope).hide();
//			};
//		};
	},

	/**
	 * load-complete
	 *
	 * @description - common.top 에서 페이지 로드시 호출
	 * @return	void
	 */
	complete:function(){
		if(!ValidationUtil.is_null(window.getMenuCode())){
			if(!this._iscomplete && this._isinit){
				this._iscomplete=true;

				// 1. complete-UI
				this.complete_ui();

				// 2. initialize-log
				this.init_log();

				// 3. initialize-top-notice
				this.init_notice_top();

				// 4. initialize-outcheck
				this.init_outcheck();

				// 3. execute-complete-page (only-use, error_auth.jsp, login.jsp)
				if(typeof(window.completePage)!='undefined') window.completePage();

				// 4. execute-complete-footer-section
				if(typeof(window.completeFooter)!='undefined') window.completeFooter();
				
				// 5. 맞춤형배너 여부 체크
				this.init_customer_banner();
			};
		};
	},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:RESIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	resize:function(){
		
		try{
			if(window.parent==window.self || this._isframeset){
				
				if(this._ispopup){



					var browser=ValidationUtil.get_browser_type();
					var wrap=$('div.popSection');
					var content=$('div#popContents');
					var view=$('div.viewer');

	                if($(wrap).hasClass('noResize')){
	                return;
	                }

					var locationh=35;//(String(browser).indexOf('chrome')!=-1 || String(browser).indexOf('firefox')!=-1)?32:35;
					var frameh=35;
					var maxw=window.screen.width;
					var maxh=window.screen.availHeight; // 2014.12.03 bluewebd 실제 사용가능한 높이값
					var addPadding = 97;
					var nw = 0;
					// 빠른 거래(WTS) wide560-마케팅 동의 안내 팝업
					if(wrap.hasClass('Large')){
						nw = 880;
					}else if(wrap.hasClass('wideFull')){
						nw = 960;
					}else if(wrap.hasClass('wide780')){
						nw = 780;
					}else if(wrap.hasClass('wide760')){
						nw = 760;
					}else if(wrap.hasClass('wide680')){
						nw = 680;
					}else if(wrap.hasClass('wide650')){
						nw = 650;
					}else if(wrap.hasClass('wide560')){
                        nw = 560;
                    }else if(wrap.hasClass('wide480')){
						nw = 480;
					}else if(wrap.hasClass('wide430')){
						nw = 430;
					}else if(wrap.hasClass('wide420')){
						nw = 420;
					}else{
						nw = 960;
					}
					var w=Math.min(nw+addPadding, maxw);
					var h=Math.min(wrap.outerHeight(true)+frameh+locationh+((browser=='firefox')?12:0), maxh);
					window.resizeTo(w+33, h);
					
					// End : as-is 
					
				};
			}else{
				/**
				 * 내용변경후 resize() 처리에 앞서 iframe 크기 변경
				 * 2014.04.25 이전에는 로드시에만 적용 되어 있었다. (중복?)
				 */
				if(window.parent._common!=null && window.parent._common._type=='CONTENT' && _common._iscrop){
					var iframe=$(window.parent.document).find('iframe[data-role=content]');
					var cscope=($('div#iframeContents').length>0)?$('div#iframeContents'):$('div#contents');
					var cw=$(cscope).innerWidth();
					var ch=$(cscope).innerHeight();
	
					$(iframe).attr({
						'width':cw,
						'height':ch
					});
	
					window.parent._common.resize();
				};
			};
		}catch(e){}
		
		this.scroll_ui(true);
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAM
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * get-menu-code
	 *
	 * @return	{String} 메뉴코드
	 */
	get_menucode:function(){
		return $.trim($(document.body).attr('data-menu-code')) || '';
	},

	/**
	 * get-menu-item
	 *
	 * @return	{Object} 메뉴코드
	 */
	get_menu_item:function(code){
		try{
			return top.getMenuItem(code);
		}catch(e){
			return null;
		};
	},

	/**
	 * get-menu-smart
	 *
	 * @description - 스마트메뉴 정보 취득 (사용안함)
	 * @return	{Array}
	 */
	get_menu_smart:function(){
		try{
			return top.getMenuSmart();
		}catch(e){
			return null;
		};
	},

	/**
	 * update-user-session
	 *
	 * @description
	 *  - /sscommon/jsp/user_info.jsp 에 지정된 메소드를 이용해서 top 세션 변경
	 *  -  frameset>frame에 존재하는 페이지에서만 실행
	 *
	 * @return	void
	 */
	update_user_session:function(){
		if((window.parent!=window.self) && (typeof(window.parent._common)!='undefined' && window.parent._common._type=='INDEX')){
			try{
				var sinfo=getUserSessionInfo();
				var username=sinfo.username; // 사용자이름
				var usergrade=sinfo.usergrade; // 등급 [닷컴]
				var usergrade2=sinfo.usergrade2; // 등급 [퇴직연금]
				var userlevel=sinfo.userlevel; // 사용자레벨
				var membershipGrade=sinfo.membershipgrade; // 사용자레벨
				var isSmartYn=sinfo.isSmartYn; // 스마트 고객여부
				var isSecfinmortglend=sinfo.isSecfinmortglend; // 증금담보대출 접근 가능여부
				var persCorpCd=sinfo.persCorpCd; // 법인여부
				top.updateUserSession(window.isLogin(), username, usergrade, usergrade2, userlevel, membershipGrade, isSmartYn, isSecfinmortglend,persCorpCd);
			}catch(e){
				this.trace('>>> EXECUTE:[COMMON] UPDATE_USER_SESSION', e);
			};
		};
	},

	/**
	 * update-server-name
	 *
	 * @description - server 이름 <title>에 적용
	 * @return	void
	 */
	update_server_name:function(){
		if((window.parent!=window.self) && (typeof(window.parent._common)!='undefined' && window.parent._common._type=='INDEX')){
			try{
				top.updateServerName(window.getServerFlag());
			}catch(e){
				this.trace('>>> EXECUTE:[COMMON] UPDATE_SERVER_NAME', e);
			};
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CP
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * resize-CP-page
	 *
	 * @description - CP 영역(frame) 세로 길이 변경
	 * @param	{Number} h
	 * @return	void
	 */
	resize_cp:function(h){

		$('iframe[name=content-cp]').attr({
			'height':h
		});
	},

	resize_cp_newpop:function(h){
		$('iframe[name=content-cp]').attr({
			'height':h
		});
		
		$(window).scrollTop(0);
		
		history.back();
		
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // METHOD:CP
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * layer-CP-page
     *
     * @description - CP 영역(frame) 외의 layer 처리
     * @return	void
     */
    openLayer_cp:function(){

        $('iframe[name=content-cp]').css({
            'position':'relative',
            'zIndex': 3000,
            'background-color':'white'
        });
        $('<div class="modalPop sampop" id="cpLayer"><div class="mbg"></div></div>').insertBefore("#wrap");
    },

    closeLayer_cp:function(){

        $('#cpLayer').remove();
    },

	/**
	 * execute-from-CP
	 *
	 * @description - CP 페이지로 부터 메소드 실행
	 * @param	{String} type
	 * @param	{String} value
	 */
	execute_from_cp:function(type, value){
		if(typeof(window.executeFromCP)!='undefined'){
			window.executeFromCP.apply(window, arguments);
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:KDEFENCE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * initialize-kdefence (키보드 보안 초기화)
	 *
	 * @description
	 * - IE를 제외한 브라우저에서만 실행
	 * - 헤더에서만 요소를 찾는 오류 수정 적용 위한 메소드
	 * - 페이지 로드가 처리된 후에 수동 실행
	 *
	 * @return	void
	 */
	init_kdefence:function(){
		if(String(ValidationUtil.get_browser_type()).indexOf('msie')==-1){
			try{
				//window.KPluginEvent();/*this.trace('INIT-KDEFENCE');*/
			}catch(e){
				this.trace('>>> EXECUTE:[COMMON] INIT-KDEFENCE', e);
			};
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TRANSKEY
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * initialize-transkey (가상 키패드 초기화)
	 *
	 * @description
	 * - TK_requestToken 값 호출에 필요 이상의 시간 소비
	 * - 로드가 끝나고 호출 시작
	 *
	 * @return	void
	 */
	init_transkey:function(){
		// 사용하지 않음(secure.js로 이동). 2016.12.07.
		return;
		
		if(typeof(window._NO_PROTECT)=='undefined' || String(window._NO_PROTECT).toUpperCase()!='Y'){
			$.getScript('/sscommon/transkey/transkey.js', function(data){
				initVirtualKeyPad();
				/*
				 * initVirtualKeyPad 에서 로드 체크
				 * script_head.jsp - initVirtualKeyPad()로 이동
				 */
			});
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:NOTICE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * @description - 고객맞춤형배너 대상여부 확인 후 특정페이지 추가노출여부 확인 ajax호출
	 * @return	void
	 */
	init_customer_banner:function(){
		//로그인 여부
		if(window.isLogin() && top.getUserSession().name != ""){
			$.util.getGlobalCustomerBanner();
		}
	},
	
	
	/**
	 * initialize-notice-top
	 *
	 * @description - 상단 공지사항 초기화. (쿠키에 존재하는 하루 안보기가 아니면 ajax 호출)
	 * @return	void
	 */
	init_notice_top:function(){
		this._notice_top=$('*[data-role=common-ui-notice-top]');

		//긴급공지 메인만 노출 -> 전페이지
		//if(window.getMenuCode()=='$INDEX'){
			if($.cookie('_NOTICE_TOP_DAY_')!='Y'){
				$.util.getNotice();
			};
		//};
	},

	/**
	 * show-notice-top
	 *
	 * @description -  상단 공지사항 노출 여부
	 * @param	{Boolean} bool
	 * @param	{Object} json
	 * @return	void
	 */
	show_notice_top:function(bool, data){
		if(!top.opener){
			if(bool){
				if(Number(data.totalCount)>0 && Number(data.totalCount)<4){
					var cntCss = 'col';
					if(Number(data.totalCount) == 2){
						cntCss = 'col2';
					}else if(Number(data.totalCount) == 3){
						cntCss = 'col3';
					}
					var shtml='';
					shtml += '<div class="inner">';
					shtml += '	<div class="imgText '+cntCss+'">';
					shtml += '		<ul>';
					for(var i=0; i < Number(data.totalCount); i++){
						var ndata=data.urgentnotice[i];
						var seqno=ndata.SeqNo;
						var cseqno=$.cookie('_NOTICE_TOP_NEVER_AGAIN_');
						var popupYN=(String(ndata.PopupYN).toUpperCase()=='U')?true:false;
						var url=ndata.MoveURL;
						var link='';
						/**
						 * - 쿠키에 저장된 'SeqNo'와 현재의 'SeqNo' 비교
						 * - 다시 보지 않을 때는 'SeqNo'를 저장하므로 같으면 열지 않고
						 * - 다르면 열기
						 */
						if(seqno!=cseqno){
							if(!ValidationUtil.is_null(url)){
								if(popupYN){
									link='<a href="'+url+'" target="_blank" class="link" >';
								}else{
									link='<a href="'+url+'" target="_self" class="link" >';
								}
							};
		
							switch(String(ndata.RefrOrder)){
								//CASE1: 배너등록(only Image),     CASE2: 한줄공지(only Text),     CASE3: 이미지 + 텍스트 (MIX)   
								case '1':
									shtml+=	'	<li class="img">';
									shtml+=	'		<div class="images">';
									shtml+=	link+'		<img src="/common.do?cmd=down&saveKey=home.fnmain.todayinfo.img&fileName='+$.trim(ndata.AppenFileNm)+'&inlineYn=N" alt="'+$.trim(ndata.ImgSubsConts)+'"></a>';
									shtml+=	'		</div>';
									shtml+=	'		<div class="cont">';
									shtml+=				$.trim(ndata.NoticTitle);
									if(!ValidationUtil.is_null(url)){
										shtml+=				'<p>'+link + '자세히보기</a></p>';
									}
									shtml+=	'		</div>';
									shtml+=	'	</li>';
									break;
		
								case '2':
									shtml+=	'	<li class="noimg">';
									shtml+=	'		<div class="images">';
									shtml+=	'			<img src="/common.do?cmd=down&saveKey=home.fnmain.todayinfo.img&fileName='+$.trim(ndata.AppenFileNm)+'&inlineYn=N" alt="'+$.trim(ndata.ImgSubsConts)+'">';
									shtml+=	'		</div>';
									shtml+=	'		<div class="cont">';
									shtml+=				$.trim(ndata.NoticTitle);
									if(!ValidationUtil.is_null(url)){
										shtml+=				'<p>'+link + '자세히보기</a></p>';
									}
									shtml+=	'		</div>';
									shtml+=	'	</li>';
									break;
	
								case '3':
									shtml+=	'	<li>';
									shtml+=	'		<div class="images">';
									shtml+=	'			<img src="/common.do?cmd=down&saveKey=home.fnmain.todayinfo.img&fileName='+$.trim(ndata.AppenFileNm)+'&inlineYn=N" alt="'+$.trim(ndata.ImgSubsConts)+'">';
									shtml+=	'		</div>';
									shtml+=	'		<div class="cont">';
									shtml+=				$.trim(ndata.NoticTitle);
									if(!ValidationUtil.is_null(url)){
										shtml+=				'<p>'+link + '자세히보기</a></p>';
									}
									shtml+=	'		</div>';
									shtml+=	'	</li>';
									break;
							};
						}
					};
					
					shtml += '		</ul>';
					shtml += '	</div></div>';
					shtml += '<div class="bottom"><div class="inner"><p class="fr"><label><input name="chkNoticeTop" type="checkbox" onclick="window.toggleNoticeTopState(\'DAY\',this.checked);"> 하루동안 보지않기</label> <a href="javascript:window.closeNoticeTop();" class="close">닫기</a></p></div>';
					shtml += '</div>';
					
					$(this._notice_top).empty().html(shtml);
					_common.reinit_ui('checkbox');

					$(this._notice_top).show();
					
				};
			}else{
				$(this._notice_top).stop()
				.slideUp(360, function(){
					$(this).empty();
				});
			};
		} else{
			$(this._notice_top)
			.remove();
		}
	},

	/**
	 * toggle-notice-top-state
	 *
	 * @description - 노출 여부 쿠키 저장
	 * @param	{String} type
	 * @param	{Boolean} bool
	 * @param	{String} seqno - 공지번호
	 * @return	void
	 */
	toggle_notice_top_state:function(type, bool, seqno){
		switch(String(type).toUpperCase()){
			case 'DAY':
				$.cookie('_NOTICE_TOP_DAY_', (bool)?'Y':'N', {expires:1, path:'/'});
				break;

			case 'NEVER-AGAIN':
				$.cookie('_NOTICE_TOP_NEVER_AGAIN_', (bool)?seqno:'', {expires:365, path:'/'});
				break;
		};
	closeNoticeTop();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OUT-CHECK
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * initialize-outcheck
	 *
	 * @description - 체크페이지 일 때 기본값 설정
	 * @return	void
	 */
	init_outcheck:function(){
		if(typeof(window._IS_OUTCHECK)!='undefined' && String(window._IS_OUTCHECK).toUpperCase()=='Y'){
			this._outcheck.bool=true;
		};
	},

	/**
	 * complete-outcheck
	 *
	 * @description - 체크페이지 완료
	 * @return	void
	 */
	complete_outcheck:function(){
		this._outcheck.complete=true;
	},

	/**
	 * get-outcheck-status (from. common.top.js)
	 *
	 * @description - 체크완료 상태 정보 취득
	 * @return	{Boolean} true:완료, false:미완
	 */
	get_outcheck:function(){
		return (this._outcheck.bool && !this._outcheck.complete)?true:false;
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LOG
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * initialize-logger
	 *
	 * @description
	 * - /sscommon/js/wlog/log.js 내용 common 에 merge
	 * - 메뉴코드의 입력을 위해 method:complete() 에서 실행
	 *
	 * @return	void
	 */
	init_log:function(){
		/**
		 * 분석대상 사이트 도메인명을 입력하세요
		 */
		
		var sid = "kpop";
		
		/**
		 * 영문으로 접속시 H02 일때 epop으로 입력
		 */
		//document.domain 도메인 홗인 
		sid = getMediaType()=="H02" ? 'epop' : 'kpop' ;
		
	
		window._n_sid=sid;
		
		/**
		 * 사이트 내에서 사용하시는 회원ID 쿠키명을 입력하시면 됩니다.
		 * 추가 예정이라면 아래 2.회원쿠키 항목을 참조하여 생성한 값을 넣어주시면 됩니다.
		 * 회원제 사이트가 아니라면 삭제하셔도 됩니다.
		 */
		window._n_uid_cookie='ENTITY_ID';

		/**
		 * 메뉴코드
		 */
		window._n_p1=this.get_menucode();

		/**
		 * 실행
		 */
		window.n_logging();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:UI
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * initialize-UI
	 *
	 * @description - UI 매니저 객체 생성
	 * @return	void
	 */
	init_ui:function(){
		this._ui=new UIManager();
	},

	/**
	 * complete-UI
	 *
	 * @description - UI 최종 실행
	 * @return	void
	 */
	complete_ui:function(){
		if(this._ui!=null) this._ui.complete();
	},

	/**
	 * re-initialize-UI
	 *
	 * @description - UI 객체 변경(삭제, 생성)시 재설정
	 * @param	{String} type
	 * @return	void
	 */
	reinit_ui:function(type){
		if(this._ui!=null && !this._iswts) this._ui.reinit(type);
	},

	/**
	 * re-initialize-UI-name
	 *
	 * @description - UI 객체 변경(삭제, 생성)시 재설정 (name 으로 지정)
	 * @param	{String} name - name
	 * @return	void
	 */
	reinit_name:function(name){
		if(this._ui!=null && !this._iswts) this._ui.reinit_name(name);
	},

	/**
	 * re-initialize-UI-id
	 *
	 * @description - UI 객체 변경(삭제, 생성)시 재설정 (id 로 지정)
	 * @param	{String} id - id
	 * @return	void
	 */
	reinit_id:function(id){
		if(this._ui!=null && !this._iswts) this._ui.reinit_id(id);
	},

	/**
	 * resize-UI
	 */
	resize_ui:function(){
		if(this._ui!=null) this._ui.resize();
	},

	/**
	 * scroll-UI
	 */
	scroll_ui:function(isreset){
		if(this._ui!=null) this._ui.scroll(new Object(), isreset);
	},

	/**
	 * reinit-css3
	 */
	reinit_css3:function(){
		var btype=ValidationUtil.get_browser_type();

		if(btype=='msie7' || btype=='msie8'){
			// Selectivizr.init(); // 2014.11.18 bluewebd ie7,8 close 
		};
	},

	/**
	 * build-paging
	 *
	 * @param	{DOM} target - 컨테이너
	 * @param	{Number} total - 총리스트수
	 * @param	{Number} step - 한화면에 보일 글수
	 * @param	{Number} pageno - 현재보여질 페이지 번호
	 * @param	{Function} callback - 페이지 변경시 콜백함수
	 * @return	{Object}
	 */
	build_paging_ui:function(target, total, step, pageno, callback){
		if(this._ui!=null){
			var properties={
				'target':target,
				'total':total,
				'step':step,
				'page':pageno,
				'callback':callback
			};

			return this._ui.build_paging(properties);
		};
	},

	/**
	 * lock-area
	 *
	 * @description - 특정 영역 커버 생성
	 * @param	{DOM} container
	 * @param	{Boolean} bool
	 * @return	void
	 */
	lock_area_ui:function(container, bool){
		if(this._ui!=null) this._ui.build_lock_area(container, bool);
	},
	
	/**
	 * lock-table
	 *
	 * @description - 테이블 영역 커버 생성
	 * @param	{DOM} container(table)
	 * @param	{Boolean} bool
	 * @return	void
	 */
	lock_table_ui:function(container, bool){
		if(this._ui!=null) this._ui.build_table_area(container, bool);
	},
	

	/**
	 * loading-area
	 *
	 * @description - 특정 영역 로딩 생성
	 * @param	{DOM} container
	 * @param	{Boolean} bool
	 * @return	void
	 */
	loading_area_ui:function(container, bool){
		if(bool){
			if(ValidationUtil.is_null($(container).data('manager-loading'))){
				$(container).data('manager-loading', new CommonLoadingBlock(container));
			}else{
				$(container).data('manager-loading').open();
			};
		}else{
			if(!ValidationUtil.is_null($(container).data('manager-loading'))){
				var isremove=$(container).data('manager-loading').close();

				if(isremove){
					$(container).data('manager-loading').remove();
					$(container).data('manager-loading', null);
				};
			};
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LOADING
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * open-loading
	 */
	open_loading:function(){
		if((window.parent==window.self) || window.parent._common._type=='INDEX'){
			if(this._loading==null){
				this._loading=new CommonLoading();
			}else{
				this._loading.open();
			};
		}else{
			window.parent.openLoading();
		};
	},

	/**
	 * close-loading
	 */
	close_loading:function(){
		if((window.parent==window.self) || window.parent._common._type=='INDEX'){
			if(this._loading!=null){
				var isremove=this._loading.close();

				if(isremove){
					this._loading.remove();
					this._loading=null;
				};
			};
		}else{
			window.parent.closeLoading();
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:MODAL
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * open-modal
	 *
	 * @param	{String} type
	 * @param	{String} param
	 * @return	void
	 */
	open_modal:function(type, param){
		this.close_modal();

		this._modal=new CommonModal(type, param);
	},

	/**
	 *  close-modal
	 *
	 * @return	void
	 */
	close_modal:function(type){
		if(type){
			switch(type){
				case 'QNA':			$('#footer .qna').focus();		break;	
				case 'SHAREURL':	$('#contents .share').focus();	break;
				case 'SHARESOURCE':	$('#contents .share').focus();	break;
				case 'SHARENOTICE':	$('#contents .share').focus();	break;
			};
		};
		if(this._modal!=null){
			this._modal.remove();
			this._modal=null;
		};
	},
	
	set_modal:function(type){
		if(type == 'GO'){
			window.closeModal('SHARENOTICE'); 
			$('*[data-role=common-ui-share]').find ('>span').find ('a').andSelf().show ();
		}else{
			window.closeModal('SHARENOTICE');
			$('*[data-role=common-ui-share]').find ('>a:last').trigger ('click');
		}
	},	

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:XCMS-HISTORY
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * build-history
	 */
	build_histroy:function(){
		this._history=new XCMSHistory();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:POPUP
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * open-popup
	 *
	 * @param	{String} url - 경로
	 * @param	{String} name - 창이름
	 * @param	{Fuction} callback -
	 * @return	{Window}
	 */
	open_popup:function(url, name, callback){
		// 1. 속성
		var url=$.trim(url);
		var name=(ValidationUtil.is_null(name))?'common_popup':name;
		//var properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100'; //,titlebar=no
		/* 2014.09.21 st.kang IE 듀어모니터 시 공통팝업 오류 */
		var ua=navigator.userAgent;
		var properties = "";
		
		/* if(String(ua).toLowerCase().indexOf('msie')!=-1){
			properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100' + popup_params(); //,titlebar=no
		}else{
			properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100,left=0,top=0'; //,titlebar=no // 2014-10-07 
		} */
		properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100' + popup_params(); // 2014-10-08
		/* 2014.08.20 ie에 한해 팝업리사이징을 막기 위해 resizable옵션을 no로 설정한다(ie에서만 적용되는 옵션임) */
		//var properties='directories=no,location=no,menubar=no,status=no,resizable=no,scrollbars=yes,toolbar=no,width=100,height=100'; //,titlebar=no

		// 2. 이전에 떠 있는 창 닫기
		var pos=this.get_position_popup(name);
		if(pos!=-1){
			try{
				if(!this._popups[pos].scope.closed){
					this._popups[pos].scope.close();
					this._popups[pos].scope=null;
				};
			}catch(e){
				
			}
		};

		// 3. 새창띄우기
		var pop=window.open(url, name, properties);

		// 4. 팝업 정보 저장
		this.set_infos_popup(pop, name, callback || null);

		// 5. 객체 반환
		return pop;
	},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:POPUP
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * open-popup2
	 *
	 * @param	{String} url - 경로
	 * @param	{String} name - 창이름
	 * @param	{String} xVal - 창위치	 * 
	 * @param	{String} yVal - 창위치	 * 
	 * @param	{Fuction} callback -
	 * @return	{Window}
	 */
	open_popup2:function(url, name, xVal, yVal, callback){
		// 1. 속성
		var url=$.trim(url);
		var name=(ValidationUtil.is_null(name))?'common_popup':name;
		//var properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100'; //,titlebar=no
		/* 2014.09.21 st.kang IE 듀어모니터 시 공통팝업 오류 */
		var ua=navigator.userAgent;
		var properties = "";
		
		/* if(String(ua).toLowerCase().indexOf('msie')!=-1){
			properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100' + popup_params(); //,titlebar=no
		}else{
			properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100,left=0,top=0'; //,titlebar=no // 2014-10-07 
		} */
		properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100' + popup_params2(xVal, yVal); // 2014-10-08
		/* 2014.08.20 ie에 한해 팝업리사이징을 막기 위해 resizable옵션을 no로 설정한다(ie에서만 적용되는 옵션임) */
		//var properties='directories=no,location=no,menubar=no,status=no,resizable=no,scrollbars=yes,toolbar=no,width=100,height=100'; //,titlebar=no

		// 2. 이전에 떠 있는 창 닫기
		var pos=this.get_position_popup(name);
		if(pos!=-1){
			try{
				if(!this._popups[pos].scope.closed){
					this._popups[pos].scope.close();
					this._popups[pos].scope=null;
				};
			}catch(e){
				
			}
		};
		// 3. 새창띄우기
		var pop=window.open(url, name, properties);

		// 4. 팝업 정보 저장
		this.set_infos_popup(pop, name, callback || null);

		// 5. 객체 반환
		return pop;
	},	
	
	/**
	 * open-popup
	 *
	 * @param	{String} url - 경로
	 * @param	{String} name - 창이름
	 * @param	{Fuction} callback -
	 * @return	{Window}
	 */
	open_popup_size:function(url, name, callback, w, h){
		// 1. 속성
		var url=$.trim(url);
		var name=(ValidationUtil.is_null(name))?'common_popup':name;
		//var properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100'; //,titlebar=no
		/* 2014.09.21 st.kang IE 듀어모니터 시 공통팝업 오류 */
		var ua=navigator.userAgent;
		
		var properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width='+w+',height='+h + popup_params();

		// 2. 이전에 떠 있는 창 닫기
		var pos=this.get_position_popup(name);
		if(pos!=-1){
			try{
				if(!this._popups[pos].scope.closed){
					this._popups[pos].scope.close();
					this._popups[pos].scope=null;
				};
			}catch(e){
				
			}
		};

		// 3. 새창띄우기
		var pop=window.open(url, name, properties);

		// 4. 팝업 정보 저장
		this.set_infos_popup(pop, name, callback || null);

		// 5. 객체 반환
		return pop;
	},
	
	/**
	 * get-position-popup
	 *
	 * @description - 이름에 맞는 팝업 정보의 위치 정보 취득
	 * @param	{String} name - 팝업이름
	 * @return	{Number}
	 */
	get_position_popup:function(name){
		var n=-1;

		for(var a=0, atotal=this._popups.length; a<atotal; a++){
			var ainfo=this._popups[a];

			if(ainfo.name==name){
				n=a; break;
			};
		};
		return n;
	},

	/**
	 * set-information-popup
	 *
	 * @description - 팝업을 띄우기전에 전달될 정보 저장
	 * @param	{Window} scope - 팝업 객체 (추가. 2015.05.30)
	 * @param	{String} name - 팝업이름
	 * @param	{Function} callback - 전달될 콜백함수
	 * @return	void
	 */
	set_infos_popup:function(scope, name, callback){
		var n=this.get_position_popup(name);

		if(n==-1){
			this._popups.push({
				'scope':scope,
				'name':name,
				'callback':callback || null
			});
		}else{
			this._popups[n].scope=scope;
			this._popups[n].callback=callback;
		};
	},

	/**
	 * get-information-popup
	 *
	 * @description - 팝업에서 자신에게 전달될 정보 취득
	 * @param	{String} name - 팝업이름
	 * @return	{Object}
	 */
	get_infos_popup:function(name){
		var n=this.get_position_popup(name);

		return this._popups[n];
	},

	/**
	 * open-window
	 *
	 * @description - 자동 리사이징이 처리 되지 않는 외부 콘텐츠용 openPopup
	 * @param	{String} url
	 * @param	{String} name
	 * @param	{String} w
	 * @param	{String} h
	 * @return	void
	 */
	open_window:function(url, name, w, h){
		var url=$.trim(url);
		var name=(ValidationUtil.is_null(name))?'_blank':name;
		var properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width='+w+',height='+h; //,titlebar=no
		/* 2014.08.20 ie에 한해 리사이징을 막기 위해 resizable옵션을 no로 설정한다(ie에서만 적용되는 옵션임) */
		//var properties='directories=no,location=no,menubar=no,status=no,resizable=no,scrollbars=yes,toolbar=no,width='+w+',height='+h; //,titlebar=no
		var win=window.open(url, name, properties);
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:MENU
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 *	get-menu-information
	 *
	 * @description - 팝업에서도 openMenu(), openMenuPopup() 처리를 위해 추가
	 * @param	{String} code - 메뉴코드
	 * @param	{String} option - 메뉴옵션
	 * @return	{Object} 메뉴정보
	 */
	get_menu_info:function(code, option){
		var info;

		switch(top._common._type){
			/**
			 * 팝업일 때
			 */
			case 'CONTENT':
				info=top.opener.top.getMenuInfo(code, option);
				break;

			default:
				info=top.getMenuInfo(code, option);
				break;
		};
		return info;
	},

	/**
	 * get-menu-last-call
	 *
	 * @description - 마지막으로 CALL 한 메뉴 정보 취득
	 * @return	{Object}
	 */
	get_menu_last_call:function(){
		var info;

		switch(top._common._type){
			/**
			 * 팝업일 때
			 */
			case 'CONTENT':
				info=top.opener.top.getMenuLastCall();
				break;

			default:
				info=top.getMenuLastCall();
				break;
		};
		return info;
	},

	/**
	 * open-home
	 *
	 * @return	void
	 */
	open_home:function(){
		try{
			if(!this._ispopup){
				top.openHome();
			}else{
				window.opener.openHome();
				window.close();
			};
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-HOME : ', e);
		};
	},

	/**
	 * open-WTS
	 *
	 * @param	{String} screenid - 화면번호
	 * @param	{Object} params - 전달 파라미터
	 * @return	void
	 */
	open_wts:function(screenid, params){
		if(!params) params={};

		try{
			if(this._iswts){
				window.openMdiwin(screenid, params); //eval('new Mdi'+screenid+'('+JSON.stringify(params)+').doJob()'); // 변경 (2014.06.05)
			}else{
				var qparam='';

				// 1. screenid
				if(!ValidationUtil.is_null(screenid)){
					qparam+='screenid='+screenid;
				};

				// 2. params
				if(!ValidationUtil.is_null(params)){
					switch(typeof(params)){
						case 'string':
							qparam+=((qparam!='')?'&':'')+decodeURIComponent(params);
							break;

						case 'object':
							qparam+=((qparam!='')?'&':'')+decodeURIComponent($.param(params));
							break;
					};
				};

				top.openWTS(qparam);
			};
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-WTS : ', e);
		};
	},

	/**
	 * open-pension
	 *
	 * @param	{String, Object} option
	 * @return	void
	 */
	open_pension:function(type, option){
		try{
			if(!this._ispopup){
				top.openPension(type, option);
			}else{
				var code='';
				switch(String(type).toUpperCase()){
					case 'PRIVATE':
						code=window.opener.top.getPrefixMenuCode('PENSION_PRIVATE');
						break;

					case 'COMPANY':
						code=window.opener.top.getPrefixMenuCode('PENSION_COMPANY');
						break;

					default:
						code=window.opener.top.getPrefixMenuCode('PENSION');
						break;
				};
				this.open_menu_frame(code, option);
			};
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-PENSION : ', e);
		};
	},

	/**
	 * open-login
	 *
	 * @param	{String, Object} option
	 * @return	void
	 */
	open_login:function(option){
		try{
			if(!this._ispopup){
				top.openLogin(option);
			}else{
				this.open_menu_frame(window.opener.top.getPrefixMenuCode('LOGIN'), option);
			};
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-LOGIN : ', e, option);
		};
	},

	/**
	 * open-loginx
	 *
	 * @param	{String, Object} option
	 * @return	void
	 */
	open_loginx:function(option){
		try{
			if(!this._ispopup){
				top.openLoginx(option);
			}else{
				this.open_menu_frame(window.opener.top.getPrefixMenuCode('LOGINX'), option);
			};
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-LOGINX : ', e, option);
		};
	},
	
	/**
	 * open-login_globalInvest
	 *
	 * @param	{String, Object} option
	 * @return	void
	 */
	open_login_globalInvest:function(option){
		try{

			if(!this._ispopup){
				top.openLoginGlobalInvest(option);
			}else{
				this.open_menu_frame(window.opener.top.getPrefixMenuCode('LOGIN_GLOBAL_INVEST'), option);
			};

		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-LOGIN_GLOBAL_INVEST : ', e, option);
		};
	},


	/**
	 * extend-login-time
	 *
	 * @description - 로그인타임 연장
	 * @param	{Boolean} isajaxcall - Ajax 호출 여부
	 * @return	void
	 */
	extend_login_time:function(isajaxcall){
		if(typeof(window.isLogin)!='undefined' && window.isLogin()){
			// 1. 세션갱신
			if(ValidationUtil.is_null(isajaxcall) || isajaxcall) $.util.renewLoginTime();

			// 2. 상단 타이머 초기화
			this._ui._header._util.extension();
            // 3. 로그인연장 레이어 삭제;
            if($('#changeClock').length != 0){
                setTimeout(function(){
                     f_changeClock.$("#modalClose").trigger("click");
                }, 1000);
            }
		};
	},

	/**
	 * open-logout
	 *
	 * @param	{String, Object} option
	 * @return	void
	 */
	open_logout:function(option){
		try{
			top.openLogout(option);
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-LOGOUT : ', e, option);
		};
	},

	/**
	 * open-download
	 *
	 * @param	{String, Object} option
	 * @return	void
	 */
	open_download:function(option){
		try{
			top.openDownload(option);
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-DOWNLOAD : ', e, option);
		};
	},

	/**
	 * open-menu
	 *
	 * @description - 메뉴이동
	 * @param	{String} code - 메뉴코드
	 * @param	{String, Array} option - 메뉴옵션
	 * @return	void
	 */
	open_menu:function(code, option){
		try{
			if(!this._ispopup){
				top.openMenu(code, option);
			}else{
				this.open_menu_frame(code, option);
			};
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-MENU : '+code, e, option);
		};
	},

	/**
	 * open-menu-from-util
	 */
	open_menu_from_util:function(type){
		try{
			switch(String(type).toUpperCase()){
				case 'POP-DTS':
					window.openMenu('M1231757624328', '/customer/guide/download/home_trading_tab4.pop');
					break;

				case 'POP-HTS':
					window.openMenu('M1231757624328');
					break;

				case 'POP-HTS-WEB':
					window.openMenu('M1231757630656', '/customer/guide/download/tab_webTrading2.pop');
					break;

				case 'MPOP':
					window.openMenu('M1398336557772');
					break;

				case 'REGISTRY-ID':
					window.openMenu(top.getPrefixMenuCode('JOIN'));
					break;

				case 'CERTIFICATE':
					window.openMenu(top.getPrefixMenuCode('CERTIFICATE'));
					break;

				case 'MODIFY':
					window.openMenu(top.getPrefixMenuCode('MODIFY'));
					break;

				case 'LOGIN':
				case 'LOGIN-CERTMODE':
					switch(window.getMenuCode()){
						case top.getPrefixMenuCode('LOGIN'):
						case top.getPrefixMenuCode('LOGOUT'):
							if(type=='LOGIN'){
								window.openLogin();
							}else{
								window.openLogin('isCertMode=Y');
							};
							break;

						default:
							if(type=='LOGIN'){
								window.openLogin('RETURN_MENU_CODE='+window.getMenuCode());
							}else{
								window.openLogin('RETURN_MENU_CODE='+window.getMenuCode()+'&isCertMode=Y');
							};
							break;
					};
					break;

				case 'LOGOUT':
					window.openLogout();
					break;
					
				// 2014-10-24 LeeGiPpum : 로그아웃이후 메뉴코드로 이동시킴
				case 'LOGOUT-REDIRECT' :
					window.openLogout("RETURN_MENU_CODE=" + window.getMenuCode());
					break;
				/**
				 * 로그인 연장
				 */
				case 'EXTEND-LOGIN-TIME':
//					window.closeModal();
//					$('#changeClock').remove(); remove시 스크롤 사라져서 수정 161118 jmw

                    window.extendLoginTime();

//                    if($('#changeClock').length != 0){
//                        f_changeClock.$("#modalClose").trigger("click");
//                    }
					break;
			};
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-UTIL-MENU : '+type, e);
		};
	},

	/**
	 * open-menu-popup
	 *
	 * @description - 메뉴코드로 팝업 생성
	 * @param	{String} code - 메뉴코드
	 * @param	{String, Array} option - 메뉴옵션
	 * @param	{String} name - 창이름
	 * @param	{Function} callback - 콜백함수
	 * @return	void
	 */
	open_menu_popup:function(code, option, name, callback){
		try{
			var info=window.getMenuInfo(code, option);

			if(info.bool){
				var url='';
				url+='/sscommon/jsp/pop/popup.content.jsp';
				url+='?MENU_CODE='+encodeURIComponent(info.menu.code);
				url+=(!ValidationUtil.is_null(option))?'&MENU_OPTION='+encodeURIComponent(option):'';

				var name=(ValidationUtil.is_null(name))?'common_popup':name;

				this.open_popup(url, name, callback);
			}else{
				alert(info.msg);
			};
		}catch(e){
			this.trace('>>> EXECUTE:[COMMON] OPEN-MENU-POPUP : '+code, e);
		};
	},

	/**
	 * add_file_name
	 *
	 * @description - 인풋박스 파일 선택
	 */
	add_file_name:function(self){
		var fileName = $(self).val();
		$(self).prev('.file_name').html(fileName);
	},


	/**
	 * open-menu-frame
	 *
	 * @description - 팝업시에 openMenu() 치환
	 * @param	{String} code - 메뉴코드
	 * @param	{String, Array} option - 메뉴옵션
	 * @return	void
	 */
	open_menu_frame:function(code, option){
		if(this._ispopup){
			var owner=this;
			var info=window.getMenuInfo(code, option);

			if(info.bool){
				// 1. change-title
				var title=String($.trim(info.menu.title)).replace('\\n', '');
				$(document).attr('title', title);
				$('h1[data-role=title]').text(title);

				// 2. event-iframe
				var iframe=$('iframe[data-role=content]');

				if(ValidationUtil.is_null($(iframe).data('isapply'))){
					$(iframe)
					.data('isapply', true)
					.bind({
						'load':function(e){
							var cbody=$(this)[0].contentWindow.document.body;
							var clocation=$(this)[0].contentWindow.location;

							/**
							 *  트러스트넷 암호화 이후에만 적용 (/sscommon/jsp/trustnet_gw.jsp?url=)
							 */
							if(String(clocation.href).indexOf('/sscommon/jsp/trustnet_gw.jsp?url=')==-1){
								/**
								 * _history에 남아 있는 정보를 기반으로 menu-code 정보 취득
								 */

								// 1. body-append-menu-code
								try{
									var curl=String(clocation.href).split(String(clocation.host))[1];
									var cinfo=owner._history.search(curl);
									var ccode=cinfo.info.code;

									$(cbody).attr('data-menu-code', ccode);
								}catch(e){};

								// 2. resize-iframe
								var cscope=$(cbody).find('#contents');
								/*
								// 헤더영역 노출로 인한 처리 -> 자체 리사이즈로만 처리하게 수정(2014.06.08)
								var cw=$(cscope).outerWidth(true);
								var ch=$(cscope).outerHeight(true);

								$(this).attr({
									'width':cw,
									'height':ch
								}); // 2014.04.25*/

								// 3. style-title
								$(cscope).find('>div.hgroup>h1, >h1').css({
									'margin-top':'0px'
								});

								// 4. resize-window
								// 헤더영역 노출로 인한 처리 -> 자체 리사이즈로만 처리하게 수정(2014.06.08)
								//owner.resize();
							};
						}
					});
				};

				// 3. change-iframe
				var url=$.trim(info.url);

				$(iframe)
				.attr({
					'height':'0',
					'src':url
				});

				// 3. save-history
				this._history.push({
					code:code,
					url:url
				});
			}else{
				alert(info.msg);
			};
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:ETC
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * console-log
	 */
	trace:function(){
		try{
			if(typeof(window.console)!='undefined' && window.console && window.console.log){
				console.log.apply(console, arguments);
			}
		}catch(e){}
	},

	/**
	 * zoom IN, OUT
	 */
	zoom:function(dir){
		var max=this._zooms.max;
		var min=this._zooms.min;
		var c=this._zooms.current; c+=dir*5;

		if(c>max){
			alert(max+'% 초과 배율은 제한 됩니다.');
		}else if(c<min){
			alert(min+'% 미만 배율은 제한 됩니다.');
		}else{
			this._zooms.current=c;

			$(document.body).css({
				// 2014-09-16 결함번호 57173 시작
				'zoom':c+'%',
				'-webkit-transform':'scale('+c/100+')',
				'-moz-transform':'scale('+c/100+')',
				'-o-transform':'scale('+c/100+')'
				// 2014-09-16 결함번호 57173 끝
			});
			// 2014-11-19 ChoKwangyo : IE Focus 오류 개선 (s)
			//.hide().show();
		};
	},

	print:function(){
		if(this._ispopup){
			window.print();
		}else{
			/**
			 * FRAMESET>FRAME
			 */
			if(window.parent!=window.self && window.parent._common._type=='INDEX'){
				var phtml='';
				phtml+=	'<div id="wrap"><div id="container">\n';
				phtml+=	'	<div id="contents">\n';
				phtml+=	(window._rollManager!=null)?window._rollManager.get_print_content():$('#contents')[0].innerHTML+'\n';
				phtml+=	'	</div>\n';
				phtml+=	'</div></div>\n';

				top.printContent(phtml);
			};
		};
	},
	
	/** 
	 * @상품상세 > 공통레이어팝업
	 * @Parameter
	 * PDT_CODE : Iframe 으로 전달될 상세코드
	 * wrapID : 팝업 레이어 아이디값 (복수팝업으로 인해 추가)
	 *
	 *
	 * @version		: 0.1
	 * @authors		: sw.jung
	 * @date 		: 2016.11.08
	 * @History 	: 웹 접근성 관련, LayerOpen시 해당요소 정보필요에 따른 수정.
	 *				: Layer 닫을 시 포커싱 지정을 위한 3번째 파라미터 _this 추가.
	 **/
	showDetailLayerPopup : function(PDT_URL, wrapID, _this) {

		var default_id = "showPdtDetailLayer";
		if (wrapID == '' || (typeof wrapID == 'undefined')) wrapID = default_id;
		var divStr = '';
		if ($("#" + wrapID).length > 0) {
			return;
		}
		divStr += '<div id="'+wrapID+'"  class="iframeLayer" style="position:absolute; top:0; left:0; width:100%; height:0; z-index:1999;">' ;
		divStr += '	<iframe class="resizeDummy" style="width:100%; height:0;" name="f_'+wrapID+'" id="f_'+wrapID+'" src="'+PDT_URL+'" title="정보 레이어" scrolling="yes" frameborder="0" allowTransparency="true" ></iframe>';
		divStr += '</div>' ; 
		if($("#wrap").length == 0){
			$(divStr).insertBefore($($('div')[0]));
		}else{
			$(divStr).insertBefore("#wrap");
		}

		if(_this == undefined || _this == ''){
			logger.debug('######################### showDetailLayerPopup 접근성 위반 : 포커스 미지정 ( _this 정보 필요 ) ############################');
		}else if(_this.location != undefined){
			logger.debug('######################### showDetailLayerPopup 접근성 위반 : a태그안에 함수지정 -> onClick() 으로 변경 필요. ############################');
			logger.debug('######################### 변경전 예시: <a href="javascript:$.fundTrade.showFund(1187001,this);"> </a>  ############################');
			logger.debug('######################### 변경후 예시: <a href="#" onClick=\'javascript:$.fundTrade.showFund(1187001,this);return false;\'> </a>  ############################');
		}else{
			logger.debug('######################### showDetailLayerPopup : 포커스 타게팅  ############################');
			$("#" + wrapID).data("layerPopupFocusItem",_this);
			logger.debug( $("#" + wrapID).data("layerPopupFocusItem") );
		}


	},
	/* iframe 내부에서 호출하는 함수.
	 * iframe 페이지 내에 비동기로 뿌려지는 부분에 전체삽입
	 *  _common.showDetailLayerIFrameLoad();
	 *  mainHeight : 부모페이지의 body 높이
	 *  layerHeight : Layer iframe의 cont 높이
	 *
 	 * @version		: 0.1
	 * @authors		: sw.jung
	 * @date 		: 2016.11.08
	 * @History 	: 웹 접근성 관련, LayerClose시 2번째 파라미터 불필요에 따른 삭제.
	 *
	 * */
	showDetailLayerIFrameLoad : function(wrapID) {

		window.parent.$("body").css({"overflow": "hidden"});
		var default_id = "showPdtDetailLayer";
		if (wrapID == "" || (typeof wrapID == 'undefined')) wrapID = default_id;
		var mainHeight = 0;
		var layerHeight = 0;
		var compareHeight = 0;
		var scrHeight = 0;
		//$('.popSection').css('top',$(parent).scrollTop()); // 부모창의 스크롤 만큼 컨텐츠의 높이조정
		
		mainHeight = parent.$('body').height(); // 
		layerHeight = $('.popSection > .cont').height() + $(parent).scrollTop() + 400;  //
		scrHeight = window.screen.height;

		compareHeight =  Math.max(layerHeight,mainHeight,scrHeight);
		$("body").css("overflow-y", "scroll");
		window.parent.$("#"+wrapID).css('top' , $(parent).scrollTop());
		window.parent.$("#"+wrapID).css('height' , compareHeight);
		window.parent.$("#f_"+wrapID).css('height' , $(parent.window).outerHeight()).prop("scrolling", "yes");

		$(".mbg").css('height' , compareHeight);
		
		/***
		 *  결함 66,437 alink 포커스
		 */
		//if($('div.cont').attr('tabindex') == 0){
		//$('.popSection:visible').first().attr('tabindex',0).focus();
		setTimeout(function(){
            $('.popSection:visible').first().attr('tabindex',0).focus();
        }, 10);

		//$("#"+wrapID).find('.popSection').attr('tabindex',0).focus();
		//$("#"+wrapID).find('.popSection').focus();
		//}else if($(':focus').length==0){
		//	$('a').first().focus();
		//}



		
		$('#modalClose').click(function(){
			if (typeof _common == "undefined") {
			//	parent._common.showDetailLayerClose(wrapID);
			} else {
				_common.showDetailLayerClose(wrapID);
			}
		});
		$('#modalClose').on('keypress',function(e){

            if(e.keyCode==9){
                $('a').first().focus();
            };
		});


		setTimeout(function(){
			window.parent.$("#"+wrapID).css('top' , $(parent).scrollTop());
		}, 10);

	},
	/**
	 * @version		: 0.1
	 * @authors		: sw.jung
	 * @date 		: 2016.11.08
	 * @History 	: 웹 접근성 관련, LayerClose시 해당요소 정보필요에 따른 수정.
	 *				: Layer 닫을 시 포커싱 지정을 위한 로직 추가. 2번째 파라미터 불필요에 따른 삭제.
	 *
	 *
	 * @date 		: 2016.11.15
	 * @History 	: IE에서 레이어 오픈 후 해당 레이어 닫힘 + 새로운 레이어 팝업 호출시 parent 변경됨에 따라 data 메소드에 있는 obj에 접근 불가. permission error. 예외처리로직추가.
	 **/
	showDetailLayerClose : function(wrapID) {

		var default_id = "showPdtDetailLayer";
		if (wrapID == "" || (typeof wrapID == 'undefined')) wrapID = default_id;

		var $closeTarget;
		try {
			$closeTarget = parent.$("#" + wrapID).data("layerPopupFocusItem");
			if($closeTarget == undefined || $closeTarget == ''){
				logger.debug('######################### showDetailLayerClose : 포커스 미지정  ############################');
			}else if(typeof $closeTarget.focus != "function"){
				logger.debug('######################### showDetailLayerClose : 포커스 (정상적인 타게팅 필요)  ############################');
			}else{
				logger.debug('######################### showDetailLayerClose : 포커스 타게팅  ############################');
				logger.debug($closeTarget);
				$closeTarget.focus();
				$("#" + wrapID).removeData("layerPopupFocusItem");
			}
		} catch (e) {
			logger.debug(e);
		}

		var layerIdx = parent.$(".resizeDummy").length;
		if(layerIdx <2){
			parent.$("body").css({"overflow": "auto"});
		}
		
		if(parent.$("body").attr('data') == 'yHidden' ){
			parent.$("body").css({"overflow-y": "scroll"});
		}
		
		window.parent.$("#" + wrapID).remove();

	}, 		
	getTextLength : function(str) {
		var len = 0;
		str = $.trim(str);
		for (var i=0; i<str.length; i++) {
			if (escape(str.charAt(i)).length == 6) {
				len++;
			}
			len++;
		}
		return len;
	},
	/* 금융상품 공통 > 상품비교 내역 cookie에 저장  
	 * @param1 : 1234@1235
	 * @param2 : 펀드=fund, ELS/DLS=elsdls
	 * */
	fundCompInsCookies :function(fundCd,type) {
		
		var fund_cookie = undefined;
		var cookieName = '';
		if (type=='fund') {
			cookieName = 'fundCompData';
		} else if (type=='elsdls') {
			cookieName = 'elsCompData';
			if (fundCd.indexOf(",")>-1) {
				fundCd = fundCd.replace(/,/gi, "@");
			}
		}
		
		fund_cookie = $.cookie(cookieName) ;
		if(fund_cookie != undefined) fund_cookie = JSON.parse(fund_cookie) ; 
		else fund_cookie = [] ; 
		
		var cookie_cnt = fund_cookie.length;
		var temp_fund_cookie = fund_cookie.slice(0);
		var fundCdArr = '';
		
		if ((typeof fundCd != 'undefined') || (fundCd.length > 0)) {
			if (fundCd.indexOf("@") > -1) {
				fundCdArr = fundCd.split("@");

				for(var i = cookie_cnt ; i--;) {
					if(fund_cookie[i].code == "") {
						temp_fund_cookie.splice(i , 1) ; 
					}
				}
				
				for(var i = cookie_cnt ; i--;){
					for (var j = fundCdArr.length; j--;) {
						if(fund_cookie[i].code == fundCdArr[j]){
							temp_fund_cookie.splice(i , 1) ; 
							break ; 
						}
					}
				}
				
				var totalCookieCnt = 0;
				totalCookieCnt = parseInt(temp_fund_cookie.length) + parseInt(fundCdArr.length);
				//if (temp_fund_cookie.length > 9) temp_fund_cookie.splice(0 , fundCdArr.length) ;
				if (totalCookieCnt > 9) temp_fund_cookie.splice(0 , parseInt(totalCookieCnt)-10) ;
				
				for (var i=0; i<fundCdArr.length; i++){
					if (type=='fund') temp_fund_cookie.push({code:fundCdArr[i]});		
					else if(type=='elsdls') temp_fund_cookie.push({code:fundCdArr[i]});		
				}	
				$.cookie(cookieName, JSON.stringify(temp_fund_cookie),{ expires: 7, path:'/'});
			}
		}

	},
	/**
	 * FUND_CODE : 1111111@2222222 <- 이 형태
	 * isPage - 1 바닥 페이지
	 * isPage - 2 팝업
	 * isPage - 3 iframe
	 * 
	 * */
	buyFund : function(FUND_CODE , isPage){
		if($.util.isEmpty(FUND_CODE)){
			alert("구매하실 펀드를 선택해 주세요.") ; 
			return ;
		}
		
		/**	구매 불가 상품이 포함되어 있는지 확인 하는 로직 추가 - 2016/06/19 박정은 차장님 요청.	*/
		
		
		var param = "CLASSFUNDCD=" +  FUND_CODE ;
		
		var arr = FUND_CODE.split("@") ;
		
		var lenArr = arr.length ; 
		
		$.cs.ajax({
			url						: '/ux/kor/finance/fund/search/listLoad.do' , 
			loadingStart 		: true,
			loadingEnd 			: true,
			data					: param ,
			success				: function(data){
				if( typeof data.errorMsg != "undefined" ){
					alert(data.errorMsg) ; 
					return ;
				}
				if(typeof data.list != "undefined" && data.list.length > 0 ){
					var len = data.list.length ; 
					var isAbleFund = "" ;
					var notCnt = 0 ; 
					for(var i = 0 ; i < len ; i++){
						if(data.list[i].HTSBuyPossYN == "Y" && data.list[i].NewPossYN == "Y"){
							if(isAbleFund == "") isAbleFund =  data.list[i].FundCd ; 
							else isAbleFund =  isAbleFund + "@" + data.list[i].FundCd ;
						}else{
							notCnt++ ; 
						}
					}
					
					if(notCnt > 0){
						if(isAbleFund != ""){
							
							if(confirm("선택 상품중 온라인 구매가 불가능한 상품이 있습니다.\n해당상품을 제외하고 진행하시겠습니까?")){
								FUND_CODE = isAbleFund ; 
							}else{
								return ; 
							}
						}else{
							var msg = "" ;
							
							if(lenArr == 1) msg = "해당 상품은 온라인 구매가 불가합니다." ; 
							else msg = "구매가 가능한 상품이 없습니다." ;
							
							alert(msg) ; 
							return ; 
						}
						
					}
					
					var strMenu = 'M1231753078265';
					var strParam = "paramFUNDCODE="+FUND_CODE;
					
					try{
						if(getMenuCode() == ""){
							parent.n_click_logging('/ux/kor/finance/fund/trade/step1.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=TR01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
						}else{
							n_click_logging('/ux/kor/finance/fund/trade/step1.do?MENU_ID='+getMenuCode()+'&ACTION_ID=TR01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
						}
					}catch(e){}
					
					if(!isLogin()){
						if(!(confirm('로그인 후 이용 가능합니다.\n지금 로그인 하시겠습니까?'))) return;
						openLogin('RETURN_MENU_CODE=' + strMenu + '&RETURN_MENU_URL=' + encodeURIComponent(strParam));
						if(isPage == "2") top.self.close();
					}else{
						openMenu(strMenu, strParam);
						if(isPage == "2") top.self.close();
					}
				}else{
					alert("온라인 구매가 가능한 상품이 없습니다.") ; 
					return ; 
				}
			}
		}) ; 
	} , 

	buyFundIsa : function(FUND_CODE , isPage){

		if($.util.isEmpty(FUND_CODE)){
			alert("구매하실 펀드를 선택해 주세요.") ; 
			return ;
		}
		
		/**	구매 불가 상품이 포함되어 있는지 확인 하는 로직 추가 - 2016/06/19 박정은 차장님 요청.	*/
		
		
		var param = "CLASSFUNDCD=" +  FUND_CODE ;
		
		var arr = FUND_CODE.split("@") ;
		
		var lenArr = arr.length ; 
		
		
		var strMenu = 'M1455866305745';
		var strParam = "paramFUNDCODE="+FUND_CODE;
			
		try{
			if(getMenuCode() == ""){
				parent.n_click_logging('/ux/kor/finance/fund/trade/confirmStep1.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=TR01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
			}else{
				n_click_logging('/ux/kor/finance/fund/trade/confirmStep1.do?MENU_ID='+getMenuCode()+'&ACTION_ID=TR01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
			}
		}catch(e){}
		
		if(!isLogin()){
			if(!(confirm('로그인 후 이용 가능합니다.\n지금 로그인 하시겠습니까?'))) return;
			openLogin('RETURN_MENU_CODE=' + strMenu + '&RETURN_MENU_URL=' + encodeURIComponent(strParam));
			if(isPage == "2") top.self.close();
		}else{
			openMenu(strMenu, strParam);
			if(isPage == "2") top.self.close();
		}
	} ,
	
	buyFundPension : function(FUND_CODE , isPage){  //퇴직연금메뉴

		if($.util.isEmpty(FUND_CODE)){
			alert("구매하실 펀드를 선택해 주세요.") ; 
			return ;
		}
		
		
		var sMenu = "";
		var BuyCmmdCd = $("#BuyCmmdCdTmp",parent.document).val();

		if(BuyCmmdCd == undefined || BuyCmmdCd == ""){
			BuyCmmdCd = FUND_CODE;
		}

		var S_RPSType = $("#S_RPSType",parent.document).val();
		if(S_RPSType == "2"){
			sMenu = 'M1264677575843';
			S_RPSType = "2";
		}else{
			sMenu = 'M1264677310640';
			S_RPSType = "1";
		}

		if(BuyCmmdCd == undefined || BuyCmmdCd == ""){
			parent.openMenu(sMenu,'/ux/kor/pension/myretire/purchase/container1.do?S_RPSType='+S_RPSType+'&sel_CmmdCd='+BuyCmmdCd);

		}else{
			if(BuyCmmdCd.length < 7){
				parent.openMenu(sMenu,'/ux/kor/pension/myretire/purchase/container1.do?S_RPSType='+S_RPSType+'&sel_CmmdCd='+BuyCmmdCd+'&BuyCmmdCd='+BuyCmmdCd+'&prodFund=Y&fundChk=Y');
			}else{
				parent.openMenu(sMenu,'/ux/kor/pension/myretire/purchase/container1.do?S_RPSType='+S_RPSType+'&sel_CmmdCd='+BuyCmmdCd+'&BuyCmmdCd='+BuyCmmdCd+'&prodFund=Y&fundChk=Y&codeSearch=Y');
			}

		}
		return;
	} , 	
	
	buyPensionFund : function(FUND_CODE , isPage){
		if($.util.isEmpty(FUND_CODE)){
			alert("구매하실 펀드를 선택해 주세요.") ; 
			return ;
		}
		var strMenu = 'M1464583826409';
		var strParam = "paramFUNDCODE="+FUND_CODE;
		
		try{
			if(getMenuCode() == ""){
				parent.n_click_logging('/ux/kor/finance/fund/trade/step1.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=TR01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=&pension=pension');
			}else{
				n_click_logging('/ux/kor/finance/fund/trade/step1.do?MENU_ID='+getMenuCode()+'&ACTION_ID=TR01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=&pension=pension');
			}
		}catch(e){}
		
		if(!isLogin()){
			if(!(confirm('로그인 후 이용 가능합니다.\n지금 로그인 하시겠습니까?'))) return;
			openLogin('RETURN_MENU_CODE=' + strMenu + '&RETURN_MENU_URL=' + encodeURIComponent(strParam));
			if(isPage == "2") top.self.close();
		}else{
			openMenu(strMenu, strParam);
			if(isPage == "2") top.self.close();
		}
	} ,
	
	interFund : function(FUND_CODE,_this){
		if($.util.isEmpty(FUND_CODE)){
			alert("장바구니에 등록하실 펀드를 선택해 주세요.") ; 
			return ;
		}
		if(!isLogin() || isMember()){
			if(!confirm("상품을 장바구니에 담으려면 로그인이 필요합니다.\n지금 로그인 하시겠습니까?")){
				return ; 
			}else{
				openLogin('RETURN_MENU_CODE='+getMenuCode()+'&RETURN_MENU_URL=' + encodeURIComponent(location.pathname));
				return ; 
			} 
		}
		
		// this._ispopup true  팝업 / false 바닥
		
		if(getMenuCode() == ""){
			parent.n_click_logging('/ux/kor/finance/wish/wishGoods/cartAdd.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
		}else{
			n_click_logging('/ux/kor/finance/wish/wishGoods/cartAdd.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
		}
		_common.showDetailLayerPopup("/ux/kor/finance/wish/wishGoods/cartAdd.do?FUNDCD=" + FUND_CODE , "basketModal",_this) ;
	},
	
	interFundBtnLayer : function(FUND_CODE,PARAM,_this,btnLayer){
		if($.util.isEmpty(FUND_CODE)){
			alert("장바구니에 등록하실 펀드를 선택해 주세요.") ; 
			return ;
		}
		if(!isLogin() || isMember()){
			if(!confirm("상품을 장바구니에 담으려면 로그인이 필요합니다.\n지금 로그인 하시겠습니까?")){
				return ; 
			}else{
				openLogin('RETURN_MENU_CODE='+getMenuCode()+'&RETURN_MENU_URL=' + encodeURIComponent(location.pathname));
				return ; 
			} 
		}
		
		// this._ispopup true  팝업 / false 바닥
		if(getMenuCode() == ""){
			parent.n_click_logging('/ux/kor/finance/wish/wishGoods/cartAdd.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
		}else{
			n_click_logging('/ux/kor/finance/wish/wishGoods/cartAdd.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
		}
		_common.showDetailLayerPopup("/ux/kor/finance/wish/wishGoods/cartAdd.do?FUNDCD=" + FUND_CODE + "&BTNLAYER="+btnLayer , "basketModal",_this) ;
	},
	
	interPensionFund : function(FUND_CODE,param,_this){
		if($.util.isEmpty(FUND_CODE)){
			alert("장바구니에 등록하실 펀드를 선택해 주세요.") ; 
			return ;
		}
		if(!isLogin() || isMember()){
			if(!confirm("상품을 장바구니에 담으려면 로그인이 필요합니다.\n지금 로그인 하시겠습니까?")){
				return ; 
			}else{
				openLogin('RETURN_MENU_CODE='+getMenuCode()+'&pension=' + param);
				return ; 
			} 
		}
		
		// this._ispopup true  팝업 / false 바닥
		
		if(getMenuCode() == ""){
			parent.n_click_logging('/ux/kor/finance/wish/wishGoods/cartAdd.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=&pension=pension');
		}else{
			n_click_logging('/ux/kor/finance/wish/wishGoods/cartAdd.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=&pension=pension');
		}
		_common.showDetailLayerPopup("/ux/kor/finance/wish/wishGoods/cartAdd.do?FUNDCD=" + FUND_CODE+'&pension='+param , "basketModal",_this) ;
	},
	
	interPensionFundBtnLayer : function(FUND_CODE,param,_this,btnLayer){
		if($.util.isEmpty(FUND_CODE)){
			alert("장바구니에 등록하실 펀드를 선택해 주세요.") ; 
			return ;
		}
		if(!isLogin() || isMember()){
			if(!confirm("상품을 장바구니에 담으려면 로그인이 필요합니다.\n지금 로그인 하시겠습니까?")){
				return ; 
			}else{
				openLogin('RETURN_MENU_CODE='+getMenuCode()+'&pension=' + param);
				return ; 
			} 
		}
		
		// this._ispopup true  팝업 / false 바닥
		
		if(getMenuCode() == ""){
			parent.n_click_logging('/ux/kor/finance/wish/wishGoods/cartAdd.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=&pension=pension');
		}else{
			n_click_logging('/ux/kor/finance/wish/wishGoods/cartAdd.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=&pension=pension');
		}
		_common.showDetailLayerPopup("/ux/kor/finance/wish/wishGoods/cartAdd.do?FUNDCD=" + FUND_CODE+ "&BTNLAYER=" + btnLayer + '&pension='+param , "basketModal",_this) ;
	},
	
	showFundDetail : function(FUND_CODE,_this){
		try{
			if(typeof getMenuCode() == "undefined") n_click_logging('/ux/kor/finance/fund/detail/view.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
			else  n_click_logging('/ux/kor/finance/fund/detail/view.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
		}catch(e){}
		_common.showDetailLayerPopup("/ux/kor/finance/fund/detail/view.do?FUND_CD=" + FUND_CODE ,'' ,_this) ;
	}, 
	
	showElsDlsDetail : function(ISCD, ISCD_TYPE_CODE,_this){
		try{
			if(typeof getMenuCode() == "undefined") {
				if (ISCD_TYPE_CODE == '1') n_click_logging('/ux/kor/finance/els/saleGoods/completeDetailTab1.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+ISCD+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
				else n_click_logging('/ux/kor/finance/els/saleGoods/ingDetailTab1.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+ISCD+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
			} else {
				if (ISCD_TYPE_CODE == '1') n_click_logging('/ux/kor/finance/els/saleGoods/completeDetailTab1.do??MENU_ID='+getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+ISCD+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
				else n_click_logging('/ux/kor/finance/els/saleGoods/ingDetailTab1.do??MENU_ID='+getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+ISCD+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
			}
		}catch(e){}
		if (ISCD_TYPE_CODE =='1') _common.showDetailLayerPopup("/ux/kor/finance/els/saleGoods/completeDetailTab1.do?ISCD=" + ISCD+ "&ISCD_TYPE_CODE=" + ISCD_TYPE_CODE,'',_this);
		else _common.showDetailLayerPopup("/ux/kor/finance/els/saleGoods/ingDetailTab1.do?ISCD=" + ISCD + "&ISCD_TYPE_CODE=" + ISCD_TYPE_CODE,'',_this);
	}, 
	
	setSubscribeCode : function(sCode, TYPE) {
		if (sCode != '' && sCode.length > 0) {
			$.cs.ajax({
				type : 'post',
				url : '/ux/kor/banking/subscribe/common/sCode.do',
				data : "sCode=" + sCode + "&sType="+TYPE,
				dataType : 'json',
				success : function(r){
					console.log(r);
				},error : function(e){
					console.log(e);
				}
			});
		}
	},
	
	setSubscribeName : function(sName, TYPE) {
		if (sName != '' && sName.length > 0) {
			$.cs.ajax({
				type : 'post',
				url : '/ux/kor/banking/subscribe/common/sName.do',
				data : "sName=" + sName + "&sType="+TYPE,
				dataType : 'json',
				success : function(r){
					console.log(r);
				},error : function(e){
					console.log(e);
				}
			});
		}
	},
	/**
	 * execute-nothing
	 */
	nothing:function(){} , 
	
	convertHtml : function(str){
		str = str.replace(/</g , '&lt;') ; 
		str = str.replace(/>/g , '&gt;') ; 
		str = str.replace(/\"/g , '&quot;') ; 
		str = str.replace(/\'/g , '&#39;') ; 
		str = str.replace(/\n/g , '<br>') ;
		
		return str ; 
	},
	
	getSignUseCheck : function(){
		var deferred = $.Deferred();
		$.cs.ajax({
			type : 'post'
			, url : '/ux/kor/online/popConfig/getDefaultConf.do'
			, dataType : 'json'
			, loadingStart : true
			, loadingEnd : true
			, success : function(data){
				deferred.resolve(data.useDigiSignYN);
			}
		});
		return deferred.promise();
	}, 
	getPCLOGData : function(formName){
		var deferred = $.Deferred();
		var $f = $.form(formName);
		if(userClient.isMobile){
			$f.val('isMobileYN', "Y");
			deferred.resolve("Y");
		}else if(userClient.os != "WINDOWS" && !userClient.isMobile){
			$f.val('isMobileYN', "Y");
			deferred.resolve("Y");
		}else{
			$ASTX2.getPCLOGData(
					null, // reserved
					function onSuccess(data) {
						$ASTX2.setPCLOGData($f, data);
						deferred.resolve("Y");
					},
					function onFailure() {
						deferred.resolve("N");
					}
				);
		}
		return deferred.promise();
	}
};