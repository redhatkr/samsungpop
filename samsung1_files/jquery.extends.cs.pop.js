(function(){
	var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
	try {
		if (window.gIsMobile) {
			isWin = false;
		}
	} catch (e) {
	}

	$.validator = {
		isEmail : function(v){
			return v.match(/(.{3,}[@]{1}.+([\.]+[a-zA-Z0-9]+)$)/gim) ? true : false;
		},
		isNumber : function(v){
			return v.match(/^[-]*[0-9,]+([\.]{1}[0-9]+)*$/gim) ? true : false;
		},
		isRatioNumber : function(v){
			return v.match(/^[0-9]+([\.]{1}[0-9]+)*$/gim) ? true : false;
		},
		getByte : function(str){
			str = String(str);
			var _len = str.length;
			var _length = 0;
			for (var i = 0; i < _len; i++) {
				if (str.charCodeAt(i) > 255) _length++;
				_length++;
			}
			return _length;
		},
		getByteToLen : function (str, len) {
			var arrStr = [], arrResult = []
			, length = 0, idx = 0, item = '';

			len = Number(len);
			str += '';
			arrStr = str.match (/./g);

			for (idx in arrStr) {

				item = arrStr[ idx ];
				if (length > len) { break; }
				if (item.charCodeAt() > 255) { length++; }
				length++;
				arrResult.push (item);
			}

			if (length > len) {
				arrResult.splice (arrResult.length - 1, 1);
			}
			return arrResult.join ('');
		},
		isContainsBlankChar : function(str) {
			return str.match(/[\s]/g) ? true : false;
		},
		isContainsSpecialChar : function(str) {
			return str.match(/[~!@\#$%^&*\()\=+_']/gi) ? true : false;
		},
		isValidYMD : function(ymdStr) {
			ymdStr = $.util.replaceAll(ymdStr, '-', '');

			var pt = /^\d{4}\d{2}\d{2}$/;

			if (! pt.test(ymdStr)) {
				return false;
			}

			var year  = Number(ymdStr.substring(0, 4));
			var month = Number(ymdStr.substring(4, 6));
			var day   = Number(ymdStr.substring(6));

			var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			// 날짜가 0이면 false
			if(day == 0) {
				return false;
			}

			//윤년여부
			var isLeaf = false;

			if(year % 4 == 0) {
				isLeaf = true;

				if(year % 100 == 0) {
					isLeaf = false;
				}

				if(year % 400 == 0) {
					isLeaf = true;
				}
			}

			var isValid = false;

			// 윤년일때
			if(isLeaf) {
				if(month == 2) {
					if(day <= monthDay[month-1] + 1) {
						isValid = true;
					}
				} else {
					if(day <= monthDay[month-1]) {
						isValid = true;
					}
				}
			} else {
				if(day <= monthDay[month-1]) {
					isValid = true;
				}
			}

			return isValid;
		},
		isValidYM : function(ymStr) {
			ymStr = $.util.replaceAll(ymStr, '-', '');

			var pt = /^\d{4}\d{2}$/;

			if (! pt.test(ymStr)) {
				return false;
			}

			var date = new Date();
			date.setFullYear(ymStr.substring(0, 4));
			date.setMonth(parseInt(ymStr.substring(4, 6),10) - 1);

			if(date.getFullYear() != parseInt(ymStr.substring(0, 4),10)
				|| date.getMonth()+1 != parseInt(ymStr.substring(4, 6),10)
				) {
				return false;
			}

			return true;
		},
		isPeriodDate : function(sdate, edate) {
			/* /hfn-web/src/main/webapp/js/util/util.all.js 에 선언되어 있는 ValidationUtil 사용 */

			var rst = { bool:true, msg:'' };

			if(typeof(sdate) == 'object' ) {
				sdate = sdate.value;
			}

			if(typeof(edate) == 'object') {
				edate = edate.value;
			}

			if($.cs.util.isEmpty(sdate) && $.cs.util.isEmpty(edate)) {
				return true;
			} else if($.cs.util.isEmpty(sdate)) {
				alert('기간 "시작일"을 입력해 주세요.');
				return false;
			} else if($.cs.util.isEmpty(edate)) {
				alert('기간 "종료일"을 입력해 주세요.');
				return false;
			}

			if(this.isValidYMD(sdate) && this.isValidYMD(edate)) {
				rst = ValidationUtil.is_period_date('DATE', sdate, edate);
			} else if(this.isValidYM(sdate) && this.isValidYM(edate)) {
				rst = ValidationUtil.is_period_date('MONTH', sdate, edate);
			} else {
				rst.bool = false;
				rst.msg = '날짜 입력 형식이 맞지 않습니다. 다시 입력해 주세요.';
			}

			if(!rst.bool) {
				alert(rst.msg);
			}

			return rst.bool;
		}
	};
	$.form = function(){
		var _isNotEmpty = function(o){return !_isEmpty(o);};
		var _isEmpty = function(o){
			return  (o == null || o == undefined || o == 'null' || o == 'undefined' || o == '') ? true : false;
		};
		var _rp = function(str, cert){
			if(!cert){
				if(_isNotEmpty(str)) str = str.replace(/[&]/gm,'%26').replace(/[+]/gm,'%2B');
			}
			return str;
		};
		var rf = typeof arguments[0] == 'string' ? document[arguments[0]] : arguments[0];
		rf._rightNoticeUse = {}; //임시전달용 _rightNotice
		rf._alert = function(_temp){
			var temp = _temp;
			if(temp!=undefined){
				this._rightNoticeUse.msg = temp;
			};
			var directionAttr = this._rightNoticeUse;
			if(directionAttr.direction!=null && directionAttr.direction=='right'){
				this._rightNotice(directionAttr);
			}else{
				alert(arguments[0]);  // 기존 AS-IS alert
			}
		};
		rf._rightNotice = function(o){
			/**
			 * 기존 validate 확장 element(span 을이용하여 안내)
			 * 기존 방식에  data-direction="right" 추가
			 */

			$(o.target).focus();
			var errorTag = $( document.createElement('span') )
			//.attr( "id", elementID + "-error" )
			.addClass( 'error' )
			.html( o.msg || '메시지가 없습니다.' );

			if(this.elementPlace(o)){
				setTimeout(function(){$(errorTag).insertAfter($(o.target)); $(o.target).addClass('error');},"300");
			}else{
				$(errorTag).insertAfter($(o.target).next());
			}


			$(o.target).addClass('error');

		};

		rf.elementPlace = function(o){
			if($(o.target).next().is('.select-box','input')){
				return false;
			}else{
				return true;
			}
		};

		rf.removeError = function(){

		};

		rf.validate = function() {
			var _elements= [];
			if(!arguments.length){
				for(var i = 0; i < this.elements.length; i++){
					//변경예정 1.26
					$(this.elements[i]).off('focus').on('focus',function(){
						$(this).siblings('.error').remove();
						$(this).removeClass('error');
					});
					_elements.push(this.elements[i]);
				}
			}else{
				var valiArg = ','+arguments[0]+',';
				for(var i = 0; i < this.elements.length; i++){
					if(this.elements[i].name && valiArg.indexOf(','+this.elements[i].name+',') > -1){

						_elements.push(this.elements[i]);

						$(this.elements[i]).off('focus').on('focus',function(){
							$(this).siblings('.error').remove();
							$(this).removeClass('error');
						});
					}
				}
			}
			return this._validate(_elements);
		};
		rf._getElementType  = function(ele){
			var _type = $(ele).attr('type');
			if(_type == undefined) _type = ""
			if(ele.nodeName && ele.nodeName == 'TEXTAREA') _type = 'textarea';
			if(ele.nodeName && ele.nodeName == 'SELECT') _type = 'select';
			return _type;
		};
		rf._validate = function(ele){
			var _bool = true;
			if(ele){
				for(var i = 0; i < ele.length; i++){
					var _attr = this._getAttr(ele[i]);
					var _type = this._getElementType(ele[i]);
					if(_type){
						_type = _type.toLowerCase();
						if(!_isEmpty(_type)){
							this._rightNoticeUse = _attr;
							if(_type == 'text' || _type == 'password' || _type == 'textarea' || _type == 'hidden'){
								if(_attr.msg){
									_bool = this._checkText(_attr);
									if(_bool && _attr.maxbyte) _bool = this._checkByte(_attr);

									if(_bool && _attr.period) _bool = this._checkPeriod(_attr);

								}
							}else if(_type == 'email'){
								if(_attr.msg){
									_bool = this._checkText(_attr);
									if(_bool) _bool = this._checkEmail(_attr);
									if(_bool && _attr.maxbyte) _bool = this._checkByte(_attr);
								}
							}else if(_type == 'number'){
								if(_attr.msg){
									_bool = this._checkText(_attr);
									if(_bool) _bool = this._checkNumber(_attr);
								}
							}else if(_type == 'checkbox'){
								_bool = _attr.msg ? this._checkCheckBox(_attr) : true;
							}else if(_type == 'radio'){
								_bool = _attr.msg ? this._checkRadioBox(_attr) : true;
							}else if(_type == 'select'){
								_bool = _attr.msg ? this._checkSelectBox(_attr) : true;
							}else if(_type == 'file'){
								_bool = _attr.msg ? this._checkFile(_attr) : true;
								if(_isNotEmpty(_attr.target.value) && _attr.extension && _bool)
									_bool = this._checkExtension(_attr);
							}
							if(_bool && _attr.func){
								if(_attr.func.match(/[a-zA-Z0-9]+[\s]*[\(].*[\)]/g)) _bool = eval(''+_attr.func);
								else _bool = eval(''+_attr.func+'.call();');
							}

							if(!_bool&&_attr.direction =='right'){ // data-directoin="right" 사용할경우 제외
								break;
							}

							if(!_bool){
								try{ ele[i].focus(); }catch(e){alert(e);}
								break;
							}
						}
					}
				}
			}
			return _bool;
		};
		rf._find = function(selector){
			var ro = [];
			$(rf).find(selector).each(function(){ro.push(this);});
			return ro;
		};
		rf._getEle = function(nm){
			var tnm = nm,p = null;
			if(nm.match(/([\[]{1}[_0-9a-zA-Z]+[:]{1}[_0-9a-zA-Z]+[\]]{1})/gim) != null){
				p = nm.match(/([\[]{1}[_0-9a-zA-Z]+[:]{1}[_0-9a-zA-Z]+[\]]{1})/gim);
				for(var i = 0; i < p.length; i++) tnm = tnm.replace(String(p[i]),'');
			}

			var _ele=[];
			for(var i = 0; i < this.elements.length; i++){
				if(this.elements[i].name && this.elements[i].name == tnm){
					if(p != null){
						if(this.isMatch(this.elements[i],p)) _ele.push(this.elements[i]);
					}else _ele.push(this.elements[i]);
				}
			}
			return _ele;
		};
		rf._checkByte = function(o){
			var _bool = true;
			var b = $.validator.getByte(o.target.value);
			if(b > parseInt(o.maxbyte,10)){
				this._alert(o.maxbyte+'byte 이내로 입력해주세요.');
				_bool = false;
			}
			return _bool;
		};

		rf._checkPeriod = function(o){
			var _bool = true;
			var sdate = '', edate = '';
			var arDate = [];

			if(o.period.indexOf(',') < 0) {
				this._alert('"\," 를 구분자로 시작일 필드명과 종료일 필드명을 지정해주시기 바랍니다.');
				return false;
			}

			try {
				arDate =  o.period.split(',');
				sdate = this.val(arDate[0].trim());
				edate = this.val(arDate[1].trim());
				_bool = $.validator.isPeriodDate(sdate, edate);
			} catch(e) {
				this._alert('"\," 를 구분자로 시작일 필드명과 종료일 필드명을 지정해주시기 바랍니다.');
				_bool = false;
			}

			return _bool;
		};


		rf._checkExtension = function(o){
			var _bool = false;
			var str = o.target.value;
			var ext = str.match(/[\.]+[a-zA-Z0-9]+$/gim);
			if(ext){
				ext = String(ext).toLowerCase().replace(/\./,'');
				var extension = ','+o.extension.toLowerCase()+',';
				_bool = extension.indexOf(','+ext+',') > -1 ? true : false;
				if(!_bool) this._alert(o.extension.toLowerCase()+'형식의 파일만 사용 가능합니다.');
			}
			return _bool;
		};
		rf._checkFile = function(o){
			var _bool = true;
			if(_isEmpty(o.target.value)){
				this._alert(o.msg);
				_bool = false;
			}
			return _bool;
		};
		rf._checkSelectBox = function(o){
			var _bool = true;
			if(!o.target.options || o.target.options.length == 0){
				_bool = false;
			}else{
				if(_isEmpty(o.target.options[o.target.options.selectedIndex].value)){
					this._alert(o.msg);
					_bool = false;
				}
			}
			return _bool;
		};
		rf._checkRadioBox = function(o){
			var _bool = true,_checkCnt = 0;;
			var _o = this._find('input[name="'+o.target.name+'"]');
			for(var i = 0; i < _o.length; i++) if(_o[i].checked) _checkCnt ++;
			if(_checkCnt > 0) _bool = true;
			else{
				this._alert(o.msg);
				_bool = false;
			}
			return _bool;
		};
		rf._checkCheckBox = function(o){
			var _bool = true,_checkCnt = 0;
			var _o = this._find('input[name="'+o.target.name+'"]');
			for(var i = 0; i < _o.length; i++) if(_o[i].checked) _checkCnt ++;
			if(_checkCnt > 0) _bool = true;
			else{
				this._alert(o.msg);
				_bool = false;
			}
			return _bool;
		};
		rf._checkText = function(o){
			var _bool = true;
			if(_isEmpty(o.target.value)){
				this._alert(o.msg);
				_bool = false;
			}
			return _bool;
		};
		rf._checkEmail = function(o){
			var _bool = true;
			if(!$.validator.isEmail(o.target.value)){
				this._alert('올바른 형식의 이메일 주소가 아닙니다.');
				_bool = false;
			}
			return _bool;
		};
		rf._checkNumber = function(o){
			var _bool = true;
			if(!$.validator.isNumber(o.target.value)){
				this._alert('숫자만 입력해 주세요');
				_bool = false;
			}
			return _bool;
		};
		rf._getAttr = function(o){
			return {
				target : o,
				msg : o.getAttribute('data-msg'),
				extension : o.getAttribute('data-extension'),
				maxbyte : o.getAttribute('data-maxbyte'),
				func : o.getAttribute('data-function'),
				period : o.getAttribute('data-period'),
				direction : o.getAttribute('data-directoin') // alert x  오른쪽 메시지
			};
		};
		rf.val = function(){
			if(arguments.length == 1) return this._get(arguments[0]);
			else return this._set(arguments[0],arguments[1]);
		};
		rf.foc = function(){
			var _el = this._getEle(arguments[0]);
			if(_el.length > 0){
				_el[0].focus();
			}
		};
		rf.chk = function(){
			var bool = true;
			if(arguments.length>1) bool = arguments[1];

			var _el = this._getEle(arguments[0]);
			for(var i=0;i<_el.length;i++){
				_el[i].checked = bool;
				_common.reinit_name(_el[i].name);
			}
			return rf;
		};
		rf.disab = function(){
			var bool = true;
			if(arguments.length>1) bool = arguments[1];

			var _el = this._getEle(arguments[0]);
			for(var i=0;i<_el.length;i++){
				_el[i].disabled = bool;
				_common.reinit_name(_el[i].name);
			}
			return rf;
		};
		rf.text = function(){
			var _returnStr = '';
			if(arguments.length > 0){
				var _el = this._getEle(arguments[0]);
				for(var i = 0; i < _el.length; i++){
					if(this._isSelectBox(_el[i])){
						if(_returnStr != '') _returnStr += ',';
						_returnStr = _el[i].options[_el[i].selectedIndex].text;
					}
				}
			}
			return _returnStr;
		};
		rf.options = function(){
			if(arguments.length > 0){
				var _el = this._getEle(arguments[0]);
				if(arguments.length == 1){
					for(var i = 0; i < _el.length; i++){
						var _len = _el[i].options.length;
						for(var j = 0; j < _len; j++){
							_el[i].options[0] = null;
						}
						_common.reinit_name(_el[i].name);
					}
				}else if(arguments.length == 2){
					for(var i = 0; i < _el.length; i++){
						var idx = arguments[1];
						if(typeof(idx) != 'number'){
							idx = this._selectedTextIndex(_el[i],arguments[1]);
						}
						_el[i].options[idx] = null;
						_common.reinit_name(_el[i].name);
					}
				}else if(arguments.length > 2){
					for(var i = 0; i < _el.length; i++){
						_el[i].options[_el[i].options.length] = new Option(arguments[2],arguments[1]);
						_common.reinit_name(_el[i].name);
					}
				}
			}
			return rf;
		},
		rf._selectedTextIndex = function(o,txt){
			var _returnIdx = -1;
			if(this._isSelectBox(o)){
				for(var i = 0; i < o.options.length; i++){
					if(o.options[i].value == txt){
						_returnIdx = i;
						break;
					}
				}
			}
			return _returnIdx;
		},
		rf._isSelectBox = function(o){
			return (o && o.nodeName && o.nodeName.toLowerCase() == 'select');
		},
		rf.decVal = function(nm, type, callback) {
			var returnMsg = "";

			var ns = "decVal_" + (1 + Math.floor(Math.random() * 100000000));	// 임시 ID 발급용
			var isEmptyId = false, isBadName = false;

			var $obj = $(this._getEle(nm));
			if ($obj.val().length == 0) {
				if("EF" == top.getMediaType()){
					alert("The Password you entered is wrong");
				}else{
					alert("비밀번호를 입력해주세요.");
				}
				$obj.focus();
				return "";
			}
			if ($obj.attr("id") == "") {
				$obj.attr("id", ns);
				isEmptyId = true;
			}
			if (type == "X") {
				sse.postByIds($obj.attr("id"), {
						url: "/ux/common/getData.do"
						, async: false
						, type: "POST"
						, dataType: "json"
						, data: "field=" + nm
				}).then(function (response) {
					callback(response.result);
					if (isEmptyId) {	// ID가 없었던 경우
						$obj.removeAttr("id");
					}
					return returnMsg;
				});
			} else {
				sse.postByIds($obj.attr("id"), {
						url: "/ux/common/encrypt.do"
						, type: "POST"
						, dataType: "json"
						, data: "type=" + type + "&field=" + nm
						, async: false
				}).then(function (response) {
					if (response.hasOwnProperty("errorCode")) {
						if("EF" == top.getMediaType()){
							alert('비밀번호 인증 후에 해당 내역을 보실 수 있습니다.');
						}else{
							alert('비밀번호 인증 후에 해당 내역을 보실 수 있습니다.');
						}
					} else {
						returnMsg = response.encPwd;
						callback(response.encPwd);
					}
					if (isEmptyId) {	// ID가 없었던 경우
						$obj.removeAttr("id");
					}
					return returnMsg;
				});
			}
		};
		rf.decVal2 = function(id, nm, type, callback) {
			var returnMsg = "";
			sse.postByNames(nm,{
				url: "/ux/common/encrypt.do"
				, type: "POST"
				, dataType: "json"
				, data: {type: type}}).then(function (response) {
				if (response.hasOwnProperty("errorCode")) {
					if("EF" == top.getMediaType()){
						alert('비밀번호 인증 후에 해당 내역을 보실 수 있습니다.');
					}else{
						alert('비밀번호 인증 후에 해당 내역을 보실 수 있습니다.');
					}
				} else {
					returnMsg = response.encPwd;
					callback(response.encPwd);
				}
			});
			return returnMsg;
		};
		rf.decVal3 = function(nm, type ,  isPass , callback ) {
			type = '3'; 
			var returnMsg = "";

			var ns = "decVal_" + (1 + Math.floor(Math.random() * 100000000));	// 임시 ID 발급용
			var isEmptyId = false, isBadName = false;

			var $obj = $(this._getEle(nm));
			if ($obj.val().length == 0) {
				if("EF" == top.getMediaType()){
					alert("비밀번호를 입력해주세요.");
				}else{
					alert("비밀번호를 입력해주세요.");
				}
				callback("error");
				return "";
			}
			if ($obj.attr("id") == "") {
				$obj.attr("id", ns);
				isEmptyId = true;
			}

			if (type == "X") {
				sse.postByIds($obj.attr("id"), {
						url: "/ux/common/getData.do"
						, async: false
						, type: "POST"
						, dataType: "json"
						, data: "field=" + nm
				}).then(function (response) {
					callback(response.encPwd);
					if (isEmptyId) {	// ID가 없었던 경우
						$obj.removeAttr("id");
					}
					return returnMsg;
				});
			} else {

				if(isPass == 'Y'){

					if(rf.val(nm) == "****"){
						callback("****");
						return;
					}
				}

				sse.postByIds($obj.attr("id"), {
					url: "/ux/common/encrypt.do"
					, type: "POST"
					, dataType: "json"
					, data: "type=" + type + "&field=" + nm
					, async: false
				}).then(function (response) {
					if (response.hasOwnProperty("errorCode")) {
						if("EF" == top.getMediaType()){
							alert('비밀번호 인증 후에 해당 내역을 보실 수 있습니다.');
						}else{
							alert('비밀번호 인증 후에 해당 내역을 보실 수 있습니다.');
						}
						callback("error");
					} else {
						returnMsg = response.encPwd;
						callback(response.encPwd);
					}
					if (isEmptyId) {	// ID가 없었던 경우
						$obj.removeAttr("id");
					}
					return returnMsg;
				});
			}
		};
		rf._set = function(nm,val){
			var _e = this._getEle(nm);
			if(_e.length){
				for(var i = 0; i < _e.length; i++){
					var _type = this._getElementType(_e[i]);
					_type = _type.toLowerCase();
					if(_type == 'select'){
						if(_e[i].options && _e[i].options.length){
							for(var j = 0; j < _e[i].options.length; j++){
								if(_e[i].options[j].value == val){
									_e[i].options[j].selected = true;
								}
							}
						}
						_common.reinit_name(_e[i].name);
					}else if(_type == 'checkbox' || _type == 'radio'){
						if(_e[i].value == val){
							_e[i].checked = true;
							_common.reinit_name(_e[i].name);
						}
					}else{
						_e[i].value = val;
					}
				}
			}else{
				if(nm.match(/([\[]{1}[_0-9a-zA-Z]+[:]{1}[_0-9a-zA-Z]+[\]]{1})/gim) == null){
					var _e = document.createElement('INPUT');
					_e.type='hidden';
					_e.id=nm;
					_e.name=nm;
					_e.value = val;
					rf.appendChild(_e);
					_e.setAttribute('data-added','Y');
				}
			}
			return rf;
		};
		rf.isMatch = function(o,p){
			var bool = true;
			for(var i =0; i < p.length; i++){
				var _p = String(p[i]).replace(/(\[|\])/gim,'').split(':');
				if(o.getAttribute && o.getAttribute(_p[0]) != _p[1]){
					bool = false;
					break;
				}
			}
			return bool;
		};
		rf._getEleAttr = function(t,p){
			var o = [];
			for(var i = 0; i < t.length; i++){
				if(this.isMatch(t[i],p))
					o.push(t[i]);
			}
			return o;
		},
		rf._get = function(nm){
			var _e = this._getEle(nm);
			var _val = '';
			for(var i = 0; i < _e.length; i++){
				var _type = this._getElementType(_e[i]);
				_type = _type.toLowerCase();
				if(_type == 'text' || _type == 'hidden' || _type == 'email' || _type == 'password' || _type == 'number' || _type == 'textarea' || _type == 'file'){
					if(_e[i].value){
						if(_val != '') _val +=',';
						_val += _e[i].value;
					}
				}else if(_type == 'checkbox' || _type == 'radio'){
					if(_e[i].checked){
						if(_val != '') _val +=',';
						_val += _e[i].value;
					}
				}else if(_type == 'select'){
					if(_e[i].options && _e[i].options.length) {
						if(_e[i].options[_e[i].options.selectedIndex]) {
							if(_e[i].options[_e[i].options.selectedIndex].value != ''){
								if(_val != '') _val +=',';
								_val += _e[i].options[_e[i].options.selectedIndex].value;
							}
						}
					}
				}
			}
			return _val;
		};
		rf._hasKey = function(el,key){
			var _bool = false;
			for(var i = 0; i < el.length; i++){
				if(el[i] == key){
					_bool = true;
					break;
				}
			}
			return _bool;
		};
		rf.toParameterString = function(cmd,cert){
			if(cmd) rf._set('cmd',cmd);
			if(!cert) cert = false;
			cert = false;	// 하하하하하하
			this._beforeSubmit();
			var _returnStr = '';
			var cmdValue = '';
			var _params = [];

			// 보안적용여부 확인
			var isSecure = $(this).find("input").filter(function () {
				var attr = $(this).attr("e2e_type");
				return (attr && attr == "1");
			}).length > 0;

			if (isSecure) {
				$(this).find("input[name='e2e_data1']").remove();
				_returnStr = $(this).serialize().replaceAll("+", "%20");
				_returnStr += "&SSEF=" + this.name;
			} else {
				for(var i = 0; i < this.elements.length; i++){
					if(this.elements[i].name){
						var nm = this.elements[i].name;
						if(!this._hasKey(_params,nm)){
							_params.push(nm);
							if(_returnStr) _returnStr +='&';
							_returnStr += nm + '=' + _rp(this._get(nm));
						}
					}
				}
			}
			return _returnStr;
		};
		rf.toMobileParameterString = function(cmd,cert){
			if(cmd) rf._set('cmd',cmd);
			if(!cert) cert = false;
			this._beforeSubmit();
			var _returnStr = '';

			var _params = [];
			_returnStr = '';
			for(var i = 0; i < this.elements.length; i++){
				if(this.elements[i].name){
					var nm = this.elements[i].name;
					if(!this._hasKey(_params,nm)){
						_params.push(nm);
						if(_returnStr) _returnStr +='&';
						_returnStr += nm+'='+_rp(this._get(nm));
					}
				}
			}
			return _returnStr;
		};

		rf.empty = function(pat){
			if(pat){
				if(pat.indexOf('*') > -1) pat = pat.replace(/[*]/gm,"(.+)");
				var p = new RegExp('^'+pat+'$');
				for(var i = 0; i < this.elements.length; i++){
					if(this.elements[i].name && p.test(this.elements[i].name)) {
						try {
							this._set(this.elements[i].name,'');
							sse.clear(this.elements[i]);
						} catch (e) {
							// ignore
							logger.debug("E2E 초기화 설정 오류! 고치세요!")
						}
					}
				}
			}
			return rf;
		};
		rf.clear = function(){
			var len = this.elements.length;
			var removeArray = [];
			for(var i = 0; i < len; i++){
				if(this.elements[i].getAttribute('data-added') && this.elements[i].getAttribute('data-added') == 'Y'){
					removeArray.push(this.elements[i]);
				}
			}
			len = removeArray.length;
			for(var i = 0; i < len; i++){
				this.removeChild(removeArray[i]);
			}
			return rf;
		};
		rf._beforeSubmit = function(cmd){
			if(cmd) {
				if(typeof(this.action)!='undefined') {
					var actionUrl = this.action;
					if(actionUrl.toLowerCase().indexOf('cmd=') < 0) {
						if(actionUrl.indexOf('?') < 0) {
							actionUrl += '?cmd='+cmd;
						} else {
							actionUrl += '&cmd='+cmd;
						}
						this.action = actionUrl;
					}
				}
				this._set('cmd',cmd);

			}

			//모바일 공인인증 전역 변수
			if(typeof(af_auto_index) != 'undefined' && af_auto_index != null) {
				this._set('af_auto_index', af_auto_index);
			}

			// 가상키패드 적용으로 주석 해제.
			try{
				// 가상키보드 submit 전처리
				if(tk!=undefined || tk!=null){
					tk.fillEncData();
				};
			}catch(e){
				//logger.debug("tk err");
			};

		};
		rf.cSubmit = function(cmd){ //common submit
			this._beforeSubmit(cmd);
			/*
			SUBMIT
			*/
			rf.submit(cmd);
		};
		rf.csSubmit = function(cmd){ //common secure submit
			this._beforeSubmit(cmd);

			//rf.submit();
			//return; //성능테스트 스크립트 처리를 위해 E2E 제거

			if (client.isMobile) {
				rf.submit();
			} else {
				if (typeof sse == "object") {
					sse.submit($(this));
				} else {
					rf.submit();
				}
			}
		};
		rf.csResult = function(cmd,resultURL,resultSuccess,resultError){
			if(!resultURL) resultURL = this.action;
			if(!resultSuccess){
				resultSuccess = function(r){$('#container').html(r);};
			}
			$.cs.ajax({
				type : 'post',
				url : resultURL,
				data : this.toParameterString(cmd, true),
				dataType : 'html',
				success : function(r){
					r = $.util.trim(r);
					if(r.indexOf('ERROR:') == 0){
						/**
						 * 기존 : ERROR:처리중 오류가 발생하였습니다.
						 * 수정 : ERROR:처리중 오류가 발생하였습니다.,MSGCODE:00032
						 * */
						alert(r.replace(/^ERROR:/,'').replace(/,MSGCODE.+/,''));
						if(resultError) resultError(r);
					}else{
						if(resultSuccess) resultSuccess(r);
					}
				},error : function(e){
					if(resultError) resultError(e);
				},loadingStart : true,loadingEnd:true
			});
		};
		rf.kdef = function(){
			return;

			var kpad = true;
			var e = [];
			if(arguments.length == 0){
				e = this.elements;
			}else if(arguments.length == 1){
				if(typeof arguments[0] == 'boolean'){
					kpad = arguments[0];
					e = this.elements;
				}else{
					e = this._getEle(arguments[0]);
				}
			}else{
				e = this._getEle(arguments[0]);
				kpad = arguments[1];
			}
			if(e.length > 0){
				for(var i = 0; i < e.length; i++){
					if(e[i].type && e[i].type.toLowerCase() == 'password'){

						if(!$(e[i]).attr('data-tk-kbdType')){
							$(e[i]).removeAttr('data-tk-kbdtype');
						}
						$(e[i]).attr('data-tk-kbdType','number');
						var nm = e[i].name;
						var innm = '#'+nm+'_tk_btn';
						if(!$(innm).length > 0){
							alert('마우스 입력 버튼을 선언하지 않았습니다.');
							return false;
						}
						if(!e[i].id){e[i].id=nm;}

						if(e[i].id != nm){
							alert('암호화 필드의 ID 와 NAME이 일치하지 않습니다.');
							return false;
						}
						$(e[i]).click(function(){
							tk.onKeyboard(this);
						});
						var ftxt = this.name+"."+nm;
						regFormEle_K(ftxt, "none");
						regFormEle_Submit(nm);
					}
				}
			}

			if(kpad != false){
				initVirtualKeyPad();
			}
		};
		rf.setParam = function(url, evt) {
			if(url == '') return false;
			var params = url.split('&');
			for(var i = 0; i < params.length; i++){
				var param = params[i].split('=');
				if(param.length != 2) continue;
				var nm = param[0];
				var vals = param[1].split(',');
				for(var j = 0; j < vals.length; j++){
					if(evt) {
						$('input[name="' + nm + '"][value="' + vals[j] + '"]').trigger(evt);
					} else {
						this.val(nm, vals[j]);
					}
				}
			}
		};
		return rf;
	};

	$.cs = {
			msg : {
				NO_SEARCH_RESULT : '검색결과가 없습니다.',
				NO_QUERY_RESULT : '조회 내역이 없습니다.',
				NO_DATA_RESULT : '데이터가 없습니다.',
				NO_CONTENT_RESULT : '내용이 없습니다.',
				USE_MOUSE_INPUT : '마우스로 입력',
				//NOT_SUPPORTED : '지원하지 않는 운영체제 환경입니다.'
				NOT_SUPPORTED : '고객님의 운영체제에서는 조회전용으로만 이용 가능합니다.',
				NO_DATA_RESULT_ENG : 'No data',
				NO_CONTENT_RESULT_ENG : 'No data'
			},
			format : {
				DEFAULT_DATE_FORMAT : 'yyyy-MM-dd'
			},
			form : $.form,
			validator : $.validator,
			loading : {open : function(){_common.open_loading();},close : function(){_common.close_loading();}},
			ajax : function(o){
				if(!o.type) o.type='post';
				if(!o.dataType) o.dataType ='json';
				if(o.loadingStart && o.loadingStart == true) $.cs.loading.open();
				// 보안적용 대상 파라미터가 포함된경우
				var e2eList = [];
				var params = [];
				var formName = "";
				if (o.data && (typeof o.data == "string") && o.data.indexOf("SSEF") > -1) {
					var paramArray = o.hasOwnProperty("data") ? o.data.split("&") : [];
					$.each(paramArray, function (i, value) {
						if (value.contains("SSEF")) {
							formName = value.split("=")[1];
						} else {
							params.push({name: value.split("=")[0], value: decodeURIComponent(value.split("=")[1])});
						}
					});
					if (formName != "") {
						var $form = $("form[name='" + formName+ "']:first");
						e2eList = $form.find("input").filter(function () {
							return $(this).attr("e2e_type") == "1";
						});
						$.each(e2eList, function (i, obj) {		// e2e 적용 파라미터 삭제
							$.each(params, function (i, item) {
								if (obj.name == item.name) {
									params.splice(i, 1);return false;
								}
							});
						});
					}
				}
				if(o.success){
					var _succ = o.success;
					o.success = function(r){
						try{ window.extendLoginTime(false); } catch(e) {} //Ajax 실행 시 로그인타이머 리셋;
						if(o.loadingEnd && o.loadingEnd  == true){
							$.cs.loading.close();
						}
						_succ.call(this,r);
						try{
							// 2014.11.27 bluewebd CP 동작이슈로 re-open
							_common.reinit_css3();		//ie7,8 css3적용(ie7,8에서만 동작) // 2014.11.18 bluewebd ie7,8 close
							_common.resize_ui();
						}catch(e){};
					};
				}
				if(o.error){
					var _err = o.error;
					o.error = function(r){
						try{ window.extendLoginTime(false); } catch(e) {} //Ajax 실행 시 로그인타이머 리셋;
						if(o.loadingEnd && o.loadingEnd  == true){
							$.cs.loading.close();
						}
						_err.call(this,r);
					};
				} else {
					o.error = function(r){
						try{ window.extendLoginTime(false); } catch(e) {} //Ajax 실행 시 로그인타이머 리셋;
						if(o.loadingEnd && o.loadingEnd  == true){
							$.cs.loading.close();
						}
						var resMsg = r.responseText;

						resMsg=resMsg.trim();

						/*ajax call 시 권한없는 controller 에 접근할 경우 시스템 오류로 메세지를 뛰워서 권한 없다는 메세지 띄우게 처리 */
						if(resMsg.indexOf('ERROR:') == 0){
							resMsg = resMsg.replace(/^ERROR:/,'').replace(/,MSGCODE.+/,'');
						} else {
							if(typeof(getServerFlag)!='undefined') {
								if(getServerFlag().length == 2) {
									resMsg = '시스템 오류가 발생하였습니다.';
								} else {
									resMsg = '이 메세지는 개발계와 테스트계에서만 오류 확인을 위하여 표시되는 메세지입니다.\n\n\n' + resMsg;
								}
							} else {
								resMsg = '시스템 오류가 발생하였습니다.';
							}
						}
						throw resMsg;
					};
				}
				if(o.data){
					if (typeof o.data == "object") {
						o.data.ajaxQuery = 1;
					} else {
						o.data = o.data + '&ajaxQuery=1';
					}
				}

				if (e2eList.length == 0) {
				 	return $.ajax(o);
				} else {
					var e2eNameArray = $.map(e2eList, function (obj, i) {return obj.name});
					var paramString = $.param(params);
					o.data = paramString;

					if (formName != "") {
						var ns = "sse_" + (1 + Math.floor(Math.random() * 100000000));
						var getId = function (name) {
							var $obj = $("form[name='" + formName + "'] input[name='" + name + "']");
							return $.map($obj, function (obj, i) {
								var id = ns + "_" + i;
								if (obj.id == "") {
									obj.id = id;
								} else {
									id = obj.id;
								}
								return id;
							});
						};

						var ids = $.isArray(e2eNameArray) ? $.map(e2eNameArray, function (name, i) {
							return getId(name);
						}) : getId(e2eNameArray);
						sse.postByIds(ids, o).then(function (response) {
							return response;
						});
					}
				}
			},
			event : {
				scroll : {VERTICAL : '1',	HORIZONTAL : '2'},
				scrollEndEvent : function(par,tar,evt,state){
					if(!state) state = this.scroll.VERTICAL;
					if(state == this.scroll.HORIZONTAL)
						new ScrollHorizontalEventUtil(par,tar,evt);
					else
						new ScrollVerticalEventUtil(par,tar,evt);
				},
				enterEvent : function(tar,evt){
					if(evt){
						$(tar).keypress(function(e){
							if(e.keyCode == 13 && evt){
								evt.call(this);
							}
						});
					}
				},
				sortEvent : function(tar, evt){
					if(!tar) tar = 'thead.sort tr th a';


					if(evt){
						$(tar).not('.help').not('.close').click(function () { // a link help 도움말 있는 케이스는 제외
							var sortColumn = '';
							var sortType = '';
							var column = $(this).attr('column');
							$(tar).each(function(i){
								var $a = $(this);
								var col = $a.attr('column');
								if(!col) return true;
								if(!$a.attr('def_class')) $a.attr('def_class', $a.attr('class'));
								var def_class = $a.attr('def_class');
								if(column == col) {
									var cls = $a.attr('class');
									if($a.parent().hasClass('on')) cls = (cls == 'down' ? 'up' : 'down');
									sortColumn = col;
									sortType = (cls == 'up' ? 'ASC' : 'DESC');
//									$a.parent().attr('class', 'on');
									$a.parent().removeClass('off').addClass( 'on');
									$a.attr('class',cls);
									$a.attr('title',(cls == 'down' ? '내림차순' : '올림차순') + '으로 정렬');
								} else {
									cls = def_class;
//									$a.parent().attr('class','off');
									$a.parent().removeClass('on').addClass( 'off');
									$a.attr('class',cls);
									$a.attr('title',(cls == 'down' ? '내림차순' : '올림차순') + '으로 정렬');
								}
							});
							eval(evt + '(\'' + sortColumn + '\',\'' + sortType + '\')');
						});
					}
				},
				numberInput : function(obj){
					obj = $(obj);
					obj.css('imeMode','disabled');
					obj.keydown(function(e){
						if((e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 189 || (e.keyCode > 95 && e.keyCode < 106)) e.returnValue = true;
						else e.returnValue = false;
					});
				}
			},
			util : {
				replaceAll : function(str, str_asis, str_tobe) {
					//return str.replace(/str_asis/g, str_tobe);
					return str.split(str_asis).join(str_tobe);
				},
				encodeParam : function(str){
					return str.replace(/[&]/gm,'%26').replace(/[+]/gm,'%2B');
				},
				numberOnly : function(str){
					return str.replace(/[^0-9]/gim,'');
				},
				ratioNumberOnly : function(str){
					return str.replace(/[^0-9\.]/gim,'');
				},
				removeFirstZero : function(str){
					return str.replace(/^0+/gim,'');
				},
				getAcctNo : function(acctNo){
					var _acctNo = '';
					if(acctNo!=''){
						var accttype = Number(acctNo.substr(0,1));
						if(accttype < 7){
							_acctNo = acctNo.substring(0,8) + '-' + acctNo.substring(8);
						} else {
							_acctNo = acctNo.substring(0,10) + '-' + acctNo.substring(10);
						}
					}
					return _acctNo;
				},
				isIsaAccount:function( accno ){
					var account = accno;
					if(account.length > 20){ account = account.substring(0,20);}
					account =  this.trim(account);
					if(account.substring(account.length-2) == "14"){
						return true;
					}else{
						return false;
					}
				},
				isForeignAccount:function( accno ){
					var account = accno;
					if(account.length > 20){ account = account.substring(0,20);}
					account =  this.trim(account);
					if(account.substring(account.length-2) == "13"){
						return true;
					}else{
						return false;
					}
				},
				getDayOfWeek : function(ymdStr) {
					if(! $.validator.isValidYMD(ymdStr)) {
						return '';
					}

					var week = new Array('일', '월', '화', '수', '목', '금', '토');

					var yyyy = ymdStr.substring(0, 4);
					var mm   = ymdStr.substring(4, 6);
					var dd   = ymdStr.substring(6, 8);

					var d = new Date(yyyy, mm - 1, dd);

					return week[d.getDay()];
				},
				noChartData : function(family, weight, size, align, color) {
					family = family || '\"맑은 고딕\",\"Malgun Gothic\",\"돋음\",Dotum,AppleGothic,Arial,Helvetica,sans-serif';
					weight = weight || 'normal';
					size   = size   || '14px';
					align  = align  || 'center';
					color  = color  || '#000';

					var noChartDataStyle = {
						fontFamily: family,
						fontWeight: weight,
						fontSize: size,
						textAlign: align,
						color: color
					};

					return noChartDataStyle;
				},
				noTableData : function(row,msg,cls,keyword){
					cls = cls || 'no_data';
					row = row || 10;
					msg = msg || '';

					var rtnStr = '';
					if(keyword) {
						rtnStr = '<tr><td colspan="'+row+'" class="'+cls+'"><p>' + '\'<strong>' + keyword + '</strong>\' 에 대한 검색결과가 없습니다.' + '</p></td></tr>';
					} else {
						rtnStr = '<tr><td colspan="'+row+'" class="'+cls+'"><p>'+msg+'</p></td></tr>';
					}

					return rtnStr;
				},
				//2016-05-03 수정
				noListData : function(msg,cls,keyword){
                					cls = cls || 'noData';
                					msg = msg || '';

                            var rtnStr = '';
                            if(keyword) {
                                rtnStr = '<li class='+cls+'>'+ '\'<strong>' + keyword + '</strong>\' 에 대한 검색결과가 없습니다.' +'</li>';
                            } else {
                                rtnStr = '<li class='+cls+'>'+msg+'</li>';
                            }

                            return rtnStr;
                        },


				getTotal : function(totalCount, rowsPerPage, currentPage, keyword){
					totalCount = totalCount || 0;
					rowsPerPage = rowsPerPage || 15;
					currentPage = currentPage || 1;
					var rtnStr = '';
					if(keyword) {
						rtnStr = '\'<strong>' + keyword + '</strong>\' 검색결과 (총 <em>' + totalCount + '</em>건)';
					} else {
						rtnStr = '전체: <em>' + totalCount + '</em>건' + ' <small><em>' + currentPage + '</em>/' + (totalCount == 0 ? '1' : Math.ceil(totalCount / rowsPerPage)) + ' 페이지' + '</small>';
					}
					return rtnStr;
				},
				//뱅킹 스타일 추가 @2016-08-30
				getBankingTotal : function(totalCount, rowsPerPage, currentPage, keyword){
					totalCount = totalCount || 0;
					rowsPerPage = rowsPerPage || 15;
					currentPage = currentPage || 1;
					var rtnStr = '';
					if(keyword) {
						rtnStr = '\'<strong>' + keyword + '</strong>\' 검색결과 (총 <em>' + totalCount + '</em>건)';
					} else {
						rtnStr = '전체: <strong>' + totalCount + '</strong>건' + ' (<strong> ' + currentPage + ' </strong> &#47; ' + (totalCount == 0 ? '1' : Math.ceil(totalCount / rowsPerPage)) + ' 페이지)';
					}
					return rtnStr;
				},

				getTotalFaq : function(totalCount, rowsPerPage, currentPage){
					totalCount = totalCount || 0;
					rowsPerPage = rowsPerPage || 15;
					currentPage = currentPage || 1;
					var rtnStr = '';
					      rtnStr = '전체: <strong>' + totalCount + '</strong>건' + ' <span><mark>' + currentPage + '</mark>&#47;' + (totalCount == 0 ? '1' : Math.ceil(totalCount / rowsPerPage)) + ' 페이지' + '</span>';
					return rtnStr;
				},

				getTotalScroll : function(totalCount, keyword){
					totalCount = totalCount || 0;
					var rtnStr = '';
					if(keyword) {
						rtnStr = '\'<strong>' + keyword + '</strong>\' 검색결과 (총 <em>' + totalCount + '</em>건)';
					} else {
						rtnStr = '전체: <em>' + totalCount + '</em>건';
					}
					return rtnStr;
				},
				lowerCase : function(val){
					return val ? val.toLowerCase() : '';
				},
				upperCase : function(val){
					return val ? val.toUpperCase() : '';
				},
				isEmpty : function(val){
					val = this.trim(String(val));
					return (val == null || val == undefined || val == 'null' || val == 'undefined' || val == '') ? true : false;
				},
				roundPoint : function(){
					if(typeof arguments[0] == 'string'){
						if(arguments[0] == "") arguments[0] = "0";
						arguments[0] = parseFloat(arguments[0].replace(/[^-0-9.]/g,''));
					}
					if(arguments.length == 2) return this._roundPoint(arguments[0],arguments[1]);
					else return Math.round(arguments[0]);
				},
				_roundPoint : function(){
					var tmp = arguments[0];
					tmp = tmp * Math.pow(10,arguments[1]);
					tmp = Math.round(tmp);
					return tmp/Math.pow(10,arguments[1]);
				},
				toInt : function(str){
					if(typeof str == 'number') return str;
					return parseInt(String(str).replace(/[^-0-9.]/g,'')||0,10);
				},
				toFloat : function(){
					return parseFloat(arguments[0].replace(/[^-0-9.]/g,''));
				},
				trim : function(){
					return String(arguments[0]).replace(/(^\s*)|(\s*$)/g,'');
				},
				ltrim : function(){
					return String(arguments[0]).replace(/(^\s*)/g,'');
				},
				rtrim : function(){
					return String(arguments[0]).replace(/(\s*$)/g,'');
				},
				equals : function(){
					if(arguments[0] == arguments[1]) return true;
					else return false;
				},
				append : function(){
					if(arguments.length > 1){
						var _strTmp = arguments[0];
						for(var i = 1;i < arguments.length;i++) _strTmp = _strTmp + arguments[i];
						return _strTmp;
					}else return arguments[0];
				},
				_rightPad : function(){
					return String(arguments[0]) + String(arguments[1]);
				},
				_rightPadLoop : function(){
					var a = 'number' ==  typeof arguments[1]? arguments[1] : this.toInt(arguments[1]);
					var _strTmp = arguments[0];
					if(_strTmp.length < a)
						for(var i = arguments[0].length;i < a;i++) _strTmp = this._rightPad(_strTmp,arguments[2]);
					return _strTmp;
				},
				rightPad : function(){
					if(arguments.length == 2) return this._rightPad(arguments[0],arguments[1]);
					else if(arguments.length == 3) return this._rightPadLoop(arguments[0],arguments[1],arguments[2]);
					else return arguments[0];
				},
				_leftPad : function(){
					return String(arguments[1]) + String(arguments[0]);
				},
				_leftPadLoop : function(){
					var a = 'number' ==  typeof arguments[1]? arguments[1] : this.toInt(arguments[1]);
					var _strTmp = arguments[0];
					if(_strTmp.length < a)
						for(var i = arguments[0].length;i < a;i++) _strTmp = this._leftPad(_strTmp,arguments[2]);
					return _strTmp;
				},
				leftPad : function(){
					if(arguments.length == 2) return this._leftPad(arguments[0],arguments[1]);
					else if(arguments.length == 3) return this._leftPadLoop(arguments[0],arguments[1],arguments[2]);
					else return arguments[0];
				},
				getChars : function(){
					arguments[0] = String(arguments[0]);
					var b = new Array();
					for(var i = 0; i < arguments[0].length; i++) b[i] = arguments[0].charAt(i);
					return b;
				},
				reverse : function(){
					var t1 = this.getChars(arguments[0]),tmp='';
					for(var i = t1.length-1;i >= 0;i--) tmp = this.append(tmp,t1[i]);
					return tmp;
				},
				lastIndexOf : function(){
					arguments[0] = String(arguments[0]);
					var keyLen = arguments[1].length,
						len = arguments[0].length,
						siht = this.reverse(arguments[0]),
						yek = this.reverse(arguments[1]),
						idx = -1;
					for(var i = 0;i < len;i++){
						if(siht.substring(i,i+keyLen) == yek){
							idx = i+keyLen;
							break;
						}
					}
					if(idx > -1) idx = len-idx;
					return idx;
				},
				dateFormat : function(){
					if($.cs.util.isEmpty(arguments[0])) return "";
					else{
						if(arguments[0] instanceof Date){
							var result = '';
							result += String(arguments[0].getFullYear());
							result += this.leftPad(String(arguments[0].getMonth()+1),2,'0');
							result += this.leftPad(String(arguments[0].getDate()),2,'0');
							result += ' ';
							result += this.leftPad(String(arguments[0].getHours()),2,'0');
							result += this.leftPad(String(arguments[0].getMinutes()),2,'0');
							result += this.leftPad(String(arguments[0].getSeconds()),2,'0');
							if(arguments[1]) return this.dateFormat(result,arguments[1]);
							else return result;
						}else{
							var tmpDt = String(arguments[0]).replace(/[^0-9]/gi,'');
							var format = $.cs.format.DEFAULT_DATE_FORMAT;
							if(arguments.length > 1) format = arguments[1];
							var _dt = new Date();
							var year = tmpDt.length >= 4 ? tmpDt.substring(0,4) : String(_dt.getFullYear());
							var month = tmpDt.length >= 6 ? tmpDt.substring(4,6) : this.leftPad(String(_dt.getMonth()+1),2,'0');
							var date = tmpDt.length >= 8 ? tmpDt.substring(6,8) : this.leftPad(String(_dt.getDate()),2,'0');
							var hours = tmpDt.length >= 10 ? tmpDt.substring(8,10) : this.leftPad(String(_dt.getHours()),2,'0');
							var minutes = tmpDt.length >= 12 ? tmpDt.substring(10,12) : this.leftPad(String(_dt.getMinutes()),2,'0');
							var seconds = tmpDt.length >= 14 ? tmpDt.substring(12,14) : this.leftPad(String(_dt.getSeconds()),2,'0');
							var yearCount=0,monthCount=0,dateCount=0,hourCount=0,minCount=0,secCount=0;
							for(var i=0;i<format.length;i++){
								var str = format.charAt(i);
								if(str=='y') yearCount++;
								if(str=='M') monthCount++;
								if(str=='d') dateCount++;
								if(str=='H' || str=='h') hourCount++;
								if(str=='m') minCount++;
								if(str=='s') secCount++;
							}
							format = format.replace(/[y]+/g,String(year).substring(String(year).length-yearCount));
							format = format.replace(/[M]+/g,String(month).substring(String(month).length-monthCount));
							format = format.replace(/[d]+/g,String(date).substring(String(date).length-dateCount));
							format = format.replace(/[h|H]+/g,String(hours).substring(String(hours).length-hourCount));
							format = format.replace(/[m]+/g,String(minutes).substring(String(minutes).length-minCount));
							format = format.replace(/[s]+/g,String(seconds).substring(String(seconds).length-secCount));
							return format;
						}
					}
				},
				numberFormat : function(){
					if($.cs.util.isEmpty(arguments[0])) return "";
					arguments[0] = String(arguments[0]);
					var temp=String(arguments[0]),format='###,###,###,###,###,###,###,###,###',a=0,b=3;
					var spr = arguments.length > 1 ? arguments[1] : 2;
					if(arguments.length > 2 && arguments[0].indexOf('.') > -1) arguments[0] = arguments[0].substring(0,arguments[0].indexOf('.')+spr+1);
					var tmpStr = String(arguments[0]).replace(/[^-0-9.]/g,'');
					if('' == tmpStr) tmpStr = '0';
					var str = String(this._roundPoint(this.toFloat(tmpStr),spr)).split('.');
					var reformat = this.reverse(format);
					var rethis = this.reverse(str[0]);
					var flen = format.split(',');
						for(var i = 0;i < flen.length;i++){
							reformat = reformat.replace(/[#]{1,}/,rethis.substring(a,b));
							a = a+3,b = b+3;
						}
					temp = this.reverse(reformat).replace(/,{1,}/,'').replace(/-,/g,'-');

					if(str[1]){
						temp = this.append(temp,'.');
						temp = this.append(temp,str[1]);
					}

					if(arguments[0] && arguments[0].indexOf('.') > -1){
						var _su = (temp.indexOf('.') > -1) ? temp.substring(temp.indexOf('.')+1).length : 0;
						for(var i = _su; i < spr; i++){
							if(temp.indexOf('.') == -1) temp = String(temp)+'.';
							temp = String(temp)+'0';
						}

					}
					return temp;
				},
				/* this._roundPoint 제거 */
				numberFormat2 : function(){
					if($.cs.util.isEmpty(arguments[0])) return "";
					arguments[0] = String(arguments[0]);
					var temp=String(arguments[0]),format='###,###,###,###,###,###,###,###,###',a=0,b=3;
					var spr = arguments.length > 1 ? arguments[1] : 2;
					if(arguments.length > 2 && arguments[0].indexOf('.') > -1) arguments[0] = arguments[0].substring(0,arguments[0].indexOf('.')+spr+1);
					var tmpStr = String(arguments[0]).replace(/[^-0-9.]/g,'');
					if('' == tmpStr) tmpStr = '0';
					var str = String(this.toFloat(tmpStr),spr).split('.');
					var reformat = this.reverse(format);
					var rethis = this.reverse(str[0]);
					var flen = format.split(',');
						for(var i = 0;i < flen.length;i++){
							reformat = reformat.replace(/[#]{1,}/,rethis.substring(a,b));
							a = a+3,b = b+3;
						}
					temp = this.reverse(reformat).replace(/,{1,}/,'').replace(/-,/g,'-');

					if(str[1]){
						temp = this.append(temp,'.');
						temp = this.append(temp,str[1]);
					}

					if(arguments[0] && arguments[0].indexOf('.') > -1){
						var _su = (temp.indexOf('.') > -1) ? temp.substring(temp.indexOf('.')+1).length : 0;
						for(var i = _su; i < spr; i++){
							if(temp.indexOf('.') == -1) temp = String(temp)+'.';
							temp = String(temp)+'0';
						}

					}
					return temp;
				},
				/* this._roundPoint 제거 , 및 .00 으로 끝나는거 제거 ex : 1.00 X 1 O */
				numberFormat3 : function(){
					if($.cs.util.isEmpty(arguments[0])) return "";
					arguments[0] = String(arguments[0]);
					var temp=String(arguments[0]),format='###,###,###,###,###,###,###,###,###',a=0,b=3;
					var spr = arguments.length > 1 ? arguments[1] : 2;
					if(arguments.length > 2 && arguments[0].indexOf('.') > -1) arguments[0] = arguments[0].substring(0,arguments[0].indexOf('.')+spr+1);
					var tmpStr = String(arguments[0]).replace(/[^-0-9.]/g,'');
					if('' == tmpStr) tmpStr = '0';
					var str = String(this.toFloat(tmpStr),spr).split('.');
					var reformat = this.reverse(format);
					var rethis = this.reverse(str[0]);
					var flen = format.split(',');
						for(var i = 0;i < flen.length;i++){
							reformat = reformat.replace(/[#]{1,}/,rethis.substring(a,b));
							a = a+3,b = b+3;
						}
					temp = this.reverse(reformat).replace(/,{1,}/,'').replace(/-,/g,'-');

					if(str[1]){
						temp = this.append(temp,'.');
						temp = this.append(temp,str[1]);
					}
					return temp;
				},					
				numberFormatNoneZero : function(){
					if($.cs.util.isEmpty(arguments[0])) return "";
					arguments[0] = String(arguments[0]);
					var temp=String(arguments[0]),format='###,###,###,###,###,###,###,###,###',a=0,b=3;
					var spr = arguments.length > 1 ? arguments[1] : 2;
					if(arguments.length > 2 && arguments[0].indexOf('.') > -1) arguments[0] = arguments[0].substring(0,arguments[0].indexOf('.')+spr+1);
					var tmpStr = String(arguments[0]).replace(/[^-0-9.]/g,'');
					if('' == tmpStr) tmpStr = '0';
					var str = String(this._roundPoint(this.toFloat(tmpStr),spr)).split('.');
					var reformat = this.reverse(format);
					var rethis = this.reverse(str[0]);
					var flen = format.split(',');
						for(var i = 0;i < flen.length;i++){
							reformat = reformat.replace(/[#]{1,}/,rethis.substring(a,b));
							a = a+3,b = b+3;
						}
					temp = this.reverse(reformat).replace(/,{1,}/,'').replace(/-,/g,'-');

					if(str[1]){
						temp = this.append(temp,'.');
						temp = this.append(temp,str[1]);
					}
					return temp;
				},
				nvlNum : function (val, str) {
					var _val = (val + '').replace (/[^\d]/g, '');
					_val = parseInt (_val);

					return _val < 1 ? str : val;
				},
				cut : function(str,len){
					if(str.length > len){
						str = str.substring(0,len-1)+"..";
					}
					return str;
				},
				removeHTML : function(str){
					return str ? str.replace(/<(\/|!)?([-a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(\/)?>/gim,'') : "";
				},
				getEncryptPassword : function(str,evt,cmd){

					var strParam = 'tn_encdata='+encodeURIComponent(unetEncrypt('passwd='+Base64Encode(str)));
					$.cs.ajax({
						type : 'post',
						url : '/common.do',
						data : 'cmd='+cmd+'&'+strParam,
						dataType : 'json',
						success : function(r){
							if(r.data.errorMsg){
								alert(r.data.errorMsg);
							}else{
								if(evt && r.data.enc_pass) evt(r.data.enc_pass);
								else{
									alert('비밀번호 인증 후에 해당 내역을 보실 수 있습니다.');
								}
							}
						}
					});
				},
				getEncryptPopPassword : function(str,evt){
					this.getEncryptPassword(str,evt,'getEncryptPassword');
				},
				getEncryptAcntPassword : function(str,evt){
					this.getEncryptPassword(str,evt,'getEncryptAcntPassword');
				},
				openScard : function(){
					if(arguments[0]){
						var $openScardFrm = $.form(arguments[0]);
						var objWinPop = _common.open_popup('about:blank', 'windowScardPop');
						$openScardFrm.action = "/common.do";
						$openScardFrm.target = objWinPop.name;
						$openScardFrm.csSubmit('getNumInquiry');
					} else {
						_common.open_popup('/common.do?cmd=getNumInquiry', 'windowScardPop');
					}
				},
				openOTPCorrect : function(){
					if(arguments[0]){
						var $openOTPCorrect = $.form(arguments[0]);
						var objWinPop = _common.open_popup('about:blank', 'windowOTPCorrectPop');
						$openOTPCorrect.action = "/common.do";
						$openOTPCorrect.target = objWinPop.name;
						$openOTPCorrect.csSubmit('otpInput');
					}
				},
				openOTPOther : function(){
					//_common.open_popup('/common.do?cmd=autoOtpOther', 'autoOtherOtp');
					openMenu('M1231752028203');
				},
				certDigitalSign : function(userId, signVal, callback) {
					var strParam = "userId=" + userId + "&signVal=" + encodeURIComponent(signVal);	// 2016.09.2

					$.cs.ajax({
						type : 'post',
						url : '/common.do',
						data : 'cmd=certDigitalSign&'+strParam,
						dataType : 'json',
						success : function(data) {
							if(data.errMsg != "") {
								alert(data.errMsg +
									'\n\n삼성증권에서 SignKorea 인증서를 재발급 받으시거나,\n다른 금융기관에서 발급받으신 인증서를 등록하신 후 이용하시기 바랍니다.'
								);
								//errorCheckSignPage(data.errMsg);  //re_signkorea.js
							} else {
								var outRec1 = data.result.outRec1;
//								if(outRec1.ExpSectCd == '1' || outRec1.ExpSectCd == '2' || outRec1.ExpSectCd == '3') {  // 1 : 만료 예정은 정상 처리
								if(outRec1.ExpSectCd == '2' || outRec1.ExpSectCd == '3') {

									alert('인증서가 만료되었습니다. \n인증서 만료일자 - ' + moment(outRec1.DSExpDt, 'YYYYMMDD').format('YYYY-MM-DD') +
										'\n삼성증권에서 SignKorea 인증서를 재발급 받으시거나,\n다른 금융기관에서 발급받으신 인증서를 등록하신 후 이용하시기 바랍니다.');
									// checkSignPage(outRec1.ExpSectCd, outRec1.A_DSRemainTerm, outRec1.DSExpDt, 'Y'); //re_signkorea.js
								} else {
									var useStatCd = outRec1.A_LoginVerfyUseStatCd;
									if(useStatCd == 'N' || useStatCd == 'S') {
										certUseStateCheck(useStatCd, (useStatCd == 'N' ? outRec1.A_EnhncPublcKeyVal : "")); //re_signkorea.js
									} else {
										if(typeof(callback)=="function") {
											callback();
											return;
										}
									}
								}
							}
						}
					});
				},
				/*
			 	* callback 함수 onAddCertComplete()
				*
				* @version		: 1.1
				* @modify		: sw.jung
				* @date 		: 2016.10.15.
				* @History 		: ux 개편으로 인한 추가인증팝업 수정. Layer 팝업으로 변경.
				*
				* @version		: 1.2
				* @modify		: sw.jung
				* @date 		: 2016.11.23
				* @History 		: 온라인지점 > 부가서비스 종합 > 예약대출시 Iframe Lyaer 가 뜬다. 해당페이지에서 다시 Iframe Layer로 호출시 새창열림 현상으로 인해,
					 			  바닥페이지로 돌아가서 다시 iframe layer를 띄우는 부분이 필요함에따라
					 			  2번째 인자값(isNeedParentYN)을 추가 하였다.
				*/
				addCertifyPopup : function(formNm , isNeedBadakCallbackYN) {
					var wrapHideFlag = false;
					$.cs.ajax({
						type : 'post',
						url : '/ux/common/addCertificate/getAddCertPopUpYN.do',
						data : $.form(formNm).toParameterString(''),
						dataType : 'json',
						success : function(data) {
							if(data.errMsg != "") {
								alert(data.errMsg);
								return;
							}
							var outRec1 = data.result.outRec1;
							var A_AddCertifyPopUpYN = outRec1.A_AddCertifyPopUpYN;
							var isOutPoup = false;
							if($.form(formNm).val('FDS_ACCT_SECT_CODE') == "03" && $.form(formNm).val('isTransfer') == "true"){
								isOutPoup = true;
							}
							if($.form(formNm).val('FDS_ACCT_SECT_CODE') == "02" && $.form(formNm).val('isTransfer') != "true"){
								isOutPoup = true;
							}							
							if(A_AddCertifyPopUpYN == "Y" || isOutPoup) {

								//이체일 경우
								if($.form(formNm).val('A_SvcSectCd') == "1") {
									$.form(formNm).val('TransYN', 'Y');
								}
								if($.form(formNm).val('A_SvcSectCd') == "3") {
									$.form(formNm).val('CertifyKeyVal43', outRec1.CertifyKeyVal43);
								}

								if("Y" == isNeedBadakCallbackYN){
									parent._common.showDetailLayerPopup("/blank.pop", "popupIdentifyModalPop");
									$.form(formNm).val('isNeedBadakCallbackYN', "Y");
								}else{
									if( "LPPU" == isNeedBadakCallbackYN ){
										$.form(formNm).val('LPPU', 'Y');
									}
									if($("#wrap").length == 0){
										$('body').append('<div id="wrap"></div>');
										wrapHideFlag = true;
									}
									_common.showDetailLayerPopup("/blank.pop", "popupIdentifyModalPop");
									if(wrapHideFlag){
										$("body").css("overflow-y", "hidden");
										$("body").attr('data','yHidden');
									}
								}

								//레이어팝업으로 폼내용 보낼때
								$.form(formNm).action = '/ux/common/addCertificate/addCertPopUp.do';
								$.form(formNm).target = 'f_popupIdentifyModalPop'; //레이어팝업 클래스이름(f_붙여야함)
								$.form(formNm).method = 'post';
								$.form(formNm).csSubmit();
							} else if(A_AddCertifyPopUpYN == "N") {

								// 14.11.10 gp.lee 수정
								var CertifyKeyVal43 = $.form(formNm).val('CertifyKeyVal43');  // 인증키값43

								if(typeof(onAddCertComplete) == "undefined") {
									alert('추가인증 후처리 함수가 선언되어 있지 않습니다.');
									return;
								}

								if($.form(formNm).val('A_SvcSectCd') == "3") {
									CertifyKeyVal43 =  outRec1.CertifyKeyVal43;
								}
								onAddCertComplete(true, CertifyKeyVal43);
							} else if(A_AddCertifyPopUpYN == "E") {
								//뱅킹PC 등록 및 추가인증서비스 신청 선택창 띄우기 호출
								_common.showDetailLayerPopup("/ux/common/popup_bankingPC.pop", "popupBankingPcModalPop");
							}
						}
					});
				},
				addCertifyPopup2 : function(formNm) {
					_common.showDetailLayerPopup("/blank.pop", "popupIdentifyModalPop");
					//레이어팝업으로 폼내용 보낼때
					$.form(formNm).action = "/ux/common/addCertificate/addCertPopUp2.do";
					$.form(formNm).target = 'f_popupIdentifyModalPop'; //레이어팝업 클래스이름(f_붙여야함)
					$.form(formNm).method = 'post';
					$.form(formNm).csSubmit();
				},
				checkAlimiServiceStatus : function(callback, custNo) {
					var strParam = '';
					if(custNo != '' && typeof(custNo) != "undefined") {
						strParam = '&tn_encdata='+encodeURIComponent(unetEncrypt('custNo='+Base64Encode(custNo)));
					}

					$.cs.ajax({
						type : 'post',
						url : '/customer/certificate/addCertCheck.do',
						dataType : 'json',
						data : 'cmd=checkAddress'+strParam,
						success : function(data) {
							var errorCode = data.result;
							var errorMsg = data.errorMsg;
							var A_TAGT_YN = data.A_TAGT_YN;
							callback(A_TAGT_YN, errorCode, errorMsg);
						}
					});
				},
				addCertifyOnlyPopup : function(formNm) {

					_common.showDetailLayerPopup("/blank.pop", "popupIdentifyModalPop");

					//레이어팝업으로 폼내용 보낼때
					$.form(formNm).action = "/ux/common/addCertificate/addCertPopUp.do";
					$.form(formNm).target = 'f_popupIdentifyModalPop'; //레이어팝업 클래스이름(f_붙여야함)
					$.form(formNm).method = 'post';
					$.form(formNm).csSubmit();
				},
				searchStockPopup : function(callback){
					openPopup('/common.do?cmd=popStock', 'searchStockPopup', callback);
				},
				searchElsPopup : function(callback) {
					openPopup('/common.do?cmd=popEls', 'searchElsPopup' , callback);
				},
				searchFundPopup : function(callback){
					openPopup('/common.do?cmd=popBeneficiary', 'searchFundPopup', callback);
				},
				/*@ 신용/대출, 이체 공통 레이어 추가 - 160905 @*/
				searchStockPopupNew : function(callback,_this){
					//openPopup('/common.do?cmd=popStock', 'searchStockPopup', callback);
					_common.showDetailLayerPopup('/ux/common/popStock.do', 'popStock',_this);
				},
				searchElsPopupNew : function(callback,_this) {
					//openPopup('/common.do?cmd=popEls', 'searchElsPopup' , callback);
					_common.showDetailLayerPopup('/ux/common/popEls.do', 'popEls',_this);
				},
				searchFundPopupNew : function(callback,_this){
					//openPopup('/common.do?cmd=popBeneficiary', 'searchFundPopup', callback);
					_common.showDetailLayerPopup('/ux/common/popBeneficiary.do', 'popBeneficiary',_this);
				},
				searchObjectionPopupNew : function(callback,_this){
					_common.showDetailLayerPopup('/ux/common/popObjectionStock.do', 'popObjectionStock',_this);
				},
				commonConsultPopup : function(serviceType) {
					var strParam = "";
					var rtnUrl = "";
					if(_common._ispopup){
						strParam = opener.window.location.href;
					}else{
						strParam = window.location.href;
					}
					// strParam에 파라미터가 없는 경우 ?, 있는경우 &
					var isQuestion = "?";
					if(strParam.indexOf(isQuestion) > -1){
						isQuestion="&";
					}

					strParam += isQuestion;

					if($.util.isEmpty(strParam)){
						strParam = "isOutboundPopup=";
					}else{
						strParam += "isOutboundPopup=";
					}

					strParam += serviceType;
					strParam = strParam.replace("://","");
					strParam = encodeURIComponent(strParam.substring(strParam.indexOf("/"),strParam.length));

					if(_common._ispopup){
						rtnUrl = "RETURN_MENU_CODE="+opener.window.getMenuCode()+"&RETURN_MENU_URL="+strParam;
					}else{
						rtnUrl = "RETURN_MENU_CODE="+window.getMenuCode()+"&RETURN_MENU_URL="+strParam;
					}

					if(!window.isLogin()) {
						var msg='';
						msg = '로그인 후 이용해주시기 바랍니다.';
						if(window.confirm(msg)){
							if(_common._ispopup){
								opener.window.openLogin(rtnUrl);
							}else{
								window.openLogin(rtnUrl);
							}
						};
						return false;
					}else{
						if(String(window.getUserSessionInfo().usergrade)=='J'){
							var msg='';
							msg+=	'선택하신 메뉴는 정회원 전용 서비스입니다.\n';
							msg+=	'정회원으로 로그인 하시겠습니까?';

							if(window.confirm(msg)){
								if(_common._ispopup){
									opener.window.openLogin(rtnUrl);
								}else{
									window.openLogin(rtnUrl);
								}
							};
							return false;
						};
					};

					$.cs.ajax({
						type : 'post',
						url : '/ux/common/checkConsultTime.do',
						dataType : 'json',
						data : 'serviceType='+serviceType,
						success : function(data) {
							if(!$.util.isEmpty(data.errorMsg)) {
								alert(data.errorMsg);
								return;
							}

							if(!$.util.isEmpty(data.trMsg)) {
								alert(data.trMsg);
								return;
							}

							var objWinPop = null;
							if(data.checkConsultTime == 'Y') {
								if(!$.util.isEmpty(data.chatPopURL) && data.chatPopURL != ""){
									objWinPop = _common.open_popup_size(data.chatPopURL, 'commonConsultPopup',null,"500px","600px");
								}
							} else {
								if('Investment' == serviceType) {
									objWinPop = _common.open_popup('/common/popup_chat2.pop', 'commonConsultPopup');
									//objWinPop.focus();
								} else {
									objWinPop = _common.open_popup('/common/popup_chat3.pop', 'commonConsultPopup');
									//objWinPop.focus();
								}
							}
						}
					});
				},
				openPDFPreview : function(pdfFile, pdfTitle, subTitle, regDate, viewCnt) {


					var objWinPop = _common.open_popup('/common/popup_preview.pop', 'openPDFPreview');


					var formNm = 'frmTmp' + Math.floor((Math.random()*100000)+1);
					$(document.createElement('form'))
						.attr('id', formNm)
						.attr('name', formNm)
						.attr('method', 'post')
						.appendTo($('body'));

					var $f = $.form(formNm);
					$f.val('pdfFile' , pdfFile);
					$f.val('pdfTitle', pdfTitle);
					$f.val('subTitle', subTitle);
					$f.val('regDate', regDate);
					$f.val('viewCnt', viewCnt);

					$f.action = '/common/popup_preview.pop';
					$f.target = objWinPop.name;
					$f.csSubmit();
				},

				openPDFPreview_ux : function(pdfFile, pdfTitle, subTitle, caseGubun, saveKey) {


					var objWinPop = _common.open_popup('/ux/kor/common/popup/popup_preview_ux.pop', 'openPDFPreviewUX', '');


					var formNm = 'frmTmp' + Math.floor((Math.random()*100000)+1);
					$(document.createElement('form'))
						.attr('id', formNm)
						.attr('name', formNm)
						.attr('method', 'post')
						.appendTo($('body'));

					var $f = $.form(formNm);
					$f.val('pdfFile' , pdfFile);
					$f.val('pdfTitle', pdfTitle);
					$f.val('subTitle', subTitle);
					$f.val('caseGubun', caseGubun);	// 보험 약관 띄우기 위한 구분
					$f.val('saveKey', saveKey);

					$f.action = '/ux/kor/common/popup/popup_preview_ux.pop';
					$f.target = objWinPop.name;
					$f.cSubmit();
				},
				openPDFResizePreview : function(pdfFile, pdfTitle, subTitle, regDate, viewCnt) {

//					var objWinPop = window.open('/common/popup_preview2.pop', 'openPDFResizePreview', target='_blank');
					var objWinPop = _common.open_popup('/ux/kor/common/popup/popup_preview2_ux.pop', 'openPDFPreview2UX', '');

					var formNm = 'frmTmp' + Math.floor((Math.random()*100000)+1);
					$(document.createElement('form'))
						.attr('id', formNm)
						.attr('name', formNm)
						.attr('method', 'post')
						.appendTo($('body'));

					var $f = $.form(formNm);
					$f.val('pdfFile' , pdfFile);
					$f.val('pdfTitle', pdfTitle);
					$f.val('subTitle', subTitle);
					$f.val('caseGubun', 'adress');	// save키를 안받아, pdfFile 파라미터에 다운로드 url 포함
					$f.val('regDate', regDate);
					$f.val('viewCnt', viewCnt);

					$f.action = '/ux/kor/common/popup/popup_preview2_ux.pop';
					$f.target = objWinPop.name;
					$f.cSubmit();
				},

				openPDFResizePreview_en : function(pdfFile, pdfTitle, subTitle, regDate, viewCnt, category, division) {

					var objWinPop = window.open('/common/popup_preview2_en.pop', 'openPDFResizePreview', target='_blank');

					var formNm = 'frmTmp' + Math.floor((Math.random()*100000)+1);
					$(document.createElement('form'))
						.attr('id', formNm)
						.attr('name', formNm)
						.attr('method', 'post')
						.appendTo($('body'));

					var $f = $.form(formNm);
					$f.val('pdfFile' , pdfFile);
					$f.val('pdfTitle', pdfTitle);
					$f.val('subTitle', subTitle);
					$f.val('caseGubun', 'adress');	// save키를 안받아, pdfFile 파라미터에 다운로드 url 포함
					$f.val('regDate', regDate);
					$f.val('viewCnt', viewCnt);
					$f.val('category', category);
					$f.val('division', division);
					
					$f.action = '/common/popup_preview2_en.pop';
					$f.target = objWinPop.name;
					$f.cSubmit();
				},

				openReportPDFPreview : function(pdfFile, pdfTitle, subTitle, regDate, viewCnt){
					
					var formNm = 'frmTmp' + Math.floor((Math.random()*100000)+1);
					$(document.createElement('form'))
						.attr('id', formNm)
						.attr('name', formNm)
						.attr('method', 'post')
						.appendTo($('body'));

					var $f = $.form(formNm);
					$.cs.ajax({
						url				: '/ux/common.do?cmd=getUserEnc' ,
						loadingStart 	: false,
						loadingEnd 		: false,
						data 			: $f.toParameterString('', false),
						success			: function(data){
							//$f.val('issueDate' , regDate.replaceAll(".",""));
							//$f.val('fileName' , pdfFile.slice(pdfFile.lastIndexOf("/") + 1));
							//$f.val('userId' , data.encString);
							//$f.method = "post";
							//$f.action = '/streamdocs/v4/openResearch';
							//$f.target = 'openPDFResizePreview';
							//$f.cSubmit();
							
							var issueDate = regDate.replaceAll(".","");
							var fileName = pdfFile.slice(pdfFile.lastIndexOf("/") + 1);
							var userId = data.encString;
							window.open("/streamdocs/v4/openResearch?fileName="+fileName+"&issueDate="+issueDate+"&userId="+userId);
						}
					});
				} , 

				searchDictionaryPopup : function(callback){
					openPopup('/invest/common.do?cmd=popup_dic', 'dictionaryPopup', callback);
				},
				openFundDetailPop : function(fundCd){
					n_click_logging('/finance/fund/fund_detail.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+fundCd+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
					openMenuPopup('M1397190931550', '/finance/fund/fund_detail.do?FUND_CODE='+fundCd+'&openType=POPUP');
				},
				openFundDetailPopStamp : function(fundCd){
					openMenuPopup('M1397190931550', '/finance/fund/fund_detail.do?FUND_CODE='+fundCd+'&openType=POPUP&stamp=Y');
				},
				openFundDetailPopIsa : function(fundCd){
					n_click_logging('/isa/fund/fund_detail.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN02&ITEM_CD='+fundCd+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
					openMenuPopup('M1455866305745', '/finance/fund/fund_detail.do?FUND_CODE='+fundCd+'&openType=POPUP&isa=Y');
				},
				addInterFundPopup : function(FundCd, callback, params){

					if(getMenuCode() == ""){
						parent.n_click_logging('/finance/wish/popupAddInterFund.do?MENU_ID='+$(parent).get(0).getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FundCd+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
					}else{
						n_click_logging('/finance/wish/popupAddInterFund.do?MENU_ID='+getMenuCode()+'&ACTION_ID=IN01&ITEM_CD='+FundCd+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
					}
					params = params || '';
					if(!isLogin() || isMember()){
						//alert(_common._iscrop);
						if (_common._iscrop || _common._ispopup){
							top.opener.confirmLogin(params);
							top.self.close();
						}else{
							confirmLogin(params);
						}
					}else{
						openPopup('/finance/wish/popupAddInterFund.do?FundCd='+FundCd, 'openAddInterFund', callback);
					}
				},
				openGuidePop : function(helpID){
					openWindow('/help/' + helpID + '.html' , 'openGuidePop', '1000','850');
				},
				buyFund : function(FundCd){
					var strMenu = 'M1231753078265';
					var strParam = "paramFUNDCODE="+FundCd;
					n_click_logging('/finance/fund/trade.do?MENU_ID='+getMenuCode()+'&ACTION_ID=TR01&ITEM_CD='+FundCd+'&WRAP_SVC_CD=&START_DATE=&END_DATE=&KEYWORD=&CAMPAIGN_ID=&CAMPAIGN_ACT_ID=&CAMPAIGN_LINKUSR_ID=');
					if(typeof(arguments[1]) != 'undefined' && arguments[1] != null ){
						strParam += "&SAVING="+arguments[1];
					}

					if(isLogin()){
						if (_common._iscrop || _common._ispopup){
							top.opener.openMenu(strMenu, strParam);
							top.self.close();
						}else{
							openMenu(strMenu, strParam);
						}
					}else if(!isLogin() || isMember()){
						if (_common._iscrop || _common._ispopup){
							top.opener.openLogin('RETURN_MENU_CODE=' + strMenu + '&RETURN_MENU_URL=' + encodeURIComponent(strParam));
							top.self.close();
						}else{
							openLogin('RETURN_MENU_CODE=' + strMenu + '&RETURN_MENU_URL=' + encodeURIComponent(strParam));
						}
					}
				},
				linkFund : function(fundCode, gubun){

					var m_code = "";
					var m_name = "";
					var m_url = "";

					if(gubun == "1"){
						//국내펀드
						m_code = 'M1397118087470';
						m_name = '국내펀드';
						m_url = '/finance/fund/goods/list.pop';
					}else{
						//해외펀드
						m_code = 'M1397118137044';
						m_name = '해외펀드';
						m_url =  '/finance/fund/goods/list_abroad.pop';
					}

				 	var param = '?FUND_CODE='    + fundCode
							 	+ '&openMenuCode=' + m_code
							    + '&openMenuName=' + m_name
//							    + '&openMenuUrl=' + encodeURIComponent(encodeURIComponent(m_url));
							    + '&openMenuUrl=' + encodeURIComponent(m_url);

				     openMenu(m_code, '/finance/fund/fund_detail.do' + param);
				},
				addBuyFund : function(ACNT_NO, FUND_CODE, PSTN_UNIT_NO){
					var strParam = "ACNT_NO=" + encodeURIComponent(ACNT_NO) + "&FUND_CODE=" + encodeURIComponent(FUND_CODE)+ "&PSTN_UNIT_NO=" + encodeURIComponent(PSTN_UNIT_NO);
					openMenu('M1231753085515', strParam);
				},
				addBuyFundTo : function(ACNT_NO, FUND_CODE, PSTN_UNIT_NO, ACNT_NM){
					var strParam = "ACNT_NO=" + encodeURIComponent(ACNT_NO) + "&FUND_CODE=" + encodeURIComponent(FUND_CODE)+ "&PSTN_UNIT_NO=" + encodeURIComponent(PSTN_UNIT_NO) + "&ACNT_NM=" + encodeURIComponent(ACNT_NM);
					openMenu('M1231753085515', strParam);
				},
				sellFund : function(ACNT_NO, FUND_CODE, PSTN_UNIT_NO){
					var strParam = "ACNT_NO=" + encodeURIComponent(ACNT_NO) + "&FUND_CODE=" + encodeURIComponent(FUND_CODE)+ "&PSTN_UNIT_NO=" + encodeURIComponent(PSTN_UNIT_NO)
					openMenu('M1231753091031', strParam);
				},

				sellFundTo : function(ACNT_NO, FUND_CODE, PSTN_UNIT_NO , ACNT_NM){
					var strParam = "ACNT_NO=" + encodeURIComponent(ACNT_NO) + "&FUND_CODE=" + encodeURIComponent(FUND_CODE)+ "&PSTN_UNIT_NO=" + encodeURIComponent(PSTN_UNIT_NO) + "&ACNT_NM=" + encodeURIComponent(ACNT_NM);
					openMenu('M1231753091031', strParam);
				},

				addBuyFundTo2 : function(ACNT_NO, FUND_CODE, PSTN_UNIT_NO, ACNT_NM, RATE){
					var strParam = "ACNT_NO=" + encodeURIComponent(ACNT_NO) + "&FUND_CODE=" + encodeURIComponent(FUND_CODE)+ "&PSTN_UNIT_NO=" + encodeURIComponent(PSTN_UNIT_NO) + "&ACNT_NM=" + encodeURIComponent(ACNT_NM) +"&RATE="+encodeURIComponent(RATE) + "&COME_FROM=" + encodeURIComponent("ASSET");
					openMenu('M1231753085515', strParam);
				},

				sellFundTo2 : function(ACNT_NO, FUND_CODE, PSTN_UNIT_NO , ACNT_NM){
					var strParam = "ACNT_NO=" + encodeURIComponent(ACNT_NO) + "&FUND_CODE=" + encodeURIComponent(FUND_CODE)+ "&PSTN_UNIT_NO=" + encodeURIComponent(PSTN_UNIT_NO) + "&ACNT_NM=" + encodeURIComponent(ACNT_NM) + "&COME_FROM=" + encodeURIComponent("ASSET");
//					openMenu('M1231753091031', strParam);
					openMenu('M1465349270127', strParam);
				},

				compareFundPopup : function(fundCds,fundCdObj){
					try{
						if(fundCdObj != 'undefined' && fundCdObj != null){
							this.compare_fund_chk_proc(fundCdObj);
						}else{
							openMenuPopup('M1394871091808', '/finance/fund/compare/compare.pop?fundCds='+fundCds);
						}

					}catch(e){
						openMenuPopup('M1394871091808', '/finance/fund/compare/compare.pop?fundCds='+fundCds);
					}

				},
				compare_fund_chk_proc : function($chk){

					 // 펀드비교수로드
		            $.cs.ajax({
		                async: false,
		                url: '/finance/fund/compare.do?cmd=compareCnt',
		                loadingStart: false,
		                loadingEnd: false,
		                success: function(data){

		                	if(typeof data.errorMsg != 'undefined') {
		                        alert(data.errorMsg);
		                        return "";
		                    }

		                    var fundCnt = data.fundCnt; // 로그인후 저장된 상품갯수.
		                    var loginYn = data.loginYn;
		                    var chkCnt  = $chk.size();
		                    var fundCds = "";

		                    if(loginYn == "Y"){
		                    	if(chkCnt == 0){
		                    		alert('비교상품을 선택해주세요.\n저장된 상품과의 비교는 1개 이상부터 가능합니다.');
		                    		return;
		                    	}else if((chkCnt + fundCnt) < 2) {
		                    		if(fundCnt == 0){
		                    			alert('비교 상품을 선택해주세요.\n비교는 2개 이상부터 가능합니다.');
		                    		}else{
		                    			alert('비교상품을 선택해주세요.\n저장된 상품과의 비교는 1개 이상부터 가능합니다.');
		                    		}
		                            return;
		                    	}

		                    }else{
		                    	if((chkCnt) < 2) {
		                    		alert('비교 상품을 선택해주세요.\n비교는 2개 이상부터 가능합니다.');
		                            return;
		                    	}
		                    }

		                    if(chkCnt > 4) {
		                        alert('비교는 최대 4개까지 가능합니다.');
		                        return;
		                    }

		                    if(data.fundList != null && data.fundList.length > 0){

		                    		var eqCnt = 0;
		                    		$chk.each(function(idx) {

		                    			var tmpFundCd  = $(this).val();
		                    			$.each(data.fundList, function(i,v) {
		                    				if(tmpFundCd == v){
		                    					eqCnt++;
		                    					return;
		                    				}
		                    			}) ;

				                    	fundCds += (idx == 0 ? '' : ',') + $(this).val();
				                    });
		                    		/* 2015.05.11 VOC 선택한 펀드가 중복이어도 중복알럿없이 바로 비교팝업노출
		                    		if(eqCnt > 0){
		                    			if(eqCnt == chkCnt){
		                    				alert("동일한 펀드가 펀드비교 내에 존재합니다.");
		                    				return;
		                    			}else{
		                    				if(!confirm("동일한 펀드가 펀드비교 내에 존재합니다.\n중복된 펀드를 제외하고 비교처리합니다.")){
		                    					return;
		                    				}
		                    			}
		                    		}
		                    		 */
		                    }else{
		                    	$chk.each(function(idx) {
			                    	fundCds += (idx == 0 ? '' : ',') + $(this).val();
			                    });
		                    }

		                    openMenuPopup('M1394871091808', '/finance/fund/compare/compare.pop?fundCds='+fundCds);
		                }
		            });


				},
				addCompareFundPopup : function(selectType, fundCnt, callback, FundType1, FundType2, FundType3, FundType4, exceptFundCd , exceptFundCds){
					exceptFundCd = exceptFundCd || '';

					var params = '';
					params += '?selectType=' + selectType;
					params += '&fundCnt=' + fundCnt;
					params += '&FundType1=' + FundType1;
					params += '&FundType2=' + FundType2;
					params += '&FundType3=' + FundType3;
					params += '&FundType4=' + FundType4;
					params += '&exceptFundCd=' + exceptFundCd;
					params += '&FWidth=915&FHeight=870';

					if(exceptFundCds != 'undefined' && exceptFundCds != null && exceptFundCds != ""){
						params += '&exceptFundCds=' + exceptFundCds;
					}

					openPopup('/finance/fund/compare/popup_compare.pop' + params, 'addCompareFundPopup', callback);
				},
				renewLoginTime : function() {
					$.cs.ajax({
						type : 'post',
						url : '/blank.pop',
						dataType : 'html',
						success : function(data) {
							//trace('success renew logintime');
						}
					});
				},
				openJoinFundPopup : function(AcctNo, PSTN_UNIT_NO, FUND_NAME) {

					openMenuPopup('M1308795559147','/finance/myfund/join_fund.do?AcctNo=' + AcctNo + '&PSTN_UNIT_NO=' + PSTN_UNIT_NO + '&FUND_NAME=' + encodeURIComponent(FUND_NAME));
				},
				openChangeJoinFundPopup : function(AcctNo) {

					openMenuPopup('M1231749928796','/finance/myfund/change_join_fund.do?AcctNo=' + AcctNo);
				},
				openChartToTablePopup : function(dv_chart, title, subtitle, x_title, chart_type, is_reverse, units, points) {

					var params = '';

					params += '?dv_chart=' 		+ dv_chart;
					params += '&title=' 		+ title;
					params += '&subtitle=' 		+ subtitle;
					params += '&x_title=' 		+ x_title;
					params += '&chart_type=' 	+ chart_type;
					params += '&is_reverse=' 	+ is_reverse;
					params += '&units=' 		+ encodeURIComponent(units);
					params += '&points=' 		+ points;

					openPopup('/common/popup_chart_data.pop' + params, dv_chart, null);
				},
				openChartToTablePopupEng : function(dv_chart, title, subtitle, x_title, chart_type, is_reverse, units, points) {

					var params = '';

					params += '?dv_chart=' 		+ dv_chart;
					params += '&title=' 		+ title;
					params += '&subtitle=' 		+ subtitle;
					params += '&x_title=' 		+ x_title;
					params += '&chart_type=' 	+ chart_type;
					params += '&is_reverse=' 	+ is_reverse;
					params += '&units=' 		+ encodeURIComponent(units);
					params += '&points=' 		+ points;

					openPopup('/eng/pension/product/popup_chart_data.pop' + params, dv_chart, null);
				},
				openChartToTablePopupIframe : function(title, subtitle, url, cmd, param) {

					var params = '';

					params += '?title='+title;
					params += '&subtitle='+subtitle;
					params += '&url='+url;
					params += '&cmd='+cmd;
					params += '&'+param;

					openPopup('/common/popup_chart_data_iframe.pop' + params, null);
				},
				setChartNoData : function(chart, force, no_data_msg) {
					no_data_msg = no_data_msg || $.msg.NO_DATA_RESULT;

					try{
						if(force) {
							chart.hideNoData();
							chart.showNoData(no_data_msg);
						}
						else if(!chart.hasData()) {

							for(var i = chart.xAxis.length-1; i >= 0; i--) {
								chart.xAxis[i].setTitle({
									text: ''
								});
								chart.xAxis[i].update({
									lineWidth: 0
								});
							}

							for(var i = chart.yAxis.length-1; i >= 0; i--) {
								chart.yAxis[i].setTitle({
									text: ''
								});
								chart.yAxis[i].update({
									lineWidth: 0
								});
							}

							chart.hideNoData();
							chart.showNoData(no_data_msg);
					}
					}catch(e){}
				},
				setChartDataBtn : function(chart, dv_chart, dv_btn, title, subtitle, x_title, chart_type, is_reverse, units, points) {
					chart_type  = chart_type || '1';
					is_reverse  = is_reverse || '0';
					units		= units	     || '';
					points		= points	 || '';

					try{
						if(chart.hasData()) {
							var btn_name = dv_btn + 'btn';
							html = '<a href=\"javascript:_common.nothing();\" id=\"' + btn_name + '\" class=\"btn3 pop\" title=\"' + title + ' 표로보기(팝업띄움)\">표로보기</a>';

							$('#' + dv_btn).html(html);

							$('#' + btn_name).click(function() {
								$.util.openChartToTablePopup(dv_chart, title, subtitle, x_title, chart_type, is_reverse, units, points);
							});
					}
					}catch(e){}
				},
				setChartDataBtnEng : function(chart, dv_chart, dv_btn, title, subtitle, x_title, chart_type, is_reverse, units, points) {
					chart_type  = chart_type || '1';
					is_reverse  = is_reverse || '0';
					units		= units	     || '';
					points		= points	 || '';

					if(chart.hasData()) {
						var btn_name = dv_btn + 'btn';
						html = '<a href=\"javascript:_common.nothing();\" id=\"' + btn_name + '\" class=\"btn3 pop\" title=\"' + title + ' 표로보기(팝업띄움)\">표로보기</a>';

						$('#' + dv_btn).html(html);

						$('#' + btn_name).click(function() {
							$.util.openChartToTablePopupEng(dv_chart, title, subtitle, x_title, chart_type, is_reverse, units, points);
						});
					}
				},
				setChartDataBtnIframe : function(title, subtitle, dv_btn, url, cmd, param) {

					if(chart.hasData()) {
						var btn_name = dv_btn + 'btn';
						html = '<a href=\"#\" id=\"' + btn_name + '\" class=\"btn3 pop\" title=\"' + title + ' 표로보기(팝업띄움)\">표로보기</a>';

						$('#' + dv_btn).html(html);

						$('#' + btn_name).click(function() {
							$.util.openChartToTablePopupIframe(title, subtitle, url, cmd, param);
						});
					}
				}, getDlbrNoText : function(divId, tabFlag, menuCode) {

					// menuCode가 빈값이고, top._common._history가 null이 아닐때
					if(menuCode == "" && top._common._history != null){
						try{
							menuCode = top._common._history._info_last.code;
						} catch(Exception){
							//ignore
						}
					}
					$.cs.ajax({
						type : 'post',
//						url : '/main/dlbrNo.do',
						url : '/ux/kor/other/global/getDlbrNo.do',
						dataType : 'json',
//						data : 'cmd=getDlbrNo&tabNo='+tabFlag + '&menuCd=' + menuCode,
						data : 'tabNo='+tabFlag + '&menuCd=' + menuCode,
						success : function(data) {
							if(data.hasOwnProperty("errorMsg") && data.errorMsg != "") {
								alert(data.errorMsg);
								return;
							}

							if(typeof(data.view.DLBRNO) != "undefined" && data.view.DLBRNO.trim() != ''){

								var tUrl = window.location.href;
								tUrl = tUrl.replaceAll('//', '');
								tUrl = tUrl.substring(tUrl.indexOf('/'));

                                var str = '';
								if( tUrl == data.view.URL  ){
                                    if(data.view.ENDDT.trim() == ''){
                                        str = data.view.DLBRNO + " ("+ $.util.dateFormat(data.view.STARTDT) + ")";
                                    }else{
                                        str = data.view.DLBRNO + " ("+ $.util.dateFormat(data.view.STARTDT) + " ~ " + $.util.dateFormat(data.view.ENDDT) + ")";
									}
									$("#" + divId).html(str);
								}
							}
						}
					});
				},
				winOpen : function(_url, _target, _option) {
					
					/* 해외증시 종합분석 로그인처리 */
					if(_url.contains("http://wstock3.edaily.co.kr")){
						if(!window.isLogin()) {
							window.openLogin("RETURN_MENU_CODE="+window.getMenuCode()+"&RETURN_MENU_URL="+_url);
							return;
						}
					}
					
					_target = _target || '_self';
					_option = _option || '';
					var win = window.open(_url, _target, _option);
					try { win.focus(); } catch(e) {}
				},
				/**
				 * 즐겨찾기
				 *
				 * @param	{String} type - 'INSERT', 'DELETE', 'EXIST', 'LIST'
				 * @param	{String} menucode
				 * @param	{Function} callback
				 * @return	void
				 */
				executeBookmark:function(type, menucode, callback){
					if(typeof(window.isLogin)!='undefined' && window.isLogin()){
						var type=String(type).toUpperCase();
						var params='';
                        var addUrl = '';
						switch(type){
							case 'INSERT':
								params='cmd=insert&MenuCode='+menucode;
								addUrl='insert.do';
								break;

							case 'DELETE':
								params='cmd=delete&MenuCode='+menucode;
								addUrl='delete.do';
								break;

							case 'EXIST':
								params='cmd=check&MenuCode='+menucode;
								addUrl='check.do';
								break;

							case 'LIST':
								params='cmd=list';
								addUrl='list.do';
								break;
						};

						if( top.getMediaType() == 'EF' ){
							//영문
							$.cs.ajax({
								url:'/eng/main/bookmark.do',
								data:params,
								dataType:'json',
								async:false,
								loadingStart:false,
								loadingEnd:false,
								success:function(data){
									if($.util.isEmpty(data.errorMsg)){
										switch(type){
											case 'INSERT':
												switch(String(data.BkmrStatus).toUpperCase()){
													case 'D':
														if(!$.util.isEmpty(callback)) callback(false);
														alert('You have deleted your favorites.');
														break;

													case 'U':
														alert('You can specify only one of 50 favorites.');
														break;

													default:
														if(!$.util.isEmpty(callback)) callback(true);
														alert('Has been added to your favorites .');
														break;
												};
												break;

											case 'DELETE':
												if(!$.util.isEmpty(callback)) callback(false);
												alert('You have deleted your favorites.');
												break;

											case 'EXIST':
												if(!$.util.isEmpty(callback)) callback((data.BkmrStatus=='Y')?true:false);
												break;

											case 'LIST':
												if(!$.util.isEmpty(callback)) callback(data);
												break;
										};
									}else{
										if(typeof(window.isLogin)!='undefined' && window.isLogin()){
											alert(data.errorMsg + ".");
										}
									};
									return;
								}
							});

						}else{
							//국문
							$.cs.ajax({
								url:'/ux/kor/main/bookmark/' + addUrl,
								data:params,
								dataType:'json',
								async:false,
								loadingStart:false,
								loadingEnd:false,
								success:function(data){
									if($.util.isEmpty(data.errorMsg)){
										switch(type){
											case 'INSERT':
												switch(String(data.BkmrStatus).toUpperCase()){
													case 'D':
														if(!$.util.isEmpty(callback)) callback(false);
														alert('즐겨찾기를 삭제 했습니다.');
														break;

													case 'U':
														alert('즐겨찾기는 50개만 지정할 수 있습니다.');
														break;

													default:
														if(!$.util.isEmpty(callback)) callback(true);
														alert('즐겨찾기에 추가했습니다.');
														break;
												};
												break;

											case 'DELETE':
												if(!$.util.isEmpty(callback)) callback(false);
												alert('즐겨찾기를 삭제 했습니다.');
												break;

											case 'EXIST':
												if(!$.util.isEmpty(callback)) callback((data.BkmrStatus=='Y')?true:false);
												break;

											case 'LIST':
												if(!$.util.isEmpty(callback)) callback(data);
												break;
										};
									}else{
										if(typeof(window.isLogin)!='undefined' && window.isLogin()){
											alert(data.errorMsg + ".");
										}
									};
									return;
								}
							});
						}

					};
				},
				doConsult : function(type) {
					/**
					 * 상담 창 띄우기
					 * 원장과 시간 체크하여 영업일 영업시간에는 채팅상담을 띄우고 아닐 경우는 전화상담 예약 창을 띄운다.
					 * type : inquiry(조회 시), trade(매매 이탈 시), etc(기타)
					 */
					var noPopup = 'no_counsel'; //_'+type;
					$.cs.ajax({
						type : 'post',
						url : '/common.do',
						dataType : 'json',
						data : 'cmd=checkConsultTime',
						success : function(data) {
							if(!$.util.isEmpty(data.errorMsg)) {
								alert(data.errorMsg);
								return;
							}

							if(!$.util.isEmpty(data.trMsg)) {
								alert(data.trMsg);
								return;
							}

							//해당 타입의 팝업의 쿠키로 Y값이 존재할 경우는 팝업을 띄우지 않고 종료한다.
							var rst = $.cookie(noPopup);
							if(rst == 'Y') {
								return;
							}

							var ua=navigator.userAgent;
							var prop = "";

							/* if(String(ua).toLowerCase().indexOf('msie')!=-1){
								prop='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100'+$.cs.util.popup_params; //,titlebar=no
							}else{
								prop='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100,left=0,top=0'; //,titlebar=no // 2014-10-07
							} */

							prop='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100'+$.cs.util.popup_params; // 2014-10-08

							if(data.checkConsultTime == 'Y') {
								//채팅상담
								window.open('/common/popup_counsel_chat.pop?st=Investment&type=' + type, 'consult', prop);
							} else {
								//전화상담 예약
								window.open('/common/popup_counsel_call.pop?type=' + type, 'consult', prop);
							}
						}
					});
				},
				inquiryGoods : function() {
					/**
					 * 상품 조회때 실행해주면 1분 30초 후에 상담창을 호출한다.
					 */
					//setTimeout('$.util.doConsult("inquiry")', 1000 * 90);
				},
				/**
				 * 매매 이탈 펍업
				 */
				tradeGoods : function() {
					/**
					 * 결함번호 61452 수정 sj.jun
					 * 매매 이탈시 호출되는 상담 팝업에서 버튼을 클릭했을 때 SCRIPT오류로 인하여 더이상 진행할 수 없었던 사항 수정
					 * 이탈 이벤트 발생 후 2초후에 상담 팝업 호출, 최상단에서 호출하면 해당오류 발생
					 * 정확한 원인파악 필요, 임시처리!!!!
					 * */
					//setTimeout('content.$.util.doConsult("trade");', 1000 * 2);
				},
				/**
				 * ie 팝업 리사이징 오류 처리 st.kang
				 */
				popup_params : function() {
				    var a = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft;
				    var i = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop;
				    var g = typeof window.outerWidth!='undefined' ? window.outerWidth : document.documentElement.clientWidth;
				    var f = typeof window.outerHeight != 'undefined' ? window.outerHeight: (document.documentElement.clientHeight - 22);
				    var h = (a < 0) ? window.screen.width + a : a;
				    var left = parseInt(h + ((g - 100) / 2), 100);
				    var top = parseInt(i + ((f-100) / 2.5), 100);
				    return ',left=' + left + ',screenX=' + left + ',top=' + top;
				},

				/**
				 * 이중 접속 팝업
				 */
				doubleConnect:function(ntcSect, doubleConnectFlag, depCnt, cmName){
					if (ntcSect == '2' || depCnt > 0) {
						var url = '/login/login.do?cmd=popupAccess&ntcSect='+ntcSect+'&depCnt='+depCnt+'&cmName='+cmName+'&doubleConnectFlag='+doubleConnectFlag;
						var ua=navigator.userAgent;
                        var properties = "";
						if (ntcSect == '2'){
							_CHECK_LOGOUT_DOUBLE_CONNECT = true;
						}
						if(content.location.href.indexOf("/wts_new/index.pop") > -1){
                            properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100'+$.cs.util.popup_params;
                            var url = '/login/login.do?cmd=popupAccess&ntcSect='+ntcSect+'&depCnt='+depCnt+'&cmName='+cmName+'&doubleConnectFlag='+doubleConnectFlag+'&locationWts=Y';
                            var popup = '';
                          popup=window.open(url, 'doubleConnect', properties);
						}else if (content.location.href.indexOf("/login/login.pop") > -1){
                            properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100'+$.cs.util.popup_params;
                            var url = '/login/login.do?cmd=popupAccess&ntcSect='+ntcSect+'&depCnt='+depCnt+'&cmName='+cmName+'&doubleConnectFlag='+doubleConnectFlag+'&locationWts=Y';
                            var popup = '';
                          popup=window.open(url, 'doubleConnect', properties);							
						}else if("EF" == top.getMediaType()){
							properties='directories=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,toolbar=no,width=100,height=100'+$.cs.util.popup_params;
							var url = '/login/login.do?cmd=popupAccess&ntcSect='+ntcSect+'&depCnt='+depCnt+'&cmName='+cmName+'&doubleConnectFlag='+doubleConnectFlag+'&locationWts=Y';
							var popup = '';
							popup=window.open(url, 'doubleConnect', properties);
						}else{
						    content._common.showDetailLayerPopup(url,'layerLoginDupWrap');
						}						
					}else{
						if (typeof(_CHECK_LOGOUT_DOUBLE_CONNECT) != 'undefined'  && _CHECK_LOGOUT_DOUBLE_CONNECT){

							_CHECK_LOGOUT_DOUBLE_CONNECT = false;
							alert('이중접속 해제 선택으로 접속이 자동 해제되었습니다.\n다시 로그인하시기 바랍니다.');
							top.bottom.client.WebSocketDisconnect();
							top.window.openLogout();
							top.bottom.document.location.href='/wts_new/frmBottom.pop';
						}else{
							try{
								top.bottom.client.WebSocketDisconnect();
								top.bottom.document.location.href='/wts_new/frmBottom.pop';
							}catch(e){
								alert(e);
							}
						}
					}

				},
				/**
				 * MCA 소켓호출
				 */
				memberLoginProc:function(){
					_common.trace('====== jquery.cs memberLoginProc 호출');
					if(top.bottom.client)
						top.bottom.client.memberLoginProc();
					else
						top.bottom2.memberLoginProc();
				},
				autoNextFocus:function(e){
					var fieldNm = arguments[0];
					var len = arguments[1];
					var nextFieldNm = arguments[2];
					var keyCode = (window.event) ? event.keyCode : e.which;
					if(
						keyCode != 9 &&
						keyCode != 16 &&
						keyCode != 8 &&
						keyCode != 39 &&
						keyCode != 37 &&
						keyCode != 46
					){
						var _val = $('input[name="'+fieldNm+'"]').val();
						if(!$.util.isEmpty(_val) && _val.length==len){
							$('input[name="'+nextFieldNm+'"]').focus();
						};
					};
				},
				getGlobalCustomerBanner: function(){
					//맞춤형배너 대상여부 확인
					try{
						var $list = $("#globalCustBanner").empty();
						var target  = "";
						var imgFullNm = "";
						var prdTypeNm = "";
						var prdTypeHead = "";
						var prdSubTxt1 = "";
						var prdSubTxt2 = "";
						var prdFirstData = "";
						var prdSecondData = "";
						var resultCss = "";

						$.cs.ajax({
				            async : false,
				            type : 'post',
				            url : '/ux/kor/other/global/globalCustomerBanner.do',
				            dataType : 'json',
				            data : '',
				            success : function(data){
				            	var strHtml = "";
				            	var customerName = typeof data.customerName != "undefined" ? data.customerName.trim() : "";
				            	if(data.bannerShowYn == "Y"){
				            		//대상자일경우 DB조회 (xcms 홈 > 10.고객맞춤형배너 내에 팝업메뉴 등록여부 확인)
				            		if(data.popUpMenuCd.indexOf(window.getMenuCode()) > -1 && window.getMenuCode() != ""){
				            			//toast배너 노출페이지 여부 판단 > css분기
				            			if($('#globalToast').length > 0){
				            				$("#globalCustBanner").addClass("withGlobalToast");
				            			}else{
				            				$("#globalCustBanner").removeClass("withGlobalToast");
				            			}
						            	if( /[a-z|A-Z]/.test(data.customerName) ){
						            		if(customerName.length > 8){
						            			customerName = data.customerName.replace(/(.{8})(.+)/,"$1...");
						            		}else{
						            			customerName = data.customerName;
						            		}
						            	}else{
						            		if(customerName.length > 4){
						            			customerName = data.customerName.replace(/(.{4})(.+)/,"$1...");
						            		}else{
						            			customerName = data.customerName;
						            		}
						            	}

					            		strHtml += '<div class="inner">';

					            		if(data.inputChoice == "U"){
						            		target  = "_blank";
					            		}else{
					            			target  = "_self";
					            		}
					            		//등록된 메뉴코드 화면에 맞춤형배너 그리기
					            		var linkHtml = '		<a href="'+data.popUrl+'" target="'+target+'" title="상품팝업 자세히보기">자세히보기</a>';
						            	if(data.contentType == "B"){
						            		//배너형 (이미지+텍스트)
				            				imgFullNm = "/common.do?cmd=down&saveKey=main&fileName="+data.popImg+"&inlineYn=N";
				 		            		var altImg = data.detailDesc;
						            		altImg = altImg.replace(/<[^>]+>/g,"");

						            		strHtml += '<div class="notice_area">';
						            		strHtml += '<p class="headman"><strong>'+customerName+' 고객님</strong></p>';
						            		strHtml += '	<div class="img">';
						            		strHtml += '		<img src="'+imgFullNm+'" alt="'+altImg+'">';
						            		strHtml += '	</div>';
						            		strHtml += '	<div class="imgText">';
						            		strHtml += '		'+data.detailDesc+'';
						            		strHtml += '	<span></span></div>';
						            		strHtml += '	<div class="btn">';
						            		strHtml += '		<a href="'+data.popUrl+'" target="'+target+'" title="배너 자세히보기">자세히보기</a>';
						            		strHtml += '	</div>';
						            		strHtml += '	<a href="javascript:$.util.bannerClosed(\''+data.popUpCode+'\');" class="ntclose" title="오늘하루안보기">닫힘</a>';
						            		strHtml += '</div>';

						            	}else if(data.contentType == "T"){
						            		//텍스트형 customerName
						            		strHtml += '<div class="notice_area text">';
				 		            		strHtml += '		<p class="headman"><strong>'+customerName+' 고객님</strong>'+data.detailDesc+'</p>';
						            		strHtml += '	<div class="btn">';
						            		strHtml += '		<a href="'+data.popUrl+'" target="'+target+'" title="텍스트팝업 자세히보기">자세히보기</a>';
						            		strHtml += '	</div>';
						            		strHtml += '	<a href="javascript:$.util.bannerClosed(\''+data.popUpCode+'\');" class="ntclose" title="오늘하루안보기">닫힘</a>';
						            		strHtml += '</div>';
						            	}else if(data.contentType == "FD" || data.contentType == "ES" || data.contentType == "BD" || data.contentType == "RP"){
						            		//상품형
						            		if(data.contentType == "FD"){
						            			prdTypeNm = "펀드";
						            			prdTypeHead = data.detailDesc;
						            			prdSubTxt1 = "위험도";
						            			prdSubTxt2 = "3개월 수익률";
												if(data.FundThreeRtn.indexOf("-") > -1){
													resultCss = "down";
												}else{
													resultCss = "up";
												}
						            			prdFirstData  = data.RiskName;

						            			if(data.FundThreeRtn == "0.00"){
							            			prdSecondData = '<em class="equal">-</em>';
						            			}else{
							            			prdSecondData = '<em class="'+resultCss+'">'+data.FundThreeRtn+'<em>%</em></em>';
						            			}
						            			linkHtml = '<a href="javascript:_common.showDetailLayerPopup(\'/ux/kor/finance/fund/detail/view.do?FUND_CD=' + data.productCode +'\')" title="펀드팝업 자세히보기">자세히보기</a>';
						            		}else if(data.contentType == "ES"){
						            			prdTypeNm = "ELS/DLS";
						            			prdTypeHead = data.detailDesc;
						            			prdSubTxt1 = "원금지급여부";
						            			prdSubTxt2 = "제시수익률(세전)";
												if(data.INVT_FRCT_PRFT_CTNT.indexOf("-") > -1){
													resultCss = "down";
												}else{
													resultCss = "up";
												}
						            			prdFirstData  = data.PRNL_GRNT_YN;
						            			prdSecondData = '<em class="'+resultCss+'">'+data.INVT_FRCT_PRFT_CTNT+'</em>';
						            			linkHtml = '<a href="javascript:_common.showDetailLayerPopup(\'/ux/kor/finance/els/saleGoods/ingDetailTab1.do?ISCD=' + data.productCode + '&listGubun=N&ISCD_TYPE_CODE=2'+'\')" title="ELS팝업 자세히보기">자세히보기</a>';
						            		}else if(data.contentType == "BD"){
						            			prdTypeNm = "채권";
						            			prdTypeHead = data.detailDesc;
						            			prdSubTxt1 = "잔존기간";
						            			prdSubTxt2 = "매매금리";
						            			if(data.DLNG_ANCT_YILD.indexOf("-") > -1){
													resultCss = "down";
												}else{
													resultCss = "up";
												}
						            			prdFirstData = data.A_RMN_MMS_NAME;
						            			prdSecondData = '<em class="'+resultCss+'">'+data.DLNG_ANCT_YILD+'<em>%</em></em>';

												linkHtml = '<a href="javascript:_common.showDetailLayerPopup(\'/ux/kor/finance/bond/outbondsearch/outBondLayer.do?ISCD=' + data.productCode + '\', \'outBondLayer\')" title="채권팝업 자세히보기">자세히보기</a>';
						            		}else if(data.contentType == "RP"){
						            			prdTypeNm = "랩";
						            			prdTypeHead = data.detailDesc;
						            			prdSubTxt1 = "투자유형";
						            			prdSubTxt2 = "운용사";
						            			prdFirstData = data.INVT_TYPE_SECT_CODE_TXT;
						            			prdSecondData =	data.MGCM_NAME;
						            			linkHtml = '<a href="javascript:_common.showDetailLayerPopup(\'/ux/kor/assetManage/goldenwrap/product/view.do?WRAP_SVC_CODE=' + data.productCode + '\')" title="랩팝업 자세히보기">자세히보기</a>';
						            		}

						            		strHtml += '<div class="notice_area goods">';
						            		strHtml += '	<p class="headman"><strong>'+customerName+' 고객님</strong></p>';
						            		//strHtml += '	<div class="title">딱 맞는 추천'+prdTypeNm+'</div>';
						            		strHtml += '	<div class="prd_text">';
						            		strHtml += '		<p>'+ prdTypeHead +'</p>';
						            		strHtml += '	</div>';
						            		strHtml += '	<div class="text"><strong>';
						            		strHtml += '		'+data.productName+'';
						            		strHtml += '	</strong><ul class="col2"><li><p>'+prdSubTxt1+'</p><span>'+prdFirstData+'</span></li>';
						            		strHtml += '	<li><p>'+prdSubTxt2+'</p><span>'+prdSecondData+'</span></li></ul></div>';
						            		strHtml += '	<div class="btn">';
						            		strHtml += linkHtml;
						            		strHtml += '	</div>';
						            		strHtml += '	<a href="javascript:$.util.bannerClosed(\''+data.popUpCode+'\');" class="ntclose" title="오늘하루안보기">닫힘</a>';
						            		strHtml += '</div>';
						            	}
						            	strHtml += '</div>';
					            	}

					            	if(data.contentType != undefined){
					            		//대상자이지만, 관리자페이지에서 등록안된 팝업코드대상자는 노출X
					            		if($.cookie('custFixBanner') != data.popUpCode){
					            			var setPos = $list.css('bottom');
					            			$list.hide();
					            			$list.html(strHtml);
					            			$list.css({'bottom' : '-330px'}).show().stop().animate({'bottom' : setPos}, 3000);
					            		}
				            		}
				            	}
				            }
				        });
					}catch(err) {
						if(typeof(logger) !="undefined"){
						logger.debug(err);
					}
					}

				},
				bannerClosed:function(popUpCode){
					$.cookie('custFixBanner', popUpCode, {expires:1, path:'/'});
			    	$("#globalCustBanner").hide();
				},
				getNotice:function(){
					//allYn: Y는 전체배너(메인제외 전체페이지), N은 메인전용배너
					var allYn = "Y";
					if(window.getMenuCode()=='$INDEX'){
						allYn = "N";
					}
					$.cs.ajax({
//						url:'/ux/kor/main/main/newUrgentnotice.do?allYn='+allYn,
						url:'/ux/kor/other/global/newUrgentnotice.do?allYn='+allYn,
						data:'',
						dataType:'json',
						async:false,
						loadingStart:false,
						loadingEnd:false,
						success:function(data){
							if(typeof data.errorMsg!='undefined') {
								alert(data.errorMsg);
								return;
							};

							window.showNoticeTop(data);
						}
					});
				},
				getMobileNotice:function(){
					$.cs.ajax({
						url:'/mobile/home/mainsub.do',
						data:'cmd=urgentnotice',
						dataType:'json',
						async:false,
						loadingStart:false,
						loadingEnd:false,
						success:function(data){
							if(typeof data.errorMsg!='undefined') {
								alert(data.errorMsg);
								return;
							};

							window.showNoticeTop(data);
						}
					});
				},
				writePFDViewer:function(pdfFile) {
					var ua = navigator.userAgent.toLowerCase();
					var contentType = '';
					var downLink = pdfFile;
					if(ua.indexOf('trident') > -1 || ua.indexOf('msie') > -1 ){
						contentType = 'application/x-pdf';
					}else{
						contentType = 'application/pdf';
					}
					if(pdfFile.indexOf('?') > -1) {
						pdfFile += '&contentType='+contentType+'&inlineYn=Y';
					}
					//<p class="skipPdf"><span><a href="#"><em class="hidden">다음 콘텐츠(PDF)로 이동하시게되면 빠져나올 수 없을 수 있습니다.</em>PDF다운받기</a></span></p>
					document.write('<p class="skipPdf"><span><a href="'+downLink+'"><em class="hidden">다음 콘텐츠(PDF)로 이동하시게 되면 빠져나올 수 없습니다.  </em>PDF다운받기</a></span></p>');
					document.write('<iframe id="viewer" name="viewer" tabindex="-1" title="PDF파일 보기" src="'+pdfFile+'" width="100%" height="100%" class="iframe" frameborder="0"></iframe>');
				},
				writePFDViewer_after:function(pdfFile) { //11-26 cdi
					var ua = navigator.userAgent.toLowerCase();
					var contentType = '';
					var downLink = pdfFile;
					var returnHtml = '';
					if(ua.indexOf('trident') > -1 || ua.indexOf('msie') > -1 ){
						contentType = 'application/x-pdf';
					}else{
						contentType = 'application/pdf';
					}
					if(pdfFile.indexOf('?') > -1) {
						pdfFile += '&contentType='+contentType+'&inlineYn=Y';
					}
					returnHtml += '<p class="skipPdf"><span><a href="'+downLink+'"><em class="hidden">다음 콘텐츠(PDF)로 이동하시게되면 빠져나올 수 없을 수 있습니다.</em>PDF다운받기</a></span></p>'
                    returnHtml += '<iframe id="viewer" name="viewer" tabindex="-1" title="PDF파일 보기" src="'+pdfFile+'" width="100%" height="100%" class="iframe" frameborder="0"></iframe>';

					return returnHtml
				},
				/**
				 * 천단위 콤마
				 */
				formatTextfield : function(obj){
					var value = obj.value;
					var c;
					var result = '';
					for(var i = 0; i < value.length; i++)
					{
						c = value.charAt(i);
						if(!isNaN(c)){
							result += c;
						}
					}
					obj.value = $.util.numberFormat(result,0);
				},

				/**
				 * 리턴 메뉴가 후강통일경우 로그인유무 체크후 팝업으로 메뉴 호출 TD0932
				 * @param menuCode
				 * @param menuUrl
				 */
				openMenuToLoginUser : function(menuCode, menuUrl){
					if(isLogin()){
						window.open(menuUrl);
					}else {
						openLogin('RETURN_MENU_CODE=' + menuCode + '&RETURN_MENU_URL=' + encodeURIComponent(menuUrl));
					}
				},
				/**
				 * 수동으로 타이틀 설정
				 * @param title
				 * @param sep
				 * @param isOverride
				 * */
				setTitleManually : function (title, sep, isOverride) {
					var _currTitleValue = title || $(document).attr ('title')
					, _topDocument = top.document
					, _topDocumentTitleValue = top.document.title
					, _sep = sep || ' > '
					, _arrTitle = [];

					if (!isOverride) {
						_arrTitle.push (_topDocumentTitleValue);
					}
					_arrTitle.unshift (_currTitleValue);

					_topDocument.title = _arrTitle.join (_sep);
				},
				/**
				 * 우편번호찾기 레이어팝업 호출
				 * @param {String} objVal		자택주소,직장주소 구분값
				 * @param {Object} frm   		레이어팝업으로 보낼 폼
				 * */
				openCommonZipCode : function (objVal, frm,_this) {
					_common.showDetailLayerPopup("/blank.pop", "layerzipcodeModalPop",_this);
					frm.val('objVal', objVal);
					frm.val('uxflag', "uxflag");  //ux용 레이어팝업 구분자
					frm.target = 'f_layerzipcodeModalPop';  //레이어팝업 클래스이름(f_붙여야함)
			        frm.action = '/common/zipcode/popup_zipcode.do';
			        frm.cSubmit();
				}, getSmartCustomerLayer : function(){
					var html ="";
					html +='<div class="mbg"><!-- 배경화면 내용없음 --></div>';
					html +='<div class="popSection pd0" style="width:500px;margin-left:-250px !important;margin-top:177px !important;">';
					html +='	<div class="cont login_smart">';
					html +='	<div class="hidden">';
					html +='		<p>고객님은 스마트 고객입니다.<br>';
					html +='		스마트한 투자! 삼성증권이 도와드립니다.</p>';
					html +='		<dl>';
					html +='		<dt>스마트 고객이란?</dt>';
					html +='		<dd>모바일/pc를 이용해 본인 스스로 투자를 결정하는 고객입니다.</dd>';
					html +='		</dl>';
					html +='	</div>';
					html +='	<ul style="position:relative;">';
					html +='		<li><span class="hidden">스스로 투자 결정 하시기 전에!</span>';
					html +='			<a href="javascript:window.openMenu(\'M1235017420812\');"><span class="hidden">투자정보 보러가기</span></a>';	
					html +='		</li>';
					html +='			<li><span class="hidden">마음대로 언제든지 PB와 상담을!</span>';
					html +='				<a href="javascript:window.openMenu(\'M1401710120030\');"><span class="hidden">PB상담 하러가기</span></a>';	
					html +='			</li>';
					html +='			<li><span class="hidden">트렌디한 상품까지 받으려면!</span>';
					html +='				<a href="javascript:window.openMenu(\'M1470963407962\');"><span class="hidden">MY혜택 보러가기</span></a>';	
					html +='			</li>';
					html +='			<li><span class="hidden">퀴즈만 풀어도 스타벅스를 드려요!</span>';
					html +='				<a href="javascript:window.openMenu(\'M1487640848597\',\'/ux/kor/customer/notice/eventQuiz/eventQuizView.do?MenuSeqNo=11\');"><span class="hidden">자세히보기</span></a>';	
					html +='			</li>';
					html +='		</ul>';
					html +='		<div class="layerBtn_close" >';
					html +='			<button title="선물옵션거래하기 페이지 이동" class="btnLarge white modalClose" onClick="$.util.closeSmartCustomerLayer();" type="button">닫기</button>';
					html +='		</div>';
					html +='	</div><!-- //cont -->';
					html +='</div><!-- //popSection  -->';
					html +='</div><!-- //modalPop  -->';

					$("#smartlayerpopup").empty().append(html);
				}, openSmartCustomerLayer : function(zdx){
					if(zdx==1){
						SSP.modalView.centerBox($('#smartlayerpopup'),$('#btn_smartlayerpopup'));
					}
				}, closeSmartCustomerLayer : function(){
					$("#smartlayerpopup").hide();
				}, pop_opinion : function(formNm) { //부적정보고서
					_common.showDetailLayerPopup("/blank.pop", "pop_opinion");
					//레이어팝업으로 폼내용 보낼때
					$.form(formNm).action = "/ux/common/pop_opinion.do";
					$.form(formNm).target = 'f_pop_opinion'; //레이어팝업 클래스이름(f_붙여야함)
					$.form(formNm).method = 'post';
					$.form(formNm).csSubmit();
				}, pop_confirmProv : function(formNm) { //투자권유희망 및 투자자정보 제공 여부 확인서
					if(formNm == undefined){
						_common.showDetailLayerPopup("/ux/common/pop_confirmProv.do", "pop_confirmProv");
					}else if(formNm == "overFrm"){
						_common.showDetailLayerPopup("/ux/common/pop_confirmProv.do?isOver=Y", "pop_confirmProv");
					}else{
						_common.showDetailLayerPopup("/blank.pop", "pop_confirmProv");
                        //레이어팝업으로 폼내용 보낼때
                        $.form(formNm).action = "/ux/common/pop_confirmProv.do";
                        $.form(formNm).target = 'f_pop_confirmProv'; //레이어팝업 클래스이름(f_붙여야함)
                        $.form(formNm).method = 'post';
                        $.form(formNm).csSubmit();
					}
	            }, pop_nonconform : function(formNm) { //부적합확인서
	            	_common.showDetailLayerPopup("/blank.pop", "pop_nonconform");
	            	if(formNm == "overFrm"){
	            		$.form(formNm).action = "/ux/common/pop_nonconform.do?isOver=Y";
	            	}else{
		                $.form(formNm).action = "/ux/common/pop_nonconform.do";
	            	}
	            	$.form(formNm).target = 'f_pop_nonconform'; //레이어팝업 클래스이름(f_붙여야함)
	                $.form(formNm).method = 'post';
	                $.form(formNm).csSubmit();
	            }, creditGrantCheck : function(LN_TYPE_CODE){
	            	if(LN_TYPE_CODE == undefined) LN_TYPE_CODE = "2";
	            	var deferred = $.Deferred();
					$.cs.ajax({
						type : 'post',
						url : '/ux/common/creditGrantCheck.do',
						dataType : 'json',
						data : 'LN_TYPE_CODE=' + LN_TYPE_CODE,
						success : function(data) {
							
							if(data.A_PUP_YN == "Y"){
				                if(confirm("신용/ 대출 서비스 이용을 위해  신용공여정보확인서\n등록/ 갱신이 필요합니다.\n신용공여정보확인서 등록 화면으로 이동하시겠습니까 ?")){
				                    openMenu('M1616040979314');
				                }
			                	deferred.resolve(false);
							}else{
								deferred.resolve(true);
							}

						}
					});
	                return deferred.promise();
	            }, ageCalculation : function(date) { //만나이 계산
	            	var today = moment().format('YYMMDD');
	            	var age = moment(date ,'YYMMDD').format('YYMMDD')
	            	
	            	var a = today.substring(0,2);
	            	var b = age.substring(0,2);
	            	var c = today.substring(2,6);
	            	var d = age.substring(2,6);
	            	var e = 100 + Number(a) - Number(b);
	            	var f = Number(c) - Number(d);
	            	var manAge = 0;
	            	
	            	if(f > 0){
	            		manAge = e;
	            	}else{
	            		manAge = e-1;
	            	}
	            	return manAge;
	            }
			}
	};

	var tableSequence = 0;
	var ScrollVerticalEventUtil = function(par,tar,evt){
		tableSequence++;
		this.scrollLeft = 0;
		this.scrollTop = 0;
		this.par = $(par);
		this.tar = $(tar);
		this.evt = evt;
		this.inter = null;
		this.init();
	};

	ScrollVerticalEventUtil.prototype = {
			init : function(){
				var p = this.par;
				this.tar.each(function(){
					var ni = this.id+tableSequence;
					var se = $(this).find('table[data-role=common-table-scroll-sync]');
					if(this.nodeName.toUpperCase() != 'TABLE' && se.length > 0){
						se.data('manager-sync', null);
						se.attr('data-parent',ni);
						p.attr('data-name',ni);
						_common.reinit_ui();
					}
				});
				var _this = this;
				this.par.scroll(function(){
					if(_this.scrollLeft == _this.par.scrollLeft()){
						if(_this.scrollTop < _this.par.scrollTop()){
							var _t = (_this.tar.height() - _this.par.height()) - _this.par.scrollTop();
							if(_t <= 25 && _this.evt){
								_this.eventCall();
							}
						}
					}else _this.scrollLeft = _this.par.scrollLeft();
				});
			},
			eventCall : function(){
				var _this = this;
				clearInterval(this.inter);
				this.inter = setTimeout(function(){
					_this.evt.call(_this);
				},100);
			}
	};



	var ScrollHorizontalEventUtil = function(par,tar,evt){
		this.scrollLeft = 0;
		this.scrollTop = 0;
		this.par = $(par);
		this.tar = $(tar);
		this.evt = evt;
		this.inter = null;
		this.init();
	};

	ScrollHorizontalEventUtil.prototype = {
			init : function(){
				var _this = this;
				this.par.scroll(function(){
					if(_this.scrollTop == _this.par.scrollTop()){
						if(_this.scrollLeft < _this.par.scrollLeft()){
							var _t = (_this.tar.width() - _this.par.width()) - _this.par.scrollLeft();
							if(_t <= 25 && _this.evt){
								_this.eventCall();
							}
						}
					}else _this.scrollTop = _this.par.scrollTop();
				});
			},
			eventCall : function(){
				var _this = this;
				clearInterval(this.inter);
				this.inter = setTimeout(function(){
					_this.evt.call(_this);
				},100);
			}
	};

	var StockCodeLoader = function(target,layer,evt){
		var _this = this;
		this.evt = evt;
		this.stockData = [];
		this.layer = layer;
		this.target = $(target);
		this.inter  = null;
		$(this.layer).css('display','none');
		$(target).keyup(function(e){
			if(e.keyCode == 13){
				_this.close();
			}else{
				_this.searchStock(this);
			}
		});
		this.init();
		return this;
	};
	StockCodeLoader.prototype = {
			init : function(){
				var _this = this;
				if(this.stockData.length == 0){
					$.cs.ajax({
						url : '/ux/common/stockCodeData.do',
						data : '',
						dataType : 'json',
						success : function(r){
							var l = r.data.length;
							for(var i = 0; i < l; i++){
								_this.stockData.push([r.data[i][1],r.data[i][0],r.data[i][1]+' - '+r.data[i][0]+'- '+r.data[i][2],_this.splitEucKR(r.data[i][0])]);
							}
						}
					});
				}
			},
			searchStock : function(tar){
				var _this = this;
				clearInterval(this.inter);
				this.inter = setTimeout(function(){
					var resultArray = [];
					if(_this.stockData){
						var searchStr = _this.splitEucKR(tar.value);
						if(!$.util.isEmpty(searchStr)){
							var len = _this.stockData.length;
							for(var i = 0; i < len; i++){
								if(_this.stockData[i][3].indexOf(searchStr) > -1 || _this.stockData[i][0].indexOf(searchStr) > -1){
									resultArray.push(_this.stockData[i]);
								}
							}
						}
					}
					_this.setGreed(resultArray);
				},100);
			},
			setGreed : function(data){
				var _this = this;
				$(this.layer).html('');
				var len = data.length;
				var rval = _this.target.val();
				if(len > 0){
					$(this.layer).css('display','');
					var str = '<ul>';
					for(var i = 0; i < len; i++){
						var replaceStr = data[i][2].replace(rval,'<strong>'+rval+'</strong>');
						str += '<li data-code="'+data[i][0]+'" data-name="'+data[i][1]+'"><a href="javascript:;">'+replaceStr+'</a></li>';
					}
					str += '</ul>';
					$(this.layer).html(str);
					$(this.layer).find('ul > li').click(function(){
						if(_this.evt){
							_this.clickEvt(this);
						}
					});
				}else{
					this.close();
				}
			},
			splitEucKR : function(){
				var str = arguments[0];
				var hanTable=new Array();
				hanTable[0]='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
				hanTable[1]='ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
				hanTable[2]=' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';
				var result = "";
				var temp;
				for(var i=0;i<str.length;i++){
					if(escape(str.charAt(i)).length>4){
						temp = str.charCodeAt(i);
						result+=$.util.trim(hanTable[0].charAt(parseInt((temp-0xAC00)/588)));
						result+=$.util.trim(hanTable[1].charAt(parseInt((temp-0xAC00)%588/28)));
						result+=$.util.trim(hanTable[2].charAt((temp-0xAC00)%28));
					}else result+=str.charAt(i);
				}
				return result;
			},
			clickEvt : function(o){
				this.evt(o.getAttribute('data-code'),o.getAttribute('data-name'));
				this.close();
			},
			close : function(){
				$(this.layer).html('');
				$(this.layer).css('display','none');
			}
	};

	$.stockbox = function(tar,layer,evt){
		return new StockCodeLoader(tar,layer,evt);
	};


	var XFEditor2 = function(containerID){
		this.containerID = containerID;
		this.xfe = null;
		this.$container = $('#' + containerID);
	};

	XFEditor2.prototype = {
			init : function() {
				try {
					var $content = this.$container.children('textarea');
					var defaultContent = $content.val();
					$content.css('display', 'none');

					this.xfe = new XFE({
						basePath : location.protocol + '//' + location.host + '/sscommon/js/xfree2',
						width : this.$container.css('width'),
						height : this.$container.css('height'),
						rootId : 'xfe'
					});

					this.xfe.render(this.containerID);

					/*
					우선 아래 내용은 에디터업체에서 수정할때까지 주석처리
					*/
					this.xfe.setHtmlValue( '<html><head></head><body><p></p></body></html>' );
					if(!defaultContent.isEmpty()) {
						this.xfe.setBodyValue( defaultContent );
					}

				} catch(e) {
					_common.trace(e);
				}
			},
			getContent : function() {
				var content = '';

				try {
					var $content = this.$container.children('textarea');

					$content.val(this.xfe.getBodyValue());
					content = $content.val();
				} catch(e) {}

				return content;
			},
			isEmpty : function() {
				return $.util.isEmpty($.util.trim(this.getContent()));
			},
			focus : function() {
				this.xfe.setFocus();
			}

	};

	var editorList = [];
	$.editor = function(containerID){
		var edt = null;
		if(editorList.length>0) {
			for(var i=0; i<editorList.length; i++) {
				if(editorList[i].containerID == containerID) {
					return editorList[i];
				}
			}
		}
		edt = new XFEditor2(containerID);
		editorList.push(edt);
		return edt;
	};

	$.util = $.cs.util;
	$.msg = $.cs.msg;


	var banks = {
			bank :[],
			bank1 : [],
			bank2 : [],
			initialize : function(opt){
				var _this = this;
				$.cs.ajax({
					url : '/common.do',
					data : 'cmd=bankList',
					success : function(r){
						_this.bank1 = [];
						_this.bank2 = [];
						_this.bank = [];
						if(opt){
							for(var i in r.bank.bank1){
								if(r.bank.bank1[i][0]!=opt){
									_this.bank1.push(r.bank.bank1[i]);
								}
							}

							for(var i in r.bank.bank2){
								if(r.bank.bank2[i][0]!=opt){
									_this.bank2.push(r.bank.bank2[i]);
								}
							}
						} else {
							_this.bank1 = r.bank.bank1;
							_this.bank2 = r.bank.bank2;
						}
						_this.bank = _this.bank1.concat(_this.bank2);
					},loadingStart : true, loadingEnd : true
				});
			},
			getTransferHtml : function(){
				var html = '';
				html += '<h4><strong>은행</strong></h4>';
				html += '<table>';
				html += '<tr>';
				var j = 0;
				for(var i = 0; i < this.bank1.length; i++){
					if(i > 0 && i % 8 == 0) html += '</tr><tr>';
					html += '<td><a href="javascript:setBank(\''+this.bank1[i][0]+'\',\''+this.bank1[i][1]+'\');" title="레이어팝업닫힘">'+this.bank1[i][1]+'</a></td>';
					j++;
				}
				if((j%8)  != 0) html += '<td colspan="'+(8-(j%8))+'" class="blank"></td>';
				html += '</tr>';
				html += '</table>';
				html += '<hr>';

				html += '<h4><em>증권</em></h4>';
				html += '<table>';
				html += '<tr>';
				j = 0;
				for(var i = 0; i < this.bank2.length; i++){
					if(i > 0 && i % 8 == 0) html += '</tr><tr>';
					html += '<td><a href="javascript:setBank(\''+this.bank2[i][0]+'\',\''+this.bank2[i][1]+'\');" title="레이어팝업닫힘">'+this.bank2[i][1]+'</a></td>';
					j++;
				}
				if((j%8)  != 0) html += '<td colspan="'+(8-(j%8))+'" class="blank"></td>';
				html += '</tr>';
				html += '</table>';
				return html;
			},
			getTransferHtmlTrade : function(gbn){
				var html = '';
				var nowNm = '' ;
				if(gbn == "fundTrade") nowNm = $('#BANK_NAME_BTN').html();

				if($.util.isEmpty(nowNm)) nowNm = '삼성증권' ;

				html += '<button type="button" class="btnLarge white minus btnBank" title="금융기관선택 닫기" onclick="javascript:$.'+gbn+'.hideBank();" id="BANK_NAME_BTN1">'+nowNm+'</button>';
				html += '<strong class="tit">은행</strong>';
				html += '<ul>';

				for(var i = 0; i < this.bank1.length; i++){
					html += '<li><a href="javascript:$.'+gbn+'.setBank(\''+this.bank1[i][0]+'\',\''+this.bank1[i][1]+'\', \'\');" title="레이어팝업닫힘">'+this.bank1[i][1]+'</a></li>';
				}

				html += '</ul>';

				html += '<strong class="tit">증권</strong>';
				html += '<ul>';
				for(var i = 0; i < this.bank2.length; i++){
					html += '<li><a href="javascript:$.'+gbn+'.setBank(\''+this.bank2[i][0]+'\',\''+this.bank2[i][1]+'\', \'\');" title="레이어팝업닫힘">'+this.bank2[i][1]+'</a></li>';
				}
				html += '</ul>';
				html += '<a href="javascript:_common.nothing();" class="btnBank_close" title="금융기관선택 닫기" onclick="javascript:$.'+gbn+'.hideBank();"><em class="hidden">닫기</em></a>';

				return html;
			},
			getBankName : function(bkcd){
				var bankName = '';
				if(this.bank){
					for(var i in this.bank){
						if(this.bank[i][0] == bkcd){
							bankName = this.bank[i][1];
							break;
						}
					}
				}
				return bankName;
			}
	};
	$.cs.bank = banks;
})();


/**
 * 자동이체 show, hide 처리 (2014.05.30)
 */
(function(){
	var ua=navigator.userAgent;
	var version='';

	if(String(ua).toLowerCase().indexOf('msie')!=-1){
		var trident=ua.match(/Trident\/(\d.\d)/i);

		if(trident!=null){
			switch(trident[1]){
				case '3.0': version='7'; break;
				case '4.0': version='8'; break;
				case '5.0': version='9'; break;
				case '6.0': version='10'; break;
				case '7.0': version='11'; break; //1230 최웅 추가
			};
		}else{
			var reg=new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
			if(reg.exec(ua)!=null) version=parseFloat(RegExp.$1);
		};
	};

	if(version!='' && Number(version)<=7){
		// 1. override-jquery-hide
		var ohide=$.fn.hide;

		$.fn.hide=function(){
			this.each(function(){
				if(String(this.nodeName).toUpperCase()=='TR'){
					$(this).find('>td').each(function(a){
						if(String($(this).css('position')).toLowerCase()=='static'){
							$(this)
							.attr('data-static', 'Y')
							.css({
								'position':'absolute',
								'top':'-9999px'
							});
						};
					});
				};
			});

			ohide.apply(this, arguments);
			return this;
		};

		// 1. override-jquery-show
		var oshow=$.fn.show;

		$.fn.show=function(){
			this.each(function(){
				if(String(this.nodeName).toUpperCase()=='TR'){
					$(this).find('>td').each(function(a){
						if(String($(this).attr('data-static')).toUpperCase()=='Y'){
							$(this)
							.removeAttr('data-static')
							.css('position', 'static');
						};
					});
				};
			});

			oshow.apply(this, arguments);
			return this;
		};
	};
})();


/*
 * 보안 및 js 파일 다운로드 크기를 줄이기 위해
 * /common/include/script_head.jsp 파일 하단으로 가이드 이동되었습니다.
 */


/**
*  jquery.extend.scrollTab()
**/
/**
*  스크롤탭
**/
(function($){
	var settings = {
		'animationSpeed' : 300,
		'closable' : false,
		'resizable' : false,
		'resizeHandles' : 'e,s,se',
		'loadLastTab':false,
		'easing':'swing'
	}

	$.fn.scrollabletab = function(options){
		return this.each(function(_idx){
			var	o = $.extend({}, settings, options),
			$tabs = $(this),
			$tabsNav = $tabs.find('>.ui-tabs-nav'),
			$liWidth = 0,
            $nav;
             // li 넓이 합산
            $tabsNav.find('>li').each(function(a){
                            $liWidth = $liWidth+$(this).outerWidth(true);
            });

            // tab 이 넘칠경우에만 진행
            if($liWidth<$tabsNav.outerWidth() || !$(this).is(":visible")){
            //    console.log(_idx+"번째는 작음 가나 show 상태가 아님");
                return;
            }




            if(ValidationUtil.is_null($(this).data('manager-scrollTab'))){
           //     console.log(_idx+'번째 탭 생성');
                $(this).data('manager-scrollTab',true);
            }else{
            //     console.log(_idx+'번째 탭 생성되어있음');
                 return;
            }

			$tabs.css({'padding':0, 'position':'relative'});
			$tabsNav.css('position','inherit');

			//Wrap inner items
			$tabs.wrap('<div id="stTabswrapper'+_idx+'" class="stTabsMainWrapper" style="position:relative"/>').find('>.ui-tabs-nav').css('overflow','hidden').wrapInner('<div class="stTabsInnerWrapper" style="width:30000px"><span class="stWidthChecker"/></div>');
			var $widthChecker = $liWidth,//$tabs.find('.stWidthChecker'),
				$itemContainer = $tabs.find('.stTabsInnerWrapper'),
				$tabsWrapper = $tabs.parents('#stTabswrapper'+_idx).width($tabs.outerWidth(true));
				//Fixing safari bug
				// if($.browser.safari)
				// {
				// 	$tabsWrapper.width($tabs.width()+6);
				// }
				//alert($tabsWrapper.width());
			if(o.resizable)
			{
				if(!!$.fn.resizable)
				{
					$tabsWrapper.resizable({
						minWidth : $tabsWrapper.width(),
						maxWidth : $tabsWrapper.width()*2,
						minHeight : $tabsWrapper.height(),
						maxHeight : $tabsWrapper.height()*2,
						handles : o.resizeHandles,
						alsoResize: $tabs,
						start : function(){ },
						resize: function(){
							$tabs.trigger('resized');
						}
						//stop: function(){ $tabs.trigger('scrollToTab',$tabsNav.find('li.ui-tabs-selected')); }
					});
				}
				else
				{
					alert('Error:\nCannot be resizable because "jQuery.resizable" plugin is not available.');
				}
			}

			var arrowsTopMargin = (parseInt(parseInt($tabsNav.innerHeight(true)/2)-8)),
				arrowsCommonCss={'cursor':'pointer','z-index':1000,'position':'absolute','top':0,'height':$tabsNav.outerHeight()-( 1)};
			$tabsWrapper.prepend(
			  $nav = $('<div/>')
			  		.disableSelection()
					.css({'position':'relative','z-index':3000,'display':'none'})
					.append(
						$('<a/>')
							.disableSelection()
							.attr('title','Previous tab')
							.attr('src','/ux/images/trading/wts/btn_tab_left.gif')
							.css(arrowsCommonCss)
							.addClass('ui-state-active ui-corner-tl ui-corner-bl stPrev stNav')
							.css('left',0)
							.append($('<img/>').disableSelection().attr('src','/ux/images/trading/wts/btn_tab_left.gif').html('Previous tab').css('margin-top',arrowsTopMargin))
							.click(function(){
								if($(this).hasClass('ui-state-disabled')) return;
								prevIndex = $tabsNav.find('li.ui-tabs-active').prevAll().length-1
								$tabsNav.find('li').eq(prevIndex).find('a').trigger('click');
								return false;
							}),
						$('<a/>')
							.disableSelection()
							.attr('title','Next tab')
							.attr('src','/ux/images/trading/wts/btn_tab_right.gif')
							.css(arrowsCommonCss)
							.addClass('ui-state-active ui-corner-tr ui-corner-br stNext stNav')
							.css({'right':0})
							.append($('<img/>').attr('src','/ux/images/trading/wts/btn_tab_right.gif').html('Next tab').css('margin-top',arrowsTopMargin))
							.click(function(){
								//Just select the previous tab and trigger scrollToTab event
								nextIndex = $tabsNav.find('li.ui-tabs-active').prevAll().length+1
								//Now select the tab
								$tabsNav.find('li').eq(nextIndex).find('a').trigger('click');
								return false;
							})
					)
			);

			//Bind events to the $tabs
			$tabs.bind('bindTabClick',function(){

				$tabsNav.find('a').click(function(){
					var $liClicked = $(this).parents('li');
					var navWidth = $nav.find('.stPrev').outerWidth(true);
					//debug('left='+($liClicked.offset().left)+' and tabs width = '+ ($tabs.width()-navWidth));
					if(($liClicked.position().left-navWidth)<0)
					{
						$tabs.trigger('scrollToTab',[$liClicked,'tabClicked','left'])
					}
					else if(($liClicked.outerWidth()+$liClicked.position().left)>($tabs.width()-navWidth))
					{
						$tabs.trigger('scrollToTab',[$liClicked,'tabClicked','right'])
					}
					//Enable or disable next and prev arrows
					$tabs.trigger('navEnabler');
					return false;
				});
			})
			.bind('scrollToTab',function(event,$tabToScrollTo,clickedFrom,hiddenOnSide){
				$tabToScrollTo = (typeof $tabToScrollTo!='undefined') ? $($tabToScrollTo) : $tabsNav.find('li.ui-tabs-selected');
				var navWidth = $nav.is(':visible') ? $nav.find('.stPrev').outerWidth(true) : 0;

				offsetLeft = -($tabs.width()-($tabToScrollTo.outerWidth(true)+navWidth+parseInt($tabsNav.find('li:last').css('margin-right'),10)));
				offsetLeft = (clickedFrom=='tabClicked' && hiddenOnSide=='left') ? -navWidth : offsetLeft;
				offsetLeft = (clickedFrom=='tabClicked' && hiddenOnSide=='right') ? offsetLeft : offsetLeft;
				var scrollSettings = { 'axis':'x', 'margin':true, 'offset': {'left':offsetLeft}, 'easing':o.easing||'' }
				$tabsNav.scrollTo($tabToScrollTo,o.animationSpeed,scrollSettings);
			})
			.bind('navEnabler',function(){
				setTimeout(function(){
					var isLast = $tabsNav.find('.ui-tabs-active').is(':last-child'),
						isFirst = $tabsNav.find('.ui-tabs-active').is(':first-child'),
						$ntNav = $tabsWrapper.find('.stNext'),
						$pvNav = $tabsWrapper.find('.stPrev');
				//	debug('isLast = '+isLast+' - isFirst = '+isFirst);
					if(isLast)
					{
//						$pvNav.removeClass('ui-state-disabled');
//						$ntNav.addClass('ui-state-disabled');

						$pvNav.show();
                        $ntNav.hide();
					}
					else if(isFirst)
					{
//						$ntNav.removeClass('ui-state-disabled');
//						$pvNav.addClass('ui-state-disabled');

						$ntNav.show();
						$pvNav.hide();
					}
					else
					{
					    $pvNav.show();
                        $ntNav.show();

//						$ntNav.removeClass('ui-state-disabled');
//						$pvNav.removeClass('ui-state-disabled');
					}
				},o.animationSpeed);
			})
			.bind('navHandler',function(){ //방향키에 대한 움직임도 ...
				if($widthChecker>$tabsNav.width())
				{
					$nav.show();
					//$tabsNav.find('li:first').css('margin-left',$nav.find('.stPrev').outerWidth(true));
				}
				else
				{
					$nav.hide();
					//$tabsNav.find('li:first').css('margin-left',0);
				}
			})
			.bind('tabsselect', function() {
				$tabs.trigger('navEnabler');
			})
			.bind('resized', function() {
				$tabs.trigger('navHandler');
				$tabs.trigger('scrollToTab',$tabsNav.find('li.ui-tabs-selected'));
			})
			.trigger('addCloseButton')
			.trigger('bindTabClick')
			.trigger('navHandler')
			.trigger('navEnabler');

			if(o.loadLastTab)
			{
				setTimeout(function(){$tabsNav.find('li:last a').trigger('click')},o.animationSpeed);
			}
		});

		//Just for debuging
		function debug(obj)
		{//console.log(obj)
		}
	}
})(jQuery);

// scroll animation

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
