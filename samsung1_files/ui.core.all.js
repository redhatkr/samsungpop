/*************************************************************************************************
 *
 * UI-COMMON (CORE)
 *
 * @author	actionwolf (neoxnazis@gmail.com)
 *
 *************************************************************************************************/
var CommonUI=Class.extend({
	/**
	 * get-ui-rectangle-info
	 *
	 * @param	{DOM} scope
	 * @return	{Object}
	 * 	{
	 * 		'ax' : offset-left
	 * 		'ay' : offset-top
	 * 		'rx' : position-left
	 * 		'ry' : position-top
	 * 		'w' : width
	 *		}
	 */
	get_rectange:function(scope){
		var zv=this.get_zoom_ratio();

		if(String(ValidationUtil.get_browser_type()).indexOf('msie')!=-1){
			return{
				'ax':$(scope).offset().left || 0,
				'ay':$(scope).offset().top ||0,
				'rx':$(scope).position().left || 0,
				'ry':$(scope).position().top || 0,
				'w':$(scope).width()*zv || 0,
				'h':$(scope).height()*zv || 0
			};
		}else{
			return{
				'ax':$(scope).offset().left*zv || 0,
				'ay':$(scope).offset().top*zv ||0,
				'rx':$(scope).position().left || 0,
				'ry':$(scope).position().top || 0,
				'w':$(scope).width()*zv || 0,
				'h':$(scope).height()*zv || 0
			};
		};
	},


	/**
	 * get-total-height
	 *
	 * @param	{DOM} scope
	 * @return	{Number} h
	 */
	get_total_height:function(scope){
	/*
		var h=0;
		h+=$(scope).height();
		h+=Number($(scope).css('margin-top').replace('px', ''));
		h+=Number($(scope).css('margin-bottom').replace('px', ''));
		h+=Number($(scope).css('padding-top').replace('px', ''));
		h+=Number($(scope).css('padding-bottom').replace('px', ''));
		return h;*/
		return $(scope).outerHeight();
	},


	/**
	 * get-total-width
	 *
	 * @param	{DOM} scope
	 * @return	{Number} w
	 */
	get_total_width:function(scope){
		/*
		var w=0;
		w+=$(scope).width();
		w+=Number($(scope).css('margin-left').replace('px', ''));
		w+=Number($(scope).css('margin-right').replace('px', ''));
		w+=Number($(scope).css('padding-left').replace('px', ''));
		w+=Number($(scope).css('padding-right').replace('px', ''));
		return w;
		*/
		return $(scope).outerWidth();
	},

	/**
	 * get-zoom-ratio
	 *
	 * @return	{Number}
	 */
	get_zoom_ratio:function(){
		// 1.
		var zv=Number(StringUtil.to_pureNumber($(document.body).css('zoom')));

		// 1. 예외처리(IE)
		if(String(ValidationUtil.get_browser_type()).indexOf('msie')!=-1){
			zv=zv/100;
		};

		// 2. 예외처리('0' 값)
		zv=(zv<=0)?1:zv;

		return zv;
	},


	/**
	 * define-collision-based-position
	 *
	 * @param	{DOM} scope
	 * @param	{Object} pos
	 * 	{
	 * 		'left' : x-position
	 * 		'top' : y-position
	 * 	}
	 * @return	{Boolean} true, false
	 */
	is_collision:function(scope, pos){
		var rect=this.get_rectange(scope);

		return (
			(pos.left>=rect.ax && pos.left<=rect.ax+rect.w) &&
			(pos.top>=rect.ay && pos.top<=rect.ay+rect.h)
		)?true:false;
	},


	/**
	 * toggle-image-src
	 *
	 * @param {DOM} img
	 * @param {String} from - 변경 대상
	 * @param {String} to - 변경 값
	 */
	toggle_img_url:function(img, from, to){
		var url=$(img).attr('src');
		url=url.replace(from, to);

		$(img).attr('src', url);
	},


	/**
	 * toggle-show
	 * @param	{DOM} scope
	 * @param	{Boolean} bool - true, false
	 */
	show:function(scope, bool){
		if(bool) $(scope).show(); else $(scope).hide();
	}
});











/*************************************************************************************************
 *
 * UI-TABLE
 *
 * @description create-id-headers
 * @author	actionwolf (neoxnazis@gmail.com)
 *
 *************************************************************************************************/
var TableUI=CommonUI.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope, prefix){
		this._scope=scope;
		this._prefix=prefix || 'T';

		this.build_summary();
		this.build_mapping();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAM
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * get-row-length
	 *
	 * @return	{Number}
	 */
	get_row:function(){
		return $(this._scope).find('tr').length;
	},

	/**
	 * get-column-length
	 *
	 * @return	{Number}
	 */
	get_col:function(){
		var c=0;
		$(this._scope).find('tr:eq(0)').children().each(function(a){
			c+=Number($(this).attr('colspan')) || 1;
		});
		return c;
	},

	/**
	 * get-table-matrix-information
	 *
	 * @return {Array}
	 */
	get_matrix:function(){
		// 1. create-array
		var mtx=new Array();
		for(var y=0, ytotal=this.get_row(); y<ytotal; y++){
			mtx[y]=new Array();

			for(var x=0, xtotal=this.get_col(); x<xtotal; x++){
				mtx[y][x]='';
			}
		}

		// 2. insert-array
		$(this._scope).find('tr').each(function(a){
			$(this).children().each(function(b){
				// 2-1. define-array-position
				var n=ArrayUtil.get_position(mtx[a], '');
				// 2-2. define-arrange-width
				var bw=Number($(this).attr('colspan')) || 1;
				// 2-3. define-arrange-height
				var bh=Number($(this).attr('rowspan')) || 1;
				// 2-4. insert-information
				ArrayUtil.insert_value_matrix(mtx, $(this), n, a, bw, bh);
			});
		});
		return mtx;
	},

	/**
	 * get-headers-column
	 *
	 * @param	{Array} source
	 * @param	{Number} x
	 * @return	{Array}
	 */
	get_headers_col:function(source, x){
		var arr0=ArrayUtil.get_value_cols(source, x);
		var arr1=new Array();

		for(var a=0, atotal=arr0.length; a<atotal; a++){
			var achild=$(arr0[a]);

			if($(achild).parent().parent().is('thead')){
				if($(achild)[0].nodeName=='TH'){
					arr1.push($(arr0[a]).attr('id'));
				}
			}
		}
		return ArrayUtil.get_value_unique(arr1); // remove-duplicate
	},

	/**
	 * get-headers-row
	 *
	 * @param	{Array} source
	 * @param	{Number} x
	 * @param	{Number} y
	 * @return	{Array}
	 */
	get_headers_row:function(source, x, y){
		var arr0=source[y];
		var arr1=new Array();
		var isfind=false; // <TH> 검색중 <TD>가 검색되면 for문 중단을 위한 flag

		for(var a=x; a>=0; a--){
			var achild=$(arr0[a]);

			if($(achild).parent().parent().is('tbody') || $(achild).parent().parent().is('tfoot')){
				if($(achild)[0].nodeName==='TH'){
					arr1.push($(arr0[a]).attr('id')); isfind=true;
				}else{
					if(isfind) break;
				}
			}
		}
		return ArrayUtil.get_value_unique(arr1); // remove-duplicate
	},

	/**
	 * get-headers
	 *
	 * @param	{String} type - 'TH', 'TD'
	 * @param	{Array} source
	 * @param	{Number} x
	 * @param	{Number} y
	 * @return	{String}
	 */
	get_headers:function(type, source, x, y){
		var cols=this.get_headers_col(source, x);
		var rows=this.get_headers_row(source, x, y);
		var output='';

		switch(type){
			case 'TH':
				output=cols.join(','); // column
				break;

			case 'TD':
				output=cols.concat(rows).join(','); // column+row
				break;
		}
		return output;
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SUMMARY
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_summary:function(iseng){
		if(ValidationUtil.is_null($(this._scope).attr('summary'))){
			// 1. search-element-th
			var msg='';
			$(this._scope).find('th').each(function(a){
				var amsg=$(this).text() || '';

				if($.trim(amsg)!=''){
					msg+=((msg=='')?'':',')+amsg;
				}else{
					// read-image-alt
					$(this).find('img').each(function(b){
						var bmsg=$(this).attr('alt') || '';

						if($.trim(bmsg)!='') msg+=((msg=='')?'':',')+bmsg;
					});

					// read-input-title
					$(this).find('input').each(function(c){
						var cmsg=$(this).attr('title') || '';

						if($.trim(cmsg)!='') msg+=((msg=='')?'':',')+cmsg;
					});
				}
			});

			if(msg!=''){
				// 2. search-element-caption
				var caption=$.trim($(this._scope).find('caption').text()) || '';

				// 3. add-message
				if(iseng){
					msg='Table include '+msg;
					if($.trim(caption)!='') msg=caption+' '+msg;
				}else{
					msg+='(으)로 이루어진';
					if($.trim(caption)!='') msg+=' '+caption;
					msg+=' 테이블입니다.';
				}

				// 4. append-attribute
				$(this._scope).attr('summary', msg);
			}
		}
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:MAPPING
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * create-id-headers
	 */
	build_mapping:function(){
		var owner=this;

		// 1. append-id (only-<th>)
		var c=0;
		$(this._scope).find('th').each(function(a){
			$(this).attr('id', owner._prefix+'-'+c); c++;
		});

		// 2. get-headers-information
		var mtx=this.get_matrix();
		var sorts=new Array();
		var w=this.get_col();
		var h=this.get_row();

		for(var y=0, ytotal=h; y<ytotal; y++){
			for(var x=0, xtotal=w; x<xtotal; x++){
				var cscope=$(mtx[y][x]);

				if($(cscope).parent().parent().is('tbody') || $(cscope).parent().parent().is('tfoot')){
					// 2-1. get-headers-string
					var prev=(!ValidationUtil.is_null($(cscope).data('headers')))?$(cscope).data('headers')+',':'';
					var current=this.get_headers($(cscope)[0].nodeName, mtx, x, y);
					$(cscope).data('headers', prev+current);

					// 2-2. insert-scope
					sorts.push($(cscope));
				}
			}
		}

		// 3. append-headers (<tbody> -> <th>, <td>)
		for(var d in sorts){
			var dscope=sorts[d];

			if(!ValidationUtil.is_null($(dscope).data('headers'))){
				$(dscope).attr('headers', ArrayUtil.get_value_unique(String($(dscope).data('headers')).split(',')).join(' '));
			}
		}
	}
});











/*************************************************************************************************
 *
 * UI-INPUT
 *
 * @extend	CommonUI
 * @author	actionwolf (neoxnazis@gmail.com)
 *
 * type :
 *		number
 *		pure-number
 *		date
 *		eng
 *
 * ASCII-CODE : http://www.powerindex.net/U_convt/ascii/ascii.html
 * KEY-CODE : http://www.superkts.pe.kr/upload/helper/file1/keyCode.html
 *
 *************************************************************************************************/
var InputUI=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope, properties){
		this._scope=scope;

		this._properties=properties || new Object();
		this._type=String(properties.type).toLowerCase() || null;
		this._issensitive=properties.issensitive;

		this._value='';
		this._keycode=null;
		this._interval=null;

		this.initCSS();
		this.initEvent();
		this.reinit();
	},


	reinit:function(){
		var value=$(this._scope).val() || '';

		switch(String(this._type)){
			case 'date':
				if($.trim(value)=='' && !this._issensitive){
					value=String(StringUtil.to_date(DateUtil.get_now()));
				};
				break;

			case 'month-date':
				if($.trim(value)=='' && !this._issensitive){
					value=String(StringUtil.to_month_date(DateUtil.get_now()));
				};
				break;

			default:
				break;

		};
		$(this._scope).val(value);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAMS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	is_allowed_keydown:function(e){
		//20141117 firefox쪽 문제로 인하여 kings쪽 keycode 체크방식으로 변경
		var code=e.keyCode;

		var bWindows=navigator.userAgent.toUpperCase().indexOf('WINDOWS');
		if(code==0 && bWindows != -1){
			code = fnGetKeyCode();
		}
		var bool=true;

		/**
		 * "." -> keyCode : 190, 65, 110
		 * "-" -> keyCode : 109, 189
		 */

		if(code!==9 && code!==13){
			switch(String(this._type)){
				case 'number':
					if(code==229 || e.shiftKey || (!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_number(code))){
						bool=false;
						//kings buffer clear
						if(bWindows != -1){
							fnbufferclear();
						}
					};
					break;

				case 'pure-number':
					if(code==229 || e.shiftKey || (!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_number(code))){
						bool=false;
						if(bWindows != -1){
							fnbufferclear();
						}
					};
					break;

				case 'string-number':
					if(code==229 || e.shiftKey || (!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_number(code))){
						bool=false;
						if(bWindows != -1){
							/*
							 * TODO 확인필요 TD2554
							 * 같은 조건 code==229 || e.shiftKey || (!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_number(code))
							 */
//							fnbufferclear();
						}
					};
					break;

				case 'string-number-ctrlv':
					if(code==229 || e.shiftKey || (!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_number(code))){
						bool=false;
						if(bWindows != -1){
							fnbufferclear();
						}
					};
					if(code==86) bool=true;
					break;

				case 'sign-number':
					/*
					if(code==229 || e.shiftKey || (!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_number(code) && code!=190 && code!=110 && code!=109 && code!=189)){
						bool=false;
					};*/
					break;
                case 'minus-number':

                    if(code==229 || e.shiftKey || (!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_number(code) && code!=190 && code!=110 && code!=109 && code!=189)){
                        bool=false;
                    };
                    break;

				case 'date':
					if(code==229 || e.shiftKey || (!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_number(code))){
						bool=false;
						if(bWindows != -1){
							fnbufferclear();
						}
					};
					break;

				case 'month-date':
					if(code==229 || e.shiftKey || (!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_number(code))){
						bool=false;
						if(bWindows != -1){
							fnbufferclear();
						}
					};
					break;

				case 'eng':
					if(code==229 || (!ValidationUtil.is_keycode_sign(code) && !ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_eng(code) && !ValidationUtil.is_keycode_number(code))){
						bool=false;
						if(bWindows != -1){
							fnbufferclear();
						}
					};
					break;

				case 'ratio-number':
					if(code==229 || e.shiftKey ||(!ValidationUtil.is_keycode_fn(code) && !ValidationUtil.is_keycode_ratio_number(code))){
						bool=false;
						if(bWindows != -1){
							fnbufferclear();
						}
					};
					break;
			};
		};
		return bool;
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CSS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	initCSS:function(){
		var cprop, aprop;

		switch(String(this._type)){
			case 'number':
				cprop={'ime-mode':'disabled'};
				aprop={};
				break;

			case 'pure-number':
				cprop={'ime-mode':'disabled'};
				aprop={};
				break;

			case 'string-number':
				cprop={'ime-mode':'disabled'};
				aprop={};
				break;

			case 'sign-number':
				cprop={'ime-mode':'disabled'};
				aprop={};
				break;

		    case 'minus-number':
                cprop={'ime-mode':'disabled'};
                aprop={};
                break;

			case 'date':
				cprop={'ime-mode':'disabled'};
				aprop={'maxlength':8};
				break;

			case 'month-date':
				cprop={'ime-mode':'disabled'};
				aprop={'maxlength':6};
				break;

			case 'eng':
				cprop={'ime-mode':'disabled'};
				aprop={};
				break;
				
			case 'string-number-ctrlv':
				cprop={'ime-mode':'disabled'};
				aprop={};
				break;

			case 'ratio-number':
				cprop={'ime-mode':'disabled'};
				aprop={};
				break;
		};
		$(this._scope).css(cprop).attr(aprop);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	initEvent:function(){
		var owner=this;

		$(this._scope).bind({
			'focusin':function(e){
				owner.focusinEvent(e);
			},

			'focusout':function(e){
				owner.focusoutEvent(e);
			},

			'keydown':function(e){
				if(!owner.is_allowed_keydown(e)){
					return false;
				};
			},

			'keyup':function(e){
				return false;
			}
		});
	},


	focusinEvent:function(e){
		var owner=this;
		var value=$(this._scope).val() || '';

		if($(this._scope).prop('readonly') || $(this._scope).attr('readonly')){
			return false;
		};

		switch(String(this._type)){
			case 'number':
				value=($.trim(value)!='')?String(StringUtil.to_pureNumber(value)):'';
				break;

			case 'pure-number':
				value=($.trim(value)!='')?String(StringUtil.to_pureNumber(value)):'';
				break;

			case 'string-number':
				value=($.trim(value)!='')?String(value):'';
				break;

			case 'sign-number':
				value=($.trim(value)!='')?String(StringUtil.to_pureNumber(value)):'';
				break;

			case 'date':
				if($('html').attr('lang')=='ko')
				{
					if(this._issensitive && !ValidationUtil.is_date(value)){
						value='';
					}else{
						value=($.trim(value)!='')?String(StringUtil.to_pureNumber(value)):'';
					};
				}
				else if($('html').attr('lang')=='en')
				{
					if(this._issensitive && !ValidationUtil.is_date_eng(value)){
						value='';
					}else{
						value=($.trim(value)!='')?String(StringUtil.to_pureNumber_eng(value)):'';
					};
				}
				break;

			case 'month-date':
				if($('html').attr('lang')=='ko')
				{
					if(this._issensitive && !ValidationUtil.is_month_date(value)){
						value='';
					}else{
						value=($.trim(value)!='')?String(StringUtil.to_pureNumber(value)):'';
					};
				}
				else if($('html').attr('lang')=='en')
				{
					if(this._issensitive && !ValidationUtil.is_month_date_eng(value)){
						value='';
					}else{
						value=($.trim(value)!='')?String(StringUtil.to_pureNumber_eng(value)):'';
					};
				}
				
				break;

			case 'string-number-ctrlv':
				value=($.trim(value)!='')?String(value):'';
				break;

			case 'ratio-number':
				value=($.trim(value)!='')?String(value):'';
				break;
				
			default:
				break;

		};
		$(this._scope).val(value);

		this._value=value;
		this._interval=setInterval(function(){
			owner.check();
		}, 10);
	},


	focusoutEvent:function(e){
		var value=$(this._scope).val() || '';

		switch(String(this._type)){
			case 'number':
				value=($.trim(value)!='')?StringUtil.to_cash(StringUtil.to_pureNumber(value)):'';
				break;

			case 'pure-number':
				value=($.trim(value)!='')?String(StringUtil.to_pureNumber(value)):'';
				break;

			case 'string-number':
				value=($.trim(value)!='')?String(value):'';
				break;

			case 'sign-number':
				value=($.trim(value)!='')?StringUtil.to_cash(StringUtil.to_pureNumber(value)):'';
				break;

			case 'date':
				if($('html').attr('lang')=='ko')
				{
					if(!ValidationUtil.is_date_nodash(value)){
						if(this._issensitive){
							value='';
						}else{
							value=String(StringUtil.to_date(DateUtil.get_now()));
						};
					}else{
						value=String(StringUtil.to_date(value, this._properties.sign));
					};
				}
				else if($('html').attr('lang')=='en') // 0106 최웅 영문 달력 월일년 순으로 변경
				{
					if(!ValidationUtil.is_date_nodash_eng(value)){
						if(this._issensitive){
							value='';
						}else{
							value=String(StringUtil.to_date_eng(DateUtil.get_now()));
						};
					}else{
						value=String(StringUtil.to_date_eng(value, this._properties.sign));
					};
				}
				
				break;

			case 'month-date':
				
				if($('html').attr('lang')=='ko')
				{
					if(!ValidationUtil.is_month_date_nodash(value)){
						if(this._issensitive){
							value='';
						}else{
							value=String(StringUtil.to_month_date(DateUtil.get_now()));
						};
					}else{
						value=String(StringUtil.to_month_date(value, this._properties.sign));
					};
				}
				else if($('html').attr('lang')=='en') // 0106 최웅 영문 달력 월일년 순으로 변경
				{
					if(!ValidationUtil.is_month_date_nodash_eng(value)){
						if(this._issensitive){
							value='';
							
						}else{
							value=String(StringUtil.to_month_date_eng(DateUtil.get_now()));
							
						};
					}else{
						value=String(StringUtil.to_month_date_eng(value, this._properties.sign));
						
					};
				}
				break;

			case 'eng':
				break;

			case 'string-number-ctrlv':
				value=($.trim(value)!='')?String(value):'';
				break;

			case 'ratio-number':
				value=($.trim(value)!='')?String(value):'';
				break;
				
			default:
				break;
		}
		$(this._scope).val(value);

		clearInterval(this._interval);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	check:function(){
		var value=$(this._scope).val() || '';
		if(this._value!=value){
			this._value=value;
			$(this._scope).trigger('change');
		}
	}
});




/*************************************************************************************************
 *
 * UI-INPUT-NUMBER
 *
 *************************************************************************************************/
var InputNumber=function(scope){
	return new InputUI(scope, {'type':'number'});
};


/*************************************************************************************************
 *
 * UI-INPUT-PURE-NUMBER
 *
 *************************************************************************************************/
var InputPureNumber=function(scope){
	return new InputUI(scope, {'type':'pure-number'});
};


/*************************************************************************************************
 *
 * UI-INPUT-STRING-NUMBER
 *
 *************************************************************************************************/
var InputStringNumber=function(scope){
	return new InputUI(scope, {'type':'string-number'});
};

/*************************************************************************************************
*
* UI-INPUT-STRING-NUMBER + Ctrl V만 허용
*
*************************************************************************************************/
var InputStringNumberCtrlV=function(scope){
	return new InputUI(scope, {'type':'string-number-ctrlv'});
};

/*************************************************************************************************
 *
 * UI-INPUT-RATIO-NUMBER - 비율입력 - 소수점과 숫자만 - PURE-NUMBER에 point(.) 처리만 추가
 *
 *************************************************************************************************/
var InputRatioNumber=function(scope){
	return new InputUI(scope, {'type':'ratio-number'});
};

/*************************************************************************************************
 *
 * UI-INPUT-SIGN-NUMBER
 *
 *************************************************************************************************/
var InputSignNumber=function(scope){
	return new InputUI(scope, {'type':'sign-number'});
};


/*************************************************************************************************
 *
 * UI-INPUT-MINUS-NUMBER
 *
 *************************************************************************************************/
var InputMinusNumber=function(scope){
	return new InputUI(scope, {'type':'minus-number'});
};

/*************************************************************************************************
 *
 * UI-INPUT-ENGLISH
 *
 *************************************************************************************************/
var InputENG=function(scope){
	return new InputUI(scope, {'type':'eng'});
};


/*************************************************************************************************
 *
 * UI-INPUT-DATE
 *
 *************************************************************************************************/
var InputDate=function(scope, sign, issenstive){
	return new InputUI(scope, {'type':'date', 'sign':((!ValidationUtil.is_null(sign))?sign:'-'), 'issensitive':issenstive});
};


/*************************************************************************************************
 *
 * UI-INPUT-DATE-MONTH
 *
 *************************************************************************************************/
var InputMonthDate=function(scope, sign, issenstive){
	return new InputUI(scope, {'type':'month-date', 'sign':((!ValidationUtil.is_null(sign))?sign:'-'), 'issensitive':issenstive});
};












/*************************************************************************************************
 *
 * UI-PAGING
 *
 * @extend	CommonUI
 * @author	actionwolf (neoxnazis@gmail.com)
 *
 * STYLE - UI_STYLE_PAGING (/js\ui\ui.style.js)
 *
 *
 * @param	{DOM} scope
 * @param	{Object} properties
 * 	{
 * 		'count':{
 * 			'total': 전체 카운트,
 * 			'step': 페이지당 카운트
 *			},
 *
 * 		'page':{
 * 			'step': 한 화면에 보이는 페이지 수
 * 			'currnet': 현재 페이지 번호 (1~)
 *			}
 * 	}
 * @param	{Function} callback
 *
 *************************************************************************************************/
var PagingUI=CommonUI.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope, properties, callback){
		this._scope=scope;

		this._properties=properties || null;
		this._callback=callback || null;

		this._count={'total':null, 'step':null};
		this._page={'current':-1, 'total':null, 'step':null};

		this.reinit();
	},


	reinit:function(){
		var prop=this._properties || new Object();

		// 1. info-count
		var total=this._count.total=(!ValidationUtil.is_null(prop.count) && !ValidationUtil.is_null(prop.count.total))?Number(prop.count.total):0;
		var step=this._count.step=(!ValidationUtil.is_null(prop.count) && !ValidationUtil.is_null(prop.count.step))?Number(prop.count.step):10;

		// 2. info-page
		this._page.step=(!ValidationUtil.is_null(prop.page) && !ValidationUtil.is_null(prop.page.step))?Number(prop.page.step):10;
		this._page.current=(!ValidationUtil.is_null(prop.page) && !ValidationUtil.is_null(prop.page.current))?Number(prop.page.current)-1:0;
		this._page.total=(total>0 && step>0)?Math.ceil(total/step):0;

		// 3. build
		this.remove_content();
		this.build_content();
		this.build_event();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAM
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	get_style:function(){
		return {
			'NAVIGATE':{
				'FIRST'		:'<a href="javascript:_common.nothing();" data-role="ui-paging-first">[<<]</a>',
				'PREV'		:'<a href="javascript:_common.nothing();" data-role="ui-paging-prev">[<]</a>',
				'NEXT'		:'<a href="javascript:_common.nothing();" data-role="ui-paging-next">[>]</a>',
				'LAST'		:'<a href="javascript:_common.nothing();" data-role="ui-paging-last">[>>]</a>'
			},

			'PAGE':{
				'ON'			:'<a href="javascript:_common.nothing();" data-role="ui-paging-page" style="color:#ff6600;"> [****] </a>',
				'OFF'		:'<a href="javascript:_common.nothing();" data-role="ui-paging-page"> [****] </a>',
				'SEP'			:'****' // 'ON', 'OFF' - seperater
			}
		};
	},


	get_start:function(){
		return Math.floor(this._page.current/this._page.step)*this._page.step; // define-start-page
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:UI
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_content:function(){

		if(this._page.total>0){
			var style=this.get_style();

			// 1. append-[first, prev]
			$(this._scope)
			.append(style.NAVIGATE.FIRST)
			.append(style.NAVIGATE.PREV);

			// 2. append-[page]
			var s=this.get_start();
			for(var a=s, atotal=s+this._page.step; a<atotal; a++){
				if(a<this._page.total){
					var asep=style.PAGE.SEP;
					var atags=String(style.PAGE[(a==this._page.current)?'ON':'OFF']).split(asep);

					$(this._scope).append(atags[0]+Number(a+1)+atags[1]);
				}
			}

			// 3. append-[first, prev]
			$(this._scope)
			.append(style.NAVIGATE.NEXT)
			.append(style.NAVIGATE.LAST);
		}
	},


	remove_content:function(){
		$(this._scope).empty();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;

		// button-event-first
		$(this._scope).find('*[data-role=ui-paging-first]').bind('click', function(e){
			owner.select(0);
		});

		//  button-event-last
		$(this._scope).find('*[data-role=ui-paging-last]').bind('click', function(e){
			owner.select(owner._page.total-1);
		});

		// button-event-prev
		$(this._scope).find('*[data-role=ui-paging-prev]').bind('click', function(e){
			var c=owner._page.current; c--; c=(c<=0)?0:c;
			owner.select(c);
		});

		// button-event-next
		$(this._scope).find('*[data-role=ui-paging-next]').bind('click', function(e){
			var t=owner._page.total;
			var c=owner._page.current; c++; c=(c>=t-1)?t-1:c;
			owner.select(c);
		});

		// button-event-page
		// start-page-number
		var s=(this._page.total>0)?this.get_start():0;

		$(this._scope).find('*[data-role=ui-paging-page]').each(function(a){
			$(this)
			.data('n', s+a)
			.bind('click', function(e){
				var n=Number($(this).data('n'));
				owner.select(n);
			});
		});
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	reset:function(properties){
		if(!ValidationUtil.is_null(properties)){
			this._properties=properties;

			this.reinit();
		}else{
			this.remove_content();
			this.build_content();
			this.build_event();
		};
	},


	select:function(n){
		if(this._page.current!=n){
			this._page.current=n;

			this.reset(); if(!ValidationUtil.is_null(this._callback)) this._callback(Number(n+1));
		};
	}
});











/*************************************************************************************************
 *
 * UI-CALENDAR (CORE)
 *
 * @extend	CommonUI
 * @author	actionwolf (neoxnazis@gmail.com)
 *
 *************************************************************************************************/
var CalendarUI=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(target){
		this._target=target;
		this._scope=null;
		this._top=null;

		this._widths={'step':30, 'total':30*7};

		this._restrict={'type':null, 'time':null};
		this._limits={'min':null, 'max':null};
		this._year={'min':1975, 'max':null, 'current':null, 'now':null, 'focus':null};
		this._month={'min':0, 'max':11, 'current':null, 'now':null, 'focus':null};
		this._date={'current':null, 'now':null, 'focus':null};

		this.reinit();
	},


	reinit:function(){
		var now=DateUtil.get_now();
		this.set_times('now', now.year, Number(now.month)-1, Number(now.date));
		this._year.max=Number(now.year)+1;

		this.build_scope();
		this.build_top();
		this.build_bottom();
		this.navigate();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAMS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * set time information
	 *
	 * @param	{String} type - 'current', 'now', 'focus'
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 0~11
	 * @param	{Number} d - 1~31
	 */
	set_times:function(type, y, m, d){
		this._year[type]=y;
		this._month[type]=m;
		this._date[type]=d;
	},


	/**
	 * set restrict time information
	 *
	 * @param	{String} type - 'before', 'after'
	 * @param	{String, JSON, Date} time
	 */
	set_restrict:function(type, time){
		this._restrict={'type':type, 'time':time};
	},


	set_limit:function(min, max){
		this._limits={'min':min, 'max':max};
	},


	/**
	 * define today
	 *
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 0~11
	 * @param	{Number} d - 1~31
	 * @return	{Boolean}
	 */
	is_today:function(y, m, d){
		return (	this._year.now==y &&
				this._month.now==m &&
				this._date.now==d)?true:false;
	},


	/**
	 * define focusday
	 *
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 0~11
	 * @param	{Number} d - 1~31
	 * @return	{Boolean}
	 */
	is_focusday:function(y, m, d){
		return (	this._year.focus==y &&
				this._month.focus==m &&
				this._date.focus==d)?true:false;
	},


	/**
	 * define clickable date
	 *
	 * @param	{Number} y - 1975~
	 * @param	{Number} m - 0~11
	 * @param	{Number} d - 1~31
	 * @return	{Boolean}
	 */
	is_allowed:function(y, m, d){
		var bool=true;
		var ctime=DateUtil.get_utc_time(y, m, d); // time-current
		var stime=(this._limits.min!=null)?DateUtil.get_date(String(this._limits.min).split('-').join('')).getTime():-1;
		var etime=(this._limits.max!=null)?DateUtil.get_date(String(this._limits.max).split('-').join('')).getTime():-1;

		/**
		 * 방향별 허용 체크
		 */
		if(this._restrict.type!=null){
			var rtime=DateUtil.get_date(this._restrict.time).getTime(); // time-restrict

			switch(this._restrict.type){
				// build-after
				case 'after':
					if(etime!=-1){
						bool=(rtime<=ctime && etime>=ctime)?true:false;
					}else{
						bool=(rtime<=ctime)?true:false;
					};
					//bool=(rtime<=ctime)?true:false;
					break;

				// build-before
				case 'before':
					if(stime!=-1){
						bool=(rtime>=ctime && stime<=ctime)?true:false;
					}else{
						bool=(rtime>=ctime)?true:false;
					};
					//bool=(rtime>=ctime)?true:false;
					break;
			};
		}else{
			if(stime!=-1 && etime!=-1){
				bool=(ctime<stime || ctime>etime)?false:true;
			}else{
				if(stime==-1 && etime!=-1){
					bool=(ctime>etime)?false:true;
				}else if(etime==-1 && stime!=-1){
					bool=(ctime<stime)?false:true;
				};
			};
		};
		return bool;
	},


	/**
	 * get-cell-infos
	 *
	 * @param	{Number} y - year(1975~)
	 * @param	{Number} m - month(0~11)
	 * @return	{Array}
	 * 	[
	 * 		{
	 *				type: 'current' (click-able), 'restrict' (dis-click-able)
	 * 			msg: 0~31 (date-number)
	 * 			state : 'sunday', 'satuday', 'normal'
	 * 			today : true (오늘), false(오늘X)
	 * 			focusday : 입력된 '년-월-일'에 해당하는 날
	 * 		},
	 * 		...
	 * 	]
	 */
	get_cells:function(y, m){
		// 1. current
		var ctotal=DateUtil.get_total_date(y, m); // total-current
		var fpos=new Date(y, m, 1).getDay(); // position-first (0~6)

		// 2. previous
		var pdate=DateUtil.get_changed_month(y, m, -1);
		var ptotal=DateUtil.get_total_date(pdate.year, pdate.month);

		// 3. build
		var infos=new Array();
		var atotal=ctotal+fpos; atotal=Math.ceil(atotal/7)*7;
		for(var a=0; a<atotal; a++){
			var ainfo=new Object();
			var d=-1, state='none';

			// 3-1. define-basic-infomation
			if(a<fpos){ // previous-date
				ainfo={'type':'previous', 'msg':Number((ptotal-fpos)+a+1), 'state':'none'};
			}else if(a-fpos>ctotal-1){ // next-date
				ainfo={'type':'next', 'msg':Number(a-ctotal-fpos)+1, 'state':'none'};
			}else{ // current-date
				d=Number(a-fpos+1);

				switch(String(a%7)){
					case '0':
						state='sunday';
						break;

					case '6':
						state='satuday';
						break;

					default:
						state='normal';
						break;
				};

				if(this.is_allowed(y, m, d)){
					ainfo={'type':'current', 'msg':d, 'state':state};
				}else{
					ainfo={'type':'restrict', 'msg':d, 'state':'none'};
				}
			};
			// 3-2. define-today
			ainfo.today=(d!=-1 && this.is_today(y, m, d))?true:false;

			// 3-3. define-focusday
			ainfo.focusday=(d!=-1 && this.is_focusday(y, m, d))?true:false;

			// 3-4. define-position
			ainfo.x=Math.floor(a%7);
			ainfo.y=Math.floor(a/7);

			// 3-5. insert-infomation
			infos.push(ainfo);
		}
		// 4. return information
		return infos;
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		this._scope=$(document.createElement('div'))
		.css({
			'float':'left',
			'width':this._widths.total+'px',
			'height':'auto',
			'border':'4px solid #333',
			'margin':'2px'
		})
		.appendTo(this._target);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TOP
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_top:function(){
		var owner=this;

		// 1. container
		var shtml='';
		shtml+='<p style="text-align:center; margin:0;">';
		shtml+='<span><select data-role="select-year" title="년 선택"></select></span>';
		shtml+='<span><select data-role="select-month" title="월 선택"></select></span>';
		shtml+='</p>';

		var top=this._top=$(document.createElement('div'))
		.html(shtml)
		.css({'line-height':this._widths.step+'px', 'background-color':'#333'})
		.appendTo($(this._scope));

		// 2. build-select-year
		var acontainer=$(top).find('select[data-role=select-year]')
		.empty().change(function(e){owner.navigate();});

		for(var a=this._year.max, atotal=this._year.min; a>=atotal; a--){
			var aoption=document.createElement('option');
			$(aoption).attr('value', a).text(a).appendTo($(acontainer));
		};

		// 3. build-select-month
		var bcontainer=$(top).find('select[data-role=select-month]')
		.empty().change(function(e){owner.navigate();});

		for(var b=this._month.min, btotal=this._month.max; b<=btotal; b++){
			var boption=document.createElement('option');
			$(boption).attr('value', b).text(StringUtil.add_zero(Number(b+1), 2)).appendTo($(bcontainer));
		};

		// 4. focus-today
		$(top).find('select[data-role=select-year]').find('option[value='+this._year.now+']').attr('selected', 'selected');
		$(top).find('select[data-role=select-month]').find('option[value='+this._month.now+']').attr('selected', 'selected');
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BOTTOM
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_bottom:function(){
		var bottom=document.createElement('div'); this._bottom=bottom;

		$(bottom)
		.css({'background-color':'#ff66ff', 'width':'100%'})
		.appendTo($(this._scope));
	},


	rebuild_bottom:function(y, m){
		$(this._bottom).empty();

		var infos=this.get_cells(y, m);
		for(var a=0, atotal=infos.length; a<atotal; a++){
			var ainfo=infos[a];
			var acell=document.createElement('div');
			var acolor;

			switch(ainfo.state){
				case 'sunday':
					acolor='#ff0000';
					break;

				case 'satuday':
					acolor='#0000ff';
					break;

				case 'normal':
					acolor='#666';
					break;

				default:
					acolor='#333';
					break;
			};

			$(acell)
			.css({
				'position':'relative',
				'float':'left',
				'width':this._widths.step+'px',
				'height':this._widths.step+'px',
				'text-align':'center',
				'background-color':((ainfo.focusday)?'#ff6600':acolor),
				'cursor':((ainfo.state=='none')?'':'pointer')
			})
			.appendTo($(this._bottom));

			var aspan=document.createElement('span');
			$(aspan)
			.css({
				'text-align':'center',
				'font-family':'tahoma',
				'font-size':'10px',
				'color':((ainfo.today)?'#ff6600':'#999'),
				'line-height':this._widths.step+'px'
			})
			.text(ainfo.msg)
			.appendTo($(acell));
		}
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	navigate:function(){
		var y=$(this._scope).find('select[data-role=select-year]').val();
		var m=Number($(this._scope).find('select[data-role=select-month]').val());

		this.rebuild_bottom(y, m);
	},


	focus_date:function(y, m, d){
		this.set_times('focus', y, m, d);
	},


	restrict_date:function(type, time){
		this.set_restrict(type, time);
		this.navigate();
	}
});









