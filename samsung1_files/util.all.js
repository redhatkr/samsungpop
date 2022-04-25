/*************************************************************************************************
 *
 * UTIL-ARRAY
 *
 * @author	actionwolf (neoxnazis@gmail.com)
 *
 *************************************************************************************************/
var ArrayUtil={
	/**
	 * get-random-array
	 *
	 * @param	{Object} range :길이 (0~)
	 * @usage	get_random(5) -> output : [3, 1, 2, 4, 0]
	 */
	get_random:function(range){
		var output=new Array();
		var ranges=new Array();
		var c=0, r;

		while(c<range){
			do{
				r=Math.floor(Math.random()*range);
			}while(ranges[r]!=undefined);

			ranges[r]=true;
			output[c]=r; c++;
		};
		return output;
	},


	/**
	 * get-position-match-value
	 *
	 * @param {Array} source
	 * @param {Object} value
	 */
	get_position:function(source, value){
		var n=-1;

		try{
			n=source.indexOf(value);
		}catch(e){
			for(var a=0, atotal=source.length; a<atotal; a++){
				if(source[a]===value){
					n=a;
					break;
				};
			};
		};
		return n;
	},


	/**
	 * insert-value-matrix
	 *
	 * @param {Array} soruce
	 * @param {Object} value
	 * @param {Number} x : 시작점
	 * @param {Number} y :  시작점
	 * @param {Number} w : 가로 범위
	 * @param {Number} h : 세로 범위
	 */
	insert_value_matrix:function(source, value, x, y, w, h){
		for(var a=y, atotal=y+h; a<atotal; a++){
			for(var b=x, btotal=x+w; b<btotal; b++){
				source[a][b]=value;
			};
		};
	},


	/**
	 * get-cols-from-all-row
	 * 다중 배열중에 해당하는 index에 해당하는 값들만 반환
	 *
	 * @param	{Array} source
	 * @param	{Nmber} x
	 * @return	{Array}
	 */
	get_value_cols:function(source, x){
		var arr=new Array();

		for(var a=0, atotal=source.length; a<atotal; a++){
			arr.push(source[a][x]);
		};
		return arr;
	},


	/**
	 * get-unique-element (not-json)
	 * 배열안에 중복된 데이터가 존재할 때, 중복 제거한 배열 반환
	 *
	 * @param	{Array} source
	 * @return	{Array}
	 */
	get_value_unique:function(source){
		var obj=new Object();
		var arr=new Array();

		for(var a in source){
			var aname=source[a];
			if(ValidationUtil.is_null(obj[aname])){
				// marking
				obj[aname]=true;
				// insert-array
				arr.push(aname);
			};
		};
		return arr;
	}
};











/*************************************************************************************************
 *
 * UTIL-CLASS
 *
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 * Inspired by base2 and Prototype
 *
 * http://ejohn.org/blog/simple-javascript-inheritance/
 * http://bluepoet.me/2012/07/22/%EB%B2%88%EC%97%AD%EA%B0%84%EB%8B%A8%ED%95%9C-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%83%81%EC%86%8D/
 *
 *************************************************************************************************/
(function(){
	var initializing=false, fnTest=/xyz/.test(function(){xyz;})?/\b_super\b/:/.*/;

	// The base Class implementation (does nothing)
	this.Class=function(){};

	// Create a new Class that inherits from this class
	Class.extend=function(prop){
		var _super=this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing=true;
		var prototype=new this();
		initializing=false;

		// Copy the properties over onto the new prototype
		for(var name in prop){
			// Check if we're overwriting an existing function
			prototype[name]=typeof prop[name]=="function" &&
			typeof _super[name]=="function" && fnTest.test(prop[name])?
			(function(name, fn){
				return function(){
					var tmp=this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super=_super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret=fn.apply(this, arguments);
					this._super=tmp;

					return ret;
				};
			})(name, prop[name]):
			prop[name];
		};

		// The dummy class constructor
		function Class(){
			// All construction is actually done in the init method
			if(!initializing && this.init) this.init.apply(this, arguments);
		};

		// Populate our constructed prototype object
		Class.prototype=prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor=Class;

		// And make this class extendable
		Class.extend=arguments.callee;

		return Class;
	};
})();











/*************************************************************************************************
 *
 * UTIL-DATE
 *
 * @author	actionwolf (neoxnazis@gmail.com)
 *
 *************************************************************************************************/
var DateUtil={
	/**
	 * get basic information
	 *
	 * @return	{Object}
	 */
	get_params:function(){
		return {
			'days_kor':['일', '월', '화', '수', '목', '금', '토'],
			'days_eng':['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			'month_kor':['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			'month_eng':['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			'asec':1000,
			'aminute':60*1000,
			'ahour':60*60*1000,
			'aday':24*60*60*1000
		};
	},


	/**
	 * set return information
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 0~11
	 * @param	{Number} d - 1~31
	 * @return	{Object}
	 */
	set_params:function(y, m, d){
		return {'year':y, 'month':StringUtil.add_zero(Number(m+1), 2), 'date':StringUtil.add_zero(d, 2)};
	},


	/**
	 * get now information
	 *
	 * @return	{Object}
	 */
	get_now:function(){
		var date=new Date();
		return this.set_params(date.getFullYear(), date.getMonth(), date.getDate());
	},


	/**
	 * get Date-Object
	 *
	 * @param	{String, Date, Number, Object} value
	 * @return	{Date}
	 * @usage	get_date('20120101') -> Date-Class
	 */
	get_date:function(value){
		var arr=StringUtil.to_date(value, '-').split('-');
		return new Date(Number(arr[0]), Number(arr[1])-1, Number(arr[2]));
	},


	/**
	 * get day name (korean)
	 *
	 * @param	{Number} n - 0~6
	 * @return	{String}
	 * @usage	get_name_day_kor(0) -> output : '일요일'
	 */
	get_name_day_kor:function(n){
		return this.get_params().day_kor[n];
	},


	/**
	 * get day name (english)
	 *
	 * @param	{Number} n - 0~6
	 * @return	{String}
	 * @usage	get_name_day_eng(0) -> output : 'Sunday'
	 */
	get_name_day_eng:function(n){
		return this.get_params().day_eng[n];
	},


	/**
	 * get month name (korean)
	 *
	 * @param	{Number} n - 0~11
	 * @return	{String}
	 * @usage	get_name_month_kor(0) -> output : '1월'
	 */
	get_name_month_kor:function(n){
		return this.get_params().month_kor[n];
	},


	/**
	 * get month name (english)
	 *
	 * @param	{Number} n - 0~11
	 * @return	{String}
	 * @usage	get_name_month_eng(0) -> output : 'January'
	 */
	get_name_month_eng:function(n){
		return this.get_params().month_eng[n];
	},


	/**
	 * get UTC time (milsec)
	 *
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 0~11
	 * @param	{Number} d - 1~31
	 * @return	{Number}
	 */
	get_utc_time:function(y, m, d){
		return new Date(y, m, d).getTime();
	},


	/**
	 * get UTC month (month)
	 *
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 0~11
	 * @return	{Number} total-month
	 */
	get_utc_month:function(y, m){
		return Number(Number(y)*12+(Number(m)+1));
	},


	/**
	 * get date changed month
	 *
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 0~11
	 * @return	{Number} l - 0~(+, -)
	 */
	get_changed_month:function(y, m, l){
		var total=this.get_utc_month(y, m)+l;
		var cm=total%12;
		var cy=Math.floor((total-cm)/12);

		switch(String(cm)){
			case '0':
				cy=cy-1; cm=11;
				break;

			default:
				cm=cm-1;
				break;
		};
		return {'year':cy, 'month':cm};
	},


	/**
	 * get total date
	 *
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 0~11
	 * @return	{Number} 0~31
	 */
	get_total_date:function(y, m){
		var next=this.get_changed_month(y, m, 1);
		var date=new Date(next.year, next.month);
		date.setTime(date.getTime()-this.get_params().aday);
		return date.getDate();
	},


	/**
	 * get specify date
	 *
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 1~12
	 * @param	{Number} d - 1~31
	 * @param	{Number} l - 0~(+, -)
	 * @return	{Object}
	 */
	get_distance_date:function(y, m, d, l){
		var date=new Date(Number(y), Number(m)-1, Number(d));
		date.setTime(date.getTime()+this.get_params().aday*l);
		return this.set_params(date.getFullYear(), date.getMonth(), date.getDate());
	}
};











/*************************************************************************************************
 *
 * UTIL-DELEGATE
 *
 *************************************************************************************************/
// (function(){
	var Delegate={};

	Delegate.create=function (delegateInstance, pointingMethod){
		return function (){
			return pointingMethod.apply(delegateInstance, arguments);
		};
	};

	if(typeof define==='function' && define.amd){
		define(['require', 'exports', 'module'], function(require, exports, module){
			return Delegate;
		});
	}else if(typeof module!='undefined' && module){
		module.exports=Delegate;
	}else{
		window.Delegate=Delegate;
	};
// })();











/*************************************************************************************************
 *
 * UTIL-STRING
 *
 * @author	actionwolf (neoxnazis@gmail.com)
 *
 *************************************************************************************************/
var StringUtil={
	/**
	 * add '0' charactor front value
	 *
	 * @param	{String, Number} value
	 * @param	{Number} len
	 * @return	{String}
	 * @usage	add_zero(1, 2) -> output : '01'
	 */
	add_zero:function(value, len){
		var value=String(value);

		while(value.length<len){
			value='0'+value;
		};
		return value;
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
		var isminus=(String(value).indexOf('-')==0)?true:false;
		var output;
		/**
		 * 소수점처리 추가 (2014.04.08)
		 */
		if(String(value).indexOf('.')!=-1){
			var values=String(value).split('.');
			output=String((Number(values[0]) || 0)+'.'+$.trim(values[1]));
		}else{
			output=String(Number(value));
		};

		if(isminus && String(output).indexOf('-')==-1) output='-'+output;

		var reg=/(^[+-.]?\d+)(\d{3})/;
		output+='';

		while(reg.test(output)){
			output=output.replace(reg, '$1'+','+'$2');
		};

		return output;
	},


	/**
	 * convert-pure-number-type
	 *
	 * @param	{String, Number} value
	 * @return	{Number}
	 *
	 * @usage	to_pureNumber('-1,000') -> output : -1000
	 */
	to_pureNumber:function(value){
		var isminus=(String(value).indexOf('-')==0)?true:false;
		var value=String(value).replace(/[^.0-9]/g, '');

		/**
		 * 소수점처리 추가 (2014.04.08)
		 */
		if(value.indexOf('.')!=-1){
			var values=value.split('.');
			value=String(Number($.trim(values[0]))+'.'+$.trim(values[1]));
		};

		if(isminus) value='-'+value;

		if($.trim(value)=='-') value='';
		
		
		return Number(String(value));
	},
	
	to_pureNumber_eng:function(value){ // 0106 최웅 영문달력용 추가
		var isminus=(String(value).indexOf('-')==0)?true:false;
		var value=String(value).replace(/[^.0-9]/g, '');

		/**
		 * 소수점처리 추가 (2014.04.08)
		 */
		if(value.indexOf('.')!=-1){
			var values=value.split('.');
			value=String(Number($.trim(values[0]))+'.'+$.trim(values[1]));
		};

		if(isminus) value='-'+value;

		if($.trim(value)=='-') value='';
		
		
		return (String(value));
	},
	
	to_pureNumber_minus:function(value){ // 음수(-) 전용 추가 - 최웅
		var isminus=(String(value).indexOf('-')!=-1)?true:false;
		
		var value=String(value).replace(/[^.0-9]/g, '');
		
		/**
		 * 소수점처리 추가 (2014.04.08)
		 */
		if(value.indexOf('.')!=-1){
			var values=value.split('.');
			value=String(Number($.trim(values[0]))+'.'+$.trim(values[1]));
		};

		if(isminus) value='-'+value;

		if($.trim(value)=='-') value='';
		
		
		return Number(String(value));
	},


	/**
	 * convert-date-type
	 * (value length is less 8, default now-date)
	 *
	 * @param	{String, Number} value
	 * @param	{String} sign (default. '-')
	 * @return	{String}
	 *
	 * @usage
	 * 	to_date(new Date()) -> output : '2013-01-01'
	 * 	to_date({'year':'2013', 'month':'01', 'date':'01'}) -> output : '2013-01-01'
	 * 	to_date(20130101) -> output : '2013-01-01'
	 */
	to_date:function(value, sign){
		var msg='';
		var sign=(!ValidationUtil.is_null(sign) || sign=='')?sign:'-'; // '' 일 때 처리 추가

		switch(typeof(value)){
			// A. JSON, Date
			case 'object':
				switch(typeof(value.getFullYear)){ // define-object-type (Date-Class)
					// A-0. Date-Class
					case 'function':
						msg+=value.getFullYear()+sign;
						msg+=this.add_zero(Number(value.getMonth()+1), 2)+sign;
						msg+=this.add_zero(value.getDate(), 2);
						break;

					// A-1. JSON
					default:
						msg+=value.year+sign;
						msg+=this.add_zero(value.month, 2)+sign;
						msg+=this.add_zero(value.date, 2);
						break;
				};
				break;

			// B. Number, String
			default:
				var value=String(value).replace(/[^0-9]/g, '');

				if(value.length>=8 && !isNaN(value.slice(0, 8))){
					msg+=value.slice(0, 4)+sign;
					msg+=this.add_zero(value.slice(4, 6), 2)+sign;
					msg+=this.add_zero(value.slice(6, 8), 2);
				}else{
					var now=DateUtil.get_now();
					msg+=now.year+sign;
					msg+=this.add_zero(now.month, 2)+sign;
					msg+=this.add_zero(now.date, 2);
				};
				break;
		}
		return msg;
	},

	to_month_date:function(value, sign){
		var msg='';
		var sign=(!ValidationUtil.is_null(sign) || sign=='')?sign:'-'; // '' 일 때 처리 추가

		switch(typeof(value)){
			// A. JSON, Date
			case 'object':
				switch(typeof(value.getFullYear)){ // define-object-type (Date-Class)
					// A-0. Date-Class
					case 'function':
						msg+=value.getFullYear()+sign;
						msg+=this.add_zero(Number(value.getMonth()+1), 2);
						break;

					// A-1. JSON
					default:
						msg+=value.year+sign;
						msg+=this.add_zero(value.month, 2);
						break;
				};
				break;

			// B. Number, String
			default:
				var value=String(value).replace(/[^0-9]/g, '');

				if(value.length>=6 && !isNaN(value.slice(0, 6))){
					msg+=value.slice(0, 4)+sign;
					msg+=this.add_zero(value.slice(4, 6), 2);
				}else{
					var now=DateUtil.get_now();
					msg+=now.year+sign;
					msg+=this.add_zero(now.month, 2);
				};
				break;
		}
		return msg;
	},
	
	to_date_eng:function(value, sign){// 0106 최웅 영문달력용 추가
		var msg='';
		var sign=(!ValidationUtil.is_null(sign) || sign=='')?sign:'-'; // '' 일 때 처리 추가

		switch(typeof(value)){
			// A. JSON, Date
			case 'object':
				switch(typeof(value.getFullYear)){ // define-object-type (Date-Class)
					// A-0. Date-Class
					case 'function':
						
						msg+=this.add_zero(Number(value.getMonth()+1), 2)+sign;
						msg+=this.add_zero(value.getDate(), 2)+sign;
						msg+=value.getFullYear();
						break;

					// A-1. JSON
					default:
						
						msg+=this.add_zero(value.month, 2)+sign;
						msg+=this.add_zero(value.date, 2)+sign;
						msg+=value.year;
						break;
				};
				break;

			// B. Number, String
			default:
				var value=String(value).replace(/[^0-9]/g, '');

				if(value.length>=8 && !isNaN(value.slice(0, 8))){
					
					msg+=this.add_zero(value.slice(0, 2), 2)+sign;
					msg+=this.add_zero(value.slice(2, 4), 2)+sign;
					msg+=value.slice(4, 8);
				}else{
					var now=DateUtil.get_now();
					
					msg+=this.add_zero(now.month, 2)+sign;
					msg+=this.add_zero(now.date, 2)+sign;
					msg+=now.year;
				};
				break;
		}
		return msg;
	},

	to_month_date_eng:function(value, sign){// 0106 최웅 영문달력용 추가
		var msg='';
		var sign=(!ValidationUtil.is_null(sign) || sign=='')?sign:'-'; // '' 일 때 처리 추가

		switch(typeof(value)){
			// A. JSON, Date
			case 'object':
				switch(typeof(value.getFullYear)){ // define-object-type (Date-Class)
					// A-0. Date-Class
					case 'function':
						msg+=this.add_zero(Number(value.getMonth()+1), 2)+sign;
						msg+=value.getFullYear();
						
						break;

					// A-1. JSON
					default:
						msg+=this.add_zero(value.month, 2)+sign;
						msg+=value.year;
						
						break;
				};
				break;

			// B. Number, String
			default:
				var value=String(value).replace(/[^0-9]/g, '');

				if(value.length>=6 && !isNaN(value.slice(0, 6))){
					msg+=this.add_zero(value.slice(0, 2), 2)+sign;
					msg+=value.slice(2, 6);
					
				}else{
					var now=DateUtil.get_now();
					msg+=this.add_zero(now.month, 2)+sign;
					msg+=now.year;
					
				};
				break;
		}
		return msg;
	},


	/**
	 * get-random-string
	 *
	 * @param	{String} type : 'eng', 'number', ' all'(default)
	 * @output	{String}
	 *
	 * @usage
	 * 	get_random('all', 10) -> output : 'avsds123e4'
	 * 	get_random('eng', 10) -> output : 'adhfzxf '
	 * 	get_random('number', 10) -> output : '6283127'
	 */
	get_random:function(type, range){
		// 1. define-range
		var range=(ValidationUtil.is_null(range))?10:range;

		// 2. define-characters
		var chars;
		switch(String(type).toLowerCase()){
			case 'eng':
				chars=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
				break;

			case 'number':
				chars=['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
				break;

			default:
				chars=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
				break;
		}

		// 3. random-sort
		var step=chars.length;
		var arr=ArrayUtil.get_random((chars.length>=range)?chars.length:range); // 전체가 썩이기 위해서 범위(range)가 문자열보다 작으면 문자열 길이로 랜덤 배열 취득
		var msg='';
		for(var a=0, atotal=range; a<atotal; a++){
			msg+=String(chars[Number(arr[a])%step]);
		};
		return msg;
	},


	/**
	 * 한글자소분리
	 *
	 * @param	{String} input
	 * @return	{Array}
	 *
	 * @usage
	 * 	StringUtil.toJaso('한글ab12', true) --> 'ㅎ,ㅏ,ㄴ,ㄱ,ㅡ,ㄹ,a,b,1,2'
	 * 	StringUtil.toJaso('한글ab12', false) --> 'ㅎ,ㄱ, a,b,1,2'
	 */
	to_jaso:function(input, isfull){
		var isfull=(ValidationUtil.is_null(isfull))?false:isfull;
		var cho_seong=[0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143, 0x3145, 0x3146, 0x3147, 0x3148, 0x3149, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e];
		var jung_seong=[0x314f, 0x3150, 0x3151, 0x3152, 0x3153, 0x3154, 0x3155, 0x3156, 0x3157, 0x3158, 0x3159, 0x315a, 0x315b,0x315c, 0x315d, 0x315e, 0x315f, 0x3160, 0x3161, 0x3162, 0x3163];
		var jong_seong=[0x0000, 0x3131, 0x3132, 0x3133, 0x3134,0x3135, 0x3136, 0x3137, 0x3139, 0x313a, 0x313b, 0x313c, 0x313d, 0x313e, 0x313f, 0x3140, 0x3141, 0x3142, 0x3144, 0x3145, 0x3146, 0x3147, 0x3148, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e];

		var chars=new Array();
		var v=new Array();

		for(var a=0, atotal=input.length; a<atotal; a++){
			chars[a]=input.charCodeAt(a);

			if(chars[a]>=0xAC00 && chars[a]<=0xD7A3){
				var i1, i2, i3;
				i3=chars[a]-0xAC00;
				i1=i3/(21*28);
				i3=i3%(21*28);
				i2=i3/28;
				i3=i3%28;
				v.push(String.fromCharCode(cho_seong[parseInt(i1)]));
				if(isfull){
					v.push(String.fromCharCode(jung_seong[parseInt(i2)]));
					if(i3!=0x0000) v.push(String.fromCharCode(jong_seong[parseInt(i3)]));
				};
			}else{
				v.push(String.fromCharCode(chars[a]));
			};
		};
		//console.log('>>> StringUtil.toJaso : '+input+' : '+isfull+'\n>>> '+v);
		return v;
	}
};











/*************************************************************************************************
 *
 * UTIL-VALIDATION
 *
 * @author	actionwolf (neoxnazis@gmail.com)
 *
 *************************************************************************************************/
var ValidationUtil={
	/**
	 * define null or undefined
	 *
	 * @param	{Object} value
	 * @return	{Boolean}
	 */
	is_null:function(value){
		var bool=false;

		if(typeof(value)=='undefined' || value==null){
			bool=true;
		}else if(typeof(value)=='string' && $.trim(value)==''){
			bool=true;
		};
		return bool;
	},


	/**
	 * validation full-email
	 *
	 * @param	{String} value
	 * @return	{Boolean}
	 */
	is_email:function(value){
		return (String(value).search(/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/)==-1)?false:true;
	},


	/**
	 * validation half-email
	 *
	 * @param	{String} value
	 * @return	{Boolean}
	 */
	is_email_half:function(value){
		return (String(value).search(/[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/)==-1)?false:true;
	},


	/**
	 * validation-phone-number
	 *
	 * @param	{String} value
	 * @return	{Boolean}
	 */
	is_phone_number:function(value){
		return (String(value).search(/^\d{2, 3}-\d{3,4}-\d{4}$/)==-1)?true:false;
	},


	/**
	 * validation-mobile-phone-number
	 *
	 * @param	{String} value
	 * @return	{Boolean}
	 */
	is_mobile_phone_number:function(value){
		return (String(value).search(/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{3,4}-\d{4}$/)==-1)?true:false;
	},


	/**
	 * define same-domain
	 *
	 * @param	{String} url
	 * @return	{Boolean}
	 */
	is_samedomain:function(url){
		// test that a given url is a same-origin URL
		// url could be relative or scheme relative or absolute
		var host=document.location.host; // host + port
		var protocol=document.location.protocol;
		var sr_origin='//'+host;
		var origin=protocol+sr_origin;
		// Allow absolute or scheme relative URLs to same origin
		return(
			url==origin || url.slice(0, origin.length+1)==origin+'/') ||
			(url==sr_origin || url.slice(0, sr_origin.length+1)==sr_origin+'/') ||
			// or any other URL that isn't scheme relative or absolute i.e relative.
			!(/^(\/\/|http:|https:).*/.test(url)
		);
	},


	/**
	 * define key-down-code (number)
	 * (96~105. Normal, 45~57. Num lock)
	 *
	 * @param	{Number} code
	 * @return	{Boolean}
	 */
	is_keycode_number:function(code){
		return ((code>=96 && code<=105) || (code>=45 && code<=57))?true:false;
	},

	/**
	 * define key-down-code (number) & point( . )
	 * (96~105. Normal, 45~57. Num lock, . 190)
	 *
	 * @param	{Number} code
	 * @return	{Boolean}
	 */
	is_keycode_ratio_number:function(code){
		return ( this.is_keycode_number(code) || code==190 )?true:false;
	},

	/**
	 * define key-down-code (english)
	 * (65~90. a-zA-Z)
	 *
	 * @param	{Number} code
	 * @return	{Boolean}
	 */
	is_keycode_eng:function(code){
		return (code>=65 && code<=90)?true:false;
	},


	/**
	 * define-key-down-code (sign)
	 *
	 * @param	{Number} code
	 * @return	{Boolean}
	 */
	is_keycode_sign:function(code){
		return(
			code==186 ||	// ~,
			code==187 ||	//=
			code==188 ||	//,
			code==189 ||	//-
			code==190 ||	//.
			code==191 ||	///
			code==192 ||	//`
			code==219 ||	//[
			code==220 ||	//\
			code==221 ||	//]
			code==222		//'
		)?true:false;
	},


	/**
	 * define key-down-code (function-eky)
	 *
	 * @param	{Number} code
	 * @return	{Boolean}
	 */
	is_keycode_fn:function(code){
		return(
			code==8 ||		//<Backspace>
			code==9 ||		//<Tab>
			code==12 ||	//<Clear>
			code==13 ||	//<Enter>
			code==16 ||	//<Shift>
			code==17 ||	//<Ctrl>
			code==18 ||	//<Menu>
			code==19 ||	//<Pause>
			code==20 ||	//<Caps Lock>
			code==21 ||	//<한영>
			code==27 ||	//<Esc>
			code==32 ||	//<SpaceBar>
			code==33 ||	//<Page Up>
			code==34 ||	//<Page Down>
			code==35 ||	//<End>
			code==36 ||	//<Home>
			code==37 ||	//<Arrow-LEFT>
			code==38 ||	//<Arrow-UP>
			code==39 ||	//<Arrow-RIGHT>
			code==40 ||	//<Arrow-DOWN>
			code==41 ||	//<Select>
			code==42 ||	//<Print Screen>
			code==43 ||	//<Execute>
			code==44 ||	//<Snapshot>
			code==45 ||	//<Ins>
			code==46 ||	//<Del>
			code==47 ||	//<Help>
			code==144		//<Nun Lock>
		)?true:false;
	},


	/**
	 * define msie version
	 *
	 * @return	{String} version
	 * @usage	get_msie_version() -> output : '7'
	 */
	get_msie_version:function(){
		var version='';
		var ua=navigator.userAgent;
		var trident=navigator.userAgent.match(/Trident\/(\d.\d)/i);
		if(trident!=null){
			switch(trident[1]){
				case '3.0': version='7'; break;
				case '4.0': version='8'; break;
				case '5.0': version='9'; break;
				case '6.0': version='10'; break;
				case '7.0': version='11'; break;
			};
		}else{
			var reg=new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
			if(reg.exec(ua)!=null) version=parseFloat(RegExp.$1);
		};
		return version;
	},


	/**
	 * define browser bander
	 *
	 * @return	{String} type-name
	 * @usage	get_browser_type() -> output : 'chrome', 'msie10'
	 */
	get_browser_type:function(){
		var type='';
		var ua=String(navigator.userAgent).toLowerCase();

		if(ua.indexOf('msie')!=-1 || this.get_msie_version()!=''){
			type='msie'+this.get_msie_version();
		}else if(ua.indexOf('chrome')!=-1){
			type='chrome';
		}else if(ua.indexOf('safari')!=-1 || ua.indexOf('applewebkit/5')!=-1){
			type='safari';
		}else if(ua.indexOf('firefox')!=-1){
			type='firefox';
		}else if(ua.indexOf('opera')!=-1){
			type='opera';
		};
		return type;
	},


	/**
	 * define platform bander
	 *
	 * @return	{String} type-name
	 * @usage	get_browser_type() -> output : 'mac', 'linux'
	 */
	get_platform_type:function(){
		var type='';
		var pf=String(navigator.platform).toLowerCase();

		if(pf.indexOf('macintel')!=-1){
			type='mac';
		}else if(pf.indexOf('linux i686')!=-1 || pf.indexOf('linux armv7l')!=-1){
			type='linux';
		};
		return type;
	},


	/**
	 * define mobile browser bander
	 *
	 * @return	Boolean
	 * @usage	is_mobile() -> output : true, false
	 */
	is_mobile:function(){
		var bool;
		var ua=navigator.userAgent;
		if(
			ua.match(/iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i)!=null ||
			ua.match(/LG|SAMSUNG|Samsung/)!=null
		){
			bool=true;
		}else{
			bool=false;
		};
		return bool;
	},


	/**
	 * define local server
	 */
	is_local:function(){
		return (String(location.href).toLowerCase().indexOf('http://localhost')!=-1)?true:false;
	},


	/**
	 * 일본 전각 체크
	 *
	 * @param	{Object} value
	 */
	is_jp_zenkaku:function(value){
		var bool=true;

		for(var a=0, atotal=value.length; a<atotal; a++){
			var c=value.charCodeAt(a);

			if(c<256 || (c>=0xff61 && c<=0xff9f)){
				bool=false; break;
			};
		};
		return bool;
	},


	/**
	 * define date format
	 *
	 * @param {Object} value
	 */
	is_date:function(value){
		return (/^(19[7-9][0-9]|20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/).test(value);
	},
	
	is_date_eng:function(value){ // 0106 최웅 영문달력용 추가
		return (/^(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])-(19[7-9][0-9]|20\d{2})$/).test(value);
	},

	is_date_nodash:function(value){
		return (/^(19[7-9][0-9]|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/).test(value);
	},
	
	is_date_nodash_eng:function(value){ // 0106 최웅 영문달력용 추가
		return (/^(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(19[7-9][0-9]|20\d{2})$/).test(value);
	},

	is_month_date:function(value){
		return (/^(19[7-9][0-9]|20\d{2})-(0[1-9]|1[0-2])$/).test(value);
	},
	
	is_month_date_eng:function(value){ // 0106 최웅 영문달력용 추가
		return (/^(0[1-9]|1[0-2])-(19[7-9][0-9]|20\d{2})$/).test(value);
	},

	is_month_date_nodash:function(value){
		return (/^(19[7-9][0-9]|20\d{2})(0[1-9]|1[0-2])$/).test(value);
	},
	
	is_month_date_nodash_eng:function(value){ // 0106 최웅 영문달력용 추가
		return (/^(0[1-9]|1[0-2])(19[7-9][0-9]|20\d{2})$/).test(value);
	},

	/**
	 * define-period-date
	 *
	 * @param	{String} type - 'DATE', 'MONTH'
	 * @param	{String, Number} sdate - '2014-01-01', 20140101
	 * @param	{String, Number} edate - '2014-01-01', 20140101
	 * @return	{Object}
	 */
	is_period_date:function(type, sdate, edate){
		var ismonth=(String(type).toUpperCase()=='MONTH')?true:false;
		var stime=(!this.is_null(sdate))?StringUtil.to_pureNumber(sdate):-1;
		var etime=(!this.is_null(edate))?StringUtil.to_pureNumber(edate):-1;

		var output={
			bool:true,
			msg:''
		};

		if(
			this[(ismonth)?'is_month_date_nodash':'is_date_nodash'](String(stime)) &&
			this[(ismonth)?'is_month_date_nodash':'is_date_nodash'](String(etime))
		){
			/**
			 *  기간 유효성 검사
			 */
			if(stime<=etime){

			}else{
				output.bool=false;
				output.msg='"시작일"이 "종료일" 보다 큽니다. 다시 입력해 주세요.';
			};
		}else{
			/**
			 * 시작일 유효성 검사
			 */
			if(output.bool){
				if(this.is_null(sdate)){
					output.bool=false;
					output.msg='"시작일"이 존재하지 않습니다.';
				}else if(!this[(ismonth)?'is_month_date_nodash':'is_date_nodash'](String(stime))){
					output.bool=false;
					output.msg='"시작일"의 날짜형식이 정확하지 않습니다.';
				};
			};

			/**
			 * 종료일 유효성 검사
			 */
			if(output.bool){
				if(this.is_null(edate)){
					output.bool=false;
					output.msg='"종료일"이 존재하지 않습니다.';
				}else if(!this[(ismonth)?'is_month_date_nodash':'is_date_nodash'](String(etime))){
					output.bool=false;
					output.msg='"종료일"의 날짜형식이 정확하지 않습니다.';
				};
			};
		};
		return output;
	}
};










