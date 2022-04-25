var digitalData= {
	page:{
		pageInfo: {
			pageID: ""
		}
	},
	user:{
		userID: "",
		loginStatus: "",
		level: ""
	},
	products:{
		ID: "",
		Type: "",
		pName: "",
		tName: ""
	},
	search:{
		keyword: "",
		result: ""
	},
	fundSearch:{
		keyword: "",
		result: ""
	},
	elsdlsSearch:{
		keyword: "",
		result: ""
	},
	ppfundSearch:{
		keyword: "",
		result: ""
	},
	isaSearch:{
		keyword: "",
		result: ""
	},
	bondSearch : {
		keyword: "",
		result: ""
	},
	wrapSearch : {
		keyword: "",
		result: ""
	},
	mirrorSearch : {
		keyword: "",
		result: ""
	}
};

$(document).ready(function () {
	var frmNmae = "";
	try{
		frmNmae = this.location.pathname;
	}catch(e){}
	if(frmNmae != "") {
		if(frmNmae == "/ux/kor/finance/fund/detail/view.do" || frmNmae == "/ux/kor/finance/els/saleGoods/ingDetailTab1.do"){
			return;
		}
	}
	
	$.cs.ajax({
		async : false,
		type : 'post',
		url : '/common/adobedtm.pop',
		dataType : 'json',
		success : function(data) {
			var digitalMenuCode = "";
			try{
				digitalMenuCode = top._common._history._info_last.code;
			}catch(e){
				digitalMenuCode = document.location.href;
			}
			
			// 예외처리
			if(digitalMenuCode != "M1470963407962" &&	//MY 혜택
			   digitalMenuCode != "M1454301976873" &&	//MY 자산
			   digitalMenuCode != "M1454302020268" &&	//MY 자산
			   digitalMenuCode != "M1400066332648" &&	//ELS/DLS 찾기
			   digitalMenuCode != "M1389772449736" &&	//추천상품
			   digitalMenuCode != "M1303804003625" &&	//펀드찾기
			   digitalMenuCode != "M1382935674722" &&	//개인연금펀드찾기
			   digitalMenuCode != "M1231762550046" &&	//로그아웃
			   digitalMenuCode != "M1231752589437"		//채권찾기
			){

				var searchQueryTxt = "";
				var searchTotalCount = "";
				try{
					searchQueryTxt = query;
					searchTotalCount = totalCount;
				}catch(e){
					searchQueryTxt = "";
					searchTotalCount = "";
				}
				
				digitalData.page.pageInfo.pageID = digitalMenuCode;
				digitalData.user.userID = parseInt(data.EntityID, 10);
				//digitalData.user.CustGrade = data.CustGrade;
				digitalData.user.level = data.UserLevel;
				digitalData.user.loginStatus = data.isLogin;
				digitalData.search.keyword = searchQueryTxt;
				digitalData.search.result = searchTotalCount;
				$.getScript("/sscommon/js/adobedtm/adobedtm_dummy.js", function (){
					
						if(typeof _satellite !== "undefined" && _satellite) {
							_satellite.pageBottom();
						}
				});
			}
		}
	});
});

function setTimeoutProduts (){
	if(typeof _satellite !== "undefined" && _satellite) {
		setTimeout("_satellite.track('productsdetail')", 500);
	}
}