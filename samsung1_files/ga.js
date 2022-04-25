var dimension1 = "";
var dimension2 = "";
var dimension3 = "";
var dimension4 = "PC WEB";
var dimension5 = "";
var dimension6 = "";
var dimension7 = "";
var dimension12 = "";
var dimension13 = "";
var dimension14 = "";
var dimension15 = "";
var dimension16 = "";
var dimension17 = "";
var dimension18 = "";

dataLayer = [{
	'dimension1': '',	//고객_ClientID
	'dimension2': '',          	//고객_UserID
	'dimension3': '',	                	//고객_로그인여부
	'dimension4': '',              	//채널유형
	'dimension5': '',	           	//페이지_상품번호
	'dimension6': '',	           	//페이지_상품타입
	'dimension7': '',	       	//페이지_페이지ID
	'dimension12': '',			//공지사항 제목
	'dimension13': '',			//이벤트 제목
	'dimension14': '',			//메뉴 depth1
	'dimension15': '',			//메뉴 depth2
	'dimension16': '',			//메뉴 depth3
	'dimension17': '',			//메뉴 depth4
	'dimension18': ''			//메뉴 depth5
}]; 

$(document).ready(function () {
	var noCheckGA = "";
	try{ noCheckGA = $("#noCheckGA").val(); }catch(ea){noCheckGA = "";}
		
	try{
		if(noCheckGA != "Y"){
			$.cs.ajax({
				async : false,
				type : 'post',
				url : '/ux/common/ga.pop',
				dataType : 'json',
				success : function(data) {
					$('body').find(':first').before(
						'<!-- Google Tag Manager (noscript) -->'
						+ '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TFSTR9F" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'
						+ '<!-- End Google Tag Manager (noscript) -->'
					);
					
					dimension1 = getCookie("_ga");
					if(dimension1 == "" || dimension1 == null){
						dimension1 = undefined;
					}else{
						dimension1 = dimension1.substring(6);
					}
					
					if(data.EntityID == ""){
						dimension2 = undefined;
					}else{
						dimension2 = parseInt(data.EntityID, 10);
					}
					dimension3 = data.isLogin;
					dimension4 = "PC WEB";
					dimension5 = undefined;
					dimension6 = undefined;
					var _gaDepth = "";
					try{
						dimension7 = top._common._history._info_last.code;
						_gaDepth = top._common._history._info_last.menu.parents.length;
					}catch(e){
						dimension7 = document.location.href;
						_gaDepth = "";
					}
					
					dimension12 = $("#gaLogNoticeTitle").val();
					dimension13 = $("#gaLogEventTitle").val();
					
					dimension14 = undefined;
					dimension15 = undefined;
					dimension16 = undefined;
					dimension17 = undefined;
					dimension18 = undefined;
					try{
						if(_gaDepth == ""){
							if(_gaDepth == 0){
								dimension14 = top._common._history._info_last.menu.title;
								dimension15 = top._common._history._info_last.menu.title;
								dimension16 = top._common._history._info_last.menu.title;
								dimension17 = top._common._history._info_last.menu.title;
								dimension18 = top._common._history._info_last.menu.title;
							}else{
								dimension14 = undefined;
								dimension15 = undefined;
								dimension16 = undefined;
								dimension17 = undefined;
								dimension18 = undefined;
							}
						}else{
							if(_gaDepth > 0){
								var _depthTitle = "";
								for(var i = 0; i < _gaDepth; i++){
									if(_depthTitle == ""){
										_depthTitle = top._common._history._info_last.menu.parents[i].title;
									}else{
										_depthTitle = _depthTitle + ">" + top._common._history._info_last.menu.parents[i].title;  
									}
									if( i == 0 ) dimension14 = _depthTitle;
									if( i == 1 ) dimension15 = _depthTitle;
									if( i == 2 ) dimension16 = _depthTitle;
									if( i == 3 ) dimension17 = _depthTitle;
								}
								_depthTitle = _depthTitle + ">" + top._common._history._info_last.menu.title;
								if( _gaDepth == 1 ){ 
									dimension15 = _depthTitle;
									dimension16 = _depthTitle;
									dimension17 = _depthTitle;
									dimension18 = _depthTitle;
								}else if( _gaDepth == 2 ){ 
									dimension16 = _depthTitle;
									dimension17 = _depthTitle;
									dimension18 = _depthTitle;
								}else if( _gaDepth == 3 ){ 
									dimension17 = _depthTitle;
									dimension18 = _depthTitle;
								}else if( _gaDepth == 4 ){ 
									dimension18 = _depthTitle;
								}
							}else{
								dimension14 = top._common._history._info_last.menu.title;
								dimension15 = top._common._history._info_last.menu.title;
								dimension16 = top._common._history._info_last.menu.title;
								dimension17 = top._common._history._info_last.menu.title;
								dimension18 = top._common._history._info_last.menu.title;
							}
						}
						
					}catch(e){}
					
					dataLayer[0].dimension1 = dimension1;
					dataLayer[0].dimension2 = dimension2;
					dataLayer[0].dimension3 = dimension3;
					dataLayer[0].dimension4 = dimension4;
					dataLayer[0].dimension5 = dimension5;
					dataLayer[0].dimension6 = dimension6;
					dataLayer[0].dimension7 = dimension7;
					dataLayer[0].dimension12 = dimension12;
					dataLayer[0].dimension13 = dimension13;
					dataLayer[0].dimension14 = dimension14;
					dataLayer[0].dimension15 = dimension15;
					dataLayer[0].dimension16 = dimension16;
					dataLayer[0].dimension17 = dimension17;
					dataLayer[0].dimension18 = dimension18;
					
					(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
					(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
					m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
					})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		
					ga('create', 'UA-124182386-1', 'auto');
		
					ga( 'set','userId', dimension2); 	   
					ga( 'set','dimension1', dimension1);
					ga( 'set','dimension2', dimension2);
					ga( 'set','dimension3', dimension3);
					ga( 'set','dimension4', dimension4);
					ga( 'set','dimension5', dimension5);
					ga( 'set','dimension6', dimension6);
					ga( 'set','dimension7', dimension7);
					ga( 'set','dimension12', dimension12);
					ga( 'set','dimension13', dimension13);
					ga( 'set','dimension14', dimension14);
					ga( 'set','dimension15', dimension15);
					ga( 'set','dimension16', dimension16);
					ga( 'set','dimension17', dimension17);
					ga( 'set','dimension18', dimension18);
		
					(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','GTM-TFSTR9F');
		
				}
			
			});
		}
	}catch(e){}
	
	
	

	
	
});



function gaSendData(title ,dimensionData8 ){
	try{
		var data= { hitType: 'pageview',
				location: window.location.href ,
				title:  document.title,
				'dimension7':  dimension7,  
				'dimension8':  dimensionData8 ,
				'dimension9':  top._common._history._info_last.menu.title,
				'dimension10': title,  
				'dimension14': dimension14 ,
				'dimension15': dimension15,
				'dimension16': dimension16,
				'dimension17': dimension17,
				'dimension18': dimension18   
			};
		
		//console.log("======ga send==========="+JSON.stringify(data).replace(/,/gi, "\n"));
		
		ga('send' , data);
	}catch(e){}

}



 