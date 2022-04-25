var BondUtil={
		/**
		 * 자릿수 만큼 소수점 버림
		 *
		 * @param	{String} 	value
		 * @return	{Number}	fixed 음수는 처리안됨.
		 *
		 * @usage	to_percent(23.129,2) -> output : '23.12'
		 */
		to_percent:function(value, fixed) {

			var rst = '';
			var temp3 = "";
			var _value = value;

			if($.util.isEmpty(value)){		//공백이면 공백리턴
				return '';
			}

			value = value+"";

			temp3 = parseFloat(value)<0?"-":"";

			if(temp3 != ""){
				value = value.substring(1);
			}

			value = $.util.removeFirstZero($.trim(value));	//'00000' 올때 공백리턴

			if($.util.isEmpty(value)){ 	return '0';	 }	//0리턴
			if(value.charAt(0)=="."){
				value = "0"+value;
			}

			if ($.util.isEmpty(fixed)) {
				fixed = 2;
			}

			if (value.indexOf('.') > -1) {

				var temp1 = value.substring(0, value.indexOf('.'));
				var temp2 = value.substring(value.indexOf('.') + 1);

				if(fixed == 0){
					rst = $.util.isEmpty(temp1) ? '0' : temp3+$.util.numberFormat(temp1);
				}else if (temp2.length >= fixed) {
					rst = ($.util.isEmpty(temp1) ? '0' : temp3+$.util.numberFormat(temp1)) + '.' + temp2.substring(0, fixed);
				} else {
					rst = _value;
				}
			} else {
				rst = temp3+$.util.numberFormat(value);
			}

			return rst;
		},

		/**
		 * 날짜 반환
		 *
		 * @param	{String, Number} 	value
		 * @return	{Number}			fixed
		 *
		 * @usage	to_percent(20020101) -> output : '2002-01-01'
		 */
		to_date:function(value){
			return  $.util.dateFormat($.trim(value));
		},

		to_time:function(value){

			var time = $.trim(value);

			if(time.indexOf(":") == -1){

				time = time.substring(0,2) + ":" + time.substring(2);
			}

			return  time;
		},

		/**
		 * 일자가 현재일로 부터 한달이전여부 반환
		 *
		 * @param	{String} 	date
		 * @return	{Boolean}	true/false
		 *
		 * @usage	is_newBond('19950101') -> output : false
		 */
		is_newBond:function(date){
			date = $.trim(date);

			var nowDate = $.cs.util.dateFormat(new Date, 'yyyyMMdd');
			var dt 		= new Date();
			var year 	= date.substring(0,4);
			var month 	= date.substring(4,6);
			var day 	= date.substring(6,8);

			dt.setFullYear(year);
			dt.setMonth(month );		// add 1 month
			dt.setDate(day);

			return ( nowDate <=  $.cs.util.dateFormat( dt, 'yyyyMMdd') );
		},

		is_wishYn:function(value){
			return ( value == "Y" );
		},

		/**
		 * '수익율' 숫자형 반환
		 *
		 * @param	{String, Number} 	value
		 * @return	{Number}			fixed
		 *
		 * @usage	to_percent(23.129,2) -> output : '23.12'
		 */
		to_prftRate:function(value){
			var rst = "";

			rst = BondUtil.to_percent(value,3);

			if( rst > 0 ){
				//rst = '<em class="up" title="상승">'+rst+'%</em>';
				rst = '<span class="rise" title="상승">'+rst+'%</span>';
			}else if( rst < 0 ){
				//rst = '<em class="down" title="하락">'+rst+'%</em>';
				rst = '<span class="drop" title="하락">'+rst+'%</span>';
			}else{
				//rst = '<em class="noChange" title="보합">'+rst+'%</em>';
				rst = '<span class="keep" title="보합">'+rst+'%</span>';
			}

			return rst;
		},

		/**
		 * '대비' 숫자형, 등락 반환
		 *
		 * @param	{String, Number} 	value
		 *
		 * @usage	to_change(-22) -> output : <span class="down" title="하락">-22</span>
		 */
		to_change:function(value, subFix){
			var rst = "";
			var text = "";

			if( subFix == null || subFix.length <= 0 ){
				subFix = "";
			}

			var tmp1 = '', tmp2 = '';
			if ($.util.toInt(value) > 0) {
				//tmp1 = 'up';
				tmp1 = 'rise';
				tmp2 = '상승';
				text = '<var>' + $.util.numberFormat(value.replace("-","")) + subFix +'</var>';
			} else if ($.util.toInt(value) < 0) {
				//tmp1 = 'down';
				tmp1 = 'drop';
				tmp2 = '하락';
				text = '<var>' + $.util.numberFormat(value.replace("-","")) + subFix +'</var>';
			} else {
				//tmp1 = 'noChange';
				//tmp1 = 'keep';
				tmp2 = '보합';
				text = $.util.numberFormat(value.replace("-","")) + subFix;
			}

			return '<p class="' + tmp1 + '">'+text+'</p>';
		},

		/**
		 * '대비' 숫자형, 등락 반환
		 *
		 * @param	{String, Number} 	value
		 *
		 * @usage	to_change2(-22) -> output : <span class="down" title="하락">-22</span>
		 */
		to_change2:function(value){
			return '<p style="display:none">' + $.util.numberFormat(value) +'</p>';
		},

		/**
		 * '매매 금리' 숫자형 반환
		 *
		 * @param	{String, Number} 	value
		 * @return	{Number}			fixed
		 *
		 * @usage	to_percent(23.00129,2) -> output : '23.001'
		 */
		to_dlngRate:function(value){
			var rst = "";
			var fixLength = arguments[1] || 3;

			value = $.util.removeFirstZero($.trim(value));

			if( value == null && value.length <= 0 ){
				return "";
			}

			rst = Math.floor(value*10000)/10000;
			rst = rst.toFixed(fixLength);

			if( rst > 0 ){
				//rst = '<em class="up" title="상승">'+rst+'%</em>';
				rst = '<span class="rise" title="상승">'+rst+'%</span>';
			}else if( rst < 0 ){
				//rst = '<em class="down" title="하락">'+rst+'%</em>';
				rst = '<span class="drop" title="하락">'+rst+'%</span>';
			}else{
				//rst = '<em class="noChange" title="보합">'+rst+'%</em>';
				rst = '<span class="keep" title="보합">'+rst+'%</span>';
			}

			return rst;
		},
		to_dlngRate1:function(value){
			var rst = "";
			var fixLength = arguments[1] || 3;

			value = $.util.removeFirstZero($.trim(value));

			if( value == null && value.length <= 0 ){
				return "";
			}

			rst = Math.floor(value*10000)/10000;
			rst = rst.toFixed(fixLength);

			if( rst > 0 ){
				rst = '<span class="up" title="상승">'+rst+'%</span>';
			}else if( rst < 0 ){
				rst = '<span class="down" title="하락">'+rst+'%</span>';
			}else{
				rst = '<span class="noChange" title="보합">'+rst+'%</span>';
			}

			return rst;
		},
		sub_zero:function(value){
			var rst = $.util.removeFirstZero($.trim(value));

			if( $.trim(value) == "0" || rst == "" ){
				return "0";
			}else{
				return rst;
			}
		},

		sub_minus:function(value){
			return $.trim(value).replace("-","");
		},

		/**
		 * convert-number-type (include ',')
		 *
		 * @param	{String, Number} value
		 * @return	{String}
		 *
		 * @usage	to_cash(1000) -> output : '1,000'
		 */
		to_cash:function(value){
			var output;
			/**
			 * 소수점처리 추가 (2014.04.08)
			 */
			if(String(value).indexOf('.')!=-1){
				var values=String(value).split('.');
				/**
				 * 소수점 이하 삭제
				 * output=String((Number(values[0]) || 0)+'.'+Number(values[1]));
				 */
				output=String((Number(values[0]) || 0));

			}else{
				output=String(Number(value));
			};

			var reg=/(^[+-.]?\d+)(\d{3})/;
			output+='';

			while(reg.test(output)){
				output=output.replace(reg, '$1'+','+'$2');
			};

			return output;
		},

		/**
		 * 숫자 소수점 변환 (키입력용)
		 *
		 * @param	{String, Number} value
		 * @return	{String}
		 *
		 * @usage	to_cash_keyinput(1000) -> output : '1,000'
		 */
		to_cash_keyinput:function(value) {

			var output = String(value).replace(/[^0-9]/g, '');

			var reg=/(^[+-.]?\d+)(\d{3})/;
			while(reg.test(output)){
				output = output.replace(reg, '$1'+','+'$2');
			};

			return output;
		},
		to_bond_ISUS_RDMN_PRIC_AMNT:function(value){		//. 다음에 오는 0 짤림 String(Number(values[1])) 오류  to_percent로 변경

			return BondUtil.to_percent(value,5);

//			var output;
//			/**
//			 * 소수점처리 추가 (2014.04.08)
//			 */
//			if(String(value).indexOf('.')!=-1){
//				var values=String(value).split('.');
//
//				if( Number(values[1]) != 0 ){
//					output=String((Number(values[0]) || 0)+'.'+String(Number(values[1])).substring(0, 5));
//				}else{
//					output=String((Number(values[0]) || 0));
//				}
//
//			}else{
//				output=String(Number(value));
//			};
//
//			var reg=/(^[+-.]?\d+)(\d{3})/;
//			output+='';
//
//			while(reg.test(output)){
//				output=output.replace(reg, '$1'+','+'$2');
//			};
//
//			return output;
		},

		to_number:function(value){
			if( value == null || value.length <= 0  ){
				return "";
			}

			return Number($.util.replaceAll($.util.removeFirstZero($.trim(value)),',',''));
		},

		/**
		 * Y 여부 반환
		 *
		 * @param	{String} 	"Y"/"N"
		 * @return	{String}	true/false
		 *
		 * @usage	is_y("Y") -> output : true
		 */
		is_y:function(value){
			var output;

			value = $.trim(value);

			if( value == "Y" || value == "y" ){
				output = true;
			}else{
				output = false;
			}

			return output;
		},

		get_yn:function(value){
			var output;

			value = $.trim(value);

			if( value == null || value.length <= 0 ){
				output = "";
			}else if( value == "N" ){
				output = "불가능";
			}else{
				output = "가능";
			}

			return output;
		},
		get_yn2:function(value){
			var output;

			value = $.trim(value);

			if( value == null || value.length <= 0 ){
				output = "";
			}else if( value == "Y" ){
				output = "있음";
			}else{
				output = "없음";
			}

			return output;
		},
		get_yn3:function(value){
			var output ="";

			value = $.trim(value);

			if( value == "N" || value == "n" ){
				output = "<em>N</em>";
			}else if( value == "Y" || value == "y" ){
				output = "<strong>Y</strong>";
			}

			return output;
		},



		get_PRDT_RTNG_TYPE_CODE:function(value){
			var output;

			value = $.trim(value);

			if( value == null || value.length <= 0 ){
				output = "";
			}else if( value == "1" ){
				output = "초저위험";
			}else if( value == "2" ){
				output = "저위험";
			}else if( value == "3" ){
				output = "중위험";
			}else if( value == "4" ){
				output = "고위험";
			}else if( value == "5" ){
				output = "초고위험";
			}else{
				output = "알수 없음";
			}

			return output;
		},

		to_JNR_TYPE_CODE:function(value){
			var output;

			value = $.trim(value);

			if( value == "0" ){
				output = "선순위";
			}else{
				output = "후순위";
			}

			return output;
		},

		/**
		 * 잔존기간의 년/개월의 0 삭제
		 *
		 * @param	{String} 	잔존기간
		 * @return	{Boolean}	잔존기간
		 *
		 * @usage	get_A_RMN_MMS_NAME('01년06개월') -> output : 1년6개월
		 */
		get_A_RMN_MMS_NAME:function(value){
//			return BondUtil.sub_zero($.trim($.util.replaceAll(value, "00년", ""))).replace("0", " ");
//			return BondUtil.sub_zero($.trim($.util.replaceAll(value, "00년", "")));

			if($.util.isEmpty(value)){
				return "";
			}

			var values = $.trim(value).split(" ");
			if(values.length > 1 ){
				return BondUtil.sub_zero($.trim($.util.replaceAll(values[0], "00년", "")))+" "+BondUtil.sub_zero($.trim($.util.replaceAll(values[1], "00개월", "")));
			}else{
				return BondUtil.sub_zero($.trim($.util.replaceAll(value, "00년", "")));
			}
		},

		/**
		 * 잔존기간 정렬용 데이터
		 *
		 * @param	{String} 	잔존기간
		 * @return	{Boolean}	잔존기간
		 *
		 * @usage	get_A_RMN_MMS_NAME('01년06개월') -> output : 1년6개월
		 */
		get_A_RMN_MMS_NAME2:function(value){
			return '<p style="display:none">' + $.trim(value) +'</p>';
		},


		get_BOND_LSTG_TYPE_CODE:function(value){
			var output;

			value = $.trim(value);

			if( value == null || value.length <= 0 ){
				output = "";
			}else if( value == "1" ){
				output = "비상장";
			}else if( value == "2" ){
				output = "상장";
			}else if( value == "3" ){
				output = "보통거래정지";
			}else if( value == "4" ){
				output = "코드변경폐지";
			}else if( value == "9" ){
				output = "상장폐지";
			}else{
				output = "알수 없음";
			}

			return output;
		},
		get_JNR_TYPE:function(value){
			var output;

			value = $.trim(value);

			if( value == null || value.length <= 0 ){
				output = "";
			}else if( value == "0" ){
				output = "선순위";
			}else{
				output = "후순위";
			}

			return output;
		},
		get_ARS_LARG_CLSN_CODE:function(value){
			var output;

			value = $.trim(value);

			if( value == null || value.length <= 0 ){
				output = "";
			}else if( value == "01" ){
				output = "국채";
			}else if( value == "02" ){
				output = "지역채";
			}else if( value == "03" ){
				output = "특수채";
			}else if( value == "04" ){
				output = "금융채";
			}else if( value == "05" ){
				output = "회사채";
			}else{
				output = "알수 없음";
			}

			return output;
		},
		get_KIS_CRDT_RTNG_CODE:function(value){
			var output;

			value = $.trim(value);
//			if( value == "0000" || value == null || value.length <= 0 ){
			if( value == "0000" || value == ""){		// pga1005p : 0000, pga1003p: ""
				//output = "무위험";
				output = "-";
				//output = "";
			}else{
				output = value;
			}

			return output;
		},
		// 장내채권 > 서신평신용등급코드
		get_SCI_CRDT_RTNG_CODE:function(value, iscd){
			var chkVal = $.trim(value);
			var _iscd = $.trim(iscd);
			var _tempIscd = _iscd.substring(0,3);
			//([KR1], [KR2], [KR3101], [KRC]))
			if(_tempIscd == "KR3"){
				if(_iscd.substring(0,5) == "KR310" && chkVal == ""){
					chkVal = "0000";
				}
			} else if ((_tempIscd == "KR1" || _tempIscd == "KR2" || _tempIscd == "KRC") && chkVal == ""){
					chkVal = "0000";
			}

			var output;

			if( chkVal == "0000"){		// FID 서비스(list) && aigp011pVO(view)
				output = "무위험";
			}else{
				output = chkVal;
			}

			return output;
		},
		get_KIS_CRDT_RTNG_CODE_Temp:function(value, txt){
			var output;

			value = $.trim(value);
//			if( value == "0000" || value == null || value.length <= 0 ){
			if( value == "0000" || value == ""){		// pga1005p : 0000, pga1003p: ""
				output = "-";
				//output = "";
				if(txt == "국채" || txt == "지역채" || txt == "통안채"){
					output ="무위험";
				}
			}else{
				output = value;
			}

			return output;
		},
		get_BOND_OPTS_SECT_CODE:function(value){
			var output;

			value = $.trim(value);

			if( value == null || value.length <= 0 ){
				output = "";
			}else if( value == "0" ){
				output = "일반";
			}else if( value == "1" ){
				output = "Call";
			}else if( value == "2" ){
				output = "Put";
			}else if( value == "3" ){
				output = "Call+Put";
			}else{
				output = "알수 없음";
			}

			return output;
		},

		get_TXTN_SECT_CODE:function(value){
			var output;

			value = $.trim(value);

			if( value == "1" ){
				output = "종합";
			}else if( value == "2" ){
				output = "분리";
			}else{
				output = "알수 없음";
			}

			return output;
		},

		get_PSTN_UNIT_NO:function(value){
			var output;

			value = $.trim(value);

			if( value == "1" ){
				output = "장부가";
			}else if( value == "2" ){
				output = "시가";
			}else{
				output = "알수 없음";
			}

			return output;
		},


		get_none:function(value){
			var output;

			value = $.trim(value);

			if( value == null || value.length <= 0 ){
				output = "없음";
			}else{
				output = value;
			}

			return output;
		},

		trim:function(value){
			return $.trim(value);
		},

		/**
		 * 개인 법인 구분
		 *
		 * @param	{Number} 	_code	1:개인, 2:법인
		 *
		 * @usage	get_persCorp('1')
		 */
		get_persCorp:function( _code ){
			var output;

			_code = $.trim(_code);

			if( _code == "1" ){
				output = "개인";
			}else if( _code == "2" ){
				output = "법인";
			}else{
				output = "알수 없음";
			}

			return output;
		},

		/**
		 * 장외채권매매 매수가능금액 조회
		 *
		 * @param	{String, Number} 	acct
		 * @param	{String, Number} 	pw
		 * @param	{function} 	        callback
		 *
		 * @usage	searchBuyPossAmt('1234567890', 'xxxx', setAmt)
		 */
		searchBuyPossAmt:function(acct, pw, callback , frm) {
			
			var $f = $.form(frm) ; 
			$f.val('ACNT_PSWD_CRYP' , pw) ; 
			$.cs.ajax({
				url : '/ux/kor/finance/bond/outbondtrade/getBuyPossAmt.do',
				//data : param,
				data : $f.toParameterString('' , true) , 
				success : function(rtn){
					if (!$.util.isEmpty(rtn.errorMsg)) {
						alert(rtn.errorMsg);
					} else {
						if(typeof(callback) == "function") {
							callback(rtn.buyPossAmt);
							return;
						}
					}
				},
				loadingStart : true,
				loadingEnd : true
			});
		},

		searchBuyPossAmt2:function(frm,callback ) {
			
			var $f = $.form(frm) ; 
			$.cs.ajax({
				url : '/ux/kor/finance/bond/abstbondtrade/getBuyPossAmt.do',
				//data : param,
				data : $f.toParameterString('' , true) , 
				success : function(rtn){
					if (!$.util.isEmpty(rtn.errorMsg)) {
						alert(rtn.errorMsg);
					} else {
						if(typeof(callback) == "function") {
							callback(rtn.buyPossAmt);
							return;
						}
					}
				},
				loadingStart : true,
				loadingEnd : true
			});
		},		
		
		/**
		 * 관심상품 등록
		 *
		 * @param		boolean 		_isLogin	로그인 유무
		 * @param		String			_bondType 	( outBond:장외채권, inBond:장내채권 )
		 * @param		String			_ISCD		채권 상품코드
		 * @param		String			_myUrl 		로그인후 리다이렉트 할 URL
		 * @return		void
		 * @usage		goInBondSrh( $.form('frm'), outBondSrh )
		 * @callback 	callback( _code, _name){};
		 */
		goAddWish:function( _isLogin,  _bondType, _ISCD, _myUrl ) {
			var vThis		= this;
			var commdSectCd = "99";
			_isLogin = $.trim(_isLogin);
			var arg4 = (typeof(arguments[4]) != "undefined" && $.util.isEmpty(arguments[4]))?"":arguments[4];

			if( _isLogin == true || _isLogin == "true" || _isLogin == "TRUE"  ){
				if( _bondType == "outBond" ){
					commdSectCd = "11";
				}else if( _bondType == "inBond" ){
					commdSectCd = "12";
				}else{
					alert( "채권구분값을 확인하세요. "+ _bondType );
					return;
				}

				if( _ISCD == null ||  $.trim(_ISCD).length <= 0 ){
					alert( "상품코드를 확인하세요. "+ _ISCD );
					return;
				}

				$.cs.ajax({
					type : 'post',
					url : '/ux/kor/finance/bond/bondwish/addBasket.do',
					dataType : 'json',
					data : 'bondType=' + _bondType +"&ISCD="+ $.trim(_ISCD),
					success : function(data){
						logger.debug(data);
						if(!data.errorMsg.isEmpty()){
							alert(data.errorMsg);
							return;
						}

						if(confirm("장바구니에 등록되었습니다.\n지금 확인하시겠습니까?")){
							if( commdSectCd == "11"){			// 장외 채권 이동
								openMenu('M1397522516620',"/ux/kor/finance/bond/bondwish/basket.do?market=outMarket");
							}else if( commdSectCd == "12"){		// 장내 채권 이동
								openMenu('M1397522516620',"/ux/kor/finance/bond/bondwish/basket.do?market=inMarket&marketType="+arg4);
							}
						}
					},
					loadingStart : true,
					loadingEnd : true
				});
			}else{
				if(confirm("로그인 후 처리가능합니다.\n지금 로그인하시겠습니까?")){
					var menuCd = getMenuCode();
					openLogin('RETURN_MENU_CODE='+menuCd+'&RETURN_MENU_URL='+_myUrl);
				} else {
					return;
				}
			}
			return;
		},

		/**
		 * 관심상품 등록(다건)
		 *
		 * @param		boolean 		_isLogin	로그인 유무
		 * @param		String			_bondType 	( outBond:장외채권, inBond:장내채권 )
		 * @param		String			_ISCD		채권 상품코드
		 * @param		String			_myUrl 		로그인후 리다이렉트 할 URL
		 * @return		void
		 * @usage		goInBondSrh( $.form('frm'), outBondSrh )
		 * @callback 	callback( _code, _name){};
		 */
		goAddWishGroup: function( _isLogin,  _bondType, _ISCDs, _myUrl ) {
			var vThis		= this;
			var commdSectCd = "99";
			_isLogin = $.trim(_isLogin);
			var arg4 = (typeof(arguments[4]) != "undefined" && $.util.isEmpty(arguments[4]))?"":arguments[4];

			if(_isLogin == true || _isLogin == "true" || _isLogin == "TRUE"){
				if( _bondType == "outBond" ){
					commdSectCd = "11";
				}else if( _bondType == "inBond" ){
					commdSectCd = "12";
				}else{
					alert( "채권구분값을 확인하세요. "+ _bondType );
					return;
				}

				if( _ISCDs == null ||  _ISCDs.length <= 0 ){
					alert( "상품코드를 확인하세요. ");
					return;
				}

				$.each(_ISCDs, function(i){
					logger.debug("종목코드",_ISCDs[i]);
				})

				var failArr = new Array();
				$.cs.ajax({
					type : 'post',
					url : '/ux/kor/finance/bond/bondwish/addBasketGroup.do',
					dataType : 'json',
					data : 'bondType=' + _bondType +"&ISCDs="+ _ISCDs.join("|"),
					success : function(data){
						logger.debug("다건 좋아요 등록 ",data);
						if(!data.errorMsg.isEmpty()){
							alert(data.errorMsg);
							return;
						}

						if(data.result.length > 0){
							var total = 0;
							var success = 0;
							$.each(data.result, function(i, val){
								total ++;
								if(val.successYN == "Y"){
									success ++;
								}
							});

							if(success == 0){	//모두 실패
								alert("이미 장바구니에 등록된 상품들입니다.")
							} else if (success > 0 && total == success){
								if(confirm("장바구니에 등록되었습니다.\n지금 확인하시겠습니까?")){
									if( commdSectCd == "11"){			// 장외 채권 이동
										openMenu('M1397522516620',"/ux/kor/finance/bond/bondwish/basket.do?market=outMarket");
									}else if( commdSectCd == "12"){		// 장내 채권 이동
										openMenu('M1397522516620',"/ux/kor/finance/bond/bondwish/basket.do?market=inMarket&marketType="+arg4);
									}
								}
							} else if (success > 0 && total > success) {
								if(confirm("이미 장바구니에 등록된 상품을 제외한 상품이 등록되었습니다.\n지금 확인하시겠습니까?")){
									if( commdSectCd == "11"){			// 장외 채권 이동
										openMenu('M1397522516620',"/ux/kor/finance/bond/bondwish/basket.do?market=outMarket");
									}else if( commdSectCd == "12"){		// 장내 채권 이동
										openMenu('M1397522516620',"/ux/kor/finance/bond/bondwish/basket.do?market=inMarket&marketType="+arg4);
									}
								}
							}
						}
					},
					loadingStart : true,
					loadingEnd : true
				});
			}else{
				if(confirm("로그인 후 처리가능합니다.\n지금 로그인하시겠습니까?")){
					var menuCd = getMenuCode();
					openLogin('RETURN_MENU_CODE='+menuCd+'&RETURN_MENU_URL='+_myUrl);
				} else {
					return;
				}
			}
			return;
		},

		/**
		 * 관심상품 삭제
		 *
		 * @param		String			_bondType 	( outBond:장외채권, inBond:장내채권 )
		 * @param		String			_ISCD		채권 상품코드
		 * @param		String			_myUrl 		로그인후 리다이렉트 할 URL
		 * @return		void
		 */
		goRemoveWish:function( _bondType, _ISCDs) {
			var isLogin = window.isLogin();
			if(isLogin){
				$.cs.ajax({
					type : 'post',
					url : '/ux/kor/finance/bond/bondwish/removeBascket.do',
					dataType : 'json',
					data : 'bondType=' + _bondType +"&ISCDs="+ $.trim(_ISCDs),
					success : function(data){
						if(!data.errorMsg.isEmpty()){
							alert(data.errorMsg);
							return;
						}else{
							alert("삭제되었습니다.");
						}
					},
					loadingStart : true,
					loadingEnd : true
				});
			} else {
				alert('로그인 후 이용가능하십니다.');
			}
			return;
		},

		/**
		 * 상품 비교하기
		 *
		 * @param		Object			$chkObj		ex) $('input[name="tableRowChkBox"]')
		 * @param		String			_bondType 	( outBond:장외채권, inBond:장내채권 )
		 * @return		void
		 * @usage		goInBondSrh( $.form('frm'), outBondSrh )
		 * @callback 	callback( _code, _name){};
		 */
		goCompare:function($chkObj,  _bondType, srh,_this) {
			//var $tableRowChkBox = $('input[name="tableRowChkBox"]');
			var url	= "";
			var iscdArray = new Array();
			//var isOneItemCompare = this.isOneItemCompare( _bondType );
			var formNm = 'BondCompareFrm' + Math.floor((Math.random()*100000)+1);
			var chkCnt = 0;
			var duCnt = 0;

			$(document.createElement('form'))
			.attr('name', formNm)
			.attr('method', 'post')
			.appendTo($('body'));

			var $f = $.form(formNm);

			$f.empty("ISCDs");

			if($chkObj == null){
				alert("비교하실 채권을 선택해 주세요.");
				return;
			}

			if( _bondType == "outBond" ){
				url = "/ux/kor/finance/bond/outcompareinfo/compare.do";
			}else if( _bondType == "inBond" ){
				url = "/ux/kor/finance/bond/incompareinfo/compare.do";
			}

			$chkObj.each(function (){
				var iscd = $(this).closest('tr').data("iscd");

				if( $(this).prop('checked') ){
					iscdArray.push( iscd );
					chkCnt++;
				}
			});


			//	logger.debug("비교하기 종목코드 리스트", iscdArray)
			//	logger.debug("비교하기 종목코드 _bondType", _bondType)

			 if( iscdArray.length < 2 ){
				alert("비교상품을 선택해주세요. \n저장된 상품과의 비교는 2개 이상부터 가능합니다.");
				$f.empty("ISCDs");
			}else if( iscdArray.length > 4 ){
				alert("비교는 최대 4개까지 가능합니다.");
				$f.empty("ISCDs");
			}else{

				var checkCalledFrom = $('#compareLayer').data("calledBuyStyle") || '';
				$('#compareLayer').data("buyStyle", checkCalledFrom);
				$('#compareLayer').data("calledBuyStyle", '');

				var buyStyle = $('#compareLayer').data("buyStyle");
				var isStyle = buyStyle == '1' || buyStyle == '2' ? false : true;
				if(isStyle){
					BondUtil.setCompareCookies(iscdArray, _bondType, 'add');
				}

				var srhIn01 = srh || '';

				$f.val("ISCDs", iscdArray.join("|"));
				$f.val("srhIn01", srhIn01 );
				$f.action = url;

				$.cs.ajax({
					url : url,
					data : $f.toParameterString("",false),
					async : false,
					success : function(data){
						logger.debug('비교하기 데이터', data);
						if (!$.util.isEmpty(data.errorMsg)) {
							SSP.modalView.centerBox($('#compareLayer'));
							alert(data.errorMsg);
							return;
						} else {
							BondUtil.drawCompare(data.result, _bondType);
						}
						//$('#compareLayer').show();
						SSP.changeTab.init($('#compareTab'), $('#compareTab .targetArea > div.tabTarget'),0,[test1,test2]);		// 탭 초기화
						if(srhIn01 =='B'){
							$('.toggleTab.fl.smallToggle').find('li:eq(0)').addClass('on');
							$('.toggleTab.fl.smallToggle').find('li:eq(1)').removeClass('on');
						} else {
							$('.toggleTab.fl.smallToggle').find('li:eq(1)').addClass('on');
							$('.toggleTab.fl.smallToggle').find('li:eq(0)').removeClass('on');
						}
						SSP.modalView.centerBox($('#compareLayer'),_this);
						$('#compareLayer .searchTime').text(moment().format('YYYY-MM-DD HH:mm:ss'));
					},
					loadingStart : true,
					loadingEnd : true
				});
			}

		},

		/**
		 * 상품 비교하기 > 종목코드로 넘어오는 경우
		 *
		 * @param		Object			$chkObj		ex) $('input[name="tableRowChkBox"]')
		 * @param		String			_bondType 	( outBond:장외채권, inBond:장내채권 )
		 * @return		void
		 * @usage		goInBondSrh( $.form('frm'), outBondSrh )
		 * @callback 	callback( _code, _name){};
		 */
		goCompareToast:function(iscdArray,  _bondType, srh) {
			var url	= "";
			var formNm = 'BondCompareFrm' + Math.floor((Math.random()*100000)+1);

			$(document.createElement('form'))
			.attr('name', formNm)
			.attr('method', 'post')
			.appendTo($('body'));

			var $f = $.form(formNm);

			$f.empty("ISCDs");

			if(  iscdArray == null ){
				alert("비교할 종목을 확인 하시기 바랍니다.");
				return;
			}

			if( _bondType == "outBond" ){
				url = "/ux/kor/finance/bond/outcompareinfo/compare.do";
			}else if( _bondType == "inBond" ){
				url = "/ux/kor/finance/bond/incompareinfo/compare.do";
			}

			 if( iscdArray.length < 2 ){
				alert("비교상품을 선택해주세요. \n저장된 상품과의 비교는 2개 이상부터 가능합니다.");
				$f.empty("ISCDs");
			}else if( iscdArray.length > 4 ){
				alert("비교는 최대 4개까지 가능합니다.");
				$f.empty("ISCDs");
			}else{

				var checkCalledFrom = $('#compareLayer').data("calledBuyStyle") || '';
				$('#compareLayer').data("buyStyle", checkCalledFrom);
				$('#compareLayer').data("calledBuyStyle", '');

				var buyStyle = $('#compareLayer').data("buyStyle");
				var isStyle = buyStyle == '1' || buyStyle == '2' ? false : true;
				if(isStyle){
					BondUtil.setCompareCookies(iscdArray, _bondType, 'add');
				}

				var srhIn01 = srh || '';

				$f.val("ISCDs", iscdArray.join("|") );
				$f.val("srhIn01", srhIn01 );
				$f.action = url;

				$.cs.ajax({
					url : url,
					data : $f.toParameterString("",false),
					async : false,
					success : function(data){
						logger.debug('비교하기 데이터', data);
						if (!$.util.isEmpty(data.errorMsg)) {
							alert(data.errorMsg);
							return;
						} else {
							BondUtil.drawCompare(data.result, _bondType);
						}
						//$('#compareLayer').show();
						SSP.changeTab.init($('#compareTab'), $('#compareTab .targetArea > div.tabTarget'),0,[test1,test2]);		// 탭 초기화
						if(srhIn01 =='B'){
							$('.toggleTab.fl.smallToggle').find('li:eq(0)').addClass('on');
							$('.toggleTab.fl.smallToggle').find('li:eq(1)').removeClass('on');
						} else {
							$('.toggleTab.fl.smallToggle').find('li:eq(1)').addClass('on');
							$('.toggleTab.fl.smallToggle').find('li:eq(0)').removeClass('on');
						}
						SSP.modalView.centerBox($('#compareLayer'));
						$('#compareLayer .searchTime').text(moment().format('YYYY-MM-DD hh:mm:ss'));
					},
					loadingStart : true,
					loadingEnd : true
				});
			}
		},

		drawCompare: function(data, _bondType){
			var ISCDList = data.ISCDList;
			var rec1List = data.rec1List
			var rec2List = data.rec2List || data.list ;
			var wishYnList = data.wishYnList || '';
			var isCorpUser = data.isCorpUser || '';
			var smallYN = data.smallYN || '';
			var rec1ListSize = rec1List.length;

			var $tab = $('.tabTarget table tbody');
			var $colgroup = $('.tabTarget table colgroup');
			$colgroup.empty();
			// colgroup 상품비교갯수별 분기
			var colgroup = {
				4:"186",
				3:"248",
				2:"327"
			}

			$.each(rec1List, function(i){
				if(i == 0){
					$colgroup.append('<col style="width:136px;">');
				} else {
					$colgroup.append('<col style="width:'+colgroup[rec1ListSize]+';">');
				}
			});
			$colgroup.append('<col style="width:*;">');

			$tab.eq(0).find('tr').children(':not(th)').detach();
			$tab.eq(1).find('tr').children(':not(th)').detach();
			$tab.eq(2).find('tr').children(':not(th)').detach();

			var theadhtml 		= "";
			var isRecom 		= false;
			var isNew 			= false;
			var isSeparate 		= false;
			var iscd 			= '';
			var productNm		= '';
			var smallBondFlag   = false;

			$.each( rec1List , function( i, rec1 ){
				var rec2 =  rec2List[i]; logger.debug("에헴",rec2);
				var sYN = smallYN[i];	 logger.debug("sYN",sYN);
				var yild = null;
				var tempYild = null;
				var exchage = "원";

				if(_bondType == "outBond"){
					theadhtml 		= "";
					isRecom 		= (wishYnList[i] == "Y");					//
					isNew 			= BondUtil.is_newBond(rec1.issd_DATE);		// 발행일자
					isSeparate 		= BondUtil.is_y(rec1List[i].sprn_TXTN_YN);	// 만기일자

					theadhtml += '<div class="hgroup" >';
					theadhtml += '<ul class="icon-list">';

					if( isRecom ){
						theadhtml += '<li class="recom">추천</li>';
					}else{
						theadhtml += '<li class="blank"></li>';
					}

					if( isNew ){
						theadhtml += '<li class="new">신규</li>';
					}else{
						theadhtml += '<li class="blank"></li>';
					}

					if( isSeparate ){
						theadhtml += '<li class="separate">분리과세</li>';
					}else{
						theadhtml += '<li class="blank"></li>';
					}

					// 개인/법인에 따른 은행환산수익율(세전)/법인세전수익율 표시 --%>
					if(isCorpUser){
						yild =  BondUtil.to_percent(rec2.bftx_YILD,3)+"%";
					}else{
						yild =  BondUtil.to_percent(rec1.bkcv_YILD,3)+"%";
					}
					tempYild = rec1.bkcv_YILD;
					iscd 			= BondUtil.trim(ISCDList[i]);
					productNm		= BondUtil.trim(rec2.isus_ABBR_NAME);
				} else {
					iscd 			= BondUtil.trim(ISCDList[i]);
					productNm		= BondUtil.trim(rec2[0]);

					// 소액가능여부체크
					if(sYN == "Y"){
						smallBondFlag = true;
					}
				}

				logger.debug('iscd !!!! >  '+iscd)
				$tab.eq(0).find('tr').eq(0).append(
										'<td class="">'
										+ '	<div class="goodsName">'
										+ '		<label for="finName0'+i+'">'+ productNm +'</label>'
										+ '		<input type="checkbox" name="choiceBox'+i+'" id="finName0'+i+'" value="">'
										+ '	</div>'
										+ '</td>'
									);
				$tab.eq(0).find('tr').eq(1).append(
										'<td headers="chHeader01" class="unfirst btnBox deactivate" data-iscd="'+iscd+'">'
										+ '	<button type="button" name="" id="" class="btnSmall white basketBtn">장바구니</button>'
										+ '	<button type="button" name="" id="" class="btnSmall red buyBtn">매수</button>'
										+ '</td>'
									);

				// 잔존기간
				$tab.eq(0).find('tr').eq(2).append('<td><p class="txt_period">'+BondUtil.get_A_RMN_MMS_NAME(rec1.a_RMN_MMS_NAME)+'</p></td>');

				// outBond: 매매금리, inbond: 수익률
				$tab.eq(0).find('tr').eq(3).append('<td data-compare="'+(_bondType == "outBond" ? rec2.dlng_ANCT_YILD : rec2[8])+'"><span class="rise"><strong>'
													+ BondUtil.to_dlngRate((_bondType == "outBond" ? rec2.dlng_ANCT_YILD : rec2[8]))
													+ '</strong></span></td>'
													);
				$tab.eq(0).find('tr').eq(3).find('th').text((_bondType == "outBond" ? '매매금리' : '수익률'));								// outBond: 매매금리, inbond: 수익률
				$tab.eq(0).find('tr').eq(4).append('<td data-compare="'+rec1.cprt+'">'+BondUtil.to_percent(rec1.cprt,3)+'%</td>');			// 표면이율\

				if(_bondType == "outBond"){
					$tab.eq(0).find('tr').eq(5).append('<td data-compare="'+tempYild+'">'+yild+'</td>');								// 은행환산수익률(세전)
				} else {
					$tab.eq(0).find('tr').eq(5).hide();
				}

				// outBond: 매매단가
				if('outBond' == _bondType){
					$tab.eq(0).find('tr').eq(6).append('<td>'+BondUtil.to_cash( rec1.dlng_ANCT_UNIT_PRIC ) + '원</td>');
					$tab.eq(0).find('tr').eq(6).find('th').text('매매단가');

				// inbond: 현재가
				} else {
					exchage = rec2[12] == '1' ? '원' : 'point';
					$tab.eq(0).find('tr').eq(6).append('<td>'+BondUtil.getIndexData(rec2[4],1,false,true) + exchage + '</td>');
					$tab.eq(0).find('tr').eq(6).find('th').text('현재가');
				}

				if(_bondType == "outBond"){
					$tab.eq(0).find('tr').eq(7).append('<td data-compare="'+rec1.kis_CRDT_RTNG_CODE+'">'+BondUtil.get_KIS_CRDT_RTNG_CODE(rec1.kis_CRDT_RTNG_CODE)+'</td>');		// 신용등급
				} else {
					$tab.eq(0).find('tr').eq(7).append('<td data-compare="'+rec2[3]+'">'+BondUtil.get_SCI_CRDT_RTNG_CODE(rec2[3], rec2[1])+'</td>');		// 신용등급
				}
				$tab.eq(0).find('tr').eq(8).append('<td data-compare="'+rec1.prdt_RTNG_TYPE_CODE+'">'+codes.get("prdtDngToast",rec1.prdt_RTNG_TYPE_CODE)+'</td>');			// 위험등급
				//BondUtil.get_PRDT_RTNG_TYPE_CODE(rec1.prdt_RTNG_TYPE_CODE)
				$tab.eq(1).find('tr').eq(0).append(
										'<td class="">'+
										'	<div class="goodsName">'+
										'		<label for="finName1'+i+'">'+ productNm +'</label>'+
										'		<input type="checkbox" name="choiceBox'+i+'" id="finName1'+i+'" value="">'+
										'	</div>'+
										'</td>'
									);
				$tab.eq(1).find('tr').eq(1).append(
										'<td headers="chHeader01" class="unfirst btnBox" data-iscd="'+iscd+'">'+
										'	<button type="button" name="" id="" class="btnSmall white basketBtn">장바구니</button>'+
										'	<button type="button" name="" id="" class="btnSmall red buyBtn">매수</button>'+
										'</td>'
									);
				$tab.eq(1).find('tr').eq(2).append('<td>'+BondUtil.get_ARS_LARG_CLSN_CODE(rec1.ars_LARG_CLSN_CODE)+'</td>');		// 유형명
				$tab.eq(1).find('tr').eq(3).append('<td>'+BondUtil.trim(rec1.kind_ABNM)+'</td>');									// 종류명
				$tab.eq(1).find('tr').eq(4).append('<td>'+BondUtil.get_BOND_LSTG_TYPE_CODE(rec1.bond_LSTG_TYPE_CODE)+'</td>');		// 상장여부
				$tab.eq(1).find('tr').eq(5).append('<td>'+BondUtil.to_date(rec1.lstg_DATE)+'</td>');								// 상장일
				$tab.eq(1).find('tr').eq(6).append('<td>'+BondUtil.to_date(rec1.xprn_DATE)+'</td>');								// 만기일


				if(_bondType == "outBond"){
					$tab.eq(1).find('tr').eq(7).append('<td>'+BondUtil.get_KIS_CRDT_RTNG_CODE(rec1.kis_CRDT_RTNG_CODE)+'</td>');		// 신용등급
				} else {
					$tab.eq(1).find('tr').eq(7).append('<td>'+BondUtil.get_SCI_CRDT_RTNG_CODE(rec2[3], rec2[1])+'</td>');		// 신용등급
				}

			//	$tab.eq(1).find('tr').eq(7).append('<td>'+BondUtil.get_KIS_CRDT_RTNG_CODE(rec1.kis_CRDT_RTNG_CODE)+'</td>');		// 신용등급
				$tab.eq(1).find('tr').eq(8).append('<td>'+BondUtil.to_percent(rec1.infn_INDD_CFCT,5)+'</td>');						// 물가연동계수

				$tab.eq(2).find('tr').eq(0).append(
										'<td class="">'+
										'	<div class="goodsName">'+
										'		<label for="finName2'+i+'">'+ productNm +'</label>'+
										'		<input type="checkbox" name="choiceBox'+i+'" id="finName2'+i+'" value="">'+
										'	</div>'+
										'</td>'
									);
				$tab.eq(2).find('tr').eq(1).append(
										'<td headers="chHeader01" class="unfirst btnBox" data-iscd="'+iscd+'">'+
										'	<button type="button" name="" id="" class="btnSmall white basketBtn">장바구니</button>'+
										'	<button type="button" name="" id="" class="btnSmall red buyBtn">매수</button>'+
										'</td>'
									);
				$tab.eq(2).find('tr').eq(2).append('<td>'+BondUtil.to_percent(rec1.xprn_RDMN_INTT_RATE,5)+'%</td>');						// 만기상환율
				$tab.eq(2).find('tr').eq(3).append('<td>'+BondUtil.to_cash(rec1.krw_SBPC)+'원</td>');										// 대용가
				$tab.eq(2).find('tr').eq(4).append('<td>'+BondUtil.to_bond_ISUS_RDMN_PRIC_AMNT(rec1.bond_ISUS_RDMN_PRIC_AMNT)+'원</td>');	// 상환가
				$tab.eq(2).find('tr').eq(5).append('<td>'+BondUtil.get_yn3(rec1.nwkn_CPTL_SCRS_YN)+'</td>');								// 신종자본증권여부
				$tab.eq(2).find('tr').eq(6).append('<td>'+BondUtil.get_JNR_TYPE(rec1.jnr_SECT_CODE)+'</td>');								// 후순위채권구분
				$tab.eq(2).find('tr').eq(7).append(' <td>'+BondUtil.get_yn2(rec1.asst_CURT_TYPE_CODE)+'</td>');								// 자산유동화구분
				$tab.eq(2).find('tr').eq(8).append(' <td>'+BondUtil.get_BOND_OPTS_SECT_CODE(rec1.bond_OPTS_SECT_CODE)+'</td>');				// 채권옵션구분
				$tab.eq(2).find('tr').eq(9).append(' <td>'+BondUtil.get_yn2(rec1.grny_SECT_CODE)+'</td>');									// 보증기관

				if(sYN == 'N' && $('.toggleTab.fl.smallToggle li.on').index() == 1){
					$tab.eq(0).find('tr').find('td:eq('+i+')').addClass('deactivate');
					$tab.eq(1).find('tr').find('td:eq('+i+')').addClass('deactivate');
					$tab.eq(2).find('tr').find('td:eq('+i+')').addClass('deactivate');

					$tab.eq(0).find('tr').find('td:eq('+i+')').append('<span class="dimm"><em class="hidden">신청할수없는 상품입니다</em></span>');
					$tab.eq(1).find('tr').find('td:eq('+i+')').append('<span class="dimm"><em class="hidden">신청할수없는 상품입니다</em></span>');
					$tab.eq(2).find('tr').find('td:eq('+i+')').append('<span class="dimm"><em class="hidden">신청할수없는 상품입니다</em></span>');
					_common.reinit_ui();
				}

			});

			// 장외>적립식일 경우 장바구니버튼 비활성화
			var buyStyle = $('#compareLayer').data("buyStyle");
			var isStyle = buyStyle == '1' || buyStyle == '2' ? false : true;
			var $everyBasketBtn = $('#compareLayer .groupBasketBtn, #compareLayer .goodsListFn .basketBtn');

			if(_bondType == 'outBond' && !isStyle){		// 장외 & 적립식
				$everyBasketBtn.hide();
			} else {
				$everyBasketBtn.show();
			}

			var $compareTable = $('#compareLayer .compareFinduct:eq(0) tr');
			// 젤 좋은거에 class 추가하는거.
			var outCompareArray = [3, 4, 5, 7, 8];	// 매매금리, 표면이율, 은행환산수익률, 신용등급, 위험도
			var inCompareArray = [3, 4, 7, 8];		// 수익률, 표면이율, 신용등급, 위험도

			var targetArr = _bondType == "outBond" ? outCompareArray : inCompareArray;
			$.each(targetArr, function(i, val){
				var test = BondUtil.calcData($compareTable.eq(val).find('td'));
				if(test.length > 0){
					$.each(test, function(i, obj){
						$compareTable.eq(val).find('td').eq(obj).addClass('superb');
					});
				} else {
					$compareTable.eq(val).find('td').removeClass('superb');
				}
			})

			// 소액채권여부
			if(smallBondFlag){
				$('.toggleTab.fl.smallToggle').show();
				$('.marketPriceBtn').show();
				$('.fl.smallToggle').off('click').on('click', function(){
					var srh1 = $(this).find('li.on').index();
					srh1 = srh1 == 0 ? 'B' : 'S';
					var iscdArr = new Array();
					$('.goodsListFn:eq(0) td').each(function(){
						var iscd = $(this).data('iscd');
						logger.debug("비교하기iscd", iscd);
							iscdArr.push(iscd);
					});
					BondUtil.goCompareToast(iscdArr, 'inBond', srh1);
				});

				// 신고시장가 버튼 이벤트
				$('.marketPriceBtn').off('click').on('click', function(){
					marketPrice.search();
				});
			} else {
				$('.toggleTab.fl.smallToggle').hide();
			}
			// 새로고침 버튼
			$('#compareLayer .anew').off('click').on('click', function(){
				var iscdArr = new Array();
				$('.goodsListFn:eq(0) td').each(function(){
					var iscd = $(this).data('iscd');
						iscdArr.push(iscd);
				});
				var srh1 = $('.toggleTab.fl.smallToggle').find('li.on').index();
					srh1 = srh1 == 0 ? 'B' : 'S';
					srh1 = _bondType == 'inBond' ? srh1 : '';

					var iscdArr = new Array();
					$('.goodsListFn:eq(0) td').each(function(){
						var iscd = $(this).data('iscd');
						logger.debug("비교하기iscd", iscd);
							iscdArr.push(iscd);
					});

				// 비교하기레이어가 활성화된 상태이기 때문에,
				var buyStyle = $('#compareLayer').data("buyStyle");
				$('#compareLayer').data("calledBuyStyle", buyStyle);
				BondUtil.goCompareToast(iscdArr, _bondType, srh1);
			});

			// 신고시장가 버튼
			if(smallBondFlag && $('.smallToggle li.on').index() == 1){
				$('.marketPriceBtn').show();
			} else {
				$('.marketPriceBtn').hide();
			}

			// 체크박스 컨트롤
			$('[name^=choiceBox]').on('click', function(){
				var name = $(this).attr('name');
				if($(this).prop('checked')){
					$('[name='+name+']').prop('checked', true)
				} else {
					$('[name='+name+']').prop('checked', false)
				}
			});
			// 매수
			$('#compareLayer .buyBtn').on('click', function(){
				var iscd = $(this).parent().data('iscd');
				if(_bondType == 'outBond'){		// 장외
					var buyStyle = $('#compareLayer').data("buyStyle");
					var isStyle = buyStyle == '1' || buyStyle == '2' ? false : true;
					if(isStyle){
						out.goBuyStep(iscd);
					} else {
						// 채권찾기&채권매수step1 화면에서 적립식상품 비교레이어에서 매수화면으로 이동할 때 param set.
						var savingTR = $('.listType2Data tbody').eq(1).find('tr');
						$.each(savingTR, function(){
							var sTableIscd = $(this).data('iscd') || '';	// 선택된 종목코드와 바닥화면 테이블의 종목코드들 중 일치하는 것 체크
							if('' != sTableIscd && iscd == sTableIscd){
								$('.listType2Data tbody').data('infoData', $(this).data('infoData'));	// 비교 레이어에서 매수버튼 누를 시 사용 데이터 셋, 바닥 jsp에 적립식 이동함수 있음
								$('.listType2Data tbody').data('buyStyle', buyStyle);					// 비교 레이어에서 매수버튼 누를 시 사용 데이터 셋
								calledByDetailLayer();
								return false;
							}
						});
					}
				} else {
					inbond.goBuyStep(iscd);		// 장내
				}
			});
			// 장바구니
			$('#compareLayer .basketBtn').on('click', function(){
				var iscd = $(this).parent().data('iscd');
				var menuCode = getMenuCode() || '';
				var backUrl = '';

				if(menuCode != ''){
					backUrl = getMenuInfo(menuCode).url || '';
					backUrl = escape(backUrl);
				}
				BondUtil.goAddWish( window.isLogin(), _bondType, iscd, backUrl);
			});
			// 장바구니 > 다건
			$('#compareLayer .groupBasketBtn').off('click').on('click', function(){
				var menuCode = getMenuCode() || '';
				var backUrl = '';

				if(menuCode != ''){
					backUrl = getMenuInfo(menuCode).url || '';
					backUrl = escape(backUrl);
				}

				var iscdArr = new Array();
				var iscdTd = $('.goodsListFn:eq(0) td');
				$('.goodsList:eq(0) input:checkbox:checked').each(function(i){
					var iscd = iscdTd.eq(i).data('iscd');
						iscdArr.push(iscd);
				});

				if(iscdArr.length > 0){
					BondUtil.goAddWishGroup( window.isLogin(), _bondType, iscdArr, backUrl);
				} else {
					alert('종목을 선택해 주시기 바랍니다.');
					return;
				}
			});
			_common.reinit_ui();
			//$('#compareLayer').show();
		},

		calcData : function($obj) {
			var com1 = 0;
			var big = 0;
			var num = -1;
			var tempArr = new Array();
			var resultArr = new Array();
			$.each($obj, function(i){
				var thisData = $(this).data('compare');
				tempArr.push(thisData);			// 중복되는 경우 체크하기 위해
				big = i == 0 ? thisData : big;	// 처음 데이터는 big 으로 ~
				if(thisData > big ){
					big = thisData;
					num = i;
				} else {
					big = big;
					num = num;
				}
			});

			if( big > 0){
				if(num == -1){
					num++;
				}
				$.each(tempArr, function(i, val){
					if(big == val){
						resultArr.push(i);
					}
				});
			}
			return resultArr;
		},

		/* *
		 * 최근본 상품 등록하기
		 * iscd : 종목코드
		 * type : 시장구분 (outBond:장외채권, inBond:장내채권)
		 * mode : action (추가:add, 삭제:remove)
		 * */
		setRecentCookies : function(iscd, type, mode) {

			var ISCD = iscd ;
			var TYPE = type ;

			try{
				var bondRecentCookie = $.cookie('bondRecentViewPrdt'+TYPE) ;

				if(typeof bondRecentCookie != 'undefined') bondRecentCookie = JSON.parse(bondRecentCookie) ;
				else bondRecentCookie = [] ;

				var cookieCnt = bondRecentCookie.length;
				var temp = bondRecentCookie.slice(0);

				for(var i = cookieCnt ;i-- ;){
					if(bondRecentCookie[i].code == ISCD){
						temp.splice(i , 1) ;
						break ;
					}
				}

				if (temp.length > 9) {
					temp.splice(0 , 1) ;
				}

				if(mode == 'add'){
					temp.push({code:ISCD, type:TYPE});
				}

				logger.debug(JSON.stringify(temp));
				$.cookie('bondRecentViewPrdt'+TYPE, JSON.stringify(temp),{ expires: 7, path:'/'});
			} catch(e) {
				$.cookie('bondRecentViewPrdt'+TYPE, JSON.stringify([]),{ expires: 7, path:'/'});
			}
		},

		/* *
		 * 비교 상품 등록하기
		 * iscds : 종목코드
		 * type : 시장구분 (outBond:장외채권, inBond:장내채권)
		 * mode : action (추가:add, 삭제:remove)
		 * */
		setCompareCookies : function(iscds, type, mode) {
			var ISCDs = new Array();
			ISCDs = iscds;
			var TYPE = type ;

			try{
				var bondCompareCookie = $.cookie('bondComparePrdt'+TYPE) ;

				if(typeof bondCompareCookie != 'undefined') bondCompareCookie = JSON.parse(bondCompareCookie) ;
				else bondCompareCookie = [] ;
				var cookieCnt = bondCompareCookie.length;
				var temp = bondCompareCookie.slice(0);

				if(cookieCnt > 0){
					for(var i = cookieCnt ;i-- ;){
						for(var j = 0; j < ISCDs.length ; j++){
							if(bondCompareCookie[i].code == ISCDs[j]){
								temp.splice(i , 1) ;
							}
						}
					}
				}

				var cnt = 10 - ISCDs.length;
				if (temp.length > cnt) {
					temp.splice(0 , temp.length - cnt );
				}

				if(mode == 'add'){
					for(var j = 0; j < ISCDs.length ; j++){
						temp.push({code:ISCDs[j], type:TYPE});
					}
				}

				$.cookie('bondComparePrdt'+TYPE, JSON.stringify(temp),{ expires: 7, path:'/'});
			} catch(e) {
				logger.debug('에러..', e);
				$.cookie('bondComparePrdt'+TYPE, JSON.stringify([]),{ expires: 7, path:'/'});
			}
		},

		// TODO: 좋아요 (임시 AS-IS)
		/* *
		 * 좋아요 데이터 set
		 * iscds : 종목코드
		 * type : 시장구분 (outBond:장외채권, inBond:장내채권)
		 * */
		 setLike: function(iscd, type, bondNm){
			var $like 		= $('#detailLayer .btnLarge.white.like');
			var $likeCount 	= $like.find('span');
			var likeObj 	= null;
			var _type = type == "inBond" ? 'BONDI' : 'BONDO';

			if( ValidationUtil.is_null(iscd )){
				return;
			}

			likeObj = getLikeCout(_type,  iscd, bondNm);

			$likeCount.text(likeObj.likeCnt);

			if( likeObj.likeChk == "N" ){
				$like.removeClass("selected");
			}else{
				$like.addClass("selected");
			}
		},

		/* *
		 * 좋아요 이벤트 set
		 * iscds : 종목코드
		 * type : 시장구분 (outBond:장외채권, inBond:장내채권)
		 * */
		 getLike: function(iscd, type, bondNm){
			var $likeBtn 	= $('#detailLayer .btnLarge.white.like');
			var loginFlag   = window.isLogin() && !window.isMember();
			var _type = type == "inBond" ? 'BONDI' : 'BONDO';

			$likeBtn.off('click').on('click', function() {
				var $likeCount 	=  $likeBtn.find('span');
				var $bondName  	= bondNm
				if(loginFlag){
					if( $(this).hasClass("selected") ){
						// 좋아요 취소 실행
						$likeCount.text(setLikeCncl(_type, iscd, bondNm));
						$( this ).removeClass("selected");
					}else{
						// 좋아요 등록 실행
						$likeCount.text(setLikeInst(_type,  iscd, bondNm));
						$(this).addClass("selected");
					}
				}else{
					var url = type == "inBond" ? '/ux/kor/finance/bond/inbondsearch/search.do' : '/ux/kor/finance/bond/outbondsearch/search.do';
					confirmLogin(url);
				}
			});
		},

		/* *
		 * 좋아요 이벤트 set
		 * iscds : 종목코드
		 * type : 시장구분 (abstb:전자단기사채)
		 * */
		 getABSTBLike: function(iscd, bondNm){
			var $likeBtn 	= $('#detailLayer .btnLarge.white.like');
			var loginFlag   = window.isLogin() && !window.isMember();
			var _type = 'BONDO';

			$likeBtn.off('click').on('click', function() {
				var $likeCount 	=  $likeBtn.find('span');
				var $bondName  	= bondNm
				if(loginFlag){
					if( $(this).hasClass("selected") ){
						// 좋아요 취소 실행
						$likeCount.text(setLikeCncl(_type, iscd, bondNm));
						$( this ).removeClass("selected");
					}else{
						// 좋아요 등록 실행
						$likeCount.text(setLikeInst(_type,  iscd, bondNm));
						$(this).addClass("selected");
					}
				}else{
					confirmLogin('/ux/kor/finance/bond/abstbondsearch/search.do');
				}
			});
		},

		/**
		 * 1개 상품 비교 가능 여부
		 *
		 * @param		String			_bondType 	( outBond:장외채권, inBond:장내채권 )
		 * @return		boolean
		 * @usage		isOneItemCompare( 'outBond' )
		 */
		isOneItemCompare:function( _bondType ) {
			var rst = false;

			if( _bondType == "outBond" ){
				url = "/finance/bond/outInfo/compare.do";
			}else if( _bondType == "inBond" ){
				url = "/finance/bond/inInfo/compare.do";
			}

			$.cs.ajax({
				url : url,
				data : "cmd=getCompareCount",
				async : false,
				success : function(data){

					if( data.compareCount != null && data.compareCount > 0 ){
						rst = true;
					}else{
						rst = false;
					}

				},
				loadingStart : true,
				loadingEnd : true
			});

			return rst;
		},

		/**
		 * 체크비교시 채권비교에있는 채권 체크
		 *
		 * @param		String			_bondType 	( outBond:장외채권, inBond:장내채권 )
		 * @param		String			iscdArray 	채권 상품아이템번호
		 * @return		int
		 * @usage		getBondChk( 'outBond' , 'KR310210G387,KR6000031239')
		 */
		getBondChk:function(_bondType, iscdArray ) {
			var cnt = 0;

			if( _bondType == "outBond" ){
				url = "/finance/bond/outInfo/compare.do";
			}else if( _bondType == "inBond" ){
				url = "/finance/bond/inInfo/compare.do";
			}

			$.cs.ajax({
				url : url,
				data : "cmd=getChkResult&iscdArray="+$.trim(iscdArray),
				async : false,
				success : function(data){

					if(!data.errorMsg.isEmpty()){
		                alert(data.errorMsg);
		                return;
		           }

					cnt = data.chkCount;
				},
				loadingStart : true,
				loadingEnd : true
			});

			return cnt;
		},

		/**
		 * RP 투자성향 정보
		 *
		 * @param	{String, Number} 	acct
		 * @param	{String, Number} 	pw
		 * @param	{String, Number} 	rpSectCode
		 * @return  {type:'', msg:'', aClntInvtPopnName:'', aPrdtRtngName:'', clntInvtPopnCode:'', salePrdtRtngCode:'', aStblPrdtYn:'', errorMsg:''};
		 *
		 * @usage	getRpDepositInfo('1234567890', '0000', '1', func)
		 */
		getRpDepositInfo:function(acct, pw, rpSectCode) {			// TODO : 2016.09.25 gp.lee toParameterString 변경 확인 및 JAVA 처리 변경 필요
			
			
			var formNm = 'CHANGEPWD' + Math.floor((Math.random()*100000)+1);
			$(document.createElement('form'))
				.attr('name', formNm)
				.attr('id', formNm)
				.attr('method', 'post')
				.appendTo($('body'));
			
			var $f = $.form(formNm);
			
			$f.val('ACNT_NO' ,  acct.substring(0, 20)) ; 
			$f.val('ACNT_ID' ,  acct.substring(20, 39)) ; 
			$f.val('ACNT_PSWD_CRYP' ,  pw) ; 
			$f.val('RP_PRDT_SECT_CODE' ,  rpSectCode) ; 
			
			// 투자성향타입 (1,2,3), 투자성향설명문, 고객투자성향명, 상품등급명, 고객투자성향코드, 판매상품등급코드, 적합상품여부, 오류메세지
		    var rtn = {type:'', msg:'', aClntInvtPopnName:'', aPrdtRtngName:'', clntInvtPopnCode:'', salePrdtRtngCode:'', aStblPrdtYn:'', errorMsg:''};

			$.cs.ajax({
				url : '/finance/bond/rpTrade/buyRp.do',
				data : $f.toParameterString('getDepositInfo' , true),
				async : false,
				success : function(data){
					if (!$.util.isEmpty(data.errorMsg)) {
						rtn.errorMsg = data.errorMsg;
					} else {

						var INFM_RSLT_CODE = $.util.trim(data.INFM_RSLT_CODE);
						// 신투정 등록여부 및 유효기간 체크하고 미등록 및 24개월 유효기간 초과시
						if (INFM_RSLT_CODE == '1' || INFM_RSLT_CODE == 'A') {
							rtn.type = '1';
							rtn.msg = '본인은 투자자정보를 제공하지 않고 본인의 판단에 따라 투자하며, 본 상품 투자와 관련하여 발생할 수 있는 모든 위험은 본인이 감수할 것임을 확인합니다.';
						// 신투정은 등록 & 투자성향 미제공(투자성향이 無)의 경우
						} else if (INFM_RSLT_CODE == 'B') {
							rtn.type = '2';
							rtn.msg = '고객님의 투자자정보가 변경되지 않았습니다. 투자자정보를 변경하시겠습니까?';
						} else {
							rtn.type = '3';
						}

						rtn.aClntInvtPopnName = $.util.trim(data.pga2001pOutRec1.A_CLNT_INVT_POPN_NAME);
						rtn.aPrdtRtngName = $.util.trim(data.pga2001pOutRec1.A_PRDT_RTNG_NAME);
						rtn.clntInvtPopnCode = $.util.trim(data.pga2001pOutRec1.CLNT_INVT_POPN_CODE);
						rtn.salePrdtRtngCode = $.util.trim(data.pga2001pOutRec1.SALE_PRDT_RTNG_CODE);
						rtn.aStblPrdtYn = $.util.trim(data.pga2001pOutRec1.A_STBL_PRDT_YN);
					}
				},
				loadingStart : true,
				loadingEnd : true
			});

			return rtn;
		},

		isPopup:function(){
			return (top._common._type == 'CONTENT');
		},

		/**
		 * 계좌의 비밀번호 여부 체크
		 * 장내채권 매수잔고현황을 조회해서 오류여부 판단
		 *
		 * @param	{String} 	acct
		 * @param	{String} 	pw
		 * @return  true/false
		 *
		 * @usage	searchBuyPossAmt('1234567890', 'xxxx', setAmt)
		 */
		checkAcctPw:function(acctNo, pw) {

			var checkResult = true;
			var rtn = this.getInbondBuyBalace(acctNo, pw);
			if (!$.util.isEmpty(rtn.errorMsg)) {
				alert(rtn.errorMsg);
				checkResult = false;
			}

			return checkResult;
		},

		/**
		 * 장내채권 매수잔고현황 조회
		 *
		 * @param	{String} 	acct
		 * @param	{String} 	pw
		 * @return  {errorMsg:'', CSLK_ASST_AMNT:'', CASH_UNCL_AMNT:'', ORDR_PSBL_TAMT:''}
		 */
		getInbondBuyBalace:function(acctNo, pw) {		

			var formNm = 'CHANGEPWD' + Math.floor((Math.random()*100000)+1);
			$(document.createElement('form'))
				.attr('name', formNm)
				.attr('id', formNm)
				.attr('method', 'post')
				.appendTo($('body'));
			
			var $f = $.form(formNm);
			
			$f.val('acctNo' , acctNo) ; 
			$f.val('A_PSWD_CRYP' , pw) ; 
			
			var rtn = {errorMsg:'', CSLK_ASST_AMNT:'', CASH_UNCL_AMNT:'', ORDR_PSBL_TAMT:''};
			$.cs.ajax({
				url : '/ux/kor/finance/bond/inbondtrade/getBuyBalance.do',
				data : $f.toParameterString('' , true),
				async : false,
				success : function(result){
					if (!$.util.isEmpty(result.errorMsg)) {
						rtn.errorMsg = result.errorMsg;
					}

					if (!$.util.isEmpty(result.meg108cpOutRec1)) {
						rtn.CSLK_ASST_AMNT = result.meg108cpOutRec1.CSLK_ASST_AMNT;
						rtn.CASH_UNCL_AMNT = result.meg108cpOutRec1.CASH_UNCL_AMNT;
						rtn.ORDR_PSBL_TAMT = result.meg108cpOutRec1.ORDR_PSBL_TAMT;
					}
				},
				loadingStart : true,
				loadingEnd : true
			});

			return rtn;
		},

		/**
		 * 검색용 잔존기간 유효성 검증
		 *
		 * @param	{jqueryObject} 	$fromYear
		 * @param	{jqueryObject} 	$fromMonth
		 * @param	{jqueryObject} 	$toYear
		 * @param	{jqueryObject} 	$toMonth
		 * @return  boolean
		 */
		checkSearchRemainDate:function($fromYear, $fromMonth, $toYear, $toMonth) {

			var fromDate = $.util.trim($fromYear.val() + $fromMonth.val());
			var toDate = $.util.trim($toYear.val() + $toMonth.val());

			/**
			 * 년/개월 중 1개만 입력 되었을때 처리
			 */
			if ( fromDate != '' && $.util.trim($fromYear.val()) == ''  ){
				$fromYear.val("0");
			}

			if ( fromDate != '' && $.util.trim($fromMonth.val()) == ''  ){
				$fromMonth.val("0");
			}

			if ( toDate != '' && $.util.trim($toYear.val()) == ''  ){
				$toYear.val("0");
			}

			if ( toDate != '' && $.util.trim($toMonth.val()) == ''  ){
				$toMonth.val("0");
			}

			if (!$.util.isEmpty(fromDate) || !$.util.isEmpty(toDate)) {

				var msg = '잔존기간 입력을 확인해 주세요.\n최소 년 0~50, 월 0~12로 입력해 주셔야 합니다.';

				var fromYear = $.util.trim($fromYear.val());
				var toYear = $.util.trim($toYear.val());
				var fromMonth = $.util.trim($fromMonth.val());
				var toMonth = $.util.trim($toMonth.val());

				if ($.util.isEmpty(fromYear) ||  $.util.toInt(fromYear) < 0 || $.util.toInt(fromYear) > 50 || !this.checkMaxLength(fromYear,2) ) {
					alert(msg);
					$fromYear.focus();
					return false;
				} else if ($.util.isEmpty(fromMonth) ||  $.util.toInt(fromMonth) < 0 || $.util.toInt(fromMonth) > 12 || !this.checkMaxLength(fromMonth,2) ) {
					alert(msg);
					$fromMonth.focus();
					return false;
				} else if ($.util.isEmpty(toYear) ||  $.util.toInt(toYear) < 0 || $.util.toInt(toYear) > 50 || !this.checkMaxLength(toYear,2) ) {
					alert(msg);
					$toYear.focus();
					return false;
				} else if ($.util.isEmpty(toMonth) ||  $.util.toInt(toMonth) < 0 || $.util.toInt(toMonth) > 12 || !this.checkMaxLength(toMonth,2) ) {
					alert(msg);
					$toMonth.focus();
					return false;
				}

				if( fromMonth.length == 1 ){
					fromMonth =  '0'+ fromMonth;
				}

				if( toMonth.length == 1 ){
					toMonth =  '0'+ toMonth;
				}

				if ($.util.toInt('99' + fromYear + fromMonth ) >= $.util.toInt('99' + toYear + toMonth)) {
					alert('잔존기간 입력을 확인해 주세요.\n두번째 조건이 첫번째 조건보다 값을 높게 입력해 주셔야 합니다.');
					$toYear.focus();
					return false;
				}
			}

			return true;
		},

		/**
		 * 검색용 금리 유효성 검증
		 *
		 * @param	{jqueryObject} 	$fromRate
		 * @param	{jqueryObject} 	$toRate
		 * @param	{String} 	$title
		 * @return  boolean
		 */
		checkSearchInterestRate:function($fromRate, $toRate, title) {

			var fromRate = $.util.trim($fromRate.val());
			var toRate = $.util.trim($toRate.val());

			if (!$.util.isEmpty(fromRate) || !$.util.isEmpty(toRate)) {

				var msg = title + ' 입력을 확인해 주세요.\n최소 0.001 ~ 99.999로 입력해 주셔야 합니다.';

				if ($.util.isEmpty(fromRate) ||  $.util.toFloat(fromRate) < 0.001 || $.util.toFloat(fromRate) > 99.999 || !this.checkMaxLength(fromRate,6)) {
					alert(msg);
					$fromRate.focus();
					return false;
				} else if ($.util.isEmpty(toRate) ||  $.util.toFloat(toRate) < 0.001 || $.util.toFloat(toRate) > 99.999 || !this.checkMaxLength(toRate,6)) {
					alert(msg);
					$toRate.focus();
					return false;
				}

				if ($.util.toFloat(fromRate) >= $.util.toFloat(toRate)) {
					alert(title + ' 입력을 확인해 주세요.\n두번째 조건이 첫번째 조건보다 값을 높게 입력해 주셔야 합니다.');
					$toRate.focus();
					return false;
				}
			}

			return true;
		},

		checkMaxLength:function( value, length ){
			value = $.util.trim(value);

			if( value.length <= length  ){
				return true;
			}

			return false;
		},

		toFixed:function( $obj, fixed ){
			var value = $obj.val();

			if( value.indexOf('.') > 0 && value.substring(value.indexOf('.') + 1).length > fixed ){
				$obj.val( parseFloat(value).toFixed(fixed) );
			}

			return;
		},
		isExpireRmnDay:function (xprnDate) {
			xprnDate = $.trim(xprnDate);
			xprnDate = xprnDate.replace (/[^\d]/g, '');

			if (xprnDate.length < 8) {
				return false;
			}

			var nowDate = $.cs.util.dateFormat(new Date, 'yyyyMMdd');
			var dt 		= new Date();
			var year 	= xprnDate.substring(0,4);
			/** 데이터 형변환 문자열 > 숫자 - 1 > 문자열 */
			var month 	= ((xprnDate.substring(4,6) >> 0) - 1) + '';
			var day 	= xprnDate.substring(6,8);

			dt.setFullYear(year);
			dt.setMonth(month );		// add 1 month
			dt.setDate(day);

			return ( nowDate >=  $.cs.util.dateFormat( dt, 'yyyyMMdd') );
		},
		/* 펀드비교 공통함수  */
		fundCompare :function(chkArr, chkCnt, type,_this) {
			if (chkCnt == 0) {
				alert("비교상품을 선택해주세요.");
				return;
			}
			if (chkCnt < 2) {
				alert("비교상품을 선택해주세요. 비교는 2개 이상부터 가능합니다.");
				return;
			}
			if(chkCnt > 4) {
				alert('비교는 최대 4개까지 가능합니다.');
				return;
			}
			if (chkArr != undefined && chkArr.length > 0) {

				if(type != ''){
					_common.showDetailLayerPopup("/ux/kor/finance/fund/compare/compareList.do?fundCds="+chkArr + (typeof type != "undefined" ? "&type=" + type : ""), "showPdtCompLayer",_this);
				}else{
					_common.showDetailLayerPopup("/ux/kor/finance/fund/compare/compareList.do?fundCds="+chkArr, "showPdtCompLayer",_this);
				}

			}

		},

		fundCompareParent :function(chkArr, chkCnt, type) {
			if (chkCnt == 0) {
				alert("비교상품을 선택해주세요. 비교는 2개 이상부터 가능합니다.");
				return;
			}
			if(chkCnt > 4) {
				alert('비교는 최대 4개까지 가능합니다.');
				return;
			}
			if (chkArr != undefined && chkArr.length > 0) {
				parent._common.showDetailLayerPopup("/ux/kor/finance/fund/compare/compareList.do?fundCds="+chkArr + (typeof type != "undefined" ? "&type=" + type : ""), "showPdtCompLayer");
			}

		},

		onlyNumDot : function(obj,dotIndex,isCash){

			var data = obj.value;
			var valid = ".1234567890";
			var output = '';

			for (var i=0; i<data.length; i++){
			    if (valid.indexOf(data.charAt(i)) != -1){
			    	if(data.charAt(i) != '-'){
			    		output += data.charAt(i);
			    	}
			    	if(i==0 && data.charAt(i) == '-'){
			    		output += data.charAt(i);
			    	}
			    }
			}

			if(output != '-' && output != ''){
				if(isCash == undefined || isCash == true){
					obj.value = BondUtil.to_dotCash(output,dotIndex);
				} else {
					//'정정/취소'에서 숫자만 입력 가능하지만, 콤마를 표시하지 않아야 하는 경우 등에 사용됨.
					obj.value = output;
				}
			}else{
				obj.value = output;
			}
		},
			// 20160620 장내채권I/O변경관련 6/27일 반영건 현행화로 인한 추가 sj.kim
		to_dotCash : function(value,dotIndex){
			var isminus=(String(value).indexOf('-')==0)?true:false;

			if(dotIndex == undefined){
				dotIndex = 0;
			}

			if(isminus){
				if(String(value).indexOf('.')!=-1){
					var val=String(value).split('.');
					val[0] = (val[0] * -1);
					value=String((Number(val[0]) || 0)+'.'+$.trim(val[1]));
				}else{
					value = (value * -1);
				}
			}
			var output;
			/**
			 * 소수점처리 추가 (2014.04.08)
			 */
			if(String(value).indexOf('.')!=-1){
				var values=String(value).split('.');
				var dotValue = $.trim(values[1]);

				if(dotIndex > 0 && dotValue.length >= dotIndex){

					dotValue = dotValue.substring(0,dotIndex);
				}

				output=String((Number(values[0]) || 0)+'.'+dotValue);
			}else{
				output=String(Number(value));
			};
			if(isminus) output='-'+output;

			var reg=/(^[+-.]?\d+)(\d{3})/;
			output+='';

			while(reg.test(output)){
				output=output.replace(reg, '$1'+','+'$2');
			};

			return output;
		},

		//data  : 값
		//dotIndex : 자릿수
		//cutting : 반올림
		//ex getIndexString(1234.5554 , 2 , true); 1234.56
		//ex getIndexString(1234.5554 , 2 , false);1234.55
		getIndexData:function(data , dotIndex , cutting , isComma){

			if(typeof cutting == 'undefined' || cutting == null) sign = false;
			if(typeof isComma == 'undefined' || isComma == null) isComma = false;
	//		    undefined
			var result , dot , sign;
			var index = String(data).indexOf(".");
			var minus = String(data).search("-");
			if(index < 0)
			{
			  result = data;
			  dot    = "";
			}
			else
			{
			  if (minus > -1)result = String(data).slice(1 , index);
			  else result = String(data).slice(0 , index);
			  dot    = String(data).slice(index+1);

			}
			var totLength  = Number(dot.length);
			while(totLength < dotIndex)
			{
			  dot += "0";
			  totLength++;
			}

			if (parseInt(result) == 0 && parseInt(dot) == 0)
			{
				result  = "0";
			}
			else
			{
				sign = "";
				if (minus > -1)
				{
					sign = "-";
				}

				if (dot.length == 0 || dotIndex == 0)
				{

					if(isComma){
						result = BondUtil.to_cash(result);
					}
					result  =  sign + result + dot;
				}
				else
				{

					var dotResult  = String(dot).slice(0 , dotIndex);
					if(cutting && parseInt(String(dot).substr(dotIndex , 1)) >= 5)
					{
						var tempDot  = parseInt(String(dot).substr(dotIndex -1 , 1)) + 1;
						dotResult = String(dotResult).slice(0 , dotResult.length -1);
						if(String(tempDot) == "10")dotResult  = String(parseInt(dotResult)+1) + "0";
						else dotResult  = dotResult + String(tempDot);
						if(dotResult.length == 3)
						{
							if(Number(result) < 0)  result = String(Number(result) - 1);
							else result = String(Number(result) + 1);
							dotResult = dotResult.slice(1);
						}
					}
					if(isComma){
						result = BondUtil.to_cash(result);
					}
					result  =  sign + result + "." + dotResult;
				}
			}
			return result;
		}
};