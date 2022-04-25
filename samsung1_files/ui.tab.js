var SSP = SSP || {};

/*************************************************************************
  *  Tab
  *  
  *************************************************************************/
 (function($){
 	'use strict';
 	var changeTab = {
 			_scope : null
 			,_content : null
 			,_defaultIndex : 0
 			,_fnArray: new Array()
 			,_selectIndex : 0
 			
 	};
 	
 	var ct = changeTab;
 	
 	var TAB_ON_CLASS ='on';
 	/**
 	 * @
 	 * @param _tempTabScope, _tempContent, _tempDefaultIndex ,_tempFnArray
 	 * @use SSP.changeTab.init(tabElements, contentElements, defaultTabIndex ,[functionName1,functionName2])
 	 * 		
 	 * @sample  SSP.changeTab.init($('.tabPopup'), $('.tabDeps2 li'),3,test1)
 	 */ 
 	ct.init = function(_tempTabScope, _tempContent , _tempDefaultIndex , _tempFnArray){
 		var defaultIndex = _tempDefaultIndex || this._defaultIndex ;
 		this._scope = _tempTabScope;
 		var target_content_page = _tempContent;
 		var fnArray = _tempFnArray;
 		//default setting
 		if($(_tempTabScope).find('>ul').hasClass('stepMenu')){
 			//stepMenu
 			//이전 step 화면으로는 이동가능 다음화면으로는 이동불가
 			$(_tempTabScope).find('>ul>li').removeClass(TAB_ON_CLASS);
 			$(_tempTabScope).find('>ul>li>a').attr('title',''); // 웹접근성 0-16 수정
			$(_tempTabScope).find('>ul>li').eq(defaultIndex).addClass(TAB_ON_CLASS);
			$(_tempTabScope).find('>ul>li').eq(defaultIndex).find('a').attr('title','현재단계'); // 웹접근성 0-16 수정
 	 		$(target_content_page).eq(defaultIndex).siblings().hide();
 	 		$(target_content_page).eq(defaultIndex).show();
 	 		if(typeof(fnArray[defaultIndex])!='undefined'){
					fnArray[defaultIndex](defaultIndex);
			}
 	 		
 	 		$(_tempTabScope).find('>ul>li>a').each(function(_index){
 	 			
 	 			var cloneContext = $(this).contents().clone();
	 			var pTag = $('</p>').html(cloneContext);
	 				$(this).next().remove();
	 				$(this).hide();
	 				$(this).parent().append(pTag);
 	 			
 	 			
 	 		// 이전단계 메뉴 활성 , 0번째는 활성 , 현재 마지막 스텝일경우 첫번째 스탭만 활성
 	 			if( _index == 0||(defaultIndex >= _index && !$(_tempTabScope).find('>ul>li').eq(defaultIndex).hasClass('last'))){ 
 	 				
 	 				$(this).show();
 	 				$(this).next().hide();
 	 				
 	 				if(ValidationUtil.is_null($(this).data('tabFn'))){
 	 					$(this).data('tabFn','tabFn');
 	 					$(this).on('click',function(){
 	 	 	 				$(this).parent().siblings().removeClass(TAB_ON_CLASS);
 	 	 	 				$(this).parent().addClass(TAB_ON_CLASS);
 	 	 	 				
 	 	 	 				$(this).parent().nextAll('li').find('a').hide();
 	 	 	 				$(this).parent().nextAll('li').find('p').show();
 	 	 	 				
 	 	 	 				if($(target_content_page).length!=0){
 	 	 	 					$(target_content_page).eq(_index).show();
 	 	 	 					
 	 	 	 					$(target_content_page).eq(_index).siblings().hide();
 	 	 	 					$(target_content_page).eq(_index).find(':header>a').eq(0).css({'visibility':'visible'}) 
 	 	 	 					$(target_content_page).eq(_index).find(':header>a').eq(0).focus();
 	 	 	 				}
 	 	 	 				if(typeof(fnArray[_index])!='undefined'){
 	 	 	 					fnArray[_index](_index);
 	 	 	 				}
 	 	 	 				 
 	 	 	 			});
 	 				}else{
 	 					//재설정
 	 				}
 	 				
 	 			}
 	 			
 	 		});
 			
 		}else{
 			
 			$(_tempTabScope).find('>ul>li').removeClass(TAB_ON_CLASS);
 	 		$(_tempTabScope).find('>ul>li').eq(defaultIndex).addClass(TAB_ON_CLASS);
 	 		$(_tempTabScope).find('>ul>li').eq(defaultIndex).find('a').attr('title','현재탭');

 	 		$(target_content_page).eq(defaultIndex).siblings().hide();
 	 		$(target_content_page).eq(defaultIndex).show();
 	 		
 	 		
 	 		$(_tempTabScope).find('>ul>li>a').each(function(_index){
 	 			
 	 			
 	 			if(ValidationUtil.is_null($(this).data('tabFn'))){
 	 				$(this).data('tabFn','tabFn');
 	 				$(this).on('click',function(){
 	 	 				$(this).parent().siblings().removeClass(TAB_ON_CLASS);
 	 	 				$(this).parent().addClass(TAB_ON_CLASS);
 	 	 				$(this).parent().siblings().find('>a').removeAttr('title');
                        $(this).parent().find('>a').attr('title','현재탭');
 	 	 				
 	 	 				
 	 	 				if($(target_content_page).length!=0){
 	 	 					$(target_content_page).eq(_index).show();
 	 	 					
 	 	 					$(target_content_page).eq(_index).siblings().hide();
 	 	 					$(target_content_page).eq(_index).find(':header>a').eq(0).css({'visibility':'visible'}) 
 	 	 					$(target_content_page).eq(_index).find(':header>a').eq(0).focus();
 	 	 				}
 	 	 				
 	 	 				
 	 	 				if(fnArray[_index]!=undefined){
 	 	 					fnArray[_index](_index);
 	 	 				}
 	 	 				
 	 	 				/**	선택된 index 반환	- 펀드 상세 화면에서 사용.*/
 	 	 				if(SSP.changeTab._selectIndex != _index){
 	 	 					try{
 	 	 					//	$.fundDetail.changeTab($(this).attr("id")) ;
 	 	 					}catch(e){ }
 	 	 				}
 	 	 				 
 	 	 			});
 	 				
 	 			}else{
 	 				//재설정
 	 			}
 	 			
 	 		});
 		}
 	};
 	
 	ct.init();
 		SSP.changeTab = ct;	
 }($));
 
 
 var SSP = SSP || {};

 /*************************************************************************
   *  Tab
   *************************************************************************/
  (function($){
  	'use strict';
  	var toggleTab = {
  			_scope : null
  			,_content : null
  			,_defaultIndex : 0
  			,_fnArray: new Array()
  			
  	};
  	
  	var tt = toggleTab
  	,TAB_ON_CLASS ='on' // 활성화(켜짐) 클래스
  	,COTNETS_CLSSS = '.toggleTabCon'; // 컨텐츠 클래스
  	/**
  	 * @param _tempTabScope
  	 * @sample  SSP.toggleTab.init($('.tabPopup'))
  	 */ 
  	tt.init = function(_tempTabScope, _tempDefaultIndex){
  		var defaultIndex = _tempDefaultIndex || this._defaultIndex ;
  		this._scope = _tempTabScope;
  		
  		$(_tempTabScope).each(function(testNum){

	  		//default setting
  			var that = $(this)
  			,target_menu_tab = $(that).find('>ul>li>a') // 메뉴 탭
  			,target_content_pages = $(that).find(COTNETS_CLSSS); // 메뉴탭에 해당하는 컨텐츠
  			
	  		$(target_menu_tab).removeClass(TAB_ON_CLASS);
	  		$(target_menu_tab).eq(defaultIndex).addClass(TAB_ON_CLASS);
	  		$(target_content_pages).eq(defaultIndex).siblings().hide(); 
	  		
	  		$(target_menu_tab).each(function(_index){
	  			
	  			$(this).on('click',function(){
	  				$(this).parent().siblings().removeClass(TAB_ON_CLASS);
					$(this).parent().siblings().find('>a').removeAttr('title');
					$(this).parent().addClass(TAB_ON_CLASS);
					$(this).parent().find('>a').attr('title','현재탭');
	  				
	  				if($(that).find('.toggleTabCon').length!=0){
	  					$(target_content_pages).eq(_index).show();
	  					$(target_content_pages).eq(_index).find(':header>a').eq(0).css({'visibility':'visible'}) 
	 					$(target_content_pages).eq(_index).find(':header>a').eq(0).focus();
	  					$(target_content_pages).eq(_index).siblings().hide();
	  				}
	  			});
	  		});
  		});	
  		
  	};
  	
  	tt.init();
  		SSP.toggleTab = tt;	
  }($));
 
 
 function test1(){
	// alert('show display one');
 }
 function test2(){
	// alert('show display two');
 }