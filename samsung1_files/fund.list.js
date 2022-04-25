(function(){
	/**********************************************
	 * FUND 목록 화면 처리 SCRIPT
	 **********************************************/
	$.fundList  = {
			forLayer			: "" , 
			prevFundList : "" , 						/**	TAB 이동 시 필요한 목록의 펀드 항목들.		*/	
			isShowFlag : "" , 
			isAllCheck : "" , 							/**	전체 체크 여부	*/	
			hideFundList : "" , 						/**	숨김 펀드 목록	*/	
			hideFundCount : 0 , 						/**	숨김 펀드 수		*/	
			selectFundList : "" , 						/**	체크박스 선택시 추가*/	
			selectFundNmList : "" , 						/**	체크박스 선택시 추가*/	
			selectFundTypeList : "" , 						/**	체크박스 선택시 추가*/	
			selectFundNationList : "" , 						/**	체크박스 선택시 추가*/	
			selectFundListCount : 0 , 				/**	체크박스 선택시 추가*/
			prevCurrentPage : "" , 					/**	이전 선택된 pageing number*/
			prevSortColumn : "YIELD_3M" , 					/**	이전 정렬 항목	*/	
			prevSortType : "" , 						/**	이전 정렬 조건	*/	
			btnSelect		: "" ,
			isVote			: "" , 
			IFMN_OFRN_YN    : "" ,
			pension         : "" ,
			init : function(){
				
				/**	tab 영역 선택시 해당 영역 처리	*/
				$(".tabDeps3 li a").click(function(){
					$(".tabDeps3 li").removeClass("on");
					$(this).parent().addClass("on");
					$(".finduct_target").removeClass("on");
				});
				
				$.cs.event.enterEvent('#searchInput',function(){
					doSmartSearchList('title');
				});
				
				$("#tab1").click(function(){ $("#tg1").addClass("on"); $.fundList.loadTab("1");});
				$("#tab2").click(function(){ $("#tg2").addClass("on"); $.fundList.loadTab("2");});
				$("#tab3").click(function(){ $("#tg3").addClass("on"); $.fundList.loadTab("3");});
				$("#tab4").click(function(){ $("#tg4").addClass("on"); $.fundList.loadTab("4");});
				$("#tab5").click(function(){ $("#tg5").addClass("on"); $.fundList.loadTab("5");});
				$("#tab6").click(function(){ $("#tg6").addClass("on"); $.fundList.loadTab("6");});
				$("#tab7").click(function(){ $("#tg7").addClass("on"); $.fundList.loadTab("7");});
				
				/**	토글 탭 title 변경 - 대표상품 / 전체상품 변경 부분	**/
				$(".toggleTab li a").click(function(){
					if(!$(this).hasClass("cursorDefault")){ //웹접근성 오류 37-16 수정
						$(".toggleTab li a").attr("title","");
						$(".toggleTab li").removeClass("current");
						$(this).parent().addClass("current");
						$(this).attr("title","현재탭");
					}
				});
				
				_common.reinit_ui();
				
			} /**		init	*/ , 
			
			loadList : function(initFlag){
				var $f = $.form("fundSearchFrm") ;
				var pension = $f.val("pension") ;
				
				if(pension=="pension"){
					$f.val("fundGrop", "") ;
				}

				if(initFlag){
					$.fundList.isShowFlag = "" ;
					$.fundList.prevFundList = "" ; 
					$.fundList.hideFundList = "" ; 
					$.fundList.isAllCheck = "" ; 
					$.fundList.selectFundList = "" ; 
					$.fundList.selectFundNmList = "" ; 						
					$.fundList.selectFundTypeList = "" ;						
					$.fundList.selectFundNationList = "" ; 					
					$.fundList.hideFundCount = 0 ; 
					$.fundList.selectFundListCount = 0 ;
					
					$("[id^=chkAll]").prop("checked" , false) ; 
					
					$("#selectCompareB").html($.fundList.selectFundListCount) ;
					$("#selectCompareT").html($.fundList.selectFundListCount) ;
					
					$f.val("currentPage" , "1") ;
					if($f.val("isTab") == "") $f.val("isTab" , "1") ; 
					if(!$("#xnwl99").is(":checked")){
						n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID='+getMenuCode()+'&ACTION_ID=SR01&ITEM_CD=&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
						
						for(var i = 1 ; i <= 7 ; i++){
							$("#tab"+i+"ListTbody").empty() ;
						}
					}
				}else{
					if(!$("#xnwl99").is(":checked")) n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID=M1439180969116&ACTION_ID=SR01&ITEM_CD=&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
				}
				/**	해외 뮤추얼이 선택 되었을 경우.	*/
				if($("#xnwl99").is(":checked")){
					
					n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID='+getMenuCode()+'&ACTION_ID=SR01&ITEM_CD=&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
					
				/*	if($f.val('forLayer') == 'Y'){
						$f.val("rowsPerPage" , '5');	
					}else{
						$f.val("rowsPerPage" , $("#listRowMutual>option:selected").val())  ;
					}*/
					
					$("#NOTFUNDLISTTBODY").empty() ;
					
					$.cs.ajax({
						async					: true ,
						url						: '/ux/kor/finance/fund/search/listLoad.do' , 
						loadingStart 		: true,
						loadingEnd 			: true,
						data					: $f.toParameterString('' , false) ,
						success				: function(data){
							if( typeof data.errorMsg != "undefined" ){
								alert(data.errorMsg) ; 
								return ;
							}
							
							var str = '' ; 
							var totalCount = 0;
							var totalMath = 0 ; 
							var currentPage = $f.val("currentPage") ; 
							var rowsPerPage = $f.val("rowsPerPage") ;
							
							if( typeof data.list == "undefined" ){
								str +='<tr>' ;
								str +='	<td class="no_data" colspan="6">찾으시는 상품이 없습니다.</td>' ;
								str +='</tr>' ;
								$("#NOTFUNDLISTTBODY").append(str) ;
								$('#NOTFUNDLISTMAXTRDDT').html('') ; 
								$("#NOTFUNDLISTTOTAL").html("전체 <strong>0</strong>건 (<strong>1</strong> &#47; 1 페이지)") ;
								initFlag = true; 
							}else{
								
								totalCount = data.totalCount ;
								var len = data.list.length ; 
								if(len > 0){
									if(totalCount == 0 ) totalMath = 1 ; 
									else totalMath = Math.ceil(totalCount / rowsPerPage) ;
									
									for(var i = 0 ; i < len ; i++){
										str ='' ;
										str +='<tr>' ;
										str +='	<td class="taL"><a href="#" onClick="javascript:$.fundList.goMutuelDetail(\'' + data.list[i].FundCd + '\',\'' + data.list[i].fundInvtTypeCode + '\',this);">' + data.list[i].FundKrNm + (data.list[i].OnlineYN == 'Y' ? '(온라인)' : '') + (data.list[i].smsgRlcmYn == 'Y' ? ' <span class="badge"><img src="/ux/images/finance/finduct_sub.gif" alt="계열사" title="계열사"></span>' : '') + '</a></td>' ;
										str +='	<td>' + data.list[i].FundType + '</td>' ;
										str +='	<td class="taR">' + BondUtil.to_percent(data.list[i].StdPrc, 2) + ' ' + data.list[i].CrrCd + '</td>' ;
										str +='	<td>' + BondUtil.to_percent(data.list[i].StdPrc2, 4) + '</td>' ;
										if(data.list[i].AnnYield == '') str +='	<td><span class="keep">0.00%</span></td>' ;
										else if(data.list[i].AnnYield == 0) str +='	<td><span class="keep">0.00%</span></td>' ;
										else if(data.list[i].AnnYield >= 0) str +='	<td><span class="rise">' + BondUtil.to_percent(data.list[i].AnnYield, 2) + '%</span></td>' ;
										else if(data.list[i].AnnYield <= 0) str +='	<td><span class="drop">' + BondUtil.to_percent(data.list[i].AnnYield, 2) + '%</span></td>' ;
										str +='	<td><a href="javascript:openMenu(\'M1231757535406\');" class="btnMid white">지점가입</a></td>' ;
										str +='</tr>' ;
										
										$("#NOTFUNDLISTTBODY").append(str) ;
									}
									
									$('#NOTFUNDLISTMAXTRDDT').html('기준일자 : ' + $.util.dateFormat(data.maxTrdDt, 'yyyy-MM-dd')) ; 
									
									
									
									$("#NOTFUNDLISTTOTAL").html("전체 <strong>" + totalCount + "</strong>건 (<strong>" + currentPage + "</strong> &#47; " + totalMath + " 페이지)") ;
									 
									
								}else{
									str +='<tr>' ;
									str +='	<td class="no_data" colspan="6">찾으시는 상품이 없습니다.</td>' ;
									str +='</tr>' ;
									$("#NOTFUNDLISTTBODY").append(str) ;
									$('#NOTFUNDLISTMAXTRDDT').html('') ; 
									$("#NOTFUNDLISTTOTAL").html("전체 <strong>0</strong>건 (<strong>1</strong> &#47; 1 페이지)") ;
									initFlag = true; 
								}
							}
							
							 /**	페이징 처리	*/
							if(initFlag){
								_common.build_paging_ui( $('#divMutuelPaging'), totalCount, rowsPerPage, currentPage, function(n){
									$.fundList.pagingList( n );
								});
							}
							_common.reinit_ui();

							try{
								var keywordData = $f.val('SearchText');
								if("" != keywordData.trim()){
									if(pension =="pension"){
										/*
										digitalData.fundSearch.keyword = keywordData;
										digitalData.fundSearch.result = totalCount;
										_satellite.track('fundSearch');
										*/
										if(totalCount == 0){
											ga('send','event', 'PC_검색_연금', '연금_개인연금펀드찾기', '검색결과 없음', {'dimension32':keywordData});
										}else{
											ga('send','event', 'PC_검색_연금', '연금_개인연금펀드찾기', '검색결과 있음', {'dimension32':keywordData});
										}
									} else {
										/*
										digitalData.ppfundSearch.keyword = keywordData;
										digitalData.ppfundSearch.result = totalCount;
										_satellite.track('ppfundSearch');
										*/
										if(totalCount == 0){
											ga('send','event', 'PC_검색_펀드', '펀드_펀드찾기', '검색결과 없음', {'dimension32':keywordData});
										}else{
											ga('send','event', 'PC_검색_펀드', '펀드_펀드찾기', '검색결과 있음', {'dimension32':keywordData});
										}
									}
								}
							}catch(e){}
						}
					}) ;
					
				}else{
					
					if($f.val('forLayer') == 'Y'){
						$f.val("rowsPerPage" , '5');	
					}else{
						$f.val("rowsPerPage" , $("#listRow>option:selected").val())  ;
					}
					
					/**	테마상품 선택 시 전체상품 노출 하게 변경 - $f.val("fundGrop" , fundGrop) ;	- 2016/07/15 결함*/
					
					if(!$.util.isEmpty($f.val('ThemeFlag'))){
						$f.empty("fundGrop") ;
						$('#notGrop').click() ; 
					}
					/* 키워드 검색시 전체상품 노출 변경*/
					if(!$.util.isEmpty($f.val("SearchText")) && $("[name=fundGrop]").data("data") != "click"){
						$f.empty("fundGrop");
						$('#notGrop').click(); 
					}
					$.cs.ajax({
						async					: true ,
						url						: '/ux/kor/finance/fund/search/listLoad.do' , 
						loadingStart 		: true,
						loadingEnd 			: true,
						data					: $f.toParameterString('' , false) ,
						success				: function(data){
							if( typeof data.errorMsg != "undefined" ){
								alert(data.errorMsg) ; 
								return ;
							}
							$("#tab"+$f.val("isTab")+"ListTbody").empty() ;
							
							
							var totalCount = 0 ; 
							var currentPage = $f.val("currentPage") ; 
							var rowsPerPage = $f.val("rowsPerPage") ; 
							
							// 상단 추천 3건
							////////////////////////////////////////////////////
							if($.fundList.IFMN_OFRN_YN != "2" && $.fundList.pension == "pension"){
								
								if(typeof data.vote != "undefined" &&  typeof data.vote.list != "undefined" && data.vote.list.length > 0 ){
									if(typeof data.list != "undefined" && data.list.length > 0 ){
										if($f.val("isTab") == "1"){
											$("#tab"+$f.val("isTab")+"ListTbody").append('<tr><td colspan="12" class="ssrecom_title">삼성증권 추천상품'+($f.val('forLayer') != 'Y' ? '<button type="button" id="" name="" class="recomeAll" title="추천상품 모두보기" onclick="javascript:$.fundList.recommSearch();">추천상품 모두보기</button>' : '')+'</td></tr>');
										}else{
											$("#tab"+$f.val("isTab")+"ListTbody").append('<tr><td colspan="10" class="ssrecom_title">삼성증권 추천상품'+($f.val('forLayer') != 'Y' ? '<button type="button" id="" name="" class="recomeAll" title="추천상품 모두보기" onclick="javascript:$.fundList.recommSearch();">추천상품 모두보기</button>' : '')+'</td></tr>');
										}
	
										$.each(data.vote.list.reverse(), function (index, item) {
											item.vote = true;
											data.list.unshift(item);
										});
									}
								}
							}
							
							
							var prevVote = "" ; 
							
							if(typeof data.list != "undefined" && data.list.length > 0 ){
								for(var i = 0 ; i < data.list.length ; i++){
									var str = '' ;
									var isChecked = false ; 
									var vote = typeof data.list[i].vote != "undefined" ? "1" : "0" ; 
									if($.fundList.selectFundList.indexOf(data.list[i].FundCd) != -1) isChecked = true ;
									
									if(prevVote == "1" && vote == "0"){
										
										var colCnt = 0 ; 
										
										if($f.val("isTab") == "1") colCnt = 12 ;
										else if($f.val("isTab") == "2") colCnt = 4 ; 
										else if($f.val("isTab") == "3") colCnt = 7 ; 
										else if($f.val("isTab") == "4") colCnt = 7 ; 
										else if($f.val("isTab") == "5") colCnt = 9 ; 
										else if($f.val("isTab") == "6") colCnt = 6 ; 
										else if($f.val("isTab") == "7") colCnt = 4 ; 
										
										str +='<tr class="listTitleTab">';
										str +='<td colspan="'+colCnt+'" class="taL">전체 펀드상품</td>';
										str +='</tr>';
									}
									
									prevVote = vote ; 
									
									str +='<tr id="tr_'+$f.val("isTab") + '_'+vote+data.list[i].FundCd+'" ' + (data.list[i].hasOwnProperty("vote") && data.list[i].vote ? ' class="ssrecom"' : '') + '>' ;
									str +='	<td><input type="checkbox" name="compareChk" id="compareChk" value="'+ data.list[i].FundCd +'" title="'+ data.list[i].FundKrNm +' 선택" onclick="javascript:$.fundList.checkCompare(\''+data.list[i].FundCd+'\', \'' +data.list[i].FundKrNm+ '\', \'' +data.list[i].TypeNm1+ '\', \'' +data.list[i].TypeNm2+ '\', this);" '+(isChecked ? "checked" : "")+'></td>' ;
									if($f.val('forLayer') == 'Y'){
										str +='	<td>' ;
										str +='		<div class="finduct mgb0">' ;
									}else{
										str +='	<td class="finduct_td">' ;
										str +='		<div class="finduct">' ;
									}
									str +='			<ul class="badge">' ;
									if(data.list[i].recomYn == 'Y') 	str +='				<li><img src="/ux/images/finance/finduct_badge1.gif" alt="이달의 추천상품" title="이달의 추천상품"></li>' ;
									if(data.list[i].bestYn == 'Y') 		str +='				<li><img src="/ux/images/finance/finduct_badge2.gif" alt="판매금액 베스트" title="판매금액 베스트"></li>' ;
									if(data.list[i].rankPricYn == 'Y') 	str +='				<li><img src="/ux/images/finance/finduct_badge3.gif" alt="수익률 베스트" title="수익률 베스트"></li>' ;
									if(data.list[i].newYn == 'Y') 		str +='				<li><img src="/ux/images/finance/finduct_badge4.gif" alt="신상품" title="신상품"></li>' ;
									if(data.list[i].OnlineYN == 'Y') 	str +='				<li><img src="/ux/images/finance/finduct_badge5.gif" alt="온라인전용" title="온라인전용"></li>' ;
									if(data.list[i].themeYn == 'Y') 	str +='				<li><img src="/ux/images/finance/finduct_badge6.gif" alt="테마" title="테마"></li>' ;
									str +='			</ul>' ;
									if($f.val('forLayer') == 'Y'){
										str +='			<a href="#" onClick="javascript:$.fundList.showFundParent('+data.list[i].FundCd+',this);" class="fd_name" title="펀드상세 레이어팝업 열림">'+ data.list[i].FundKrNm+ (data.list[i].OnlineYN == 'Y' ? '(온라인)' : '') + (data.list[i].smsgRlcmYn == 'Y' ? ' <span class="badge"><img src="/ux/images/finance/finduct_sub.gif" alt="계열사" title="계열사"></span>' : '') + '</a>' ;
									}else{
										if($f.val('pension') == "pension"){
											str +='			<a href="#" class="fd_name" title="펀드상세 레이어팝업 열림" onClick=\'javascript:$.fundList.showPensionFund('+data.list[i].FundCd+',this);return false;\'>'+ data.list[i].FundKrNm+ (data.list[i].OnlineYN == 'Y' ? '(온라인)' : '') + (data.list[i].smsgRlcmYn == 'Y' ? ' <span class="badge"><img src="/ux/images/finance/finduct_sub.gif" alt="계열사" title="계열사"></span>' : '') +  '</a>' ;
										} else {
											str +='			<a href="#" class="fd_name" title="펀드상세 레이어팝업 열림" onClick=\'javascript:$.fundList.showFund('+data.list[i].FundCd+',this);return false;\'>'+ data.list[i].FundKrNm+ (data.list[i].OnlineYN == 'Y' ? '(온라인)' : '') + (data.list[i].smsgRlcmYn == 'Y' ? ' <span class="badge"><img src="/ux/images/finance/finduct_sub.gif" alt="계열사" title="계열사"></span>' : '') +  '</a>' ;
										}
									}
									str +='	<br><p class="taL">' +  data.list[i].fundClassTypeName+'</p>';
									str +='			<dl class="fd_type" id="'+data.list[i].FundCd+'" fund_type1="'+data.list[i].TypeNm1+'" fund_type2="'+data.list[i].TypeNm2+'" fund_name="'+data.list[i].FundKrNm+'">' ;
									str +='				<dt>유형 :</dt>' ;
									str +='				<dd>'+ data.list[i].TypeNm1 + (data.list[i].TypeNm2 != '' ?  ' ' + data.list[i].TypeNm2 : '' ) +'</dd>' ;
									str +='			</dl>' ;
									str +='		</div><!-- //finduct  -->' ;
									
									if($f.val('forLayer') != 'Y'){
										str +='		<div class="field_function">' ;
										
										/**	전체 상품 선택 시 클래스 펀드 항목 비노출.	*/
	
										if (!data.list[i].hasOwnProperty("vote")  || !data.list[i].vote) {
											if($f.val("fundGrop") == "Y"){
												if(data.list[i].fundClasCnt > 1) str +='			<a href="javascript:$.fundList.loadClassFund(\''+ data.list[i].FundCd +'\' , \''+ data.list[i].TrdDt +'\', \''+ data.list[i].fundClasCnt+'\');" class="line_finduct" id="classFund_'+ data.list[i].FundCd +'">클래스펀드<span>('+ ($.util.toInt(data.list[i].fundClasCnt) - 1)+')</span></a>' ;
											}
										}
										
										str +='			<a href="javascript:$.fundList.hideList(\''+data.list[i].FundCd+'\');" class="hide_field">숨기기</a>' ;
										str +='		</div>' ;
									}
									str +='	</td>' ;
									
									if($f.val("isTab") == "1"){
										str +='	<td><span class="keep">'+BondUtil.to_percent(data.list[i].TotRwrt,2) +'%</span></td>' ;
                                        str +='	<td><span class="keep">'+(data.list[i].saleFeeRate == "" ? "없음" : BondUtil.to_percent(data.list[i].saleFeeRate,2)+'%')+'</span></td>' ;

										var YIELD_1M = data.list[i].YIELD_1M;
										var YIELD_3M = data.list[i].YIELD_3M;
										var YIELD_6M = data.list[i].YIELD_6M;
										var YIELD_1Y = data.list[i].YIELD_1Y;
										var YIELD_3Y = data.list[i].YIELD_3Y;

										if(YIELD_1M == "") 			str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_1M == 0) 	str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_1M > 0) 		str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_1M , 2)	+'%</span></td>' ;
										else if(YIELD_1M < 0) 		str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_1M , 2)	+'%</span></td>' ;
										
										if(YIELD_3M == "") 			str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_3M == 0) 	str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_3M > 0) 		str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_3M , 2)	+'%</span></td>' ;
										else if(YIELD_3M < 0) 		str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_3M , 2)	+'%</span></td>' ;
										
										if(YIELD_6M == "") 			str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_6M == 0) 	str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_6M > 0) 		str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_6M , 2)	+'%</span></td>' ;
										else if(YIELD_6M < 0) 		str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_6M , 2)	+'%</span></td>' ;
										
										if(YIELD_1Y == "") 			str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_1Y == 0) 	str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_1Y > 0) 	str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_1Y , 2)	+'%</span></td>' ;
										else if(YIELD_1Y < 0) 	str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_1Y , 2)	+'%</span></td>' ;
										
										if(YIELD_3Y == "") 			str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_3Y == 0) 	str +='	<td><span class="keep">-</span></td>' ;
										else if(YIELD_3Y > 0) 	str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_3Y , 2)	+'%</span></td>' ;
										else if(YIELD_3Y < 0) 	str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_3Y , 2)	+'%</span></td>' ;
										
										var rtngAgnyRtngValu = data.list[i].rtngAgnyRtngValu ;
										
										if(rtngAgnyRtngValu == "1") 			str +='	<td><p class="risks deps1">매우낮음</p></td>' ;
										else if(rtngAgnyRtngValu == "2") 	str +='	<td><p class="risks deps2">낮음</p></td>' ;
										else if(rtngAgnyRtngValu == "3") 	str +='	<td><p class="risks deps3">중간</p></td>' ;
										else if(rtngAgnyRtngValu == "4") 	str +='	<td><p class="risks deps4">높음</p></td>' ;
										else if(rtngAgnyRtngValu == "5") 	str +='	<td><p class="risks deps5">매우높음</p></td>' ;
										
										str +='	<td>' ;
										str +='		<span class="startday">' + data.list[i].FstSetDt + '</span>' ;
										if(data.list[i].kfrEstabAm != null && data.list[i].kfrEstabAm == 0) str +='		<span>0.00억원</span>' ;
										else str +='		<span>' + BondUtil.to_percent(data.list[i].kfrEstabAm / 100000000 , 2) + ' 억원</span>' ; 
										str +='	</td>' ;
										
										if($.fundList.isShowFlag == "") $.fundList.isShowFlag = "1" ;
										
									}else if($f.val("isTab") == "2"){
										
										if( typeof(eval('data.list[i].tab2Chart_' + data.list[i].FundCd)) != 'undefined'){
											str +='<td id="listChart'+vote+""+data.list[i].FundCd+'" >' ;
										}else{
											str +='<td id="listChart'+vote+""+data.list[i].FundCd+'" style="display:none">' ;
										}
										str +='	<div class="finduct_barChart">' ;
										str +='	<dl class="legend">' ;
										str +='		<dt>범례</dt>' ;
										str +='		<dd class="case1">수익률</dd>' ;
										str +='		<dd class="case3">동일유형평균</dd>' ;
										str +='		<dd class="case2">클래스 설정액</dd>' ;
										str +='	</dl>' ;
										str +='	<div class="chart" id="inc_earning_amount_rate_highchart_container_'+vote+""+	data.list[i].FundCd	+'"></div>' ;
										str +='	</div>' ;
										str +='</td>' ;
										
										if(typeof(eval('data.list[i].tab2Chart_' + data.list[i].FundCd)) != 'undefined'){
											str +='<td id="listButton'+vote+""+data.list[i].FundCd+'" style="display:none;">' ;
										}else{
											str +='<td id="listButton'+vote+""+data.list[i].FundCd+'" >' ;
										}
										
										str +='	<button type="button" name="" id="" title="그래프 보기" class="btnMid white" onclick="javascript:$.fundList.step2Chart(\''+	data.list[i].FundCd	+'\' , \''+vote+'\');">그래프보기</button>' ;
										str +='</td>' ;
										
									}else if($f.val("isTab") == "3"){
										var P_RANK_YIELD = data.list[i].P_RANK_YIELD;	// 3개월 수익률 % 순위
										P_RANK_YIELD = P_RANK_YIELD.number() == 0 ? 1 : P_RANK_YIELD;
										var P_RANK_SD = data.list[i].P_RANK_SD;			// 표준편차  % 순위
										var P_RANK_SHARP = data.list[i].P_RANK_SHARP;	// 샤프 % 순위
										var P_RANK_BETA = data.list[i].P_RANK_BETA;		// 베타 % 순위
										var stepTexts1 = ["없음", "매우높음", "높음", "평균", "낮음", "매우낮음"];
										var stepTexts2 = ["없음", "매우우수", "우수", "중간", "부진", "매우부진"];
										var STEP_P_RANK_YIELD = 	(parseInt((P_RANK_YIELD - 1) / 20) + 1);
										var STEP_P_RANK_SD = 		(parseInt((P_RANK_SD - 1) / 20) + 1);
										var STEP_P_RANK_SHARP = 	(parseInt((P_RANK_SHARP - 1) / 20) + 1);
										var STEP_P_RANK_BETA =  	(parseInt((P_RANK_BETA - 1) / 20) + 1);

										str +='<td>' ;
										str +='	<dl class="risks_bar">' ;
										str +='		<dt class="deps' + (P_RANK_YIELD == 0 ? '0' : (6-STEP_P_RANK_YIELD))  + ' ">' + (P_RANK_YIELD == 0 ? stepTexts2[0] : stepTexts2[STEP_P_RANK_YIELD]) + '<span></span></dt>' ;
										str +='		<dd>(%순위 ' + (P_RANK_YIELD == 0 ? '-' : P_RANK_YIELD) + '위)</dd>' ;
										str +='	</dl>' ;
										str +='</td>' ;
										str +='<td>' ;
										str +='	<dl class="risks_bar">' ;
										str +='		<dt class="deps' + (P_RANK_SD == 0 ? '0' : (6-STEP_P_RANK_SD)) + ' ">' + (P_RANK_SD == 0 ? stepTexts1[0] : stepTexts2[STEP_P_RANK_SD]) + '<span></span></dt><!-- deps1=매우높음, deps2=높음, deps3=우수, deps4=낮음, deps5=매우낮음  -->' ;
										str +='		<dd>(%순위 ' + (P_RANK_SD == 0 ? '-' : P_RANK_SD) + '위)</dd>' ;
										str +='	</dl>' ;
										str +='</td>' ;
										str +='<td>' ;
										str +='	<dl class="risks_bar">' ;
										str +='		<dt class="deps' + (P_RANK_SHARP == 0 ? '0' : (6-STEP_P_RANK_SHARP)) + ' ">' + (P_RANK_SHARP == 0 ? stepTexts2[0] : stepTexts2[STEP_P_RANK_SHARP]) + '<span></span></dt><!-- deps1=매우높음, deps2=높음, deps3=우수, deps4=낮음, deps5=매우낮음  -->' ;
										str +='		<dd>(%순위 ' + (P_RANK_SHARP == 0 ? '-' : P_RANK_SHARP) + '위)</dd>' ;
										str +='	</dl>' ;
										str +='</td>' ;
										str +='<td>' ;
										str +='	<dl class="risks_bar">' ;
										str +='		<dt class="deps' + (P_RANK_BETA == 0 ? '0' : (6-STEP_P_RANK_BETA)) + ' ">' + (P_RANK_BETA == 0 ? stepTexts1[0] : stepTexts1[STEP_P_RANK_BETA] ) + '<span></span></dt><!-- deps1=매우높음, deps2=높음, deps3=우수, deps4=낮음, deps5=매우낮음  -->' ;
										str +='		<dd>(%순위 ' + (P_RANK_BETA == 0 ? '-' : P_RANK_BETA) + '위)</dd>' ;
										str +='	</dl>' ;
										str +='</td>' ;
									}else if($f.val("isTab") == "4"){
										
										var RDMP_FEE_DSCN_CTNT = $.util.trim(data.list[i].RDMP_FEE_DSCN_CTNT) ;
										if (RDMP_FEE_DSCN_CTNT == "") {
											RDMP_FEE_DSCN_CTNT = "환매수수료 없음";
										}
										
										str +='<td>' + BondUtil.to_percent(data.list[i].TotRwrt,4) + '%</td>' ;
										str +='<td>' + (data.list[i].fundFeeSectCodeYn == 'Y' ? (BondUtil.to_percent(data.list[i].saleFeeRate,2) + (data.list[i].cltnStnrCode == '1' ? '원' : '%')) : '없음') + '</td>' ;
										str +='<td>' + (data.list[i].fundFeeSectCodeYn2 == 'Y' ? '적용' : '없음') + '</td>' ;
										str +='<td>' ;
										str +='	<p>'+RDMP_FEE_DSCN_CTNT+'</p>' ;
										str +='</td>' ;
									}else if($f.val("isTab") == "5"){
										
										var igv7442p = (data.list[i].hasOwnProperty("vote") && data.list[i].vote) ? data.vote.igv7442p : data.igv7442p ;
										
										if( typeof(igv7442p) != "undefined"){
											var igv7442pLen = igv7442p.length ; 
											for(var a = 0 ; a < igv7442pLen ; a++ ){
												var datas = igv7442p[a] ;
												var FUND_CODE = $.util.trim(datas.FUND_CODE) ; 
												var ASST_AMNT1 = BondUtil.to_percent(datas.ASST_AMNT1) ; 
												var ASST_AMNT2 = BondUtil.to_percent(datas.ASST_AMNT2) ; 
												var ASST_AMNT3 = BondUtil.to_percent(datas.ASST_AMNT3) ; 
												var ASST_AMNT4 = BondUtil.to_percent(datas.ASST_AMNT4) ; 
												var ASST_AMNT5 = BondUtil.to_percent(datas.ASST_AMNT5) ; 
												var ASST_AMNT6 = BondUtil.to_percent(datas.ASST_AMNT6) ;

												if(data.list[i].FundCd == FUND_CODE){
													
													ASST_AMNT1 = ASST_AMNT1 - 10 ; 
													ASST_AMNT2 = ASST_AMNT2 - 10 ; 
													ASST_AMNT3 = ASST_AMNT3 - 10 ; 
													ASST_AMNT4 = ASST_AMNT4 - 10 ; 
													ASST_AMNT5 = ASST_AMNT5 - 10 ; 
													ASST_AMNT6 = ASST_AMNT6 - 10 ;
													
													str +='<td>' ;
													if(ASST_AMNT1 > 0) str +='	<p class="rating_star deps'+ASST_AMNT1+'">별'+ASST_AMNT1+'개</p>' ;
													else						str +='	<p class="rating_star">0</p>' ; 
													str +='</td>' ;
													str +='<td>' ;
													if(ASST_AMNT2 > 0) str +='	<p class="rating_star deps'+ASST_AMNT2+'">별'+ASST_AMNT2+'개</p>' ;
													else						str +='	<p class="rating_star">0</p>' ;
													str +='</td>' ;
													str +='<td>' ;
													if(ASST_AMNT3 > 0) str +='	<p class="rating_star deps'+ASST_AMNT3+'">별'+ASST_AMNT3+'개</p>' ;
													else						str +='	<p class="rating_star">0</p>' ;
													str +='</td>' ;
													str +='<td>' ;
													if(ASST_AMNT4 > 0) str +='	<p class="rating_star deps'+ASST_AMNT4+'">별'+ASST_AMNT4+'개</p>' ;
													else						str +='	<p class="rating_star">0</p>' ;
													str +='</td>' ;
													str +='<td>' ;
													if(ASST_AMNT5 > 0) str +='	<p class="rating_star deps'+ASST_AMNT5+'">별'+ASST_AMNT5+'개</p>' ;
													else						str +='	<p class="rating_star">0</p>' ;
													str +='</td>' ;
													str +='<td>' ;
													if(ASST_AMNT6 > 0) str +='	<p class="rating_star deps'+ASST_AMNT6+'">별'+ASST_AMNT6+'개</p>' ;
													else						str +='	<p class="rating_star">0</p>' ;
													str +='</td>' ;
													
													break ;
												}
											}
										}else{
											str +='<td>-</td>' ;
											str +='<td>-</td>' ;
											str +='<td>-</td>' ;
											str +='<td>-</td>' ;
											str +='<td>-</td>' ;
											str +='<td>-</td>' ;
										}
										
										
									}else if($f.val("isTab") == "6"){
										
										var ZRN_STOCK_WG = "0.00" ; 
										var ZRN_BOND_WG = "0.00" ; 
										var ZRN_CASH_WG = "0.00" ; 
										var ZRN_ETC_WG = "0.00" ; 
										
										if(typeof(data.list[i].igv7311p) != "undefined" && data.list[i].igv7311p != null) {
											
											ZRN_STOCK_WG = BondUtil.to_percent($.util.trim(data.list[i].igv7311p.outRec1.ZRN_STOCK_WG)) ; 
											ZRN_BOND_WG = BondUtil.to_percent($.util.trim(data.list[i].igv7311p.outRec1.ZRN_BOND_WG)) ; 
											ZRN_CASH_WG = BondUtil.to_percent($.util.trim(data.list[i].igv7311p.outRec1.ZRN_CASH_WG)) ;
											ZRN_ETC_WG = BondUtil.to_percent($.util.trim(data.list[i].igv7311p.outRec1.ZRN_ETC_WG)) ;
											
											var totalIgv7311p = $.util.roundPoint(ZRN_STOCK_WG, 2) + $.util.roundPoint(ZRN_BOND_WG, 2) + $.util.roundPoint(ZRN_CASH_WG, 2) + $.util.roundPoint(ZRN_ETC_WG, 2) ; 
											
											ZRN_STOCK_WG = Highcharts.numberFormat(($.util.roundPoint(ZRN_STOCK_WG, 2) * 100) / totalIgv7311p, 2) ; 
						                    ZRN_BOND_WG = Highcharts.numberFormat(($.util.roundPoint(ZRN_BOND_WG, 2) * 100) / totalIgv7311p, 2) ; 
						                    ZRN_CASH_WG = Highcharts.numberFormat(($.util.roundPoint(ZRN_CASH_WG, 2) * 100) / totalIgv7311p, 2) ; 
											
											str +='<td colspan="4" id="listChartTab6'+data.list[i].FundCd+'">' ;
											str +='	<div class="stick_bar">' ;
											str +='		<div class="diagram">' ;
											str +='			<span class="case1" style="width:'+ZRN_STOCK_WG+'%"></span>' ;
											str +='			<span class="case2" style="width:'+ZRN_BOND_WG+'%"></span>' ;
											str +='			<span class="case3" style="width:'+ZRN_CASH_WG+'%"></span>' ;
											str +='			<span class="case4" style="width:'+ZRN_ETC_WG+'%"></span>' ;
											str +='		</div>' ;
											str +='		<div class="unit">' ;
											str +='			<dl class="case1">' ;
											str +='				<dt>주식</dt>' ;
											str +='				<dd>'+ZRN_STOCK_WG+'%</dd>' ;
											str +='			</dl>' ;
											str +='			<dl class="case2">' ;
											str +='				<dt>채권</dt>' ;
											str +='				<dd>'+ZRN_BOND_WG+'%</dd>' ;
											str +='			</dl>' ;
											str +='			<dl class="case3">' ;
											str +='				<dt>유동성</dt>' ;
											str +='				<dd>'+ZRN_CASH_WG+'%</dd>' ;
											str +='			</dl>' ;
											str +='			<dl class="case4">' ;
											str +='				<dt>기타</dt>' ;
											str +='				<dd>'+ZRN_ETC_WG+'%</dd>' ;
											str +='			</dl>' ;
											str +='		</div>' ;
											str +='	</div>' ;
											str +='</td>' ;

										}else{

											if (typeof(data.list[i].igv7311p) != "undefined" && data.list[i].igv7311p == null) {
												str +='<td colspan="4" id="listChartTab6'+data.list[i].FundCd+'" style="display:none;">' ;
												str +='</td>' ;
												str +='<td colspan="4" id="listButtonTab6'+data.list[i].FundCd+'">' ;
												str +='	데이터가 없습니다.' ;
												str +='</td>' ;
											} else {
												str +='<td colspan="4" id="listChartTab6'+data.list[i].FundCd+'" style="display:none;">' ;
												str +='</td>' ;
												str +='<td colspan="4" id="listButtonTab6'+data.list[i].FundCd+'">' ;
												str +='	<button type="button" name="" id="" title="그래프보기" class="btnMid white" onclick="javascript:$.fundList.step6Chart(\''+	data.list[i].FundCd	+'\');">그래프보기</button>' ;
												str +='</td>' ;
											}
										}


										/*str +='<td>중형성장주</td>' ;*/
									}else if($f.val("isTab") == "7"){
										
										var ZRN_STRAT_CMNT = $.util.trim(data.list[i].ZRN_STRAT_CMNT) ;
										
										if(ZRN_STRAT_CMNT != ""){
											str +='<td>' ;
											str +='	<ul class="dot_list">' ;
											if(ZRN_STRAT_CMNT != ""){
												var A_CMMT_ARR = ZRN_STRAT_CMNT.split('- ') ;
												if(A_CMMT_ARR.length >= 3){
													for(var a = 0 ; a < A_CMMT_ARR.length ; a++){
														str +='		<li>' + $.util.trim(A_CMMT_ARR[a]) + '</li>' ;			
													}
												}else{
													str +='		<li>' + ZRN_STRAT_CMNT.replaceAll('- ' , '') + '</li>' ;
												}
											}else{
												//str +='		<li></li>' ;
											}
											str +='	</ul>' ;
											str +='</td>' ;
										}else{
											str +='<td>-</td>' ;
										}
									}
									var pension = $f.val("pension");
									
									str +='	<td class="fnBtn">' ;
									if("pension"==pension){
										if(data.list[i].HTSBuyPossYN == "Y" && data.list[i].NewPossYN == "Y") str +='		<a href="javascript:$.fundList.buyFund(\''+	 data.list[i].FundCd	+'\');" class="btnMid red size1" prodID="'+data.list[i].FundCd+'" prodType="P_FUND">신규매수</a>' ;
										else if(data.list[i].HTSBuyPossYN == "N" && data.list[i].NewPossYN == "Y") str +='		<a href="javascript:openMenu(\'M1231757535406\');" class="btnMid white">지점가입</a>' ;
										else str +='		<span class="btnMid white">가입불가</span>' ;
									}else{
										if(data.list[i].HTSBuyPossYN == "Y" && data.list[i].NewPossYN == "Y") str +='		<a href="javascript:$.fundList.buyFund(\''+	 data.list[i].FundCd	+'\');" class="btnMid red" prodID="'+data.list[i].FundCd+'" prodType="FUND">신규매수</a>' ;
										else if(data.list[i].HTSBuyPossYN == "N" && data.list[i].NewPossYN == "Y") str +='		<a href="javascript:openMenu(\'M1231757535406\');" class="btnMid white">지점가입</a>' ;
										else str +='		<span class="btnMid white">가입불가</span>' ;
									}
									if($f.val('forLayer') == 'Y'){
										str +='		<a href="#" onClick="javascript:$.fundList.interFundParent(\'' + data.list[i].FundCd + '\',this);" class="btnMid white" prodID="'+data.list[i].FundCd+'" prodType="'+(pension !="pension" ? "FUND" : "P_FUND")+'">장바구니</a>' ;
									}else{
										str +='		<a href="#" onClick="javascript:$.fundList.interFundBtnLayer(\'' + data.list[i].FundCd + '\',this, \'search\');" class="btnMid white" prodID="'+data.list[i].FundCd+'" prodType="'+(pension !="pension" ? "FUND" : "P_FUND")+'">장바구니</a>' ;
									}
									str +='	</td>' ;
									str +='</tr>' ;
									
									
									$("#tab"+$f.val("isTab")+"ListTbody").append(str) ; 
									
									/**	차트 그리기	*/
									if($f.val("isTab") == "2"){
										
										if(i < 6){	// 추천포함 최대 6개
											if(typeof(eval('data.list[i].tab2Chart_' + data.list[i].FundCd)) != 'undefined'){
												var cnt = eval('data.list[i].tab2Chart_' + data.list[i].FundCd).length ; 
												var inc_earning_amount_rate_xname = [] ; 
												var inc_earning_amount_rate_data1 = [] ; 
												var inc_earning_amount_rate_data2 = [] ; 
												var inc_earning_amount_rate_data3 = [] ; 
												
												for(var a = 0 ; a < cnt ; a++){
													var igv7223p = eval('data.list[i].tab2Chart_' + data.list[i].FundCd)[a] ;
													
													var ZRN_STD_DT		= $.util.dateFormat($.util.trim(igv7223p.ZRN_STD_DT), 'yyyy-MM-dd');
													var A_PRFT_1_RATE 	= $.util.toFloat($.util.trim(igv7223p.A_PRFT_1_RATE)); /* 펀드수익율 */
													var A_PRFT_3_RATE 	= $.util.toFloat($.util.trim(igv7223p.A_PRFT_3_RATE)); /* 동일유형평균 */
													var A_STNG_AMNT1 	= $.util.toFloat($.util.trim(igv7223p.A_STNG_AMNT1));  

													A_PRFT_1_RATE = isNaN(A_PRFT_1_RATE) ? 0 : A_PRFT_1_RATE;
													A_PRFT_3_RATE = isNaN(A_PRFT_3_RATE) ? 0 : A_PRFT_3_RATE;
													A_STNG_AMNT1  = isNaN(A_STNG_AMNT1)  ? 0 : A_STNG_AMNT1;

													inc_earning_amount_rate_xname.push(ZRN_STD_DT);
													inc_earning_amount_rate_data1.push(A_PRFT_1_RATE);
													inc_earning_amount_rate_data2.push(A_STNG_AMNT1);
													inc_earning_amount_rate_data3.push(A_PRFT_3_RATE);
												}
												
												$.fundList.drawFundChart(data.list[i].FundCd , inc_earning_amount_rate_xname, inc_earning_amount_rate_data1, inc_earning_amount_rate_data2, inc_earning_amount_rate_data3, vote) ;
												
											}
										
										}
										
									} /**	차트 - tab2	*/
									
									/**	현재 목록 해당 펀드 정보 TAB 이동 시 사용.		*/
									if(initFlag){
										if($.fundList.prevFundList == "") $.fundList.prevFundList = data.list[i].FundCd ;
										else $.fundList.prevFundList = $.fundList.prevFundList + "@" + data.list[i].FundCd ;
									}
								} /**		for		*/
								
								/**	기준일자 / 목록 / 전체 데이터 표기 부분.	*/
								$("#maxTrdDtP").html("") ; 
								
								var totalMath = 0 ; 
								totalCount = data.totalCount ; 
								
								if(totalCount == 0 ) totalMath = 1 ; 
								else totalMath = Math.ceil(totalCount / rowsPerPage) ; 
								
								$("#totalPageInfo").html("전체 <strong>" + totalCount + "</strong>건 (<strong>" + currentPage + "</strong> &#47; " + totalMath + " 페이지)") ;
								
								/**전체 선택 처리 부분*/
								if($.fundList.isAllCheck == "Y"){
									$("input:checkbox[name='chkAll']").prop('checked' , true) ;
									$("input:checkbox[name='compareChk']").prop('checked' , true) ;
								}
								
								/**	숨기기 처리	*/
								$.fundList.hideList( '') ;
								
							} /**	data.list.length	*/else{
								var str = '' ;
								var colspan = "7" ; /**	3 , 4 , 6 : 7	*/
								if($f.val("isTab") == "1") colspan = "12" ;
								else if($f.val("isTab") == "2" || $f.val("isTab") == "7") colspan = "4" ; 
								else if($f.val("isTab") == "5") colspan = "9" ;
								
								str +='<tr>' ;
								str +='	<td class="no_data" colspan="'+colspan+'">찾으시는 상품이 없습니다.</td>' ;
								str +='</tr>' ;
								
								$("#tab"+$f.val("isTab")+"ListTbody").append(str) ;
								
								$("#totalPageInfo").html("전체 <strong>0</strong>건 (<strong>0</strong> &#47; 0 페이지)") ;
								
								if($.fundList.btnSelect == "title"){
									if(!$('#notGrop').parent().hasClass("current")){
										$('#notGrop').trigger('click');
										$.fundList.loadGrop('');
									}
								}
							}
							
							/**	페이징 처리	*/
							if(initFlag){
								_common.build_paging_ui( $('#divNormalPaging'), totalCount, rowsPerPage, currentPage, function(n){
									$.fundList.pagingList( n );
								});
							}
							_common.reinit_ui();
							
							/*
							if(!ValidationUtil.is_null($('#searchInput').val())){
								$('html,body').animate({
							          scrollTop: $('#tab1').offset().top
							    }, 500);
							}
							*/
							try{
								var keywordData = $f.val('SearchText');
								if("" != keywordData.trim()){
									if($f.val("pension") =="pension"){
										/*
										digitalData.fundSearch.keyword = keywordData;
										digitalData.fundSearch.result = totalCount;
										_satellite.track('fundSearch');
										*/
										if(totalCount == 0){
											ga('send','event', 'PC_검색_연금', '연금_개인연금펀드찾기', '검색결과 없음', {'dimension32':keywordData});
										}else{
											ga('send','event', 'PC_검색_연금', '연금_개인연금펀드찾기', '검색결과 있음', {'dimension32':keywordData});
										}
									} else {
										/*
										digitalData.ppfundSearch.keyword = keywordData;
										digitalData.ppfundSearch.result = totalCount;
										_satellite.track('ppfundSearch');
										*/
										if(totalCount == 0){
											ga('send','event', 'PC_검색_펀드', '펀드_펀드찾기', '검색결과 없음', {'dimension32':keywordData});
										}else{
											ga('send','event', 'PC_검색_펀드', '펀드_펀드찾기', '검색결과 있음', {'dimension32':keywordData});
										}
									}
								}
							}catch(e){}							
						} /**	success	*/
					}) ;
				}
				
			} /**	loadList	*/ ,
			
			drawFundChart : function(FUND_CODE , XNAME, DATA1 , DATA2, DATA3, VOTE){

				var xtickInterval= $.util.roundPoint(DATA1.length / 2.5) ;
				var options = {
						 chart: {
							 		 renderTo: "inc_earning_amount_rate_highchart_container_"+VOTE + "" + FUND_CODE,
							         type: 'spline',
							         marginBottom: 25,
							         alignTicks: true
							         
							     },
							 	title: {
							          text: ''
							      },
							     subtitle: {
							      text: ''
							  	},
							     xAxis: {
							     	tickInterval : xtickInterval,
							     	categories: XNAME,
							     	
							     },
							     yAxis: [{
							     	//tickAmount: 5,
							         title: {
										 text: ''
							         },
							         labels: {
										 formatter: function() {
										     return this.value + '%';
										 }
							         }
							         //,tickInterval : 1
							        
							     }, { // Secondary yAxis
							         gridLineWidth: 0,
							         //tickAmount:5,
							         title: {
										 text: '',
										 style: {
										     color: Highcharts.getOptions().colors[1]
										 }
							         },
							         labels: {
										 format: '{value} 억',
										 style: {
										     color: Highcharts.getOptions().colors[1]
										 }
							         },
							         tickInterval : 1,
							         opposite: true
							     }],
							     
							     plotOptions: {
							         spline: {
										 lineWidth: 1.5,
										 marker: {
										     enabled: false
										 },
										 events: {
										 	legendItemClick: function () {
										      return false;
										     }
							         	}
							         },
							         area: {
					                        
					                        lineWidth: 1,
					                        marker: {
					                            enabled: false
					                        },
					                        shadow: false,
					                        states: {
					                            hover: {
					                                lineWidth: 1
					                            }
					                        },
					                        threshold: null
					                    }
							     },
							     credits: {
										enabled:  false
									},
									tooltip: {
							         formatter: function(){
							     		var tmpData = new Array();
							     		var key = this.points[0].key;
							     		var _suffix = "";
							     		tmpData.push('<span style="font-size:12px;">'+key+'</span><table>');
										 $.each(this.points,function(){
										 	var index = -1;

										 	$.each(this.series.data,function(i){
										 		if(index>=0){
										 			return;
										 		}
										 		if(key  == this.category){
										 			index = i;
										 		}
										 	});
										 	if(this.series.name =="클래스 설정액"){
										 		_suffix = "억";
										 	}else{
										 		_suffix = "%";
										 	}
												tmpData.push('<tr><td style="color:'+this.series.color+';padding:0"><b>'+this.series.name+'</b></td>');
												tmpData.push('<td style="padding:0"><b> : '+this.y+_suffix+'</b></td></tr>');	    					
										 });
											tmpData.push('</table>');  
											return tmpData.join('');
							     	},
							         
							         shared: true,
							         useHTML: true
							     },
							     
							     noData		: { style: $.util.noChartData()},
							     exporting	: { enabled: false },
							     legend: {
							     	enabled: false
							     },
							     series: [{
							    	 
							         name: '수익률',
							         zIndex:3,
							         data: DATA1,
							         marker: {
										 symbol: 'circle'
							         },
							         color: '#e81a1a'  // 빨강
							     },	 {
							     	
							         name: '동일유형평균',
							         zIndex:2,
							         data: DATA3,
							         marker: {
										 symbol: 'diamond'
							         },
							         color: '#ff8f1c' // 오렌지
							     },{
							    	 yAxis:1,
							    	 zIndex:1,
							         name: '클래스 설정액',
							         data: DATA2,
							         type: 'area',
							         color: '#b5d6ef',
							         marker: {
										 symbol: 'square'
							         }
							     }]
				 };
				 
                 chart = new Highcharts.Chart(options);
                 var getPortfolioTable1 = function(_tempId){
                 var tempTable ='<table class="guideTb1 small hidden">' +
                                 '	<caption><strong></strong><p>구성된 표</p></caption>' +
                                 '	<thead></thead>' +
                                 '	<tbody></tbody>' +
                                 '</table>';

                 var targetChart = chart;
                 var dateCategories  = {} ;
                 dateCategories.data =targetChart.xAxis[0].categories; //차트에 그려진 기준날짜


                 var $table = $(tempTable).find("caption>strong").text('수익률,동일유형평균,클래스설정액 ').end();
                 var $thead = $table.find("thead");
                 var $tbody = $table.find("tbody");
                 $.each(targetChart.series[0].data, function (index, point) {
                     var $tr = $("<tr/>");
                     $tr.append("<td class='taC'>" + point.category + "</td>");
                     $tr.append('<td>' +targetChart.series[0].data[index].y.toFixed(2) + '</td>');
                     $tr.append('<td>' +  targetChart.series[1].data[index].y.toFixed(2) + '</td>');
                     $tr.append('<td>' +  targetChart.series[2].data[index].y.toFixed(2) + '</td>');
                     $tbody.append($tr);
                 });

                 $table.append($thead).append($tbody);
                 $(_tempId).append($table);


                };
                getPortfolioTable1("#inc_earning_amount_rate_highchart_container_"+VOTE + "" + FUND_CODE);
				 $.util.setChartNoData(chart, false);
				 
				 _common.reinit_ui();
			}/**	drawFundChart	*/ , 
			
			loadTab : function(tabGbn){
				
				var $f = $.form("fundSearchFrm") ;
				$f.val("isTab" , tabGbn) ;
				
				if($.fundList.isShowFlag.indexOf(tabGbn) == -1){
					if($.fundList.isShowFlag == "") $.fundList.isShowFlag = tabGbn ; 
					else $.fundList.isShowFlag = $.fundList.isShowFlag + "," + tabGbn ; 
					
					$f.val("prevFundList" , $.fundList.prevFundList) ; 
					
					$.fundList.loadList(false) ; 
				}
			} /**	loadTab	*/ , 
			
			loadGrop : function(fundGrop){
				var $f = $.form("fundSearchFrm") ;
				$.fundList.btnSelect = "" ; 
				//if(fundGrop ) $.fundList.btnSelectTheme = "1" ; 
				$f.val("fundGrop" , fundGrop) ;
				$("[name=fundGrop]").data("data","click");
				$.fundList.loadList(true) ;
			} /**	 loadGrop	*/ , 
			
			/**	새로 고침 버튼 선택 시	*/
			goListCnt : function(){
				var $f = $.form("fundSearchFrm") ;
				if(!$('#xnwl99').is(":checked")) $f.val('rowsPerPage' , $("#listRow>option:selected").val()) ;
				else $f.val('rowsPerPage' , $("#listRowMutual>option:selected").val()) ;
				$.fundList.btnSelect = "" ; 
				$f.val('currentPage' , '1') ;
				$.fundList.loadList(true) ; 
			} /**		goListCnt	*/ , 
			
			
			chkAll : function(thisObj){
				if($.fundList.prevFundList != ""){
					$("input:checkbox[name='compareChk']").prop('checked' , thisObj.checked) ;
					
					if(thisObj.checked) {
						$.fundList.isAllCheck = "Y" ;
						var imsi = "" ;
						var imsiCnt = 0 ; 
						
						$("input:checkbox[name='compareChk']").each(function(idx){
							
							var thisVal = $(this).val() ;
							
							if(imsi == ""){
								imsi = thisVal ;
								imsiCnt++ ;
							}else{
								if(imsi.indexOf(thisVal) == -1) {
									imsi = imsi + "@" + thisVal ;
									imsiCnt++ ; 
								}
							}
						}) ; 	
						
						$.fundList.selectFundList = imsi ;
						$.fundList.selectFundListCount = imsiCnt ; 
						
					}else{
						$.fundList.isAllCheck = "" ;
						$.fundList.selectFundList = "" ;
						$.fundList.selectFundNmList = "" ; 						
						$.fundList.selectFundTypeList = "" ;						
						$.fundList.selectFundNationList = "" ; 		
						$.fundList.selectFundListCount = 0 ; 
					}
					
					$("#selectCompareT").html($.fundList.selectFundListCount) ; 
					$("#selectCompareB").html($.fundList.selectFundListCount) ; 
					/** 웹로그용 추가. */
					$("#checkBuyFundBtnMrg4").attr("prodIDs",$.fundList.selectFundList.replaceAll("@",","));
					$("#checkBuyFundBtn").attr("prodIDs",$.fundList.selectFundList.replaceAll("@",","));
					$("#checkInterFundBtn").attr("prodIDs",$.fundList.selectFundList.replaceAll("@",","));					
				}
			} /**	chkAll	*/ , 
			
			hideList : function(FUNDCD){
				var isShowFlagArr = $.fundList.isShowFlag.split(',') ;
				
				if(FUNDCD != ""){
					if($.fundList.hideFundList == "") $.fundList.hideFundList = FUNDCD ; 
					else $.fundList.hideFundList = $.fundList.hideFundList + "@" + FUNDCD ;
					
					for(var i = 0 ; i < isShowFlagArr.length ; i++){
						if($("#tr_" + isShowFlagArr[i] + '_0' + FUNDCD).length) $("#tr_" + isShowFlagArr[i] + '_0' + FUNDCD).hide() ;
						if($("#tr_" + isShowFlagArr[i] + '_1' + FUNDCD).length) $("#tr_" + isShowFlagArr[i] + '_1' + FUNDCD).hide() ;
						$("#tg"+isShowFlagArr[i]+" tr[data-parents="+FUNDCD+"]").hide(); // classFund hide
					}
					
					$.fundList.hideFundCount = $.fundList.hideFundCount + 1 ; 
					
				}else{
					
					if($.fundList.hideFundList != ""){
						var hideArr = $.fundList.hideFundList.split("@") ; 
						
						for(var i = 0 ; i < isShowFlagArr.length ; i++){
							for(var j = 0 ; j < hideArr.length ; j++){
								try{
									if($("#tr_" + isShowFlagArr[i] + '_0' + hideArr[j]).length) $("#tr_"+  isShowFlagArr[i] + '_0'+ hideArr[j]).hide() ;
									if($("#tr_" + isShowFlagArr[i] + '_1' + hideArr[j]).length) $("#tr_"+  isShowFlagArr[i] + '_1'+ hideArr[j]).hide() ;
									$("#tg"+isShowFlagArr[i]+" tr[data-parents="+hideArr[j]+"]").hide(); // classFund hide
								}catch(e){}
							}
							
						}
					}
				}
				$("#totalHide").html("("+$.fundList.hideFundCount+")") ;
				_common.reinit_ui();
			} /**		hideList	*/ , 
			
			clearHide : function(){
				var isShowFlagArr = $.fundList.isShowFlag.split(',') ;
				
				if($.fundList.hideFundList != ""){
					var hideArr = $.fundList.hideFundList.split("@") ; 
					for(var i = 0 ; i < isShowFlagArr.length ; i++){
						
						for(var j = 0 ; j < hideArr.length ; j++){
							try{
								if($("#tr_" + isShowFlagArr[i] + '_0' + hideArr[j]).length) $("#tr_"+  isShowFlagArr[i] + '_0'+ hideArr[j]).show() ;
								if($("#tr_" + isShowFlagArr[i] + '_1' + hideArr[j]).length) $("#tr_"+  isShowFlagArr[i] + '_1'+ hideArr[j]).show() ;
								$("#tg"+isShowFlagArr[i]+" tr[data-parents="+hideArr[j]+"]").show(); // classFund hide
							}catch(e){}
						}
					}
				}
				
				$.fundList.hideFundList = "" ; 
				$.fundList.hideFundCount = 0 ; 
				$("#totalHide").html("("+$.fundList.hideFundCount+")") ;
				_common.reinit_ui();
			} /**	clearHide	*/ , 
			
			hideAll : function(){
				var pageHideArr = "" ; 
				
				$("input[name='compareChk']").each(function(){
					if($(this).is(":checked")){
						if(pageHideArr == "") pageHideArr = $(this).val() ; 
						else pageHideArr = pageHideArr + "@" + $(this).val() ;
					} 
				});
				
				var imsiCnt = 0 ; 
				var isShowFlagArr = $.fundList.isShowFlag.split(',') ;
				if(pageHideArr != ""){
					var pageHideArrSplit = pageHideArr.split("@") ;
					for(var a = 0 ;a < pageHideArrSplit.length ; a++){
						
						if($.fundList.hideFundList == "") $.fundList.hideFundList = pageHideArrSplit[a] ; 
						else $.fundList. hideFundList = $.fundList.hideFundList + "@" + pageHideArrSplit[a] ;
						imsiCnt++ ; 
						for(var i = 0 ; i < isShowFlagArr.length ; i++){
							if($("#tr_" + isShowFlagArr[i] + '_0' + pageHideArrSplit[a]).length) $("#tr_" + isShowFlagArr[i] + '_0' + pageHideArrSplit[a]).hide() ;
							if($("#tr_" + isShowFlagArr[i] + '_1' + pageHideArrSplit[a]).length) $("#tr_" + isShowFlagArr[i] + '_1' + pageHideArrSplit[a]).hide() ;
							$("#tg"+isShowFlagArr[i]+" tr[data-parents="+pageHideArrSplit[a]+"]").hide(); // classFund hide
						}
					}
				}
				$.fundList.hideFundCount = imsiCnt ; 
				$("#totalHide").html("("+$.fundList.hideFundCount+")") ;
				_common.reinit_ui();
			} /**		hideAll	*/ , 
			
			
			checkCompare : function(FUND_CD, FUND_NM, FUND_TYPE1, FUND_TYPE2, thisObj){

				var checkFlag = thisObj.checked;
				if(FUND_CD != ''){
					if(checkFlag) {
						if($.fundList.selectFundList == ""){ 
							$.fundList.selectFundList =  FUND_CD; 
							$.fundList.selectFundNmList = FUND_NM;
							$.fundList.selectFundTypeList = FUND_TYPE1 + ' ' + FUND_TYPE2;
							$.fundList.selectFundNationList = FUND_TYPE1;
						}else{
							if($.fundList.selectFundList.indexOf(FUND_CD) < 0){ 
								$.fundList.selectFundList = $.fundList.selectFundList + "@" + FUND_CD ;
								$.fundList.selectFundNmList = $.fundList.selectFundNmList + "@" + FUND_NM ;
								$.fundList.selectFundTypeList = $.fundList.selectFundTypeList + "@" + FUND_TYPE1 + ' ' + FUND_TYPE2; ;
								$.fundList.selectFundNationList = $.fundList.selectFundNationList + "@" + FUND_TYPE1 ;
							}
						}
						
						var arr = $.fundList.selectFundList.split('@') ; 
						
						$.fundList.selectFundListCount = arr.length ;
						
						$("input[name='compareChk']").each(function(){
							if($(this).val() == FUND_CD) $(this).prop("checked" , true) ; 
						});
						
						
					}else{

						var imsi = "" ; 
						var imsi2 = "" ; 
						var imsi3 = "" ; 
						var imsi4 = "" ; 
						
						var imsiCnt = 0 ;

						if($.fundList.selectFundList != ""){
							var selectArr = $.fundList.selectFundList.split("@") ;
							var selectArr2 = $.fundList.selectFundNmList.split("@") ;
							var selectArr3 = $.fundList.selectFundTypeList.split("@") ;
							var selectArr4 = $.fundList.selectFundNationList.split("@") ;

							
							for(var i = 0 ; i < selectArr.length ; i++){
								if(selectArr[i] != FUND_CD){
									if(imsi == ""){
										imsi = selectArr[i] ;
										imsi2 = selectArr2[i] ;
										imsi3 = selectArr3[i] ;
										imsi4 = selectArr4[i] ;
									}else{
										imsi = imsi + "@" + selectArr[i] ;
										imsi2 = imsi2 + "@" + selectArr2[i] ;
										imsi3 = imsi3 + "@" + selectArr3[i] ;
										imsi4 = imsi4 + "@" + selectArr4[i] ;
									}

									imsiCnt++ ;
								}
							}
						}
						
						$("input[name='compareChk']").each(function(){
							if($(this).val() == FUND_CD) $(this).prop("checked" , false) ; 
						});

						$.fundList.selectFundList = imsi ;
						$.fundList.selectFundNmList = imsi2 ;
						$.fundList.selectFundTypeList = imsi3 ;
						$.fundList.selectFundNationList = imsi4 ;
						$.fundList.selectFundListCount = imsiCnt ;


					}
				}
				
				$("#selectCompareB").html($.fundList.selectFundListCount) ;
				$("#selectCompareT").html($.fundList.selectFundListCount) ;

				$("#checkBuyFundBtnMrg4").attr("prodIDs",$.fundList.selectFundList.replaceAll("@",","));
				$("#checkBuyFundBtn").attr("prodIDs",$.fundList.selectFundList.replaceAll("@",","));
				$("#checkInterFundBtn").attr("prodIDs",$.fundList.selectFundList.replaceAll("@",","));
//				_common.reinit_ui();
			}/**	checkCompare		*/ ,
			
			pagingList : function(selectCurrentPage){
				var $f = $.form("fundSearchFrm") ;
				
				if(Number($f.val("currentPage")) != selectCurrentPage){
					$f.val("currentPage" , selectCurrentPage) ; 
					$.fundList.prevCurrentPage = selectCurrentPage ;
					$.fundList.btnSelect = "" ; 
					$.fundList.loadList(false);
				}
				
			} /**	pagingList	*/ , 
			
			showFund : function(FUND_CD,_this){
				n_click_logging('/ux/kor/finance/fund/detail/view.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+FUND_CD+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
				_common.showDetailLayerPopup("/ux/kor/finance/fund/detail/view.do?FUND_CD=" + FUND_CD ,'' ,_this) ;
			} /**	showFund	*/ ,
			
			showFundParent : function(FUND_CD,_this){
				n_click_logging('/ux/kor/finance/fund/detail/view.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+FUND_CD+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
				parent._common.showDetailLayerPopup("/ux/kor/finance/fund/detail/view.do?FUND_CD=" + FUND_CD ,'' ,_this) ;
			} /**	showFund	*/ , 
			
			goMutuelDetail : function(FUND_CD, fundInvtTypeCode,_this){
				_common.showDetailLayerPopup("/ux/kor/finance/fund/detail/mutuelView.do?FUND_CD=" + FUND_CD +"&fundInvtTypeCode=" + fundInvtTypeCode ,'' ,_this) ;
			} /**	showFund	*/ , 
			
			showPensionFund : function(FUND_CD,_this){
				n_click_logging('/ux/kor/finance/fund/detail/view.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+FUND_CD+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
				_common.showDetailLayerPopup("/ux/kor/finance/fund/detail/view.do?FUND_CD=" + FUND_CD +"&pension=pension",'' ,_this) ;
			} /**	showFund	*/ ,
			
			OrderSearch : function(sortColumn){
				var $f = $.form("fundSearchFrm") ;
				$f.val('currentPage' , '1') ;
				var sortType = "" ;
				
				if($.fundList.prevSortColumn == sortColumn){
					$f.val("sortColumn" , sortColumn) ; 
					if($.fundList.prevSortType == "ASC"){
						$f.val("sortType" , "DESC") ;
						sortType = "DESC" ;
					}else{
						$f.val("sortType" , "ASC") ;
						sortType = "ASC" ;
					}   
				}else{
					$f.val("sortColumn" , sortColumn) ; 
					$f.val("sortType" , "DESC") ;
					sortType = "DESC" ;
				}
				
				$.fundList.prevSortColumn = sortColumn ; 
				$.fundList.prevSortType = sortType ; 
				
				$.fundList.loadList(true) ; 
				
			} /**	OrderSearch	*/ , 
			
			loadClassFund : function (FundCd , TrdDt , fundClasCnt){
				var $f = $.form("fundSearchFrm") ;
				
				if($("#classFund_"+ FundCd).hasClass("open")){
					$("#classFund_"+ FundCd).removeClass("open") ; 
					$("#tab"+$f.val("isTab")+"ListTbody").find('tr').each(function(index){
						if($(this).hasClass("classFundOpen") && $(this).attr("data-parents") == FundCd){
							
							if($.fundList.selectFundList != ""){
								var selectArr = $.fundList.selectFundList.split("@") ;
								var imsi = "" ; 
								var cnt = 0 ;
								var deleteFundArr = "" ; 
								
								
								if($(this).find("input[name=compareChk]").is(":checked")){
									for(var i = 0 ; i < selectArr.length ; i++){
										if(selectArr[i] == $(this).attr("data-child")){
												if(deleteFundArr == "") deleteFundArr = $(this).attr("data-child") ; 
												else deleteFundArr = deleteFundArr + "@" + $(this).attr("data-child") ;
										}
									}
								}
								
								if(deleteFundArr != ""){
									for(var i = 0 ; i < selectArr.length ; i++){
										if(deleteFundArr.indexOf(selectArr[i]) < 0){
											if(imsi == "") imsi = selectArr[i] ; 
											else imsi = imsi + "@" + selectArr[i] ;
											
											cnt++;
										}
									}
								}
								
								
								$.fundList.selectFundList = imsi ; 
								$.fundList.selectFundListCount = cnt ;
								
								$("#selectCompareB").html($.fundList.selectFundListCount) ;
								$("#selectCompareT").html($.fundList.selectFundListCount) ;
								
							}
							
							$(this).remove();
						}
							
					}) ;
				}else{
					
					if(fundClasCnt != "0"){
						$f.val("FUNDCD" , FundCd) ;
						$.cs.ajax({
							type     	: 'post',
				            url      	: '/ux/kor/finance/fund/search/classFundList.do',
				            loadingStart : true,
							loadingEnd   : true,
				            data     	: $f.toParameterString('', false),
				            dataType : 'json',
				            success  : function(data) {
				            	if(data.errMsg != ''){
									alert(data.errMsg) ; 
									return ;
								}
								/**
								 * table-sort Class 추가 : data-addtr="Y"
								 */
				            	
								if(typeof data.list != "undefined" && data.list.length > 0 ){
									
									var len = data.list.length ; 
									
									for(var i = (len -1) ; i >= 0  ; --i){
										var str = '' ;
										if(FundCd != data.list[i].FundCd){
											str +='<tr class="classFundOpen" data-parents="'+FundCd+'" data-child="'+data.list[i].FundCd+'" data-addtr="Y">' ;
											str +='	<td><input type="checkbox" name="compareChk" id="compareChk" value="'+ data.list[i].FundCd +'" title="'+ data.list[i].FundKrNm+ (data.list[i].OnlineYN == 'Y' ? '(온라인)' : '') +  '항목선택" onclick="javascript:$.fundList.checkCompare(\''+data.list[i].FundCd+'\', \'' +data.list[i].FundKrNm+ '\', \'' +data.list[i].TypeNm1+ '\', \'' +data.list[i].TypeNm2+ '\', this);"></td>' ;
											str +='	<td>' ;
											str +='		<div class="finduct">' ;
											str +='			<ul class="badge">' ;
											if(data.list[i].recomYn == 'Y')		str +='				<li><img src="/ux/images/finance/finduct_badge1.gif" alt="이달의 추천상품" title="이달의 추천상품"></li>' ;
											if(data.list[i].bestYn == 'Y') 		str +='				<li><img src="/ux/images/finance/finduct_badge2.gif" alt="판매금액 베스트" title="판매금액 베스트"></li>' ;
											if(data.list[i].rankPricYn == 'Y')	str +='				<li><img src="/ux/images/finance/finduct_badge3.gif" alt="수익률 베스트" title="수익률 베스트"></li>' ;
											if(data.list[i].newYn == 'Y')		str +='				<li><img src="/ux/images/finance/finduct_badge4.gif" alt="신상품" title="신상품"></li>' ;
											if(data.list[i].OnlineYN == 'Y')		str +='				<li><img src="/ux/images/finance/finduct_badge5.gif" alt="온라인전용" title="온라인전용"></li>' ;
											if(data.list[i].themeYn == 'Y')		str +='				<li><img src="/ux/images/finance/finduct_badge6.gif" alt="테마" title="테마"></li>' ;
											str +='			</ul>' ;
											str +='			<a href="#" onClick="javascript:$.fundList.showFund('+data.list[i].FundCd+',this);return false;" class="fd_name" title="펀드상세 레이어팝업 열림">'+ data.list[i].FundKrNm+ (data.list[i].OnlineYN == 'Y' ? '(온라인)' : '') + (data.list[i].smsgRlcmYn == 'Y' ? ' <span class="badge"><img src="/ux/images/finance/finduct_sub.gif" alt="계열사" title="계열사"></span>' : '') +  '</a>' ;
											str +='			<dl class="fd_type">' ;
											str +='				<dt>유형 :</dt>' ;
											str +='				<dd>'+ data.list[i].TypeNm1 + (data.list[i].TypeNm2 != '' ?  ' ' + data.list[i].TypeNm2 : '' ) +'</dd>' ;
											str +='			</dl>' ;
											str +='		</div><!-- //finduct  -->' ;
											str +='	</td>' ;

											if($f.val("isTab") == "1"){
	                                            str +='	<td><span class="keep">'+BondUtil.to_percent(data.list[i].TotRwrt,2) +'%</span></td>' ;
                                                str +='	<td><span class="keep">'+(data.list[i].saleFeeRate == "" ? "없음" : BondUtil.to_percent(data.list[i].saleFeeRate,2)+'%')+'</span></td>' ;


												var YIELD_1M = data.list[i].YIELD_1M;
												var YIELD_3M = data.list[i].YIELD_3M;
												var YIELD_6M = data.list[i].YIELD_6M;
												var YIELD_1Y = data.list[i].YIELD_1Y;
												var YIELD_3Y = data.list[i].YIELD_3Y;
												var rtngAgnyRtngValu = data.list[i].rtngAgnyRtngValu ;

												if(YIELD_1M == "") 			str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_1M == 0) 	str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_1M > 0) 		str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_1M , 2)	+'%</span></td>' ;
												else if(YIELD_1M < 0) 		str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_1M , 2)	+'%</span></td>' ;

												if(YIELD_3M == "") 			str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_3M == 0) 	str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_3M > 0) 		str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_3M , 2)	+'%</span></td>' ;
												else if(YIELD_3M < 0) 		str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_3M , 2)	+'%</span></td>' ;

												if(YIELD_6M == "") 			str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_6M == 0) 	str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_6M > 0) 		str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_6M , 2)	+'%</span></td>' ;
												else if(YIELD_6M < 0) 		str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_6M , 2)	+'%</span></td>' ;

												if(YIELD_1Y == "") 			str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_1Y == 0) 	str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_1Y > 0) 	str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_1Y , 2)	+'%</span></td>' ;
												else if(YIELD_1Y < 0) 	str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_1Y , 2)	+'%</span></td>' ;

												if(YIELD_3Y == "") 			str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_3Y == 0) 	str +='	<td><span class="keep">-</span></td>' ;
												else if(YIELD_3Y > 0) 	str +='	<td><span class="rise">'+	BondUtil.to_percent(YIELD_3Y , 2)	+'%</span></td>' ;
												else if(YIELD_3Y < 0) 	str +='	<td><span class="drop">'+	BondUtil.to_percent(YIELD_3Y , 2)	+'%</span></td>' ;

												if(rtngAgnyRtngValu == "1") 			str +='	<td><p class="risks deps1">매우낮음</p></td>' ;
												else if(rtngAgnyRtngValu == "2") 	str +='	<td><p class="risks deps2">낮음</p></td>' ;
												else if(rtngAgnyRtngValu == "3") 	str +='	<td><p class="risks deps3">중간</p></td>' ;
												else if(rtngAgnyRtngValu == "4") 	str +='	<td><p class="risks deps4">높음</p></td>' ;
												else if(rtngAgnyRtngValu == "5") 	str +='	<td><p class="risks deps5">매우높음</p></td>' ;

												str +='	<td>' ;
												str +='		<span class="startday">' + data.list[i].FstSetDt + '</span>' ;

												if(data.list[i].kfrEstabAm != null && data.list[i].kfrEstabAm == 0) str +='		<span>0.00억원</span>' ;
												else str +='		<span>' + BondUtil.to_percent(data.list[i].kfrEstabAm / 100000000 , 2) + ' 억원<br></span>' ;
												str +='	</td>' ;
											}else if($f.val("isTab") == "2"){
												
												str +='<td>' ;
												str +='<div class="finduct_barChart">' ;
												str +='<dl class="legend">' ;
												str +='	<dt>범례</dt>' ;
												str +='	<dd class="case1">수익률</dd>' ;
												str +='	<dd class="case2">설정액</dd>' ;
												str +='	<dd class="case3">동일유형평균</dd>' ;
												str +='</dl>' ;
												str +='<div class="chart" id="inc_earning_amount_rate_highchart_container_0'+	data.list[i].FundCd	+'"></div>' ;
												str +='</div>' ;
												str +='</td>' ;
												
											}else if($f.val("isTab") == "3"){
												var P_RANK_YIELD = data.list[i].P_RANK_YIELD;	// 3개월 수익률 % 순위
												P_RANK_YIELD = P_RANK_YIELD.number() == 0 ? 1 : P_RANK_YIELD;
												var P_RANK_SD = data.list[i].P_RANK_SD;			// 표준편차  % 순위
												var P_RANK_SHARP = data.list[i].P_RANK_SHARP;	// 샤프 % 순위
												var P_RANK_BETA = data.list[i].P_RANK_BETA;		// 베타 % 순위
												var stepTexts1 = ["없음", "매우높음", "높음", "평균", "낮음", "매우낮음"];
												var stepTexts2 = ["없음", "매우우수", "우수", "중간", "부진", "매우부진"];
												var STEP_P_RANK_YIELD = 	(parseInt((P_RANK_YIELD - 1) / 20) + 1);
												var STEP_P_RANK_SD = 		(parseInt((P_RANK_SD - 1) / 20) + 1);
												var STEP_P_RANK_SHARP = 	(parseInt((P_RANK_SHARP - 1) / 20) + 1);
												var STEP_P_RANK_BETA =  	(parseInt((P_RANK_BETA - 1) / 20) + 1);

												str +='<td>' ;
												str +='	<dl class="risks_bar">' ;
												str +='		<dt class="deps' + (P_RANK_YIELD == 0 ? '0' : (6-STEP_P_RANK_YIELD)) + ' ">' + (P_RANK_YIELD == 0 ? stepTexts2[0] : stepTexts2[STEP_P_RANK_YIELD]) + '<span></span></dt>' ;
												str +='		<dd>(%순위 ' + (P_RANK_YIELD == 0 ? '-' : P_RANK_YIELD) + '위)</dd>' ;
												str +='	</dl>' ;
												str +='</td>' ;
												str +='<td>' ;
												str +='	<dl class="risks_bar">' ;
												str +='		<dt class="deps' + (P_RANK_SD == 0 ? '0' : (6-STEP_P_RANK_SD)) + ' ">' + (P_RANK_SD == 0 ? stepTexts1[0] : stepTexts2[STEP_P_RANK_SD]) + '<span></span></dt><!-- deps1=매우높음, deps2=높음, deps3=우수, deps4=낮음, deps5=매우낮음  -->' ;
												str +='		<dd>(%순위 ' + (P_RANK_SD == 0 ? '-' : P_RANK_SD) + '위)</dd>' ;
												str +='	</dl>' ;
												str +='</td>' ;
												str +='<td>' ;
												str +='	<dl class="risks_bar">' ;
												str +='		<dt class="deps' + (P_RANK_SHARP == 0 ? '0' : (6-STEP_P_RANK_SHARP)) + ' ">' + (P_RANK_SHARP == 0 ? stepTexts2[0] : stepTexts2[STEP_P_RANK_SHARP]) + '<span></span></dt><!-- deps1=매우높음, deps2=높음, deps3=우수, deps4=낮음, deps5=매우낮음  -->' ;
												str +='		<dd>(%순위 ' + (P_RANK_SHARP == 0 ? '-' : P_RANK_SHARP) + '위)</dd>' ;
												str +='	</dl>' ;
												str +='</td>' ;
												str +='<td>' ;
												str +='	<dl class="risks_bar">' ;
												str +='		<dt class="deps' + (P_RANK_BETA == 0 ? '0' : (6-STEP_P_RANK_BETA)) + ' ">' + (P_RANK_BETA == 0 ? stepTexts1[0] : stepTexts1[STEP_P_RANK_BETA] ) + '<span></span></dt><!-- deps1=매우높음, deps2=높음, deps3=우수, deps4=낮음, deps5=매우낮음  -->' ;
												str +='		<dd>(%순위 ' + (P_RANK_BETA == 0 ? '-' : P_RANK_BETA) + '위)</dd>' ;
												str +='	</dl>' ;
												str +='</td>' ;
											}else if($f.val("isTab") == "4"){

												var RDMP_FEE_DSCN_CTNT = $.util.trim(data.list[i].RDMP_FEE_DSCN_CTNT) ;

												str +='<td>' + BondUtil.to_percent(data.list[i].TotRwrt,4) + '%</td>';
												str +='<td>' + (data.list[i].fundFeeSectCodeYn == 'Y' ? (BondUtil.to_percent(data.list[i].saleFeeRate,2) + (data.list[i].cltnStnrCode == '1' ? '원' : '%')) : '없음') + '</td>' ;
												str +='<td>' + (data.list[i].fundFeeSectCodeYn2 == 'Y' ? '적용' : '없음') + '</td>' ;
												str +='<td>' ;
												str +='	<p>'+RDMP_FEE_DSCN_CTNT+'</p>' ;
												str +='</td>' ;
											}else if($f.val("isTab") == "5"){
												
												var igv7442p = data.igv7442p ;
												if(typeof data.igv7442p != "undefined" ){
													var igv7442pLen = igv7442p.length ; 
													for(var a = 0 ; a < igv7442pLen ; a++ ){
														var datas = igv7442p[a] ;
														var FUND_CODE = $.util.trim(datas.FUND_CODE) ; 
														var ASST_AMNT1 = BondUtil.to_percent(datas.ASST_AMNT1) ; 
														var ASST_AMNT2 = BondUtil.to_percent(datas.ASST_AMNT2) ; 
														var ASST_AMNT3 = BondUtil.to_percent(datas.ASST_AMNT3) ; 
														var ASST_AMNT4 = BondUtil.to_percent(datas.ASST_AMNT4) ; 
														var ASST_AMNT5 = BondUtil.to_percent(datas.ASST_AMNT5) ; 
														var ASST_AMNT6 = BondUtil.to_percent(datas.ASST_AMNT6) ;
														
														if($.util.trim(data.list[i].FundCd) == $.util.trim(FUND_CODE)){
															
															str +='<td>' ;
															if(ASST_AMNT1 > 0) str +='	<p class="rating_star deps'+(ASST_AMNT1 - 10)+'">별'+(ASST_AMNT1 - 10)+'개</p>' ;
															else						str +='	<p class="rating_star">0</p>' ; 
															str +='</td>' ;
															str +='<td>' ;
															if(ASST_AMNT2 > 0) str +='	<p class="rating_star deps'+(ASST_AMNT2 - 10)+'">별'+(ASST_AMNT2 - 10)+'개</p>' ;
															else						str +='	<p class="rating_star">0</p>' ;
															str +='</td>' ;
															str +='<td>' ;
															if(ASST_AMNT3 > 0) str +='	<p class="rating_star deps'+(ASST_AMNT3 - 10)+'">별'+(ASST_AMNT3 - 10)+'개</p>' ;
															else						str +='	<p class="rating_star">0</p>' ;
															str +='</td>' ;
															str +='<td>' ;
															if(ASST_AMNT4 > 0) str +='	<p class="rating_star deps'+(ASST_AMNT4 - 10)+'">별'+(ASST_AMNT4 - 10)+'개</p>' ;
															else						str +='	<p class="rating_star">0</p>' ;
															str +='</td>' ;
															str +='<td>' ;
															if(ASST_AMNT5 > 0) str +='	<p class="rating_star deps'+(ASST_AMNT5 - 10)+'">별'+(ASST_AMNT5 - 10)+'개</p>' ;
															else						str +='	<p class="rating_star">0</p>' ;
															str +='</td>' ;
															str +='<td>' ;
															if(ASST_AMNT6 > 0) str +='	<p class="rating_star deps'+(ASST_AMNT6 - 10)+'">별'+(ASST_AMNT6 - 10)+'개</p>' ;
															else						str +='	<p class="rating_star">0</p>' ;
															str +='</td>' ;
															
															break ;
														}
													}
												}else{
													str +='<td>-</td>' ;
													str +='<td>-</td>' ;
													str +='<td>-</td>' ;
													str +='<td>-</td>' ;
													str +='<td>-</td>' ;
													str +='<td>-</td>' ;
												}
											}else if($f.val("isTab") == "6"){

												var ZRN_STOCK_WG = "0.00" ;
												var ZRN_BOND_WG = "0.00" ;
												var ZRN_CASH_WG = "0.00" ;
												var ZRN_ETC_WG = "0.00" ;

												if(typeof(data.list[i].igv7311p) != "undefined" && data.list[i].igv7311p != null) {

													ZRN_STOCK_WG = BondUtil.to_percent($.util.trim(data.list[i].igv7311p.outRec1.ZRN_STOCK_WG)) ;
													ZRN_BOND_WG = BondUtil.to_percent($.util.trim(data.list[i].igv7311p.outRec1.ZRN_BOND_WG)) ;
													ZRN_CASH_WG = BondUtil.to_percent($.util.trim(data.list[i].igv7311p.outRec1.ZRN_CASH_WG)) ;
													ZRN_ETC_WG = BondUtil.to_percent($.util.trim(data.list[i].igv7311p.outRec1.ZRN_ETC_WG)) ;
												}
												
												var totalIgv7311p = $.util.roundPoint(ZRN_STOCK_WG, 2) + $.util.roundPoint(ZRN_BOND_WG, 2) + $.util.roundPoint(ZRN_CASH_WG, 2) + $.util.roundPoint(ZRN_ETC_WG, 2) ; 
												
												ZRN_STOCK_WG = Highcharts.numberFormat(($.util.roundPoint(ZRN_STOCK_WG, 2) * 100) / totalIgv7311p, 2) ; 
												ZRN_BOND_WG = Highcharts.numberFormat(($.util.roundPoint(ZRN_BOND_WG, 2) * 100) / totalIgv7311p, 2) ; 
												ZRN_CASH_WG = Highcharts.numberFormat(($.util.roundPoint(ZRN_CASH_WG, 2) * 100) / totalIgv7311p, 2) ; 
												ZRN_ETC_WG = Highcharts.numberFormat(($.util.roundPoint(ZRN_ETC_WG, 2) * 100) / totalIgv7311p, 2) ; 

												str +='<td colspan="4">' ;
												str +='	<div class="stick_bar">' ;
												str +='		<div class="diagram">' ;
												str +='			<span class="case1" style="width:'+ZRN_STOCK_WG+'%"></span>' ;
												str +='			<span class="case2" style="width:'+ZRN_BOND_WG+'%"></span>' ;
												str +='			<span class="case3" style="width:'+ZRN_CASH_WG+'%"></span>' ;
												str +='			<span class="case4" style="width:'+ZRN_ETC_WG+'%"></span>' ;
												str +='		</div>' ;
												str +='		<div class="unit">' ;
												str +='			<dl class="case1">' ;
												str +='				<dt>주식</dt>' ;
												str +='				<dd>'+ZRN_STOCK_WG+'%</dd>' ;
												str +='			</dl>' ;
												str +='			<dl class="case2">' ;
												str +='				<dt>채권</dt>' ;
												str +='				<dd>'+ZRN_BOND_WG+'%</dd>' ;
												str +='			</dl>' ;
												str +='			<dl class="case3">' ;
												str +='				<dt>유동성</dt>' ;
												str +='				<dd>'+ZRN_CASH_WG+'%</dd>' ;
												str +='			</dl>' ;
												str +='			<dl class="case4">' ;
												str +='				<dt>기타</dt>' ;
												str +='				<dd>'+ZRN_ETC_WG+'%</dd>' ;
												str +='			</dl>' ;
												str +='		</div>' ;
												str +='	</div>' ;
												str +='</td>' ;

											}else if($f.val("isTab") == "7"){

												var ZRN_STRAT_CMNT = $.util.trim(data.list[i].ZRN_STRAT_CMNT) ;

												str +='<td>' ;
												str +='	<ul class="dot_list">' ;


												if(ZRN_STRAT_CMNT != ""){
													var A_CMMT_ARR = ZRN_STRAT_CMNT.split('- ') ;
													if(A_CMMT_ARR.length >= 3){
														for(var a = 0 ; a < A_CMMT_ARR.length ; a++){
															str +='		<li>' + $.util.trim(A_CMMT_ARR[a]) + '</li>' ;
														}
													}else{
														str +='		<li>' + ZRN_STRAT_CMNT.replaceAll('- ' , '') + '</li>' ;
													}
												}else{
													str +='-' ;
												}
												str +='	</ul>' ;
												str +='</td>' ;
											}

											str +='	<td>' ;
											var pension = $f.val("pension");
											
											if("pension" == pension){
												if(data.list[i].HTSBuyPossYN == "Y" && data.list[i].NewPossYN == "Y") str +='		<a href="javascript:$.fundList.buyFund((\''+	 data.list[i].FundCd	+'\');" class="btnMid red size1" prodID="'+data.list[i].FundCd+'" prodType="P_FUND">신규매수</a>' ;
												else if(data.list[i].HTSBuyPossYN == "N" && data.list[i].NewPossYN == "Y") str +='		<a href="javascript:openMenu(\'M1231757535406\');" class="btnMid white size1">지점가입</a>' ;
												else str +='		<span class="btnMid white">가입불가</span>' ;
											}else{
												if(data.list[i].HTSBuyPossYN == "Y" && data.list[i].NewPossYN == "Y") str +='		<a href="javascript:$.fundList.buyFund(\''+	 data.list[i].FundCd	+'\');" class="btnMid red size1" prodID="'+data.list[i].FundCd+'" prodType="FUND">신규매수</a>' ;
												else if(data.list[i].HTSBuyPossYN == "N" && data.list[i].NewPossYN == "Y") str +='		<a href="javascript:openMenu(\'M1231757535406\');" class="btnMid white size1">지점가입</a>' ;
												else str +='		<span class="btnMid white">가입불가</span>' ;
											}
											str +='		<a href="#" onClick="javascript:$.fundList.interFundBtnLayer(\'' + data.list[i].FundCd + '\',this, \'search\');" class="btnMid white size1" prodID="'+data.list[i].FundCd+'" prodType="'+(pension !="pension" ? "FUND" : "P_FUND")+'">장바구니</a>' ;
											str +='	</td>' ;
											str +='</tr>' ;

											$("#tr_"+$f.val("isTab")+"_0"+ FundCd).after(str) ;

											if($f.val("isTab") == "2"){

												if(typeof(eval('data.list[i].tab2Chart_' + data.list[i].FundCd)) != 'undefined'){
													var cnt = eval('data.list[i].tab2Chart_' + data.list[i].FundCd).length ;
													var inc_earning_amount_rate_xname = [] ;
													var inc_earning_amount_rate_data1 = [] ;
													var inc_earning_amount_rate_data2 = [] ;
													var inc_earning_amount_rate_data3 = [] ;

													for(var a = 0 ; a < cnt ; a++){
														var igv7223p = eval('data.list[i].tab2Chart_' + data.list[i].FundCd)[a] ;
														
														var ZRN_STD_DT		= $.util.dateFormat($.util.trim(igv7223p.ZRN_STD_DT), 'yyyy-MM-dd');
														var A_PRFT_1_RATE 	= $.util.toFloat($.util.trim(igv7223p.A_PRFT_1_RATE)); /* 펀드수익율 */
														var A_PRFT_3_RATE 	= $.util.toFloat($.util.trim(igv7223p.A_PRFT_3_RATE)); /* 동일유형평균 */
														var A_STNG_AMNT1 	= $.util.toFloat($.util.trim(igv7223p.A_STNG_AMNT1));

														A_PRFT_1_RATE = isNaN(A_PRFT_1_RATE) ? 0 : A_PRFT_1_RATE;
														A_PRFT_3_RATE = isNaN(A_PRFT_3_RATE) ? 0 : A_PRFT_3_RATE;
														A_STNG_AMNT1  = isNaN(A_STNG_AMNT1)  ? 0 : A_STNG_AMNT1;

														inc_earning_amount_rate_xname.push(ZRN_STD_DT);
														inc_earning_amount_rate_data1.push(A_PRFT_1_RATE);
														inc_earning_amount_rate_data2.push(A_STNG_AMNT1);
														inc_earning_amount_rate_data3.push(A_PRFT_3_RATE);
													}

													$.fundList.drawFundChart(data.list[i].FundCd , inc_earning_amount_rate_xname, inc_earning_amount_rate_data1, inc_earning_amount_rate_data2, inc_earning_amount_rate_data3, '0') ;

												}

											} /**	차트 - tab2	*/
										}
									}

									$("#classFund_"+ FundCd).addClass("open") ;
									_common.reinit_ui();

								}
							}
						}) ;
					}
				}
			}/**	loadClassFund - 클래스 펀드 open		*/ , 
			
			step2Chart : function(FUNDCD, vote){
				
				var $f = $.form("fundSearchFrm") ;
				
				$f.val("FUNDCD" , FUNDCD) ; 
				
				$.cs.ajax({
					type     			: 'post',
		            url      			: '/ux/kor/finance/fund/search/step2Chart.do',
		            loadingStart	: true,
					loadingEnd 		: true,
		            data     			: $f.toParameterString('', false),
		            dataType 		: 'json',
		            success  		: function(data) {
		            	if(typeof data.errorMsg != "undefined"){
							alert(data.errorMsg) ; 
							return ;
						}
		            	
						if(typeof data.list != "undefined"  && data.list.length > 0){

							$("#listChart" + vote+FUNDCD).show() ;
							$("#listButton" + vote+FUNDCD).hide() ;
							var cnt = data.list.length ;
							var inc_earning_amount_rate_xname = [] ;
		        			var inc_earning_amount_rate_data1 = [] ; 
		        			var inc_earning_amount_rate_data2 = [] ; 
		        			var inc_earning_amount_rate_data3 = [] ; 
		        			for(var a = 0 ; a < cnt ; a++){
		        				
		        				var igv7223p = data.list[a] ; 
		        				
		        				var ZRN_STD_DT		= $.util.dateFormat($.util.trim(igv7223p.ZRN_STD_DT), 'yyyy-MM-dd');
		        				var A_PRFT_1_RATE 	= $.util.toFloat($.util.trim(igv7223p.A_PRFT_1_RATE)); /* 펀드수익율 */
		        				var A_PRFT_3_RATE 	= $.util.toFloat($.util.trim(igv7223p.A_PRFT_3_RATE)); /* 동일유형평균 */
		        				var A_STNG_AMNT1 	= $.util.toFloat($.util.trim(igv7223p.A_STNG_AMNT1));  
		        				
		        				A_PRFT_1_RATE = isNaN(A_PRFT_1_RATE) ? 0 : A_PRFT_1_RATE;
		        				A_PRFT_3_RATE = isNaN(A_PRFT_3_RATE) ? 0 : A_PRFT_3_RATE;
		        				A_STNG_AMNT1  = isNaN(A_STNG_AMNT1)  ? 0 : A_STNG_AMNT1;
		        				
		        				inc_earning_amount_rate_xname.push(ZRN_STD_DT);
		        				inc_earning_amount_rate_data1.push(A_PRFT_1_RATE);
		        				inc_earning_amount_rate_data2.push(A_STNG_AMNT1);
		        				inc_earning_amount_rate_data3.push(A_PRFT_3_RATE);
		        			}
		        			
		        			$.fundList.drawFundChart(FUNDCD , inc_earning_amount_rate_xname, inc_earning_amount_rate_data1, inc_earning_amount_rate_data2, inc_earning_amount_rate_data3 , vote) ;
		        			
		        			_common.reinit_ui();
						}

					}
				}) ;
			}/**	step2Chart -  차트 그리기 버튼 선택 시 	*/ ,

			step6Chart : function(FUNDCD){
				
				var $f = $.form("fundSearchFrm") ;

				$f.val("FUNDCD" , FUNDCD) ;

				$.cs.ajax({
					type     			: 'post',
					url      			: '/ux/kor/finance/fund/search/step6Chart.do',
					loadingStart	: true,
					loadingEnd		: true,
					data     			: $f.toParameterString('', false),
					dataType 		: 'json',
					success  		: function(data) {
						
						$("#listChartTab6" + FUNDCD).show() ;
						$("#listButtonTab6" + FUNDCD).hide() ;
						
						if(typeof data.errorMsg != "undefined" ){
							alert(data.errorMsg) ;
							$("#listChartTab6" + FUNDCD).append($.msg.NO_QUERY_RESULT) ;
							return ;
						}

						if(typeof data.outRec1 != "undefined" ){

							var ZRN_STOCK_WG = BondUtil.to_percent($.util.trim(data.outRec1.ZRN_STOCK_WG)) ;
							var ZRN_BOND_WG = BondUtil.to_percent($.util.trim(data.outRec1.ZRN_BOND_WG)) ;
							var ZRN_CASH_WG = BondUtil.to_percent($.util.trim(data.outRec1.ZRN_CASH_WG)) ;
							var ZRN_ETC_WG = BondUtil.to_percent($.util.trim(data.outRec1.ZRN_ETC_WG)) ;

							var str = '' ;

							str +='	<div class="stick_bar">' ;
							str +='		<div class="diagram">' ;
							str +='			<span class="case1" style="width:'+ZRN_STOCK_WG+'%"></span>' ;
							str +='			<span class="case2" style="width:'+ZRN_BOND_WG+'%"></span>' ;
							str +='			<span class="case3" style="width:'+ZRN_CASH_WG+'%"></span>' ;
							str +='			<span class="case4" style="width:'+ZRN_ETC_WG+'%"></span>' ;
							str +='		</div>' ;
							str +='		<div class="unit">' ;
							str +='			<dl class="case1">' ;
							str +='				<dt>주식</dt>' ;
							str +='				<dd>'+ZRN_STOCK_WG+'%</dd>' ;
							str +='			</dl>' ;
							str +='			<dl class="case2">' ;
							str +='				<dt>채권</dt>' ;
							str +='				<dd>'+ZRN_BOND_WG+'%</dd>' ;
							str +='			</dl>' ;
							str +='			<dl class="case3">' ;
							str +='				<dt>유동성</dt>' ;
							str +='				<dd>'+ZRN_CASH_WG+'%</dd>' ;
							str +='			</dl>' ;
							str +='			<dl class="case4">' ;
							str +='				<dt>기타</dt>' ;
							str +='				<dd>'+ZRN_ETC_WG+'%</dd>' ;
							str +='			</dl>' ;
							str +='		</div>' ;
							str +='	</div>' ;
							$("#listChartTab6" + FUNDCD).append(str) ;
							_common.reinit_ui();
						}else{
							$("#listChartTab6" + FUNDCD).append($.msg.NO_QUERY_RESULT) ;
						}

					}
				}) ;
			}/**	step2Chart -  차트 그리기 버튼 선택 시 	*/ ,
			/* fund 비교 */
			fundCompare :function(_this) {
				var totalValue = $.fundList.selectFundList;
				var cnt = $.fundList.selectFundListCount;
			
				if (cnt == 0) {
					alert("비교상품을 선택해주세요. 비교는 2개 이상부터 가능합니다.");
					return;
				}
				
			    if(cnt > 4) {
			        alert('비교는 최대 4개까지 가능합니다.');
			        return;
			    }
				
				_common.showDetailLayerPopup("/ux/kor/finance/fund/compare/compareList.do?fundCds="+totalValue, "showPdtCompLayer",_this);
				
			}/*//fund 비교 */ , 
			
			checkMutual : function(thisObj){
				var orderColumn = '' ;
				if(thisObj.checked){
					if(!confirm("‘해외뮤추얼’은 다른 조건과 함께 검색할 수 없습니다. \n‘해외뮤추얼’로만 검색하시겠습니까?")){
						$(thisObj).prop("checked" , false) ;
						return ; 
					}else{
						$('#FUNDLISTDIV').hide() ; 
						$('#NOTFUNDLISTDIV').show() ;
						$('.ui-slider').addClass('disabled'); // slide 비활성화
						
						clearSearch("1") ; 
						
						$('.ui-slider').slider('disable');
						$('.rangeShoe span').removeClass('on'); //규모 이미지 클래스 제거
						$('#fundSearchFrm').find('input:checkbox, input:radio').each(function(idx) { //체크박스,라디오 비활성
							    $(this).prop('checked', false);
							    $(this).prop('disabled', true);
				        });
						
						$(thisObj).prop("checked" , true) ;
						$(thisObj).prop("disabled" , false) ;
						orderColumn = 'AnnYieldOrd' ;
						
					}
				}else{
					$('.ui-slider').removeClass('disabled'); // slide 활성화
					$('.rangeShoe span').addClass('on'); //규모 이미지 클래스 추가
					$('#fundSearchFrm').find('input:checkbox, input:radio').each(function(idx) { //체크박스,라디오 비활성
						$(this).prop('disabled', false);
					});
					
					clearSearch("1") ;
					$('.ui-slider').slider('enable');
					$('#FUNDLISTDIV').show() ; 
					$('#NOTFUNDLISTDIV').hide() ; 
					/*$("#tab1").click() ;  
					$('[id^=tab]').removeClass() ;*/
					
					for(var i = 1 ; i <= 7 ; i++){
						if($("#tab" + i).hasClass('on')) $("#tab" + i).removeClass('on') ;
					}
					
					$("#tab1").addClass('on') ;
					orderColumn = 'YIELD_3M' ;
					
				}
				$.fundList.OrderSearch(orderColumn) ;
			} , 
			
			checkBuyFund : function(){
				if($.fundList.selectFundList == ""){
					alert("구매하실 상품을 선택해 주세요.") ; 
					return ;
				}
				
				if($.fundList.selectFundListCount > 30){
					alert("펀드는 최대 30건까지만 일괄구매가능합니다.") ; 
					return ;
				}
				
				var $f = $.form("fundSearchFrm") ;
				var param = $f.val("pension") ;
				try{
					var gaLogArr = [];
					var arrFund = $.fundList.selectFundList.split("@");
					for(var i=0;i<arrFund.length;i++){
						$("#"+arrFund[i]).attr('fund_type1');
						$("#"+arrFund[i]).attr('fund_type2');
						$("#"+arrFund[i]).attr('fund_name');
						
						var variant = "펀드";
						var dim19 = "FUND";
						
						//개인연금 메뉴 코드 셋팅 - 개인연금찾기, 장바구니, 신규매수, 추가매수, 매도/해지 
						if(param == 'pension'){
							variant = "개인연금펀드";
							dim19 = "P_FUND";
						}
						
						var brand = $("#"+arrFund[i]).attr('fund_type1')+' '+$("#"+arrFund[i]).attr('fund_type2');
						gaLogArr.push({
							'id':arrFund[i],
							'name':$("#"+arrFund[i]).attr('fund_name'),
							'brand':brand.trim(),
							'variant':variant,
							'category':$("#"+arrFund[i]).attr('fund_type1'),
							'dimension19':dim19,
							'metric1':1
						});
					}
					
					dataLayer.push({
						'event':'Checkout1',
						'label':'펀드찾기_신규매수',
						'ecommerce':{
							'checkout':{
								'actionField':{'step':1},
								'products':gaLogArr
							}
						}
					});
				}catch(e){}
				if(param=="pension"){
					_common.buyPensionFund($.fundList.selectFundList) ;
				}else{
					if($.fundList.forLayer == "") _common.buyFund($.fundList.selectFundList) ;
					else parent._common.buyFund($.fundList.selectFundList) ;
				}
			} , 
			
			checkInterFund : function(_this){
				var $f = $.form("fundSearchFrm") ;
				var param = $f.val("pension") ;
				
				if($.fundList.selectFundList == ""){
					alert("장바구니에 담을 상품을 선택해 주세요.") ; 
					return ;
				}
				n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID=M1439183172570&ACTION_ID=IN01&ITEM_CD='+$.fundList.selectFundList+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
				if(param=="pension"){
					_common.interPensionFund($.fundList.selectFundList,param,_this) ;
				}else{
					if($.fundList.forLayer == "") _common.interFund($.fundList.selectFundList,'',_this) ;
					else parent._common.interFund($.fundList.selectFundList,'',_this) ;
				}
			} , 
			
			checkInterFundBtnLayer : function(_this, btnLayer){
				var $f = $.form("fundSearchFrm") ;
				var param = $f.val("pension") ;
				if($.fundList.selectFundList == ""){
					alert("장바구니에 담을 상품을 선택해 주세요.") ; 
					return ;
				}
				n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID=M1439183172570&ACTION_ID=IN01&ITEM_CD='+$.fundList.selectFundList+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
				if(param=="pension"){
					_common.interPensionFundBtnLayer($.fundList.selectFundList,param,_this,btnLayer) ;
				}else{
					if($.fundList.forLayer == "") _common.interFundBtnLayer($.fundList.selectFundList,'',_this,btnLayer) ;
					else parent._common.interFundBtnLayer($.fundList.selectFundList,'',_this,btnLayer) ;
				}
			} , 
			
			interFund : function(FUND_CODE,_this){
				var $f = $.form("fundSearchFrm") ;
				var param = $f.val("pension") ;
				
				if(param=="pension"){
					n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID=M1439183172570&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=&pansion=pansion');
					_common.interPensionFund(FUND_CODE,param ,'' ,_this) ;
				}else{
					n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID=M1439183172570&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
					_common.interFund(FUND_CODE,_this) ;
				}
			} ,
			
			interFundBtnLayer : function(FUND_CODE,_this,btnLayer){
				var $f = $.form("fundSearchFrm") ;
				var param = $f.val("pension") ;
				
				if(param=="pension"){
					n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID=M1439183172570&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=&pansion=pansion');
					_common.interPensionFundBtnLayer(FUND_CODE,param,_this,btnLayer) ;
				}else{
					n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID=M1439183172570&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
					_common.interFundBtnLayer(FUND_CODE,'',_this,btnLayer) ;
				}
			} ,
			
			interFundParent : function(FUND_CODE,_this){
				n_click_logging('/ux/kor/finance/fund/search/list.do?MENU_ID=M1439183172570&ACTION_ID=IN01&ITEM_CD='+FUND_CODE+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
				parent._common.interFund(FUND_CODE,_this) ;
			} , 
			
			recommSearch : function(){
				$('#tkdvna01').prop('checked' , true);
				$.fundList.loadList(true) ; 
			} , 
			
			checkThem : function(){
				
				var checkFlag = false ; 
				
				$("input:checkbox[name=ThemeFlag]").each(function(){
					if($(this).is(":checked")){
						checkFlag = true ; 
					}
				}) ;
				
				if(checkFlag){
					if(!$('#Grop').hasClass("cursorDefault")) $('#Grop').addClass("cursorDefault") ;
					$('#Grop').attr("href" , "javascript:_common.nothing();") ; 
				}else{
					if($('#Grop').hasClass("cursorDefault")) $('#Grop').removeClass("cursorDefault") ;
					$('#Grop').attr("href" , "javascript:$.fundList.loadGrop('Y');") ;
				}
				
			},
			buyFund : function(code){
				var $f = $.form("fundSearchFrm") ;
				var param = $f.val("pension") ;
				try{
					var gaLogArr = [];
					$("#"+code).attr('fund_type1');
					$("#"+code).attr('fund_type2');
					$("#"+code).attr('fund_name');
					
					var variant = "펀드";
					var dim19 = "FUND";
					
					//개인연금 메뉴 코드 셋팅 - 개인연금찾기, 장바구니, 신규매수, 추가매수, 매도/해지 
					if(param == 'pension'){
						variant = "개인연금펀드";
						dim19 = "P_FUND";
					}
					
					var brand = $("#"+code).attr('fund_type1')+' '+$("#"+code).attr('fund_type2');
					gaLogArr.push({
						'id':code,
						'name':$("#"+code).attr('fund_name'),
						'brand':brand.trim(),
						'variant':variant,
						'category':$("#"+code).attr('fund_type1'),
						'dimension19':dim19,
						'metric1':1
					});
					
					dataLayer.push({
						'event':'Checkout1',
						'label':'펀드찾기_신규매수',
						'ecommerce':{
							'checkout':{
								'actionField':{'step':1},
								'products':gaLogArr
							}
						}
					});
				}catch(e){}
				if(param=="pension"){
					_common.buyPensionFund(code) ;
				}else{
					if($.fundList.forLayer == "") _common.buyFund(code) ;
					else parent._common.buyFund(code) ;
				}
			}
			
	};	/**	$.fundList	*/

})();

$(function () {
	$(".btnLarge").each(function () {
		if ($(this).text().contains("검색")) {
			$(this).on("click.scroll", function () {
				$('html,body').animate({
					  scrollTop: $('#tab1').offset().top
				}, 500);
			});
		}
	});
});