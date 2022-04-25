/*************************************************************************************************
 *
 * UI-COMMON-RADIO
 *
 *************************************************************************************************/
var CommonRadio=CommonUI.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(target){
		this._target=target;
		this._scope=null;

		this.reinit();
	},

	reinit:function(){
		this.build_scope();
		this.reset();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		this._scope=$(document.createElement('div'))
		.attr('class', 'radio')
		.insertBefore($(this._target))
		.append($(this._target));

		if(!ValidationUtil.is_null($(this._target).attr('class'))){
			$(this._scope).addClass($(this._target).attr('class'));
		};

		$(this._target)
		.bind({
			'mouseover focusin':function(e){
				$(this).parent().addClass('focus');
			},

			'mouseleave focusout':function(e){
				$(this).parent().removeClass('focus');
			}
		});
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*	reset:function(){
		// 1. disabled
		if($(this._target).is(':disabled')){
			$(this._scope)
			.addClass('disabled')
			.addClass('readonly');
		}else{
			$(this._scope)
			.removeClass('disabled')
			.removeClass('readonly');
		};*/


	// 2014.11.27 결함 61268 관련 수정, 전체선택과 비활성화 구분.
	reset:function(){
		// 1. disabled
		if($(this._target).is(':disabled')){
			if($(this._target).is(':checked')){
				$(this._scope)
				.addClass('disabled');
			}else{
				$(this._scope)
				.addClass('readonly');
			}
		}else{
			$(this._scope)
			.removeClass('disabled')
			.removeClass('readonly');
		};

		// 2. checked
		if($(this._target).is(':checked')){
			$(this._scope).addClass('checked');
		}else{
			$(this._scope).removeClass('checked');
		};
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-CHECK
 *
 *************************************************************************************************/
var CommonCheck=CommonUI.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(target){
		this._target=target;
		this._scope=null;

		this.reinit();
	},

	reinit:function(){
		this.build_scope();
		this.reset();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		this._scope=$(document.createElement('div'))
		.attr('class', 'checkbox')
		.insertBefore($(this._target))
		.append($(this._target));

		if(!ValidationUtil.is_null($(this._target).attr('class'))){
			$(this._scope).addClass($(this._target).attr('class'));
		};

		$(this._target)
		.css('opacity', '0')
		.bind({
			'mouseover focusin':function(e){
				$(this).parent().addClass('focus');
			},

			'mouseleave focusout':function(e){
				$(this).parent().removeClass('focus');
			}
		});
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/* reset:function(){
		// 1. disabled
		if($(this._target).is(':disabled')){
			$(this._scope)
			.addClass('disabled')
			.addClass('readonly');
		}else{
			$(this._scope)
			.removeClass('disabled')
			.removeClass('readonly');
		}; */


	// 2014.11.27 결함 61268 관련 수정, 전체선택과 비활성화 구분.
		reset:function(){
			// 1. disabled
			if($(this._target).is(':disabled')){
				if($(this._target).is(':checked')){
					$(this._scope)
					.addClass('disabled');
				}else{
					$(this._scope)
					.addClass('readonly');
				}
			}else{
				$(this._scope)
				.removeClass('disabled')
				.removeClass('readonly');
			};

		// 2. checked
		if($(this._target).is(':checked')){
			$(this._scope).addClass('checked');
		}else{
			$(this._scope).removeClass('checked');
		};
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-SELECT
 *
 *************************************************************************************************/
var CommonSelect=CommonUI.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function (target, index){
		this._target=target;
		this._scope=null;
		this._top=null;
		this._list=null;

		this._index=index;
		this._type=null;
		this._title=null;
		this._minw=85;
		this._maxchar=0;
		this._marginw=17; // 가로 마진값
//		this._marginw+=(ValidationUtil.get_browser_type()=='safari')?25:0;
		
		this._iseng=_common._iseng;
		this._issyncwidth=(String($(this._target).attr('data-syncwidth')).toUpperCase()!='N')?true:false;
		this._isfixedwidth=(String($(this._target).attr('style')).indexOf('width')!=-1)?true:false;
		this._ispositiontop=(String($(this._target).attr('data-position-top')).toUpperCase()=='Y')?true:false;
		this._ispositionright=(String($(this._target).attr('data-position-right')).toUpperCase()=='Y')?true:false;
		this._isshowall=(String($(this._target).attr('data-show-all')).toUpperCase()=='Y')?true:false;
		this._isdisabled=false;
		this._isbuildlist=false;
		this._isopen=false;

		this.init_scope();
		this.init_list();

		this._show;

		this.reinit();
	},

	reinit:function (){
		this._ispositiontop=(String($(this._target).attr('data-position-top')).toUpperCase()=='Y')?true:false;
		this._isdisabled=$(this._target).is(':disabled') || false;
		this._title=$(this._target).attr('title')+' ' || '';

		this.build_scope();
		this.remove_list(); //this.build_list();
		this.build_event();
		this.resize();
		this.show(false);
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAM
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	get_rectange:function(scope){
		var dh;
		var dy;

		if(this._issyncwidth){
			dh=(this._isopen)?$(this._list).height():0;
			dy=(this._isopen && this._ispositiontop)?-dh:0;
		}else{
			dh=0;
			dy=0;
		};

		return{
			'ax':$(scope).offset().left || 0,
			'ay':$(scope).offset().top+dy ||0,
			'rx':$(scope).position().left || 0,
			'ry':$(scope).position().top || 0,
			'w':$(scope).innerWidth() || 0,
			'h':$(scope).innerHeight()+dh || 0
		};
	},

	get_scope:function (){
		return this._scope;
	},

	is_focus:function(){
		var bool=false;

		$(this._scope).find('a').each(function(a){
			if($(this).is(':focus')) bool=true;
		});

		return bool;
	},

	is_collision:function(scope, pos){
		if(this._issyncwidth){
			/**
			 * data-syncwidth='Y' or null 일 때는 기존처리 유지
			 */
			return this._super(scope, pos);
		}else{
			/**
			 * data-syncwidth='N' 일 때는 위(top), 아래(list) 별도 체크
			 */
			// 1. top
			var arect=this.get_rectange(this._top);
			var abool=(
				(pos.left>=arect.ax && pos.left<=arect.ax+arect.w) &&
				(pos.top>=arect.ay && pos.top<=arect.ay+arect.h)
			)?true:false;

			// 2. list
			var brect=this.get_rectange(this._list);
			var bbool=(
				(pos.left>=brect.ax && pos.left<=brect.ax+brect.w) &&
				(pos.top>=brect.ay && pos.top<=brect.ay+brect.h) &&
				this._isopen
			)?true:false;

			return (abool || bbool)?true:false;
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCPE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_scope:function () {
		var owner=this;

		// 1. tab-index
		$(this._target).attr('tabIndex', '-1');

		// 2. build
		this._scope=$(document.createElement('div'))
		.insertBefore($(this._target))
		.attr('class', 'select-box')
		.append($(document.createElement('div'))
			.attr('class', 'selecter')
			.append($(this._target))
			.append($(document.createElement('div'))
				.css({
					'overflow':'hidden',
					'cursor':'pointer'
				})
				.attr({
					'class':'wrap'	,
					'data-role':'common-select-top'
				})
				.append($(document.createElement('div'))
					.attr('data-role', 'common-select-button')
					.css({
						'height':'34px' //(!this._issyncwidth)?'34px':'inherit' - 2014.04.01
					})
					.bind({
						'click':function (e){
							// 2014-09-18 고객센터 Seclcet disabled="disabled" 시작

							// 2014-11-03 결함번호 60135 시작
							if($(owner._target).hasClass('full')){
								$(owner._target).parent().next('.list').addClass('full');
							}
							// 2014-11-03 결함번호 60135 끝

							if($(owner._target).attr('disabled') == null){
								if($(owner._target).find('option').length>0){
									owner.toggle();
								}
							};
							// 2014-09-18 고객센터 Seclcet disabled="disabled" 끝
						}
					})
					.append($(document.createElement('span'))
						.css({
							//'overflow':(this._isfixedwidth)?'hidden':'visible'//(!this._issyncwidth)?'hidden':'visible' - 2014.04.01
						})
						.attr('data-role', 'common-select-title')
					)
					.append($(document.createElement('a'))
						.attr({
							'href':'javascript:_common.nothing();',
							'data-role': 'common-select-arrow',
							'class':'selecter'
						})
						.text((!owner._iseng)?'선택':'Select')
						.bind({
							'focusin':function(e){
								$(owner._scope).find('*[data-role=common-select-button]').css('border-color', '#2768c3');
							},

							'focusout':function(e){
								$(owner._scope).find('*[data-role=common-select-button]').css('border-color', '#686970');
							},

							'keydown':function(e){
								if(e.keyCode==13){
									if($(owner._target).find('option').length>0){
										owner.toggle(); //$.focusNext();
									};

									return false;
								}else if(e.keyCode==40 && owner._isopen){
									if($(owner._target).find('option').length>0){
										$.focusNext();
									};

									return false;
								};
							}
						})
					)
				)
			)
		)
		.append($(document.createElement('div'))
			.hide()
			.css({
				'position':'absolute',
				'overflow-x':'hidden',
				'overflow-y':'auto'
			})
			.attr('class', 'list')
			.attr('data-role', 'common-select-list')
			.append($(document.createElement('ul')))
		);

		this._top=$(this._scope).find('*[data-role=common-select-top]');
	},

	build_scope:function (){
		var scope=$(this._scope).find('*[data-role=common-select-button]');

		if(this._isdisabled){
			$(this._target).addClass('disable');
			$(scope).addClass('disabled');
			$(scope).find('*[data-role=common-select-arrow]').attr('tabIndex','-1');
		}else{
			$(this._target).removeClass('disable');
			$(scope).removeClass('disabled');
			$(scope).find('*[data-role=common-select-arrow]').attr('tabIndex','0');
		};
	},

	focus_scope:function (n){
		var total=$(this._target).find('option').length;
		var msg=(total>0)?$(this._target).find('option:eq('+n+')').text():'&nbsp;';

		$(this._scope).find('*[data-role=common-select-title]').html(msg);
	},

	resize_scope:function (){
		$(this._target).show();

		var w=Math.max(this._minw, $(this._target).outerWidth()+this._marginw);
		$(this._scope).css('width', w+'px');

		$(this._target).hide();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LIST
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_list:function(){
		this._list=$(this._scope).find('*[data-role=common-select-list]');
	},

	build_list:function (){
		this._isbuildlist=true;

		var owner=this;
		var container=$(this._list).find('ul').empty();

		if(!this._issyncwidth) this._maxchar=0;

		$(this._target).find('option').each(function (a){
			var amsg=$(this).text(); amsg=($.trim(amsg)=='')?String('&nbsp;'):amsg;
			var islast=$(this).is(':last-child');

			/**
			 * data-syncwidth='N' 일 때 캐릭터 길이로 가로 길이 정하기 위해 필요
			 */
			if(!owner._issyncwidth){
				owner._maxchar=Math.max(owner._maxchar, String(amsg).length);
			};
			var ali = "";
			if($(this).attr('disabled') != null){
				ali=$(document.createElement('li'))
				.append($(document.createElement('a'))
					.attr({
						'href':'javascript:_common.nothing();'
					})
					.css('color','gray')
					.html(amsg)
					.data('islast', islast)
					.data('n', a)
				);
			}else{
				ali=$(document.createElement('li'))
				.append($(document.createElement('a'))
					.attr({
						'data-role':'common-select-option',
						'href':'javascript:_common.nothing();'
					})
					.html(amsg)
					.data('islast', islast)
					.data('n', a)
					.bind({
						'click': function (e) {
							owner.focus($(this).data('n'), e);
							owner.show(false);
						},

						'mousedown': function (e) { //ie8에서 마우스 클릭시 선택이 안되는 문제 해결
							owner.focus($(this).data('n'), e);
							owner.show(false);
						},

						'keydown':function(e){
							var keycode=e.keyCode;

							switch(String(keycode)){
								case '38':
									$.focusPrev();
									return false;
									break;

								case '40':
									if(!$(this).data('islast')) $.focusNext();
									return false;
									break;
							};
						}
					})
				);
			}
			var isselected=$(this).prop('selected');
			if(isselected) $(ali).addClass('on');

			$(container).append($(ali));
		});

		if(this._isshowall){
			$(this._list).css('height', 'auto');
		}else{
			var total=$(this._target).find('option').length;
			$(this._list).css('height', (total>5)?'145px':'auto');
		};
	},

	remove_list:function(){
		$(this._list).find('ul').empty(); this._isbuildlist=false;
	},

	focus_list:function (n){
		$(this._list).find('>ul li').each(function (a){
			if(!ValidationUtil.is_null(n)){
				if(a===n) $(this).addClass('on'); else $(this).removeClass('on');
			}else{
				if($(this).hasClass('on')) $(this).find('>a').focus();
			};
		});

		/**
		 * 위로 뜨는 케이스
		 */
		if(this._ispositiontop){
			
			var ty=Number($(this._list).outerHeight(true))*-1;

			$(this._list).css({
				'top':Math.floor(ty)+'px',
			//	'border':'1px solid #686970',
				'border-bottom':0
			});
		}else{
			$(this._list).css({
				'top':$(this._top).outerHeight(true)+'px'
			});
		}

		/**
		 * 오른쪽 정렬
		 */
		if(this._ispositionright && !this._issyncwidth){
			var tx=0;
			tx=$(this._top).outerWidth(true)-$(this._list).outerWidth(true);
			tx=(tx>=0)?0:tx;

			$(this._list).css({
				'left':Math.floor(tx)+'px'
			});
		};
	},

	resize_list:function (){
		if(this._list!=null){
			$(this._target).show();

			var sw=$(this._scope).width(); //Math.max(this._minw, $(this._target).width()+20); // scope 의 가로 길이에 맞춰서 크기조절
			var uw=this._maxchar*13+10*2;

			if((this._issyncwidth) || (!this._issyncwidth && uw<=sw)){
				$(this._list).css('width', (sw-2)+'px');
				$(this._list).find('>ul').removeAttr('style');
			}else{
				$(this._list).css('width', (uw-2)+'px');
				$(this._list).find('>ul').css('width', uw+'px');
			};

			$(this._target).hide();
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;

		$(this._scope).off('mousewheel').on({
			'mousewheel':function(e, dy, dx){
				if(owner._isopen){
					return false;
				};
			}
		});
		$(this._list).off('mousewheel').on({
			'mousewheel':function(e, dy, dx){
				var sct=$(this).scrollTop(); sct+=dy*29*-1;
				$(this).scrollTop(sct);
				return false;
			}
		});
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TRANSFORM
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	resize:function(){
		this.resize_scope();
		this.resize_list();

		try{
			this.focus($(this._target).find('option:selected')[0].index);
		}catch(e){
			this.focus(-1);
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	focus:function(n, e){
		$(this._target).find('option').each(function (a){
			if(a===n) $(this).prop('selected', true); else $(this).prop('selected', false);
		});

		if(!ValidationUtil.is_null(e)){
			$(this._target).trigger('change');
			$(this._scope).find('*[data-role=common-select-arrow]').focus();
		};

		this.focus_scope(n);
		this.focus_list(n);
	},

	toggle:function(){
		if(!this._isdisabled){
			this.show(!this._isopen);
		}else{
			this.show(false);
		};
	},

	show:function (bool){
		this._isopen=bool;

		if(bool){
			$(this._list).show();

			$(this._scope).addClass('on').css('z-index', '1000');
			$(this._scope).find('*[data-role=common-select-arrow]').attr('title', this._title+((!this._iseng)?'리스트 레이어 닫힘':'Hide'));
			$(this._scope).find('*[data-role=common-select-button]').css('border-color', '#2768c3');

			/**
			 * 실제로 열릴때만 list 생성
			 */
			if(!this._isbuildlist){
				this.build_list();
				this.resize_list();
			};

			this.focus_list(null);
		}else{
			$(this._list).hide();
			$(this._scope).removeClass('on').css('z-index', '0');
			$(this._scope).find('*[data-role=common-select-arrow]').attr('title', this._title+((!this._iseng)?'리스트 레이어 열림':'Show'));
			$(this._scope).find('*[data-role=common-select-button]').css('border-color', '#686970');
		};

		try{
			this._show(bool);
		}catch(e){};
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-TABLE
 *
 *************************************************************************************************/
var CommonTable=TableUI.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope, prefix){
		this._scope=scope;
		this._prefix=prefix || 'T';

		this.build_summary(_common._iseng);
		this.build_deactivate();
		this.build_upDownText(); // 접근성 상승_하락 에대한 TEXT 제공
		//this.build_mapping(); -> 사용안함
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SUMMARY
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_summary:function(iseng){
		
		if(
			($(this._scope).find('>caption').length>0) &&
			($(this._scope).find('>caption p').length==0 || $.trim($(this._scope).find('>caption p').text())=='')
		){
			
			// 0. insideTable Searching addClass(insideTitle)
			$(this._scope).find('table th').addClass('insideTitle');
			
			// 1. search-element-th
			var msg='';

			$(this._scope).find('th:not(".insideTitle")').each(function(a){
				var atip=String($(this).find('*[data-role=common-ui-tip]').text());
				var amsg=String($(this).text() || '');
				amsg=amsg.replace(atip, '').replace(/■/g, ''); // tip 내용 제거
				amsg=$.trim(amsg);

				if($.trim(amsg)!=''){
					msg+=((msg=='')?'':',')+amsg;
				}else{
					// read-image-alt
					$(this).find('img').each(function(b){
						var bmsg=$(this).attr('alt') || '';

						if($.trim(bmsg)!='') msg+=((msg=='')?'':', ')+bmsg;
					});

					// read-input-title
					$(this).find('input').each(function(c){
						var cmsg=$(this).attr('title') || '';

						if($.trim(cmsg)!='') msg+=((msg=='')?'':', ')+cmsg;
					});
				};
			});
			
			// 2. insideTable Searching addClass(insideTitle)
			$(this._scope).find('table th').removeClass('insideTitle');
			
			if(msg!=''){
				// 3. add-message
				if(iseng){
					msg='Table include '+msg;
				}else{
					msg+='로 구성된 표입니다.';
				};

				// 3. remove-p-element
				$(this._scope).find('caption p').remove();

				// 4. create-p-element
				$(document.createElement('p'))
//				.css({
//					'overflow':'hidden' // firefox 에서 caption을 뚫고 나오는 현상 수정 : 갭션자체에 숨김처리 되어있음 overflow 삭제
//				})
				.html(msg)
				.appendTo($(this._scope).find('>caption'));
			};
		};
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:deactivate (element : TR)
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_deactivate:function(iseng){
		var deactivateTr = $(this._scope).find('tr.deactivate');
		// 1. dim
		$(deactivateTr).each(function(a){
			//텍스트 가이드 없음
			if($(this).find('.dimm').length == 0){
				$(this).find('th , td').append('<span class="dimm"><em class="hidden"></em></span>');
			}else{
				// 아닐경우 ....
			}
			
			
			
		});
		
		
		// 2. tabIndex
		$(deactivateTr).find(':focusable').each(function(a){
			if(String($(this)[0].nodeName).toUpperCase()!='SELECT'){
//				if(bool){
					/**
					 * tabIndex 값이 있는지 화인 (-1)만 체크
					 */
					var aindex=$(this).attr('tabIndex');

					if(aindex!=undefined){
						$(this).attr('data-tabindex', aindex);
					};

					$(this).attr('tabIndex', '-1');
//				}else{
//					if($(this).attr('data-tabindex')!='-1'){
//						$(this).removeAttr('tabIndex');
//					};
//				};
			};
		});
		
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // METHOD:build_upDownText (element : SPAN/ P, cssClass:rise/drop )
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    build_upDownText:function(){
        $(this._scope).find('p.riseSmall>var:not(:has(em)), p.rise>var:not(:has(em))').prepend('<em class="hidden">상승</em>');
        $(this._scope).find('p.dropSmall>var:not(:has(em)), p.drop>var:not(:has(em))').prepend('<em class="hidden">하락</em>');
        $(this._scope).find('span.riseSmall>var:not(:has(em)), span.rise>var:not(:has(em))').prepend('<em class="hidden">상승</em>');
        $(this._scope).find('span.dropSmall>var:not(:has(em)), span.drop>var:not(:has(em))').prepend('<em class="hidden">하락</em>');

    }
});






/*************************************************************************************************
 *
 * UI-COMMON-TABLE-TOGGLE
 *
 * @example
 * - http://localhost:7001/html/_guide/board.html
 * - http://localhost:7001/html/invest/service/value/peterLynch2.jsp
 * - http://localhost:7001/html/invest/service/recommend/recommend.jsp
 * - http://localhost:7001/html/invest/report/today_list.jsp
 *
 *************************************************************************************************/
var CommonToggleTable=Class.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;

		this._isusebtn=false;
		this._iseng=_common._iseng;
		this._isfirst=true;

		this.reinit();
	},

	reinit:function(){
		this._isusebtn=(String($(this._scope).attr('data-use-btn')).toUpperCase()=='Y')?true:false;

		this.build();

		/**
		 * 리스트가 비어 있는 상태에서는
		 * 자동으로 첫번째 상태가 열리지 못하므로
		 * 예외처리
		 * 2014.04.03
		 */
		if(this._isfirst && $(this._scope).find('tr[data-role=common-table-toggle-list]').length>0){
			this.toggle(0); this._isfirst=false;
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAMS
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 *<TR> 객체 취득
	 *
	 * @description - index 단위가 아닌, 초기에 입력한 data('n') 에 의한 객체 취득
	 * @param	{Number} n
	 * @return	{Object}
	 */
	get_list:function(n){
		var scope=null;

		$(this._scope).find('tr[data-role=common-table-toggle-list]').each(function(a){
			if($(this).data('n')==n){
				scope=$(this);
			};
		});

		var child=$(scope).data('child');
		var next=$(child).nextElementSibling || $(child).nextSibling;

		return{
			'scope':scope,
			'next':next
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BUILD
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build:function(){
		var owner=this;

		// 1. list
		$(this._scope).find('tr[data-role=common-table-toggle-list]').each(function(a){
			// 1-1. data
			$(this)
			.data('n', a)
			.data('child', $(owner._scope).find('tr[data-role=common-table-toggle-detail]').eq(a))
			.css('background-color', (a%2==0)?'#fff':'#fafbfc');

			// 1-2. event
			if(ValidationUtil.is_null($(this).data('isapply-toggle'))){
				// 1-2-1. <li>
				$(this)
				.data('isapply-toggle', true)
				.data('istoggle', false);

				// 1-2-2. <a>
				var amsg=String($(this).find('a[data-role=common-table-toggle-btn]').text());

				$(this)
				.find('a[data-role=common-table-toggle-btn]')
				.data('n', a)
				.data('parent', $(this))
				.attr('title', (!owner._iseng)?'상세(레이어) 열기':'Show')
				.addClass('on').removeClass('off')
				.text((!owner._iseng)?String(amsg).replace('닫기', '열기'):String(amsg).replace('Hide', 'Show'));

				if(owner._isusebtn){
					$(this).find('a[data-role=common-table-toggle-btn]')
					.bind({
						'click':function(e){
							owner.toggle($(this).data('n'));
						}
					});
				}else{
					$(this).css({
						'cursor':'pointer'
					})
					.bind({
						'click':function(e){
							owner.toggle($(this).data('n'));
						}
					});
				};
			};
		});

		// 2. detail
		$(this._scope).find('tr[data-role=common-table-toggle-detail]').each(function(a){
			if(ValidationUtil.is_null($(this).data('isapply-toggle'))){
				$(this)
				.data('isapply-toggle', true)
				.hide();
			};
		});
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TRANSFORM
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	position:function(n){
		try{
			var scope=this.get_list(n).scope;
			var ty=scope[0].offsetTop;

			$(this._scope).parent().stop().animate({
				'scrollTop':ty
			}, 500);
		}catch(e){};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	toggle:function(n){
		var trs=this.get_list(n);
		var scope=trs.scope;
		var next=trs.next;
		var btn=$(scope).find('a[data-role=common-table-toggle-btn]');
		var bmsg=String($(btn).text());
		var child=$(scope).data('child');
		var istoggle=!$(scope).data('istoggle'); $(scope).data('istoggle', istoggle);

		if(istoggle){
			$(scope).addClass('on');

			$(btn)
			.attr('title', (!this._iseng)?'상세(레이어) 닫기':'Hide')
			.addClass('off').removeClass('on')
			.text((!this._iseng)?String(bmsg).replace('열기', '닫기'):String(bmsg).replace('Show', 'Hide'));

			$(child).show();
			$(next).find('td').css({'border-top-width':'0'});

			this.position(n);

			$(this._scope).find('tr[data-role=common-table-toggle-list]').each(function(a){
				scope=$(this);
				if($(scope).data('istoggle') && $(scope).data('n')!=n){
					next=$(child).nextElementSibling || $(child).nextSibling;
					btn=$(scope).find('a[data-role=common-table-toggle-btn]');
					bmsg=String($(btn).text());
					child=$(scope).data('child');

					$(scope).data('istoggle', false);
					$(scope).removeClass('on');

					$(btn)
					.attr('title', (!this._iseng)?'상세(레이어) 열기':'Show')
					.addClass('on').removeClass('off')
					.text((!this._iseng)?String(bmsg).replace('닫기', '열기'):String(bmsg).replace('Hide', 'Show'));

					$(child).hide();
					$(next).find('td').css({'border-top-width':'1px'});
				};
			});
		}else{
			$(scope).removeClass('on');

			$(btn)
			.attr('title', (!this._iseng)?'상세(레이어) 열기':'Show')
			.addClass('on').removeClass('off')
			.text((!this._iseng)?String(bmsg).replace('닫기', '열기'):String(bmsg).replace('Hide', 'Show'));

			$(child).hide();
			$(next).find('td').css({'border-top-width':'1px'});
		};
	}
});




/*************************************************************************************************
*
* UI-COMMON-TABLE-PAGING
* @since 2014-10-27
* @author TD1006
* @example
* - /invest/trade/dayTrading.do?cmd=search&day_trade_gbn=02
*
*************************************************************************************************/
var CommonPagingTable=Class.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope = scope;
		this.build_page();
		this.clear();
		this.build_data();
		this.reinit();
	},
	_scope : "",
	paging : {
		isLoaded : false
		, page : 1
		, pageSize: 10
		, data : {}
		, totalCount : 0
		, totalPages : 1
		, startPage : 1
		, endPage : 10
		, data : {}
	},
	reinit:function(){
		this.build_head();
	},
	clear:function(){
		this.paging = {
			isLoaded : false
			, page : 1
			, data : {}
			, pageSize: 10
			, totalCount : 0
			, totalPages : 1
			, startPage : 1
			, endPage : 10
			, data : {}
		};
	},
	reload:function () {
		this.clear();
		this.build_data();
	},
	build_head:function(){
		var owner=this;
		try {
			owner.paging.pageSize = parseInt($(owner._scope).data("paging-size"));
		} catch (e) {
			owner.paging.pageSize = 10;
		}
		this._conditions=new Array();

		$(owner._scope).find('>thead>tr').each(function(a){
			$(this).find('>th').each(function(b){
				if($(this).hasClass('on') || $(this).hasClass('off')){
					var ascope=$(this).find('>a');
					if(ValidationUtil.is_null($(ascope).data('isapply'))){
						$(ascope).data('isapply', true)
						.data('n', a+'-'+b)
						.data('index', Number($(this).attr('data-index') || -1))
						.bind({
							'click':function(e){
								owner.change_head($(this));
								owner.sort($(this));
							}
						});
					};
					owner._conditions.push(ascope);
				};
			});
		});
	}, change_head:function(scope){
		// 1. class-up, down
		if($(scope).hasClass('down')){
			if($(scope).parent().hasClass('on')){
				$(scope)
				.removeClass('down')
				.addClass('up')
				.attr('title', '오름차순으로 정렬');
			} else {
				$(scope).parent()
				.attr('class','on');
				$(scope)
				.attr('title', '내림차순으로 정렬');
			}
		}else{
			$(scope)
			.removeClass('up')
			.addClass('down')
			.attr('title', '내림차순으로 정렬');
		};

		// 2. class-on,off
		for(var a in this._conditions){
			var ascope=this._conditions[a];

			if($(scope).data('n')!=$(ascope).data('n')){
				$(ascope).parent()
				.removeClass('on')
				.addClass('off');
				$(ascope).attr('class','down'); // 2014-10-08
			}else{
				$(ascope).parent()
				.removeClass('off')
				.addClass('on');
			};
		};
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:DATA
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_data:function () {
		var owner=this;
		var fncData = window[$(owner._scope).data("paging-get")];
		if (fncData != null) {
			owner.paging.data = fncData(owner);
		} else {
			owner.paging.data = {};
		}
		//owner.bind_data();
	},
	bind_data:function () {
		var owner=this;
		owner.clear_list();
		owner.set_count(owner.paging.data);
		owner.calc_page(1);
		owner.build_list();
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PAGE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_page:function () {
		var owner=this;
		var objPager = $("<div/>").addClass("btn-area");
		var objBtnPrev = $("<a/>").attr("href", "javascript:_common.nothing();").addClass("btn3 big prev").text("이전");
		var objBtnNext = $("<a/>").attr("href", "javascript:_common.nothing();").addClass("btn3 big").text("다음");
		objBtnPrev.on("click", function () {owner.move_prev();return false;});
		objBtnNext.on("click", function () {owner.move_next();return false;});
		objPager.append(objBtnPrev).append(objBtnNext);
		$(owner._scope).after(objPager);
	},
	calc_page:function (page) {
		var owner=this;
		owner.paging.page = page;
		owner.paging.startPage = owner.paging.pageSize * (page - 1) + 1;
		owner.paging.endPage = owner.paging.pageSize * page;
		owner.paging.endPage = owner.paging.endPage > owner.paging.totalCount ? owner.paging.totalCount : owner.paging.endPage;
	},
	move_next:function () {
		var owner=this;
		if (owner.paging.page < owner.paging.totalPages) {
			owner.paging.page++;
			owner.calc_page(owner.paging.page);
			owner.clear_list();
			owner.build_list();

		}
	},
	move_prev:function () {
		var owner=this;
		if (owner.paging.page > 1) {
			owner.paging.page--	;
			owner.calc_page(owner.paging.page);
			owner.clear_list();
			owner.build_list();
		}
	},
	set_count:function (data) {
		var owner=this;
		var fncCount = window[$(owner._scope).data("paging-count")];
		if (fncCount != null) {
			owner.paging.totalCount = fncCount(owner);
		} else {
			owner.paging.totalCount = data.length;
		}
		owner.paging.totalPages = parseInt((owner.paging.totalCount - 1) / owner.paging.pageSize) + 1;
	},
	clear_list:function () {
		var owner=this;
		var fncClear = window[$(owner._scope).data("paging-clear")];
		if (fncClear != null) {
			fncClear(owner);
		} else {
			$(owner._scope).find("tbody").empty();
		}
	},
	build_list:function () {
		var owner=this;
		var fncList = window[$(owner._scope).data("paging-list")];
		if (fncList != null) {
			fncList(owner);
		}
	}, get_data:function () {
		var owner=this;
		return owner.paging.data;
	}, sort: function (scope) {
		var owner=this;
		var target = owner.paging.data;

		var isup=$(scope).hasClass('down'); // 내림차순, 올림차순 여부
		var idx = $(scope).data("idx");
		var type = $(scope).data("type");

		target.sort(
			function (a1, b1) {
				var a = a1[idx];
				var b = b1[idx];
				if (type == "N") {
					try {
						a = parseFloat(a);
						b = parseFloat(b);
					} catch (e) {
						a = 0;
						b = 0;
					}
				} else {
					a = a + "";
					b = b + "";
				}

				if (a === b) {
			        return 0;
			    }
			    else {
			    	if (isup == (type == "N")) {
			    		return (a > b) ? -1 : 1;
			    	} else {
			    		return (a < b) ? -1 : 1;
			    	}
				}
			}
		);
		owner.reset_page();
		owner.build_list();
	}, sort_asc : function (idx) {
		return function (a, b) {
			if (a[idx] === b[idx]) {
		        return 0;
		    }
		    else {
		        return (a[idx] < b[idx]) ? -1 : 1;
			}
		};
	}, sort_desc : function (idx) {
		return function (a, b) {
			if (a[idx] === b[idx]) {
		        return 0;
		    }
		    else {
		        return (a[idx] > b[idx]) ? -1 : 1;
			}
		};
	}, reset_page: function () {
		this.paging.page = 1;
		this.calc_page(1);
		this.clear_list();
	}
});



/*************************************************************************************************
 *
 * UI-COMMON-TABLE-SCROLL-SYNC
 *
 * @example
 * - /html/bizBank/subscription/stocksPublic/inquiry_tab6.jsp
 *
 *************************************************************************************************/
var CommonScrollSyncTable=Class.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._target=null;
		this._scope=scope;

		this._direction='HORIZON';
		this._isapply=false;

		this.reinit();
	},

	reinit:function(){
		this._target=$('*[data-name='+String($(this._scope).attr('data-target'))+']');
		this._direction=String($(this._scope).attr('data-direction') || 'HORIZON').toUpperCase();

		this.build_event();
		this.build_target();

		this._isapply=true;
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TARGET
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_target:function(){
		if(this._direction=='VERTICAL'){
			var owner=this;

			$(this._scope).find('tr').each(function(a){
				// 1. 초기화
				$(this).css('height', 'auto');
				$(owner._target).find('tr').eq(a).css('height', 'auto');

				// 2. 비교
				var th=Math.max($(this).height(), $(owner._target).find('tr').eq(a).height());

				// 3. 적용
				$(this).css('height', th+'px');
				$(owner._target).find('tr').eq(a).css('height', th+'px');
			});
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		if(this._direction=='HORIZON'){
			var owner=this;
			var parent;

			if($(this._scope).attr('data-parent')!=null){
				parent=$('*[data-name='+$(this._scope).attr('data-parent')+']');
			}else{
				parent=$(this._scope).parent();
			};

			if(!this._isapply){
				$(parent).bind({
					'scroll':function(e){
						$(owner._target).scrollLeft(e.currentTarget.scrollLeft);
					}
				});
			}else{
				/**
				 * 위치 초기화
				 */
				setTimeout(function(){
					try{$(owner._target).scrollLeft(0);}catch(e){alert(e);};
					try{$(parent).scrollLeft(0);}catch(e){alert(e);};
				}, 300);
			};
		};
	}
});


/*************************************************************************************************
 * 2016-05-19
 * UI-COMMON-STOCK-SCROLL-SYNC
 * ELS/DLS 기초자산정보
 * @example
 * - /ux_html/finance/els_dls/search/els_money_info.jsp
 *
 *************************************************************************************************/
var CommonButtonSyncStock=Class.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._interval={
			'id':null,
			'sec':100
		};

		this._row=Number($(this._scope).attr('data-row') || 1);
		this._rows={
			'head':0
		},

		this.reinit();
	},

	reinit:function(){
		this._rows.head=$(this._scope).find('.stock_select>li').length;

		this.build_event();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARMAS
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	get_position:function(n){
		var ty=0;

		$(this._scope).find('.stock_select>li').each(function(a){
			if(a<n){
				ty+=$(this).innerHeight();
			};
		});
		return ty;
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;
		$(this._scope).find('.stock_select>li').each(function(a){
			if(ValidationUtil.is_null($(this).data('isapply'))){
				$(this)
				.data('isapply', true)
				.bind({
					'click':function(e){
						owner.focus($(this));
					}
				});
			}
		});
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	focus:function(scope){
		var owner=this;

		$(this._scope).parent().stop();
		if(this._interval.id!=null) clearInterval(this._interval.id);

		this._interval.id=setTimeout(function(){
			var n=$(scope)[0].rowIndex-(owner._rows.head);
			var ty=owner.get_position(n);
			var sec=480;

			$(owner._scope).parent().animate({
				'scrollTop':ty
			}, sec);
		}, this._interval.sec);
	}
});







/*************************************************************************************************
 *
 * UI-COMMON-TABLE-SCROLL-SYNC
 *
 * @example
 * - /html/bizBank/subscription/stocksPublic/inquiry_tab6.jsp
 *
 *************************************************************************************************/
var CommonButtonSyncTable=Class.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._interval={
			'id':null,
			'sec':100
		};

		this._row=Number($(this._scope).attr('data-row') || 1);
		this._rows={
			'head':0
		},

		this.reinit();
	},

	reinit:function(){
		this._rows.head=$(this._scope).find('>thead>tr').length;

		this.build_event();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARMAS
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	get_position:function(n){
		var ty=0;

		$(this._scope).find('>tbody>tr').each(function(a){
			if(a<n){
				ty+=$(this).innerHeight();
			};
		});
		return ty;
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;
		$(this._scope).find('>tbody>tr').each(function(a){
			if(ValidationUtil.is_null($(this).data('isapply'))){
				$(this)
				.data('isapply', true)
				.bind({
					'click':function(e){
						owner.focus($(this));
					}
				});
			}
		});
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	focus:function(scope){
		var owner=this;

		$(this._scope).parent().stop();
		if(this._interval.id!=null) clearInterval(this._interval.id);

		this._interval.id=setTimeout(function(){
		
//			var n=$(scope)[0].rowIndex-(owner._rows.head);
			var n=$(scope).index();
			/*
			var tn=((n%owner._row)==0)?n:n-(n%owner._row);
			var th=$(scope).outerHeight(true) || 0;
			var ty=th*tn;
			*/

			var ty=owner.get_position(n);
			var sec=480;

			$(owner._scope).parent().animate({
				'scrollTop':ty
			}, sec);
		}, this._interval.sec);
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-TABLE-SORT
 *
 * @example
 * - /html/invest/report/companyIndustry/company_list.jsp (일반)
 * - /html/invest/service/value/johnNeff.jsp (분리)
 * - /html/finance/fund/search.jsp (일반 + INDEX)
 * - /html/finance/bond/search/search.jsp (분리 + INDEX)
 *
 *************************************************************************************************/
var CommonSortTable=Class.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope, isall){
		this._scope=scope;
		this._conditions=null;

		this._isall=isall;

		this._row=Number($(this._scope).attr('data-row') || 1);
		/**
		 *<tbody><tr>안에 <td> 인덱스 지정여부
		 */
		this._isindex=(String($(this._scope).attr('data-type')).toUpperCase()=='INDEX')?true:false;

		this.reinit();
	},

	reinit:function(){
		this.build_head();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:HEAD
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_head:function(){
		var owner=this;
		this._conditions=new Array();

		$(this._scope).find((this._isall)?'>thead>tr':'>tbody>tr').each(function(a){
			$(this).find((owner._isall)?'>th':'>td').each(function(b){
				if($(this).hasClass('on') || $(this).hasClass('off')){
					var ascope=$(this).find('>a');
					
					if(ValidationUtil.is_null($(ascope).data('isapply'))){
						
						$(ascope).data('isapply', true)
						.data('n', a+'-'+b)
						.data('index', $(this).attr('data-index') || -1)
						.bind({
							'click':function(e){
								owner.change_head($(this));
								owner.change_body($(this));
							}
						});
					};
					owner._conditions.push(ascope);
				}else{
					//logger.debug("테이블이 생성될경우 기본으로 off 클래스를 맞춰 주십시오.");
				}
			});
		});
	},

	change_head:function(scope){
		// 1. class-up, down
		// 2014-10-20 CP사 전달용 테이블 소팅 샘플 시작
		if($(scope).hasClass('down')){
			if($(scope).parent().hasClass('on')){
				$(scope)
				.removeClass('down')
				.addClass('up')
				.attr('title', '오름차순으로 정렬');
			} else {
				$(scope).parent()
				.removeClass('off')
				.addClass('on');
				$(scope)
				.attr('title', '내림차순으로 정렬');
			}
		}else{
			$(scope)
			.removeClass('up')
			.addClass('down')
			.attr('title', '내림차순으로 정렬');
		};

		// 2. class-on,off
		for(var a in this._conditions){
			var ascope=this._conditions[a];

			if($(scope).data('n')!=$(ascope).data('n')){
				$(ascope).parent()
				.removeClass('on')
				.addClass('off');
				$(ascope).attr('class','down'); // 2014-10-08
			}else{
				$(ascope).parent()
				.removeClass('off')
				.addClass('on');
			};
		};
		// 2014-10-20 CP사 전달용 테이블 소팅 샘플 끝
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BODY
	// 추가사항 :   아래와 같은 케이스일경우  첫번째는  0  두번째는 1-0
	//   <tr class="두개가하나 첫번째"><td><td></tr>
	//   <tr class="두개가하나 두번째"><td><td></tr>
	//    
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	change_body:function(scope){
		var tbody=(this._isall)?$(this._scope).find('>tbody'):($($(this._scope)[0].nextElementSibling).find('>table>tbody') || $($(this._scope)[0].nextSibling).find('>table>tbody'));
		// 1. append-<TR>
		var row=this._row;
		var sn=$(tbody).find('tr[data-nosort=Y]').length; // 공지사항갯수
		var trs=new Array();
		$(tbody).find('>tr').each(function(a){
			/**
			 * 공지사항항목등 이동이 필요없을 때를 제외
			 */
			
			if(String($(this).attr('data-nosort')).toUpperCase()!='Y'){
				var an=(a-sn);

				if(an%row==0){
					if(String($(this).attr('data-addtr')).toUpperCase()=='Y'){  //  tr 덧붙여 질경우  data-addtr 추가
						trs[trs.length-1].push($(this));
					}else{
						
						trs.push(new Array($(this)));
					}
					
				}else{
					trs[trs.length-1].push($(this));
				};
			};
			
		});
		// 2. sort-<TR>
		//var n=Number(String($(scope).data('n')).split('-')[1]); // 2014.03.26 - 아래내용추가
		
		var n= 0; // col Num
		var rn = 0; // row Num
		var tempIdx = String($(scope).data('index'));
		if(this._isindex){
			if(tempIdx.indexOf('-')==-1){
				n = tempIdx;
			}else{
				
				n = tempIdx.split('-')[1];
				rn = tempIdx.split('-')[0];
			}
			
		}else{
			n = String($(scope).data('n')).split('-')[1];
		}
		
		var isup=$(scope).hasClass('down'); // 내림차순, 올림차순 여부 // 2014-10-20 CP사 전달용 테이블 소팅 샘플
		
		
		
		// sort bug  선처리 
		var compareVal = $(trs[0][0]).find('>td').eq(n).text();
		var sortContinueFlg = false;
		for(var c=0, ctotal=trs.length; c<ctotal; c++){
			for(var d=0, dtotal=trs[c].length; d<dtotal; d++){
				
				if(d==0){
					if(compareVal != $(trs[c][rn]).find('>td').eq(n).text()){
						sortContinueFlg = true;
						break;
					}
					
					
				} 
			}
		};
		if(!sortContinueFlg){
			return;
		}
		
		
	
		if(
			String($(scope).parent().attr('data-type')).toUpperCase()=='CHAR' ||
			String($(scope).attr('data-type')).toUpperCase()=='CHAR'
		){
			/**
			 * 문자열
			 * 	기존 charCodeAt(0)를 이용하고있었음,
			 *  전체문자열을 가지고 비교하게 수정
			 *  0, 1, -1 리턴하게 변경
			 */
			trs.sort(function(atr, btr){
				var ascope=$(atr[rn]).find('td').eq(n);
				var bscope=$(btr[rn]).find('td').eq(n);
				var avAll,bvAll ;
				/**
				 * <p>태그 포함 여부에 따라서 따로 분기
				 */
				if($(ascope).find('>p').length>0 && $(bscope).find('>p').length>0){

					//문자열 통째로..
					avAll=String($.trim($(ascope).find('>p:eq(0)').text()));
					bvAll=String($.trim($(bscope).find('>p:eq(0)').text()));
				}else{
					
					avAll=typeof $(ascope).attr("data-text") == "undefined" ? String($.trim($(ascope).text())) : $(ascope).attr("data-text");
					bvAll=typeof $(bscope).attr("data-text") == "undefined" ? String($.trim($(bscope).text())) : $(bscope).attr("data-text");

				};

				if (isup) {
					if(avAll > bvAll) return -1 ;
					else if(avAll < bvAll) return 1  ;
					else return 0 ;
						//같을 경우
				}else{
					if(avAll > bvAll) return 1  ;
					else if(avAll < bvAll) return -1 ;
					else return 0 ;	//같을 경우
				}

				return 0 ;

			});
		}else{
			/**
			 * 숫자
			 */
			trs.sort(function(atr, btr){
				var ascope=$(atr[rn]).find('>td').eq(n);
				var bscope=$(btr[rn]).find('>td').eq(n);
				var av, bv;

				/**
				 * <p>태그 포함 여부에 따라서 따로 분기
				 */

				if($(ascope).find('>p').length>0 && $(bscope).find('>p').length>0){ //0113 음수 처리 추가-최웅
					av=StringUtil.to_pureNumber_minus($.trim($(ascope).find('>p:eq(0)').text()));
					bv=StringUtil.to_pureNumber_minus($.trim($(bscope).find('>p:eq(0)').text()));
				}else{
					av=StringUtil.to_pureNumber_minus($.trim($(ascope).text()));
					bv=StringUtil.to_pureNumber_minus($.trim($(bscope).text()));

				};

				return (isup)?bv-av:av-bv;
			});
		};
		
		// 3. re-append-<TR>
		for(var c=0, ctotal=trs.length; c<ctotal; c++){
			for(var d=0, dtotal=trs[c].length; d<dtotal; d++){
				$(tbody).append($(trs[c][d])); //if(d==0) console.log(c,n ,$(trs[c][rn]).find('td').eq(n).text()); // 순서 확인용
			}
		};

		// 4. adjust-css-[IE7-8]
		if(typeof(Selectivizr)!='undefined'){
			/**
			 * Selectivizr 초기화
			 */
			$(tbody).find('tr').each(function(a){
				var aclass=String($(this).attr('class')).split(' ');
				var bclass=new Array();

				for(var b in aclass){
					if(String(aclass[b]).indexOf('slvzr-')!=0 && $.trim(aclass[b])!=''){
						bclass.push($.trim(aclass[b]));
					};
				};

				if(bclass.length>0){
					$(this).attr('class', bclass.join(' '));
				}else{
					$(this).removeAttr('class');
				};
			});

			/**
			 * Selectivizr 적용
			 */
			Selectivizr.init();
		};
	},
//	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:RESET_HEADER
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	reset_header : function () {
		var owner = this;
		var title = $(owner._scope).find((owner._isall)?'>thead>tr>th':'>tbody>tr>td');
		$.each(title, function () {
			if ($(this).hasClass("on") || $(this).hasClass("off")) {
				$(this).removeClass("on").addClass("off");
				var thisA = $(this).find(">a");
				if(!thisA.hasClass('down')){
					thisA
					.removeClass('up')
					.addClass('down')
					.attr('title', '내림차순으로 정렬');
				};
			}
		});
	}

});






/*************************************************************************************************
 *
 * UI-COMMON-LIST-SLIDE
 *
 * @example
 * - /html/customer/guide/download/security_service.jsp
 *
 *************************************************************************************************/
var CommonSlideList=Class.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._lists=null;
		this._blank=null;

		this._counts={'total':0, 'focus':-1, 'step':1, 'blank':-1};

		this.reinit();
	},

	reinit:function(){
		this._counts.step=Number($(this._scope).attr('data-step') || 1);

		this.build_list();
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAMS
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * get-position-pervious-item
	 *
	 * @param {Number} n - 선택된 리스트 index-numbers
	 */
	get_row_index:function(n){
		var row=(Math.floor(n/this._counts.step)+1)*this._counts.step-1;
		row=Math.min(row, this._counts.total-1);
		return row;
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LIST
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_list:function(){
		var owner=this;

		if(this._lists==null) this._lists=new Array();

		$(this._scope).find('*[data-role=common-list-slide-item]').each(function(a){
			if(a>=owner._counts.total){
				$(this).find('*[data-role=common-list-slide-toggle]')
				.data('n', a)
				.data('istoggle', false)
				.bind({
					'click':function(e){
						var bool=!$(this).data('istoggle');
						var n=(bool)?$(this).data('n'):-1;
						owner.focus(n);
					}
				});
			};
		});
		this._counts.total=$(this._scope).find('*[data-role=common-list-slide-item]').length;
	},

	focus_list:function(n){
		$(this._scope).find('*[data-role=common-list-slide-item]').each(function(a){
			var abool=(n==a)?true:false;

			var atitle=$(this).find('*[data-role=common-list-slide-title]');
			var atoggle=$(this).find('*[data-role=common-list-slide-toggle]');
			var adetail=$(this).find('*[data-role=common-list-slide-detail]');

			var atext=String($(atoggle).text());
			var aattr=String($(atoggle).attr('title'));

			$(atoggle).data('istoggle', abool);
			$(adetail).hide();

			if(abool){
				$(atitle).addClass('on');

				$(atoggle).removeClass('off').addClass('on')
				.text(atext.replace('보기', '닫기'))
				.attr('title', aattr.replace('열림', '닫힘'));
			}else{
				$(atitle).removeClass('on');

				$(atoggle).removeClass('on').addClass('off')
				.text(atext.replace('닫기', '보기'))
				.attr('title', aattr.replace('닫힘', '열림'));
			};
		});
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BLANK
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_blank:function(n){
		this._blank=$(document.createElement('li'))
		.css({
			'width':'100%',
			'height':'0px',
			'margin-bottom':'10px'
		})
		.insertAfter($(this._scope).find('*[data-role=common-list-slide-item]').eq(n));
	},

	remove_blank:function(){
		if(this._blank!=null){
			$(this._blank).stop().remove();
			this._blank=null;
		};
	},

	transition_blank:function(n){
		var target=$(this._scope).find('*[data-role=common-list-slide-item]').eq(n).find('*[data-role=common-list-slide-detail]');
		var th=$(target).outerHeight(true);

		$(this._blank).animate(
			{
				'height':th+'px'
			},
			{
				'duration':600,
				'easing':'expoEaseOut',
				'complete':function(){
					$(target).show();
				}
			}
		);
	},

	focus_blank:function(n){
		if(n!=-1){
			var bn=this.get_row_index(n);

			if(this._counts.blank!=bn){
				this.remove_blank();
				this.build_blank(bn);
			};

			this.transition_blank(n);
			this._counts.blank=bn;
		}else{
			this.remove_blank();
			this._counts.blank=-1;
		};

		this._counts.focus=n;
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	focus:function(n){
		this.focus_list(n);
		this.focus_blank(n);
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-PAGING
 *
 * @example
 * - http://localhost:7001/html/_guide/board.html
 *
 *************************************************************************************************/
var CommonPaging=PagingUI.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAM
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	get_style : function() {
		var iseng = _common._iseng;

		return {
			'NAVIGATE' : {
				'FIRST' : '<a href="javascript:_common.nothing();" class="first" data-role="ui-paging-first">'
						+ ((!iseng) ? '첫페이지' : 'First')
						+ '</a> ',
				'PREV' : '<a href="javascript:_common.nothing();" class="prev" data-role="ui-paging-prev">'
						+ ((!iseng) ? '이전' : 'Previous')
						+ '</a> ',
				'NEXT' : '<a href="javascript:_common.nothing();" class="next" data-role="ui-paging-next">'
						+ ((!iseng) ? '다음' : 'Next')
						+ '</a> ',
				'LAST' : '<a href="javascript:_common.nothing();" class="end" data-role="ui-paging-last">'
						+ ((!iseng) ? '마지막페이지' : 'End')
						+ '</a> '
			},

			'PAGE' : {
				'ON' : '<a href="javascript:_common.nothing();" data-role="ui-paging-page" title="'
						+ ((!iseng) ? '현재리스트' : 'Currently List')
						+ '" class="current">****</a>',
				'OFF' : '<a href="javascript:_common.nothing();" data-role="ui-paging-page">****</a>',
				'SEP' : '****' // 'ON', 'OFF' - seperater
			}
		};
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:UI
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_content:function(){
		if(this._page.total>0){
			var style=this.get_style();
			var s=this.get_start();

			// 1. append-[first, prev]
			if(s>0){
				$(this._scope)
				.append(style.NAVIGATE.FIRST)
				.append(style.NAVIGATE.PREV);
			};

			// 2. append-[page]
			var container=this._scope;
			for(var a=s, atotal=s+this._page.step; a<atotal; a++){
				if(a<this._page.total){
					var asep=style.PAGE.SEP;
					var atags=String(style.PAGE[(a==this._page.current)?'ON':'OFF']).split(asep);

					$(container).append(atags[0]+Number(a+1)+atags[1]);
				};
			};

			// 3. append-[first, prev]
			if(s+10<this._page.total){
				$(this._scope)
				.append(style.NAVIGATE.NEXT)
				.append(style.NAVIGATE.LAST);
			};
		};
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
			var c=owner._page.current;
			var s=owner._page.step;
			c=Math.floor(c/s)*s-1;

			owner.select(c);
		});

		// button-event-next
		$(this._scope).find('*[data-role=ui-paging-next]').bind('click', function(e){
			var c=owner._page.current;
			var s=owner._page.step;
			c=Math.floor(c/s)*s+s;

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
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-CALENDAR
 *
 * @example
 * - http://localhost:7001/html/_guide/board.html
 *
 *************************************************************************************************/
var CommonCalendar=CalendarUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(issingle, target, index, islock, fixdates, direction){
		this._target=target;
		this._tfd=null;//tfd;
		this._scope=null;
		this._top=null;

		this._restrict={'type':null, 'time':null};
		this._limits={'min':null, 'max':null};
		this._year={'min':null, 'max':null, 'current':null, 'now':null, 'focus':null};
		this._month={'min':0, 'max':11, 'current':null, 'now':null, 'focus':null};
		this._date={'current':null, 'now':null, 'focus':null};
		this._fixdates=fixdates || new Array(); // 지정되는 날
		this._direction=direction;

		this._index=index;
		this._issingle=issingle;
		this._islock=ValidationUtil.is_null(islock)?false:islock;

		this._select;
		this._change;

		this.reinit();
	},

	reinit:function(){
		var now=DateUtil.get_now();
		this.set_times('now', now.year, Number(now.month)-1, Number(now.date));

		switch(String(this._direction).toUpperCase()){
			case 'AFTER':
				this._year.min=Number(now.year)-1;
				this._year.max=Number(now.year)+30;
				break;
			/* 2014-12-21 카드 발급 일자 관련 수정으로 최소년 수정*/
			default:
				// this._year.min=2005;
				this._year.min=Number(now.year)-20;
				this._year.max=Number(now.year)+1;
				break;
		};

		this.build_scope();
		this.build_top();
		this.build_bottom();
		this.reset();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAMS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	get_focusday:function(){
		return String(this._year.focus)+'-'+StringUtil.add_zero(Number(this._month.focus)+1, 2)+'-'+StringUtil.add_zero(this._date.focus, 2);
	},

	get_focusday_eng:function(){
		return StringUtil.add_zero(Number(this._month.focus)+1, 2)+'-'+StringUtil.add_zero(this._date.focus, 2)+'-'+String(this._year.focus);
	},

	is_fixdates:function(d){
		var bool=false;

		if(this._fixdates.length>0){
			for(var a=0, atotal=this._fixdates.length; a<atotal; a++){
				if(Number(d)==Number(this._fixdates[a])){
					bool=true; break;
				};
			};
		};
		return bool;
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		this._scope=this._target;
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TOP
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_top:function(){
		if($('html').attr('lang')=='ko')
		{
			var owner=this;
			var ymsg=((this._issingle)?'년도선택':((this._index==0)?'시작':'종료')+'기간 년도선택')+'(레이어열림)';
			var mmsg=((this._issingle)?'월선택':((this._index==0)?'시작':'종료')+'기간 월선택')+'(레이어열림)';

			// 1. build-container
			var top=$(document.createElement('div'))
			.attr('class', 'selecter')
			.append($(document.createElement('div'))
				.attr('class', 'year')
				.append('<a href="javascript:_common.nothing();" class="prev" data-role="common-ui-calendar-year-prev">이전년도</a>')
				.append('<span><a href="javascript:_common.nothing();" data-role="common-ui-calendar-year" title="'+ymsg+'">'+this._year.min+'</a></span>')
				.append('<ul title="년도 리스트" data-role="common-ui-calendar-year-list" style="display:none;"></ul>')
				.append('<a href="javascript:_common.nothing();" class="next" data-role="common-ui-calendar-year-next">다음년도</a>')
			)
			.append($(document.createElement('div'))
				.attr('class', 'month')
				.append('<a href="javascript:_common.nothing();" class="prev" data-role="common-ui-calendar-month-prev">이전달</a>')
				.append('<span><a href="javascript:_common.nothing();" data-role="common-ui-calendar-month" title="'+mmsg+'">01</a></span>')
				.append('<ul title="월 리스트" data-role="common-ui-calendar-month-list" style="display:none;"></ul>')
				.append('<a href="javascript:_common.nothing();" class="next" data-role="common-ui-calendar-month-next">다음달</a>')
			)
			.append('<span class="apply"data-role="common-ui-calendar-close-top" style="display:none;"><a href="javascript:_common.nothing();">닫기</a></span>')
			.appendTo($(this._scope)); this._top=top;
		}
		else if($('html').attr('lang')=='en')
		{
			var owner=this;
			var ymsg=((this._issingle)?'Year Select':((this._index==0)?'Start':'End')+'Period Year Select')+'(layer open)';
			var mmsg=((this._issingle)?'Month Select':((this._index==0)?'Start':'End')+'Period Month Select')+'(layer open)';

			// 1. build-container
			var top=$(document.createElement('div'))
			.attr('class', 'selecter')
			.append($(document.createElement('div'))
				.attr('class', 'year')
				.append('<a href="javascript:_common.nothing();" class="prev" data-role="common-ui-calendar-year-prev">Prev Year</a>')
				.append('<span><a href="javascript:_common.nothing();" data-role="common-ui-calendar-year" title="'+ymsg+'">'+this._year.min+'</a></span>')
				.append('<ul title="year list" data-role="common-ui-calendar-year-list" style="display:none;"></ul>')
				.append('<a href="javascript:_common.nothing();" class="next" data-role="common-ui-calendar-year-next">Next Year</a>')
			)
			.append($(document.createElement('div'))
				.attr('class', 'month')
				.append('<a href="javascript:_common.nothing();" class="prev" data-role="common-ui-calendar-month-prev">Prev Month</a>')
				.append('<span><a href="javascript:_common.nothing();" data-role="common-ui-calendar-month" title="'+mmsg+'">01</a></span>')
				.append('<ul title="month list" data-role="common-ui-calendar-month-list" style="display:none;"></ul>')
				.append('<a href="javascript:_common.nothing();" class="next" data-role="common-ui-calendar-month-next">Next Month</a>')
			)
			.append('<span class="apply"data-role="common-ui-calendar-close-top" style="display:none;"><a href="javascript:_common.nothing();">Close</a></span>')
			.appendTo($(this._scope)); this._top=top;
		}
		// 2. build-list-year
		switch(String(this._direction).toUpperCase()){
			case 'AFTER':
				for(var a=this._year.min, atotal=this._year.max; a<=atotal; a++){
					$('<li><a href="javascript:_common.nothing();">'+a+'</a></li>')
					.bind({
						'click':function(e){
							owner.focus_top('year', $(this).text());
							owner.reset(true);

						}
					})
					.appendTo($(top).find('ul[data-role=common-ui-calendar-year-list]'));
				};
				break;

			default:
				for(var a=this._year.max, atotal=this._year.min; a>=atotal; a--){
					$('<li><a href="javascript:_common.nothing();">'+a+'</a></li>')
					.bind({
						'click':function(e){
							owner.focus_top('year', $(this).text());
							owner.reset(true);
							$(e.target).focus();/*1215 최웅 포커스 추가*/

						}
					})
					.appendTo($(top).find('ul[data-role=common-ui-calendar-year-list]'));
				};
				break;
		};

		// 3. build-list-month
		for(var b=0, btotal=12; b<btotal; b++){
			$('<li><a href="javascript:_common.nothing();">'+StringUtil.add_zero(Number(b+1), 2)+'</a></li>')
			.bind({
				'click':function(e){
					owner.focus_top('month', $(this).text());
					owner.reset(true);
					$(e.target).focus();/*1215 최웅 포커스 추가*/
				}
			})
			.appendTo($(top).find('ul[data-role=common-ui-calendar-month-list]'));
		};

		// 4. event - [year, month]
		var types=['year', 'month'];
		for(var c=0, ctotal=2; c<ctotal; c++){
			var ctype=types[c];

			// 4-1. list
			$(top).find('ul[data-role=common-ui-calendar-'+ctype+'-list]').bind({
				'mousewheel':function(e, dy, dx){
					var st=$(this).scrollTop(); st+=29*((dy<0)?1:-1);
					$(this).scrollTop(st);
					return false;
				}
			});

			// 4-2. view
			$(top).find('a[data-role=common-ui-calendar-'+ctype+']')
			.data('type', ctype)
			.bind({
				'click':function(e){
					//owner.toggle_top();
					owner.show_top(true, $(this).data('type'));
					//$(top).find('ul[data-role=common-ui-calendar-year-list]').find('li.on').children('a').focus(); /*1215 최웅 포커스 - 달력(기간) 추가*/
					$(this).parent().next().find('li.on').children('a').focus(); /*1215 최웅 포커스 - 달력(기간) 추가*/


				}
			});

			// 4-3. previous
			$(top).find('a[data-role=common-ui-calendar-'+ctype+'-prev]')
			.data('type', ctype)
			.bind({
				'click':function(e){
					owner.navigate_top($(this).data('type'), -1);
				}
			});

			// 4-4. next
			$(top).find('a[data-role=common-ui-calendar-'+ctype+'-next]')
			.data('type', ctype)
			.bind({
				'click':function(e){
					owner.navigate_top($(this).data('type'), 1);
				}
			});
		};

		// 5. event - [close-top]
		$(this._top).find('span[data-role=common-ui-calendar-close-top]').bind({
			'click':function(e){
				owner.show_top(false);
				//$(owner._top).find('a[data-role=common-ui-calendar-month-next]').focus();
			}
		});
	},

	navigate_top:function(type, dir){
		var owner=this;
		var year=$(this._top).find('a[data-role=common-ui-calendar-year]');
		var month=$(this._top).find('a[data-role=common-ui-calendar-month]');
		var yvalue=Number($(year).text());
		var mvalue=Number($(month).text());

		switch(String(type).toLowerCase()){
			case 'year':
				yvalue+=dir;
				yvalue=(yvalue<=this._year.min)?this._year.min:yvalue;
				yvalue=(yvalue>=this._year.max)?this._year.max:yvalue;
				break;

			case 'month':
				var dates=DateUtil.get_changed_month(yvalue, mvalue-1, dir);

				if(
					(dates.year>=this._year.min && dates.year<=this._year.max) &&
					(dates.month>=0 && dates.month<=11)
				){
					yvalue=dates.year;
					mvalue=Number(dates.month)+1;
				};
				break;
		};

		// 2014-10-08 Chokwangyo : 년월 변경시 focus 없이 1일 선택
		owner.focus(yvalue, mvalue, "01");

		// 1. change-year
		$(year).text(yvalue);
		this.focus_top('year', yvalue);

		// 2. change-month
		$(month).text(StringUtil.add_zero(Number(mvalue), 2));
		this.focus_top('month', StringUtil.add_zero(Number(mvalue), 2));

		// 3. scroll+focus
		$(this._top).find('ul[data-role=common-ui-calendar-'+type+'-list]>li.on>a').focus();

		this.reset(true);
	},

	focus_top:function(type, date){
		// 1. view
		$(this._top).find('a[data-role=common-ui-calendar-'+type+']').text((type=='month')?StringUtil.add_zero(date, 2):date);

		// 2. list
		$(this._top).find('ul[data-role=common-ui-calendar-'+type+'-list]>li').each(function(a){
			if(String(date)==$(this).text()){
				$(this).addClass('on');
			}else{
				$(this).removeClass('on');
			};
		});
	},

	/**
	 * 사용안함
	 */
	/*
	toggle_top:function(){
		this.show_top(!$(this._top).find('span[data-role=common-ui-calendar-change]').is(':visible'));
	},*/

	show_top:function(bool, type){
		// 1. list
		var types=(type=='year')?['month', 'year']:['year', 'month'];
		// 2014-10-20 Chokwangyo : 년월 변경시 focus 없이 1일 선택 시작
		var owner=this;
		var year=$(this._top).find('a[data-role=common-ui-calendar-year]');
		var month=$(this._top).find('a[data-role=common-ui-calendar-month]');
		var yvalue=Number($(year).text());
		var mvalue=Number($(month).text());
		// 2014-10-20 Chokwangyo : 년월 변경시 focus 없이 1일 선택 끝

		for(var a=0, atotal=2; a<atotal; a++){
			var alist=$(this._top).find('ul[data-role=common-ui-calendar-'+types[a]+'-list]');

			if(bool){
				$(alist).show();
				$(alist).find('>li.on>a').focus();
			}else{
				$(alist).hide();
			};
			
		};

		// 2. btn
		var btn=$(this._top).find('span[data-role=common-ui-calendar-close-top]');
		if(bool) $(btn).show(); else $(btn).hide();
		
		if(!bool)owner.focus(yvalue, mvalue, "01"); // 2015.1.27 일자 클릭시 포커스 안되는 문제 해결
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BOTTOM
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_bottom:function(){
		if($('html').attr('lang')=='ko')
		{
			var bottom=$(document.createElement('table'))
			.append($(document.createElement('caption'))
				.append('<strong>달력</strong>')
				.append('<p>주7일(일,월,화,수,목,금,토)로 구성된 달력입니다.</p>')
			)
			.append($(document.createElement('thead').setAttribute('class','blind'))
				.append($(document.createElement('tr'))
					.append('<th scope="col" class="sun">일</th>')
					.append('<th scope="col">월</th>')
					.append('<th scope="col">화</th>')
					.append('<th scope="col">수</th>')
					.append('<th scope="col">목</th>')
					.append('<th scope="col">금</th>')
					.append('<th scope="col" class="sat">토</th>')
				)
			)
			.append($(document.createElement('tbody')))
			.appendTo($(this._scope)); this._bottom=bottom;
		}
		else if($('html').attr('lang')=='en')
		{
			var bottom=$(document.createElement('table'))
			.append($(document.createElement('caption'))
				.append('<strong>calendar</strong>')
				.append('<p>Week 7 day(sunday,monday,tuesday,wednesday,thursday,friday,saturday) calendar</p>')
			)
			.append($(document.createElement('thead').setAttribute('class','blind'))
				.append($(document.createElement('tr'))
					.append('<th scope="col" class="sun">Sun</th>')
					.append('<th scope="col">Mon</th>')
					.append('<th scope="col">Tue</th>')
					.append('<th scope="col">Wed</th>')
					.append('<th scope="col">Thu</th>')
					.append('<th scope="col">Fri</th>')
					.append('<th scope="col" class="sat">Sat</th>')
				)
			)
			.append($(document.createElement('tbody')))
			.appendTo($(this._scope)); this._bottom=bottom;


		}

	},

	rebuild_bottom:function(y, m){
		this._year.current=y;
		this._month.current=m;

		$(this._bottom).find('>tbody').empty();

		var owner=this;
		var infos=this.get_cells(y, m);
		var atr;

		for(var a=0, atotal=infos.length; a<atotal; a++){
			if(a%7==0) atr=$(document.createElement('tr')).appendTo($(this._bottom).find('tbody'));

			var ainfo=infos[a];
			var atd=$(document.createElement('td')).appendTo(atr);

			if(!this._islock){
				switch(String(ainfo.type)){
					case 'current':
						if(this._fixdates.length==0 || (this._fixdates.length>0 && this.is_fixdates(ainfo.msg))){
							$(atd)
							.data('year', y)
							.data('month', m)
							.data('date', ainfo.msg);

							switch(String(ainfo.state)){
								case 'satuday':
									$(atd).append('<a href="javascript:_common.nothing();" class="sat">'+ainfo.msg+'</a>');
									break;

								case 'sunday':
									$(atd).append('<a href="javascript:_common.nothing();" class="sun">'+ainfo.msg+'</a>');
									break;

								default:
									$(atd).append('<a href="javascript:_common.nothing();">'+ainfo.msg+'</a>');
									break;
							};

							if(ainfo.focusday) $(atd).addClass('select');
							$("td.select a").attr("title","선택한 날짜"); // 웹 접근성 오류항목 0-16
						}else{
							$(atd)
							.css('color', '#ddd')
							.append(ainfo.msg);
						};
						break;

					case 'restrict':
						$(atd)
						.css('color', '#ddd')
						.append(ainfo.msg);
						break;
				};
			}else{
				switch(String(ainfo.type)){
					case 'current':
						$(atd)
						.data('year', y)
						.data('month', m)
						.data('date', ainfo.msg)
						.css('color', '#ddd')
						.append(ainfo.msg);
						break;

					case 'restrict':
						$(atd)
						.css('color', '#ddd')
						.append(ainfo.msg);
						break;
				};
			};
		};

		$(this._bottom).find('>tbody a').each(function(b){
			$(this).bind({
				'click':function(e){
					owner._select(owner. _index, y, m, Number($(this).text()));
					$(owner._top).next().find('td.select').children('a').focus(); // 1208 최웅 추가(누른 달 포커스 주기)
//
				}
			});
		});
	},

	/**
	 * FOLLOW 타입의 종료 달력에 날짜 표시 하기
	 */
	enable_bottom:function(d){
		var owner=this;
		var max=DateUtil.get_total_date(this._year.current, this._month.current); // 마지막날 작을때 처리
		var d=(max<=d)?max:d;

		$(this._bottom).find('>tbody td').each(function(a){
			var adate=Number($(this).text());

			if(adate>0){
				if(adate==d){
					$(this)
					.empty()
					.append('<a>'+adate+'</a>')
					.addClass('select');
				}else{
					$(this)
					.empty()
					.append(adate);
				};
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	reset:function(issync){
		var y=Number($(this._top).find('a[data-role=common-ui-calendar-year]').text());
		var m=Number($(this._top).find('a[data-role=common-ui-calendar-month]').text());

		this.rebuild_bottom(y, m-1);

		$(this._bottom).find('.select a').last().focus();

		if(issync){
			try{
				this._change(this._index, y, m);
			}catch(e){};
		};
	},

	focus:function(y, m, d){
		this.set_times('focus', y, m-1, d);
		this.focus_top('year', y);
		this.focus_top('month', m);

		this.reset();
	},

	enable:function(d){
		this.enable_bottom(d);
	},

	restrict:function(type, time){
		this.set_restrict(type, time);
		this.navigate();
	},

	limit:function(min, max){
		this.set_limit(min, max);
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-MONTH-CALENDAR
 *
 * @example
 * - /banking/balance/goldenegg.do
 *
 *************************************************************************************************/
var CommonMonthCalendar=CommonCalendar.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAMS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	get_focusday:function(){
		return String(this._year.focus)+'-'+StringUtil.add_zero(Number(this._month.focus)+1, 2);
	},

	get_focusday_eng:function(){
		return StringUtil.add_zero(Number(this._month.focus)+1, 2)+'-'+String(this._year.focus);
	},

	get_cells:function(y, m){
		var output=new Array();
		var stime=(this._limits.min!=null)?Number(String(this._limits.min).replace(/[^0-9]/g, '')):-1;
		var etime=(this._limits.max!=null)?Number(String(this._limits.max).replace(/[^0-9]/g, '')):-1;

		for(var a=0, atotal=12; a<atotal; a++){
			var abool;
			var ctime=Number(String(y)+StringUtil.add_zero(a+1, 2));

			if(
				((stime!=-1 && stime<=ctime) && (etime!=-1 && etime>=ctime)) ||
				((stime!=-1 && stime<=ctime) && (etime==-1)) ||
				((etime!=-1 && etime>=ctime) && (stime==-1)) ||
				(stime==-1 && etime==-1)
			){
				if(this._restrict.type!=null){
					var rtime=Number(this._restrict.time);

					switch(this._restrict.type){
						case 'after':
							abool=(ctime>=rtime)?true:false;
							break;

						case 'before':
							abool=(ctime<=rtime)?true:false;
							break;
					};
				}else{
					abool=true;
				};
			}else{
				abool=false;
			};

			output.push(abool);
		};
		return output;
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TOP
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_top:function(){
		if($('html').attr('lang')=='ko')
		{
			var owner=this;
			var ymsg=((this._issingle)?'년도선택':((this._index==0)?'시작':'종료')+'기간 년도선택')+'(레이어열림)';

			// 1. build-container
			var top=$(document.createElement('div'))
			.attr('class', 'selecter')
			.append($(document.createElement('div'))
				.attr('class', 'year')
				.append('<a href="javascript:_common.nothing();" class="prev" data-role="common-ui-calendar-year-prev">이전년도</a>')
				.append('<span><a href="javascript:_common.nothing();" data-role="common-ui-calendar-year" title="'+ymsg+'">'+this._year.min+'</a></span>')
				.append('<ul title="년도 리스트" data-role="common-ui-calendar-year-list" style="display:none;"></ul>')
				.append('<a href="javascript:_common.nothing();" class="next" data-role="common-ui-calendar-year-next">다음년도</a>')
			)
			.append('<span class="apply"data-role="common-ui-calendar-close-top" style="display:none;"><a href="javascript:_common.nothing();">닫기</a></span>')
			.appendTo($(this._scope)); this._top=top;
		}
		else if($('html').attr('lang')=='en')
		{
			var owner=this;
			var ymsg=((this._issingle)?'Year Select':((this._index==0)?'Start':'End')+'Period Year Select')+'(Layer Open)';

			// 1. build-container
			var top=$(document.createElement('div'))
			.attr('class', 'selecter')
			.append($(document.createElement('div'))
				.attr('class', 'year')
				.append('<a href="javascript:_common.nothing();" class="prev" data-role="common-ui-calendar-year-prev">Prev Year</a>')
				.append('<span><a href="javascript:_common.nothing();" data-role="common-ui-calendar-year" title="'+ymsg+'">'+this._year.min+'</a></span>')
				.append('<ul title="Year List" data-role="common-ui-calendar-year-list" style="display:none;"></ul>')
				.append('<a href="javascript:_common.nothing();" class="next" data-role="common-ui-calendar-year-next">Next Year</a>')
			)
			.append('<span class="apply"data-role="common-ui-calendar-close-top" style="display:none;"><a href="javascript:_common.nothing();">Close</a></span>')
			.appendTo($(this._scope)); this._top=top;
		}
		// 2. build-list-year
		switch(String(this._direction).toUpperCase()){
			case 'AFTER':
				for(var a=this._year.min, atotal=this._year.max; a<=atotal; a++){
					$('<li><a href="javascript:_common.nothing();">'+a+'</a></li>')
					.bind({
						'click':function(e){
							owner.focus_top('year', $(this).text());
							owner.reset(true);
						}
					})
					.appendTo($(top).find('ul[data-role=common-ui-calendar-year-list]'));
				};
				break;

			default:
				for(var a=this._year.max, atotal=this._year.min; a>=atotal; a--){
					$('<li><a href="javascript:_common.nothing();">'+a+'</a></li>')
					.bind({
						'click':function(e){
							owner.focus_top('year', $(this).text());
							owner.reset(true);
						}
					})
					.appendTo($(top).find('ul[data-role=common-ui-calendar-year-list]'));
				};
				break;
		};


		// 3. event
		// 3-1. list
		$(top).find('ul[data-role=common-ui-calendar-year-list]').bind({
			'mousewheel':function(e, dy, dx){
				var st=$(this).scrollTop(); st+=29*((dy<0)?1:-1);
				$(this).scrollTop(st);
				return false;
			}
		});

		// 3-2. view
		$(top).find('a[data-role=common-ui-calendar-year]').bind({
			'click':function(e){
				//owner.toggle_top();
				owner.show_top(true, 'year');
			}
		});

		// 3-3. previous
		$(top).find('a[data-role=common-ui-calendar-year-prev]')
		.data('type', 'year')
		.bind({
			'click':function(e){
				owner.navigate_top($(this).data('type'), -1);
			}
		});

		// 3-4. next
		$(top).find('a[data-role=common-ui-calendar-year-next]')
		.data('type', 'year')
		.bind({
			'click':function(e){
				owner.navigate_top($(this).data('type'), 1);
			}
		});

		// 4. event - [close-top]
		$(this._top).find('span[data-role=common-ui-calendar-close-top]').bind({
			'click':function(e){
				owner.show_top(false);
				$(owner._top).find('a[data-role=common-ui-calendar-year]').focus();// 1208 최웅 추가(포커스 주기)
			}
		});
	},

	navigate_top:function(type, dir){
		var year=$(this._top).find('a[data-role=common-ui-calendar-year]');
		var yvalue=Number($(year).text());

		yvalue+=dir;
		yvalue=(yvalue<=this._year.min)?this._year.min:yvalue;
		yvalue=(yvalue>=this._year.max)?this._year.max:yvalue;

		// 1. change-year
		$(year).text(yvalue);
		this.focus_top('year', yvalue);

		// 2. scroll+focus
		$(this._top).find('ul[data-role=common-ui-calendar-year-list]>li.on>a').focus();

		this.reset(true);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BOTTOM
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_bottom:function(){
		var bottom=$(document.createElement('ul'))
		.attr({
			'class':'btn-month'
		})
		.appendTo($(this._scope)); this._bottom=bottom;
	},

	rebuild_bottom:function(y, m){
		this._year.current=y;
		this._month.current=m;

		var owner=this;
		var cells=this.get_cells(y, m);

		$(this._bottom).empty();

		for(var a=0, atotal=12; a<atotal; a++){
			var abool=cells[a];

			if(abool){
				if($('html').attr('lang')=='ko')
				{
					$(document.createElement('li'))
					.addClass((this._year.focus==y && this._month.focus==a)?'select':'')
					.append($(document.createElement('a'))
						.text(Number(a+1)+'월')
						.data('n', a)
						.attr({
							'data-role':'common-ui-calendar-month-btn',
							'href':'javascript:_common.nothing();'
						})
						.bind({
							'click':function(e){
								var y=Number($(owner._top).find('a[data-role=common-ui-calendar-year]').text());

								owner._select(owner. _index, y, $(this).data('n'), -1);
								owner.reset(true);

								$(owner._top).next().find('li.select').children('a').focus(); // 1208 최웅 추가(누른 달 포커스 주기)


							}
						})
					)
					.appendTo($(this._bottom));
				}
				else if($('html').attr('lang')=='en')
				{
					$(document.createElement('li'))
					.addClass((this._year.focus==y && this._month.focus==a)?'select':'')
					.append($(document.createElement('a'))
						.text(Number(a+1)+'M')
						.data('n', a)
						.attr({
							'data-role':'common-ui-calendar-month-btn',
							'href':'javascript:_common.nothing();'
						})
						.bind({
							'click':function(e){
								var y=Number($(owner._top).find('a[data-role=common-ui-calendar-year]').text());

								owner._select(owner. _index, y, $(this).data('n'), -1);
								owner.reset(true);

								$(owner._top).next().find('li.select').children('a').focus(); // 1208 최웅 추가(누른 달 포커스 주기)


							}
						})
					)
					.appendTo($(this._bottom));
				}
			}else{
				if($('html').attr('lang')=='ko')
				{
					$(document.createElement('li'))
					.append($(document.createElement('span'))
						.text(Number(a+1)+'월')
					)
					.appendTo($(this._bottom));
				}
				else if($('html').attr('lang')=='en')
				{
					$(document.createElement('li'))
					.append($(document.createElement('span'))
						.text(Number(a+1)+'M')
					)
					.appendTo($(this._bottom));
				}
			};
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	reset:function(issync){
		var y=Number($(this._top).find('a[data-role=common-ui-calendar-year]').text());
		var m=Number(String($(this._bottom).find('>li.select>a').text()).replace(/[^0-9]/g, ''));

		this.rebuild_bottom(y, m-1);

		if(issync){
			try{
				this._change(this._index, y, m);
			}catch(e){};
		};
	},

	focus:function(y, m, d){
		var year=Number(y);
		var month=Number(m);

		this.set_times('focus', year, month-1, 1);
		this.focus_top('year', year);
		this.rebuild_bottom(y, month-1);

		this.reset();
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-PERIOD-CALENDAR
 *
 * @example
 * - http://localhost:7001/html/_guide/board.html
 *
 *************************************************************************************************/
var CommonPeriodCalendar=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._container=null;
		this._calendars=null;
		this._tfds=null;
		this._btns={'toggles':null, 'refresh':null, 'exit':null};

		this._type='PERIOD';
		this._isonlymonth=false;
		this._isuseselect=false;
		this._ispositiontop=false;
		this._distance=0;
		this._fixdates=null;
		this._direction=null;
		this._zindex=null;
		this._isfirst=true;
		this._isopen=false;

		this._focus;
		this._callback;

		this.reinit();
	},

	reinit:function(){
		this._isonlymonth=(String($(this._scope).attr('data-type')).toUpperCase()=='MONTH')?true:false; // 달선택 사용 유무
		this._isuseselect=(String($(this._scope).attr('data-use-select')).toUpperCase()=='Y')?true:false; // select 필드 사용유무
		this._ispositiontop=(String($(this._scope).attr('data-position-top')).toUpperCase()=='Y')?true:false; // 상단에 띄우기
		this._distance=Number($(this._scope).attr('data-distance'));
		this._callback=($(this._scope).attr('data-callback')!=undefined)?$(this._scope).attr('data-callback'):null;
		this._zindex=$(this._scope).css('z-index'); if(this._zindex>0) $(this._scope).css('z-index', '0'); // fieldset 에 z-index:10(?) 때문에 셀렉트, 다른 달력이 가려지는 부분 보안, open 됐을때만 기존에 있던 포커스 적용

		switch(String($(this._scope).attr('data-direction')).toUpperCase()){
			case 'BEFORE':
				this._direction='BEFORE';
				break;

			case 'AFTER':
				this._direction='AFTER';
				break;
		};

		this.build_container();
		//this.build_calendars(); // -> 실제로 노출될 때만 생성
		this.build_tfd();
		this.build_btns();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CONTAINER
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_container:function(){
		if($('html').attr('lang')=='ko')
		{
			this._container=$(document.createElement('div'))
			.attr({
				'class':'lay-calendar'+((this._isonlymonth)?' month':''),
				'data-role':'common-ui-calendar-container'
			})
			.css({
				'display':'none',
				'height':(this._isonlymonth)?'auto':'290px',
				'z-index':200
			})
			.append($(document.createElement('div'))
				.attr({
					'class':'start',
					'data-role':'common-ui-calendar'
				})
				.append('<p>기간 시작</p>')
			)
			.append($(document.createElement('div'))
				.attr({
					'class':'end',
					'data-role':'common-ui-calendar'
				})
				.append('<p>기간 끝</p>')
			)
			//.append('<a href="#" class="refresh2" data-role="common-ui-calendar-refresh">적용하기</a>')
			.append('<div class="btn-area"><a href="javascript:_common.nothing();" class="btnLarge blue" data-role="common-ui-calendar-refresh">적용</a></div>')
			.append('<a href="#" class="close4" data-role="common-ui-calendar-exit">달력(레이어) 닫기</a>')
			.appendTo($(this._scope));
		}
		else if($('html').attr('lang')=='en')
		{
			this._container=$(document.createElement('div'))
			.attr({
				'class':'lay-calendar'+((this._isonlymonth)?' month':''),
				'data-role':'common-ui-calendar-container'
			})
			.css({
				'display':'none',
				'height':(this._isonlymonth)?'auto':'290px',
				'z-index':200
			})
			.append($(document.createElement('div'))
				.attr({
					'class':'start',
					'data-role':'common-ui-calendar'
				})
				.append('<p>Period Start</p>')
			)
			.append($(document.createElement('div'))
				.attr({
					'class':'end',
					'data-role':'common-ui-calendar'
				})
				.append('<p>Period End</p>')
			)
			//.append('<a href="javascript:_common.nothing();" class="refresh2" data-role="common-ui-calendar-refresh">적용하기</a>')
			.append('<div class="btn-area line"><a href="javascript:_common.nothing();" class="btn" data-role="common-ui-calendar-refresh">Apply</a></div>')
			.append('<a href="javascript:_common.nothing();" class="close4" data-role="common-ui-calendar-exit">Calender(layer) Close</a>')
			.appendTo($(this._scope));
		}
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CALENDAR
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_calendars:function(){
		this._calendars=new Array();

		var owner=this;
		var direction=this._direction;

		for(var a=0, atotal=(this._type=='PERIOD')?2:1; a<atotal; a++){
			var aissingle=(this._type=='PERIOD')?false:true;
			var aislock=(this._type=='PERIOD' && this._isonlymonth)?true:false;
			var acontainer=$(this._scope).find('div[data-role=common-ui-calendar]').eq(a);

			var ac;
			if(!this._isonlymonth){
				ac=new CommonCalendar(aissingle, acontainer, a, aislock, new Array(), direction);
			}else{
				ac=new CommonMonthCalendar(aissingle, acontainer, a, aislock, new Array(), direction);
			};
			ac._select=Delegate.create(owner, owner.select_calendar);
			ac._change=Delegate.create(owner, owner.change_calendar);

			this._calendars.push(ac);
		}
	},

	select_calendar:function(n, y, m, d){
		this._calendars[n].focus(y, m+1, d);

		if(this._type=='SINGLE'){
			this.refresh();
		}else{
			var sdate=this._calendars[0].get_focusday();
			var edate=this._calendars[1].get_focusday();

			this.reinit_calendar(sdate, edate);
		};
	},

	/**
	 *년, 월 변경시 다른 캘린더 조정
	 */
	change_calendar:function(n, y, m){
		if(this._isonlymonth && this._distance>0){
			var dir=(n==0)?1:-1;
			var d=this._distance*dir;
			var dates=DateUtil.get_changed_month(Number(y), Number(m)-1, d);

			this._calendars[(n==0)?1:0].focus(dates.year, Number(dates.month)+1);
		};
	},

	reset_calendar:function(){
		var dates=new Array();
		var min=($(this._scope).attr('data-min')!=undefined)?$(this._scope).attr('data-min'):null;
		var max=($(this._scope).attr('data-max')!=undefined)?$(this._scope).attr('data-max'):null;
		var fdate=($(this._scope).attr('data-focus')!=undefined)?$(this._scope).attr('data-focus'):null;

		for(var a=0, atotal=(this._type=='PERIOD')?2:1; a<atotal; a++){
			this._calendars[a].limit(min, max); // 제한설정
			this._calendars[a].show_top(false);

			var adate=this.get_value_tfd(a);
			if($('html').attr('lang')=='en'){ //영문 달력에 대한 추가오류 수정 0126 최웅
				if(!this._isonlymonth){
					adate = adate.slice(6,10) + '-' + adate.slice(0,5);
				}
				else{
					adate = adate.slice(3,7) + '-' + adate.slice(0,2);
				}

			}
			/**
			 *  필드가 비었을 때 오늘날짜로 처리
			 */
			if(!this._isonlymonth){
				//adate=(!ValidationUtil.is_date(adate))?StringUtil.to_date(DateUtil.get_now()):adate; // 주석(2014.05.23)

				/**
				 * 필드가 비어 있고, data-focus가 지정되어 있을 때
				 * 포커스되는 날짜는 data-focus 일로 지정
				 * (2014.05.23)
				 */
				if(!ValidationUtil.is_date(adate)){
					if(!ValidationUtil.is_null(fdate)){
						adate=fdate;
					}else{
						adate=StringUtil.to_date(DateUtil.get_now());
					};
				};
			}else{
				adate=(!ValidationUtil.is_month_date(adate))?StringUtil.to_date(DateUtil.get_now()):adate;
			};

			dates[a]=adate;
		};

		this.reinit_calendar.apply(this, dates);
	},

	reinit_calendar:function(sdate, edate){
		var sdate=String(sdate).split('-');
		var edate=String(edate).split('-');

		if(this._type=='PERIOD'){
			this._calendars[0].restrict_date('before', edate.join(''));
			this._calendars[1].restrict_date('after', sdate.join(''));

			if(!this._isonlymonth){
				/**
				 * 년-월-일
				 */
				this._calendars[0].focus(sdate[0], sdate[1], sdate[2]);
				this._calendars[1].focus(edate[0], edate[1], edate[2]);
			}else{
				/**
				 * 년-월
				 */
				this._calendars[0].focus(sdate[0], sdate[1]);
				this._calendars[1].focus(edate[0], edate[1]);
			};
		}else{
			var now=$(this._scope).attr('data-now') || StringUtil.to_date(DateUtil.get_now());

			/**
			 * 제한 설정
			 */
			if(!this._isonlymonth){
				switch(this._direction){
					case 'BEFORE':
						this._calendars[0].restrict_date('before', now);
						break;

					case 'AFTER':
						this._calendars[0].restrict_date('after', now);
						break;
				};

				/**
				 * 포커스 지정 (년-월-일)
				 */
				this._calendars[0].focus(sdate[0], sdate[1], sdate[2]);
			}else{
				/**
				 * 포커스 지정 (년-월)
				 */
				this._calendars[0].focus(sdate[0], sdate[1]);
			};
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TEXTFILED
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_tfd:function(){
		var owner=this;

		this._tfds=new Array();

		if(!this._isuseselect){
			$(this._scope).find('input[type=text]').each(function(a){
				if(!$(this).attr('readonly')){
					$(this)
					.data('n', a)
					.bind({
						'focusin':function(e){
							owner.show(false);
						},

						'focusout':function(e){
							//owner.adjust_tfd($(this).data('n')); // 달력에서만 선택할 수 있도록 하기위해 삭제
						}
					});
				};
				owner._tfds.push($(this));
			});
		}else{
			$(this._scope).find('select').each(function(a){
				/**
				 * select 박스가 열렸을 때 달력 닫기
				 */
				$(this).data('manager')._show=Delegate.create(owner, function(bool){
					if(bool) owner.show(false);
				});

				owner._tfds.push($(this));
			});
		};
	},

	/*
	 * adjust-textfield
	 *
	 * @description - 필드에 값이 변경될 때, 시작. 종료일에 대한 변경 (사용안함)
	 * @param	{Number} n - (0~1)
	 * @return	void
	 */
	/*
	adjust_tfd:function(n){
		if(!this._isuseselect){
			// 1. current
			var cdate=String($(this._tfds[n]).val());
			cdate=(!ValidationUtil.is_date(cdate))?StringUtil.to_date('', '-'):cdate;
			cdate=String(cdate).replace(/[^0-9]/g, '');

			// 2. target
			if(this._type=='PERIOD'){
				var tdate=String($(this._tfds[(n==0)?1:0]).val()).replace(/[^0-9]/g, '');

				switch(String(n)){
					case '0':
						cdate=(Number(cdate)>Number(tdate))?tdate:cdate;
						break;

					case '1':
						cdate=(Number(cdate)<Number(tdate))?tdate:cdate;
						break;
				};
			};

			$(this._tfds[n]).val(StringUtil.to_date(cdate, '-'));
		}else{

		};
	},*/

	/**
	 * 달력에서 선택된 값 필드(input[type=text], select) 에 입력
	 */
	refresh_tfd:function(){
		for(var a=0, atotal=(this._type=='PERIOD')?2:1; a<atotal; a++){
			if($('html').attr('lang')=='ko')
			{
				var adate=this._calendars[a].get_focusday();
			}
			else if($('html').attr('lang')=='en')
			{
				var adate=this._calendars[a].get_focusday_eng();
			}

			this.set_value_tfd(a, adate);
		};
	},

	/*
	 * 기간설정 버튼에서
	 */
	distance_tfd:function(value, isafter){
		/**
		 * 기준일 존재확인
		 * 존재하지 않을때 기준일을 오늘 날짜로 변경
		 */
		var fn=(isafter)?0:1;
		var fdate=String(this.get_value_tfd(fn)).replace(/[^0-9]/g, '');

		if(this._isonlymonth){
			if(!ValidationUtil.is_month_date_nodash(fdate)){
				this.set_value_tfd(fn, StringUtil.to_date(DateUtil.get_now()));
			};
		}else{
			if(!ValidationUtil.is_date_nodash(fdate)){
				this.set_value_tfd(fn, StringUtil.to_date(DateUtil.get_now()));
			};
		};

		/**
		 * 변경일 필드값 변경
		 */
		var cn=(isafter)?1:0;
		var cdate=String(this.get_value_tfd(fn)).split('-');

		if(this._isonlymonth){
			var dinfo=DateUtil.get_changed_month(Number(cdate[0]), Number(cdate[1])-1, Number(value)*((!isafter)?-1:1));

			this.set_value_tfd(cn, dinfo.year+'-'+StringUtil.add_zero(Number(dinfo.month)+1, 2));
		}else{
			var pdate=DateUtil.get_distance_date(cdate[0], Number(cdate[1]), Number(cdate[2]), Number(value)*((!isafter)?-1:1));

			this.set_value_tfd(cn, StringUtil.to_date(pdate));
		};
	},

	/**
	 * get-value-tfd
	 *
	 * @description - 날짜형식 입력값 취득 (input[type=text], select)
	 * @param	{Number} n - 0~
	 * @return	{String}
	 */
	get_value_tfd:function(n){
		var value='';

		if(!this._isuseselect){
			value=$(this._tfds[n]).val();
		}else{
			switch(String(this._tfds.length)){
				/**
				 * 년-월-일 (x2)
				 */
				case '6':
					value+=$(this._tfds[n*3]).val()+'-';
					value+=StringUtil.add_zero($(this._tfds[n*3+1]).val(), 2)+'-';
					value+=StringUtil.add_zero($(this._tfds[n*3+2]).val(), 2);
					break;

				/**
				 * 년-월 (x2)
				 */
				case '4':
					value+=$(this._tfds[n*2]).val()+'-';
					value+=StringUtil.add_zero($(this._tfds[n*2+1]).val(), 2);
					break;

				/**
				 * 년-월
				 */
				case '2':
					value+=$(this._tfds[0]).val()+'-';
					value+=StringUtil.add_zero($(this._tfds[1]).val(), 2);
					break;
			};
		};
		return $.trim(value);
	},

	/**
	 * set-value-tfd
	 *
	 * @description - 날짜형식 입력값 변경 (input[type=text], select)
	 * @param	{Number} n - 0~
	 * @return	{String}
	 */
	set_value_tfd:function(n, value){
		if(!this._isuseselect){
			$(this._tfds[n]).val(value);
		}else{
			var values=String(value).split('-');

			switch(String(this._tfds.length)){
				/**
				 * 년-월-일 (x2)
				 */
				case '6':
					$(this._tfds[n*3]).find('>option[value='+values[0]+']').prop('selected', true);
					$(this._tfds[n*3+1]).find('>option[value='+values[1]+']').prop('selected', true);
					$(this._tfds[n*3+2]).find('>option[value='+values[2]+']').prop('selected', true);
					break;

				/**
				 * 년-월 (x2)
				 */
				case '4':
					$(this._tfds[n*2]).find('>option[value='+values[0]+']').prop('selected', true);
					$(this._tfds[n*2+1]).find('>option[value='+values[1]+']').prop('selected', true);
					break;

				/**
				 * 년-월 (x2)
				 */
				case '2':
					$(this._tfds[0]).find('>option[value='+values[0]+']').prop('selected', true);
					$(this._tfds[1]).find('>option[value='+values[1]+']').prop('selected', true);
					break;
			};
			_common.reinit_ui('select');
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BUTTON
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_btns:function(){
		var owner=this;

		// 1. toggle
		this._btns.toggles=new Array();

		$(this._scope).find('[data-role=common-ui-calendar-toggle]').each(function(a){
			$(this)
			.data('n', a)
			.bind({
				'click':function(e){
					//e.stopPropagation();
					owner.toggle(!$(owner._container).is(':visible'), $(this).data('n'));
				}
			});
			owner._btns.toggles.push($(this));
		});

		// 2. refresh
		this._btns.refresh=$(this._scope).find('a[data-role=common-ui-calendar-refresh]').bind({
			'click':function(e){
				owner.refresh();
			}
		});

		// 3. exit
		this._btns.exit=$(this._scope).find('a[data-role=common-ui-calendar-exit]').bind({
			'click':function(e){
				owner.exit();
			},
			'focusout':function(e){
				$(owner._scope).find('a[data-role=common-ui-calendar-year-prev]').eq(0).focus();
			}
		});

		// 4. distance
		$(this._scope).find('*[data-role^=common-ui-calendar-distance]').each(function(b){
			
			//기간 설정 : 전체(all) 일경우 
			var distance = $(this).attr('data-role').split('common-ui-calendar-distance-')[1];
			
			if(isNaN(distance)){ //전체 : Srting
				$(this).data('value', distance);
				$(this).bind({
					'click':function(e){
						// 선택 버튼 Class 추가  : current
						$(this).parent().siblings().removeClass('current');
						$(this).parent().addClass('current');
						var isafter=(String($(this).attr('data-after')).toUpperCase()=='Y')?true:false;
						owner.removePeriod($(this).data('value'), isafter);
					}
				});
			}else{ // 기간 :Number
				$(this).data('value', Number(distance));
				$(this).bind({
					'click':function(e){
						// 선택 버튼 Class 추가  : current
						$(this).parent().siblings().removeClass('current');
						$(this).parent().addClass('current');
						var isafter=(String($(this).attr('data-after')).toUpperCase()=='Y')?true:false;
						owner.distance($(this).data('value'), isafter);
					}
				});
			}
			
			
		});

		// 5. container
		$(this._scope).find('div[data-role=common-ui-calendar-container]').bind({
			'click':function(e){
				e.stopPropagation();
			}
		});

		$(document).click(function(e){
			//owner.exit();
			$(owner._scope).find('a[data-role=common-ui-calendar-exit]').focus();
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	toggle:function(bool, n){
		if(bool){
			/**
			 * 노출될 때 생성
			 */
			if(this._isfirst){
				this._isfirst=false;
				this.build_calendars();
			};

			this.reset_calendar();
			this._focus(this);
		};

		this.show(bool, n);
	},

	refresh:function(){
		this.refresh_tfd();
		this.show(false);

		$(this._btns.toggles[(this._type=='PERIOD')?1:0]).focus();

		if(this._callback!=null) window[this._callback]();
	},

	exit:function(){
		this.show(false);

		$(this._btns.toggles[(this._type=='PERIOD')?1:0]).focus();
	},

	distance:function(value, isafter){
		if(this._type=='PERIOD'){
			this.distance_tfd(value, isafter);
			this.show(false);
		};
	},
	
	removePeriod:function(value, isafter){
		if(this._type=='PERIOD'){
			$(this._tfds[0]).val('');
			$(this._tfds[1]).val('');
			this.show(false);
		};
	},
	

	show:function(bool, n){
		if(bool){
			if(this._zindex>0) $(this._scope).css('z-index', Number(this._zindex)+1);

			if(this._ispositiontop){
				var h=$(this._container).outerHeight(true);

				$(this._container).css({
					'top':Number(h+4)*-1+'px'
				});
			};

			$(this._container).show();
			$(this._container).find('a[data-role=common-ui-calendar-year-prev]').eq(n).focus();
		}else{
			if(this._zindex>0) $(this._scope).css('z-index', 0);

			$(this._container).hide();
		};

		this._isopen=bool;
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-SINGLE-CALENDAR
 *
 * @example
 * - http://localhost:7001/html/_guide/board.html
 *
 *************************************************************************************************/
var CommonSingleCalendar=CommonPeriodCalendar.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._container=null;
		this._calendars=null;
		this._tfds=null;
		this._btns={'toggles':null, 'refresh':null, 'exit':null};

		this._type='SINGLE';
		this._isonlymonth=false;
		this._distance=0;
		this._fixdates=null;
		this._direction=null;
		this._isfirst=true;
		this._isopen=false;

		this._focus;

		this.reinit();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CONTAINER
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_container:function(){
		if($('html').attr('lang')=='ko')
		{
			this._container=$(document.createElement('div'))
			.attr({
				'class':'lay-calendar single'+((this._isonlymonth)?' month':''),
				'data-role':'common-ui-calendar-container'
			})
			.css({
				'display':'none',
				'z-index':200
			})
			.append($(document.createElement('div'))
				.attr({
					'data-role':'common-ui-calendar'
				})
				//.append('<p>'+((this._isonlymonth)?'월 선택':'날짜 선택')+'</p>')
			)
			.append('<a href="javascript:_common.nothing();" class="close4" data-role="common-ui-calendar-exit"  title="레어이팝업닫힘">달력(레이어) 닫기</a>')
			.appendTo($(this._scope));
		}
		else if($('html').attr('lang')=='en')
		{
			this._container=$(document.createElement('div'))
			.attr({
				'class':'lay-calendar single'+((this._isonlymonth)?' month':''),
				'data-role':'common-ui-calendar-container'
			})
			.css({
				'display':'none',
				'z-index':200
			})
			.append($(document.createElement('div'))
				.attr({
					'data-role':'common-ui-calendar'
				})
				.append('<p>'+((this._isonlymonth)?'Month Select':'Day Select')+'</p>')
			)
			.append('<a href="javascript:_common.nothing();" class="close4" data-role="common-ui-calendar-exit"  title="layer popup close">calendar(layer) close</a>')
			.appendTo($(this._scope));
		}

	}
});






/*************************************************************************************************
 *
 * UI-COMMON-PERIOD-FOLLOW-CALENDAR
 *
 * @description - 시작일만 조회가능
 * @example
 * - http://localhost:7001/html/_guide/form.html
 *
 *************************************************************************************************/
var CommonPeriodFollowCalendar=CommonPeriodCalendar.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	reinit:function(){
		this._fixdates=String($(this._scope).attr('data-fixdates') || '').split(','); if(this._fixdates[0]=='') this._fixdates=new Array();
		this._ispositiontop=(String($(this._scope).attr('data-position-top')).toUpperCase()=='Y')?true:false; // 상단에 띄우기
		this._distance=Number($(this._scope).attr('data-distance')) || 0;
		this._callback=($(this._scope).attr('data-callback')!=undefined)?$(this._scope).attr('data-callback'):null;

		switch(String($(this._scope).attr('data-direction')).toUpperCase()){
			case 'BEFORE':
				this._direction='BEFORE';
				break;

			case 'AFTER':
				this._direction='AFTER';
				break;
		};

		this.build_container();
		//this.build_calendars(); // 보여질 때만 생성
		this.build_tfd();
		this.build_btns();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAMS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	is_fixdates:function(d){
		var bool=false;

		if(this._fixdates.length>0){
			for(var a=0, atotal=this._fixdates.length; a<atotal; a++){
				if(Number(d)==Number(this._fixdates[a])){
					bool=true; break;
				};
			};
		};
		return bool;
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CALENDAR
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_calendars:function(){
		this._calendars=new Array();

		var owner=this;

		for(var a=0, atotal=2; a<atotal; a++){
			var acontainer=$(this._scope).find('div[data-role=common-ui-calendar]').eq(a);
			var atfd=$(this._scope).find('input[data-role=common-input-date]').eq(a);

			var ac=new CommonCalendar(false, acontainer, a, (a==1)?true:false, (a==0)?this._fixdates:new Array(), this._direction);
			ac._select=Delegate.create(owner, owner.select_calendar);
			ac._change=Delegate.create(owner, owner.change_calendar);

			this._calendars.push(ac);
		};
	},

	/**
	 * 일 선택
	 */
	select_calendar:function(n, y, m, d){
		this._calendars[n].focus(y, m+1, d);

		// 1. 시작일 선택시 종료일 달력변경
		if(n==0){
			// 1-1. 제한설정
			var sdate=String(this._calendars[0].get_focusday()).split('-');
			var ndate=DateUtil.get_changed_month(Number(sdate[0]), Number(sdate[1])-1, this._distance);

			this._calendars[1].focus(ndate.year, ndate.month+1, d);
		};

		// 2. 시작일에 선택된 일자로 종료일 버튼 생성
		this._calendars[1].enable(d);
	},

	/**
	 * 년, 월 변경시 다른 캘린더 조정
	 * 시작일에 선택된 날짜로 버튼 생성
	 */
	change_calendar:function(n, y, m){
		if(n==1){
			var sdate=String(this._calendars[0].get_focusday()).split('-');
			var ndate=DateUtil.get_changed_month(Number(sdate[0]), Number(sdate[1])-1, this._distance);

			var eyear=this._calendars[1]._year.current;
			var emonth=this._calendars[1]._month.current;
			var etime=Number(String(eyear)+StringUtil.add_zero(emonth+1, 2));
			var ntime=Number(String(ndate.year)+StringUtil.add_zero(ndate.month+1, 2));

			/**
			 * 시작일 이전으로만 포커스
			 */
			if(etime>=ntime){
				this._calendars[1].focus(eyear, (emonth+1), sdate[2]);
				this._calendars[1].enable(sdate[2]);
			};
		};
	},

	reinit_calendar:function(sdate, edate){
		// 1. 시작일
		var sdate=String(sdate).split('-');
		var now=$(this._scope).attr('data-now') || null;

		if(now==null){
			this._calendars[0].restrict_date('after', sdate.join(''));
		}else{
			this._calendars[0].restrict_date('after', String(now).split('-').join('')); // 시작날이 지정되어 있을 경우
		};

		if($(this._tfds[0]).val()!=''){
			this._calendars[0].focus(sdate[0], sdate[1], sdate[2]);
		}else{
			this._calendars[0].focus(sdate[0], sdate[1]);
		};

		// 2. 종료일
		if($(this._tfds[1]).val()!=''){
			var edate=String(edate).split('-');

			this._calendars[1].restrict_date('after', sdate.join(''));
			this._calendars[1].focus(edate[0], edate[1], edate[2]);
			this._calendars[1].enable(edate[2]);
		}else{
			var ndate=DateUtil.get_changed_month(Number(sdate[0]), Number(sdate[1])-1, this._distance);

			this._calendars[1].restrict_date('after', String(ndate.year)+StringUtil.add_zero(ndate.month+1, 2)+StringUtil.add_zero(sdate[2], 2));
			this._calendars[1].focus(ndate.year, ndate.month+1, sdate[2]);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	refresh:function(){
		var sdate=String(this._calendars[0].get_focusday()).split('-');

		/**
		 * 시작일이 선택되지 않았을 때 적용안함
		 */
		if(!ValidationUtil.is_null(this._calendars[0]._date.focus)){
			this.refresh_tfd(); if(this._callback!=null) window[this._callback]();
		};

		this.show(false);

		$(this._btns.toggles[(this._type=='PERIOD')?1:0]).focus();
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-TAB
 *
 *************************************************************************************************/
var CommonTab=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;

		this.reinit();
	},

	reinit:function(){
		this.build_scope();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		var owner=this;

		$(this._scope).find('>li').each(function(a){
			$(this)
			.data('n', a)
			.bind({
				'click':function(e){
					owner.focus($(this).data('n'));
				}
			});
		});
	},

	focus_scope:function(n){
		$(this._scope).find('>li').each(function(a){
			if(a==n) $(this).addClass('on'); else $(this).removeClass('on');
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TARGET
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	focus_target:function(n){
		var tname=String($(this._scope).attr('data-target'));

		$(document.body).find('*[data-name='+tname+']').each(function(a){
			if(a==n){
				$(this).show();

				/**
				 * Selectivizr.init();
				 */
				var btype=ValidationUtil.get_browser_type();
				if(btype=='msie7' || btype=='msie8'){
					if(!$(this).data('isapply-selectivizr')){
						$(this).data('isapply-selectivizr', true);
						try{
//ie8에서 메인 탭 클릭시 스크립트 에러에 따라 try catch문으로 에러수정 - 최웅
							Selectivizr.init();
						}
						catch(err)
						{
						}
					};
				};
			}else{
				$(this).hide();
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	focus:function(n){
		this.focus_scope(n);
		this.focus_target(n);
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-LOADING
 *
 *************************************************************************************************/
var CommonLoading=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(){
		this._scope=null;

		this._counts=0;

		this.reinit();
	},

	reinit:function(){
		this.build_scope();

		this.open(); // count 증가
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		if(this._scope==null){
			this._scope=$(document.createElement('div'))
			.attr('data-role', 'common-ui-loading')
			.addClass('common-ui-loading') // 2014-09-12 UI-COMMON-LOADING
			/* 2014-09-12 UI-COMMON-LOADING .css({
				'position':'fixed',
				'left':'0px', 'top':'0px',
				'width':'100%',
				'height':'100%',
				'z-index':9999
			}) */
			.append($(document.createElement('div'))
				.addClass('inner') // 2014-09-12 UI-COMMON-LOADING
//				.show(3000) // 2014-09-12 UI-COMMON-LOADING
//				/* 2014-09-12 UI-COMMON-LOADING .css({
//					'width':'100%',
//					'height':'100%',
//					'background-color':'#fff',
//					'opacity':.5,
//					'pointer-events':'none'
//				})*/
			)
			.append($(document.createElement('img'))
					.attr('src','/ux/images/common/loading_L.gif')
					.attr('alt','loading')
					.show() // 2014-09-12 UI-COMMON-LOADING
					/* 2014-09-12 UI-COMMON-LOADING .css({
						'position':'absolute',
						'width':'60px',
						'height':'60px',
						'left':'50%',
						'top':'50%',
						'margin-top':'-30px',
						'margin-left':'-30px'
					})*/
				)
			.bind({
				'mousewheel':function(e){
					return false;
				}
			})
			.appendTo(document.body);
		};
	},

	remove_scope:function(){
		if(this._scope!=null){
			$(this._scope)
			.empty()
			.remove();

			this._scope=null;
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	open:function(){
		this._counts++;
	},

	close:function(){
		var isremove=false;
		var c=this._counts; c--;

		if(c<=0){
			isremove=true;
		}else{
			this._counts=c;
		};

		return isremove;
	},

	remove:function(){
		this.remove_scope();
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-LOADING-BLOCK
 *
 *************************************************************************************************/
var CommonLoadingBlock=CommonLoading.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(target){
		this._target=target;
		this._scope=null;

		this._counts=0;
		this._checks={
			'id':null,
			'sec':100,
			'w':null,
			'h':null
		};

		this.init_check();
		this.reinit();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CHECK
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 대상의 크기가 변경 되었을 때, 반응하기 위해 작성
	 */
	init_check:function(){
		var owner=this;

		this._checks.id=setInterval(function(){
			var w=$(owner._target).innerWidth();
			var h=$(owner._target).innerHeight();

			if(owner._checks.w!=w || owner._checks.h!=h){
				owner._checks.w=w;
				owner._checks.h=h;

				$(owner._scope).css({
					'width':w+'px',
					'height':h+'px'
				});
			};

		}, this._checks.sec);
	},

	remove_check:function(){
		clearInterval(this._checks.id);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		if(this._scope==null){
			this._scope=$(document.createElement('div'))
			.attr('data-role', 'common-ui-loading-block')
			.addClass('common-ui-loading-block') // 2014-09-12 UI-COMMON-LOADING
			.css({
				/* 2014-09-12 UI-COMMON-LOADING 'position':'absolute',
				'left':'0px', 'top':'0px',
				'z-index':9999, */
				'width':$(this._target).innerWidth()+'px',
				'height':$(this._target).innerHeight()+'px'
			})
			.append($(document.createElement('div'))
				.addClass('inner') // 2014-09-12 UI-COMMON-LOADING
				.show(3000) // 2014-09-12 UI-COMMON-LOADING
				/* 2014-09-12 UI-COMMON-LOADING .css({
					'width':'100%',
					'height':'100%',
					'background-color':'#fff',
					'opacity':.5,
					'pointer-events':'none'
				}) */
			)
			.append($(document.createElement('img'))
					.attr('src','/ux/images/common/loading_S.gif')
					.show(3000) // 2014-09-12 UI-COMMON-LOADING
					/* 2014-09-12 UI-COMMON-LOADING .css({
						'position':'absolute',
						'width':'60px',
						'height':'60px',
						'left':'50%',
						'top':'50%',
						'margin-top':'-30px',
						'margin-left':'-30px'
					})*/
				)
			.bind({
				'mousewheel':function(e){
					return false;
				}
			})
			.appendTo($(this._target));
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	remove:function(){
		this.remove_check();
		this.remove_scope();
	}
});

/* 창닫기 후 공유 버튼 포커스 추가 1217 최웅 추가*/
$(function(){

	$(this).on('click', '.close5', function(){

		setTimeout(function(){
			$('.share').focus();

		}, 10);

	});
	$('.lay-share').append($('span.details')); //url복사 떼서 뒤로 붙임

	$(this).on('focusout', 'div.lay-copy .btn_close', function(){
		setTimeout(function(){
			$('div.lay-copy .btn-area a').focus();

		}, 10);

	});
	/* 1217 동적으로 문구 추가 최웅*/
	$('*[data-role=common-ui-slider-bar]').before('<span class="blind">옵션변경 스크롤 - 키보드운용불가</span>');
	//$('.invest-rate').prepend('<span class="blind">옵션변경 스크롤 - 키보드운용불가</span>');


});




/*************************************************************************************************
 *
 * UI-COMMON-MODAL
 *
 *************************************************************************************************/
var CommonModal=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(type, param){
		this._scope=null;

		this._type=type;
		this._param=param;

		this._interval={
			'id':null,
			'sec':1000,
			'max':60,
			'count':0
		};

		this.reinit();
	},

	reinit:function(){
		this.build_scope();
		this.build_timer();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAMS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	get_contents:function(type, param){
		var chtml='';

		switch(String(type).toUpperCase()){
			case 'EXTEND-LOGIN-TIME':
				var time=window.getSessionTimeout();
				var msg;

				if(time==60*60){
					msg='1시간';
				}else{
					msg=(time/60)+'분';
				};

				chtml+=	'<div class="lay-logout" style="margin-top:-40%;margin-left:-50%;background:#fff;">\n';
				chtml+=	'	<h1>자동로그아웃 안내</h1>\n';
				chtml+=	'	<p class="message3">\n';
				chtml+=	'		현재 고객님이 설정하신 자동로그아웃 시간('+msg+')에 <br>맞추어 자동 로그아웃 처리될 예정입니다.\n';
				chtml+=	'	</p>\n';
				chtml+=	'	<hr>\n';
				chtml+=	'	<table class="tbl-type2">\n';
				chtml+=	'	<caption>\n';
				chtml+=	'		<strong>자동로그아웃 남은시간 안내</strong>\n';
				chtml+=	'	</caption>\n';
				chtml+=	'	<colgroup>\n';
				chtml+=	'		<col style="width:25%">\n';
				chtml+=	'		<col>\n';
				chtml+=	'	</colgroup>\n';
				chtml+=	'		<tr>\n';
				chtml+=	'			<th scope="row">남은시간</th>\n';
				chtml+=	'			<td data-role="common-ui-modal-time">60초</td>\n';
				chtml+=	'		</tr>\n';
				chtml+=	'	</table>\n';
				chtml+=	'	<p class="tbl-comment">고객님의 안전한 금융거래를 위하여 고객님이 설정한 자동 로그아웃 설정시간이 되면 자동으로<br>로그아웃처리됩니다.</p>\n';
				chtml+=	'	<hr>\n';
				chtml+=	'	<p class="desc">로그인 시간을 연장하시려면, 로그인 연장하기 버튼을 클릭하시기 바랍니다.</p>\n';
				chtml+=	'	<div class="column-box2">\n';
				chtml+=	'		<div class="row">\n';
				chtml+=	'			<dl>\n';
				chtml+=	'				<dt>현재 내 로그인을 연장합니다.</dt>\n';
				chtml+=	'				<dd><a href="javascript:window.openMenuFromUtil(\'EXTEND-LOGIN-TIME\');" class="btn3 go">로그인 연장</a></dd>\n';
				chtml+=	'			</dl>\n';
				chtml+=	'			<dl>\n';
				chtml+=	'				<dt>지금 바로 로그아웃합니다.</dt>\n';
				chtml+=	'				<dd><a href="javascript:window.openMenuFromUtil(\'LOGOUT\');" class="btn3 go">로그아웃</a></dd>\n';
				chtml+=	'			</dl>\n';
				chtml+=	'		</div>\n';
				chtml+=	'	</div>\n';
				chtml+=	'</div>\n';
				break;

			case 'SHARE-URL':
				chtml+=	'<div class="lay-copy" style="margin-top:-190px; margin-left:-270px; background:#fff;">\n';
				chtml+=	'	<h1 class="url">URL 복사</h1>\n';
				chtml+=	'	<fieldset>\n';
				chtml+=	'		<legend></legend>\n';
				chtml+=	'		<input type="text" value="'+param+'" title="url 복사 주소">\n';
				chtml+=	'	</fieldset>\n';
				chtml+=	'	<div class="guide">\n';
				chtml+=	'		<p>알려드립니다!</p>\n';
				chtml+=	'		<ul>\n';
				chtml+=	'			<li>자신의 SNS(페이스북/트위터 등)에 URL을 복사하여 해당 페이지를 공유하실 수 있습니다.</li>\n';
				chtml+=	'			<li>해당 URL을 클릭 후 Ctrl+c 키보드 입력을 통해 복사하시기 바랍니다.</li>\n';
				chtml+=	'			<li>Ctrl+v 키보드 입력을 통해 원하시는곳에 복사하시기 바랍니다.</li>\n';
				chtml+=	'		</ul>\n';
				chtml+=	'	</div>\n';
				chtml+=	'	<a href="javascript:window.closeModal(\'SHAREURL\');" class="close5">URL 복사 레이어닫기</a>\n';
				chtml+=	'</div>\n';
				break;

			case 'SHARE-SOURCE':
				chtml+=	'<div class="lay-copy" style="margin-top:-290px;margin-left:-270px;background:#fff;">\n';
				chtml+=	'	<h1 class="html">HTML 복사</h1>\n';
				chtml+=	'	<fieldset>\n';
				chtml+=	'		<legend></legend>\n';
				chtml+=	'		<textarea title="HTML 복사"><iframe width="560" height="400" src="'+param+'" frameborder="0" allowfullscreen title="HTML 복사"></iframe></textarea>\n';
				chtml+=	'	</fieldset>\n';
				chtml+=	'	<div class="guide">\n';
				chtml+=	'		<p>알려드립니다!</p>\n';
				chtml+=	'		<ul>\n';
				chtml+=	'			<li>자신의 블로그 또는 카페에 소스를 복사하여 해당 페이지를 공유하실 수 있습니다.</li>\n';
				chtml+=	'			<li>해당 소스 클릭 후 Ctrl+c 키보드 입력을 통해 복사하시기 바랍니다.</li>\n';
				chtml+=	'			<li>Ctrl+v 키보드 입력을 통해 HTML글쓰기가 가능한 게시판에 복사가 가능합니다.</li>\n';
				chtml+=	'		</ul>\n';
				chtml+=	'	</div>\n';
				chtml+=	'	<a href="javascript:window.closeModal(\'SHARESOURCE\');" class="close5">HTML 복사 레이어닫기</a>\n';
				chtml+=	'</div>\n';
				break;

			case 'SHARE-NOTICE':
				$('*[data-role=common-ui-share]').find ('>span').find ('a').andSelf().hide ();
				var subParam = param.split("|");
				//&amp; -> %26으로 변환되지 않아 뒤쪽 파라미터 짤리는 현상으로 인한 2번 인코드 처리
				var encReturnUrl = encodeURIComponent(encodeURIComponent(subParam[0]));

				chtml+=	'<div class="lay-copy fund">\n';
				chtml+=	'	<p class="title"><b>공유하기 서비스 안내</b></p>\n';
				chtml+=	'	<ul class="desc" style="margin-top:30px;">\n';
				//chtml+=	'		<li>공유하기 서비스는 삼성증권 이외의 타 사이트 게시판, 블로그, 카페 등에 해당 페이지의 컨텐츠를 공유할 수 있는 소스코드와 URL을 제공하는 서비스 입니다.</li>\n';
				chtml+=	'		<li>공유하기 서비스는 삼성증권 이외의 타 사이트 게시판, 블로그, 카페 등에 해당 페이지의 컨텐츠를 공유할 수 있는 URL을 제공하는 서비스 입니다.</li>\n';
				chtml+=	'		<li>삼성증권의 고객뿐 아니라 누구나 사용하실 수 있는 서비스 입니다.</li>\n';
				chtml+=	'		<li>공유하기 서비스 이용 시 로그인 하실 경우 삼성증권에서 제공하는 다양한 혜택을 누릴 수 있습니다.</li>\n';
				chtml+=	'	</ul>\n';
				chtml+=	'	<div class="btn-area">\n';
				chtml+=	'		<a href="javascript:setModal(\'GO\');" class="btn big">공유하기</a>\n';
				chtml+=	'	</div>\n';
				chtml+=	'	<hr>\n';
				chtml+=	'	<div class="message3 ">\n';
				chtml+=	'		<a href="javascript:window.openLogin(\'RETURN_MENU_CODE='+subParam[1]+'&RETURN_MENU_URL='+encReturnUrl+'\')" class="btn3 big"><em>정회원</em> 로그인 후 이용하기</a>\n';
				chtml+=	'		<a href="javascript:window.openMenu(\'M1231762522406\', \'/login/login.pop?isApiMember=Y&RETURN_MENU_CODE='+subParam[1]+'&RETURN_MENU_URL='+encReturnUrl+'\')" class="btn3 big"><em>준회원</em> 로그인 후 이용하기</a>\n';
				chtml+=	'	</div>\n';
				chtml+=	'	<p class="tbl-comment">로그인 하신 후 다시 공유하기 버튼을 클릭하여 주시기 바랍니다.</p>\n';
				chtml+=	'	<a href="javascript:setModal(\'CLOSE\');" class="btn_close"><img src="/images/common/btn/bt_close.gif" alt="Close"></a>\n';
				chtml+=	'</div>\n';
				break;
				
			case 'PB-ALERT':
				/*
				chtml+=	'<div class="lay-copy layer_pop_content on" style="width:660px; left:50%; top:50%; margin-left:-330px; margin-top:-300px; background:#fff; ">\n';
				chtml+=	'	<div style="margin-bottom: 20px; padding: 10px 40px; background: #222; color: #fff; font-weight: bold; font-size: 14px;">\n';
				chtml+=	'		<p>알려드립니다.</p>\n';														
				chtml+=	'	</div>\n';
				chtml+=	'	<div style="padding: 0 40px 40px 40px;">\n';
				chtml+=	'		<p>담당PB가 있는 고객님에 한하여 신청이 가능합니다</p>\n';				
				chtml+=	'		<p>담당PB가 없는 고객님은 가까운 지점에 방문하시어 \n 담당PB를 지정 받으시기 바랍니다.</p>\n';				
				chtml+=	'	</div>\n';
				chtml+=	'	<a href="javascript:window.closeModal(\'CLOSE\');" class="close5">닫기</a>\n';
				chtml+=	'</div>\n';
				break;
				*/
				chtml+=	'<div class="layer_pop_content type4 on" style="width:660px; left:50%; top:50%; margin-left:-330px; margin-top:-300px; background:#fff; ">\n';
				
				chtml+=	'	<div class="popHeader"><h1>알려드립니다.</h1></div>\n';
				chtml+=	'	<div class="popContents">\n';
				chtml+=	'		<div class="achievement"><p style="font-weight:bold;">담당PB가 있는 고객님에 한하여 신청이<br> 가능합니다.<br> 담당PB가 없는 고객님은 가까운 지점에<br> 방문하시어 담당PB를 지정 받으시기 바랍니다.</p></div>\n';
				chtml+=	'		<div class="btn-area"><a href="javascript:window.closeModal(\'CLOSE\')" class="btn big chking inputVal">확인</a></div>\n';
				chtml+=	'	</div>\n';								
				chtml+=	'	<div class="popFooter"><a href="javascript:window.closeModal(\'CLOSE\')" class="close pop_close">팝업닫기</a></div>\n';				
				chtml+=	'</div>\n';
				break;
				
			
			case 'GOAL-CHECKING':
				chtml+=	'<div class="lay-copy" style="margin-top:-300px; margin-left:-330px; background:#fff; width:660px; padding:0;">\n';
				chtml+=	'	<div id="popHeader"><h1>목표달성여부 조회</h1></div>\n';				
				chtml+=	'	<div class="message3 type2" style="padding:50px;">현재 투자 상태로는 <em>목표달성이 불가능</em> 합니다.<br>아래 조건을 한가지 선택하시면 목표달성이 가능합니다.</div>\n';
				chtml+=	'	<div style="padding:40px 0;">\n';
				chtml+=	'		<table class="tbl-type2">\n';														
				chtml+=	'		<caption><strong>목표달성여부 조회 선택</strong></caption>\n';
				chtml+=	'		<colgroup><col style="width:28%"><col style="width:auto"></colgroup>\n';
				chtml+=	'			<tbody>\n';
				chtml+=	'				<tr>\n';
				chtml+=	'					<th scope="row"><label for="chk1"><input type="radio" name="chk" id="chk1" title="" checked> 선택 1. 초기투자</label></th>\n';
				chtml+=	'					<td><input type="text" name="" value="" title="초기투자 금액" style="width:80%"> 만원 증액</td>\n';
				chtml+=	'				</tr>\n';
				chtml+=	'				<tr>\n';
				chtml+=	'					<th scope="row"><label for="chk2"><input type="radio" name="chk" id="chk2" title=""> 선택 2. 월적립</label></th>\n';
				chtml+=	'					<td><input type="text" name="" value="" title="월적립 금액" style="width:80%"> 만원 증액</td>\n';
				chtml+=	'				</tr>\n';
				chtml+=	'				<tr>\n';				
				chtml+=	'					<th scope="row"><label for="chk3"><input type="radio" name="chk" id="chk3" title=""> 선택 3. 투자기간</label></th>\n';
				chtml+=	'					<td><input type="text" name="" value="" title="투자기간 입력" style="width:80%"> 년 연장</td>\n';
				chtml+=	'				</tr>\n';
				chtml+=	'			</tbody>\n';
				chtml+=	'		</table>\n';
				chtml+=	'	</div>\n';
				chtml+=	'	<div class="btn-area">\n';
				chtml+=	'		<a href="#" class="btn big">확정</a>\n';
				chtml+=	'		<a href="#" class="btn3 big">재입력</a>\n';
				chtml+=	'	</div>\n';
				chtml+=	'	<div id="popFooter"><a href="javascript:window.closeModal(\'CLOSE\');" class="close">팝업닫기</a></div>\n';				
				chtml+=	'</div>\n';
				break;

		};
		//init_ie_css3();
		return chtml;
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		if(this._scope==null){
			this._scope=$(document.createElement('div'))
			.attr('data-role', 'common-ui-modal')
			.css({
				'position':'fixed',
				'left':'0px', 'top':'0px',
				'width':'100%',
				'height':'100%',
				'z-index':19999
			})
			.append($(document.createElement('div'))
				.css({
					'width':'100%',
					'height':'100%',
					'background-color':'#000',
					'opacity':.5,
					'pointer-events':'none'
				})
			)
			.append(
					$(document.createElement('div'))
					.append(this.get_contents(this._type, this._param))
					.css({
						'position':'absolute',
						'left':'50%',
						'top':'50%'
					})
				)
			.bind({
				'mousewheel':function(e){
					return false;
				}
			})
			.appendTo(document.body);//_common.reinit_css3(); // 2014.11.18 bluewebd ie7,8 close

			$(this._scope).find(':focusable:eq(0)').focus().bind('keydown',function(e){
				owner.trapTabKey(e);
			});

			var owner = this;
			$(this._scope).find(':focusable').last().bind('keydown',function(e){
				owner.trapTabKey(e);
			});
		};
	},

	trapTabKey:function(e){
		if(e.which == 9){
			if(e.shiftKey){
				$(this._scope).find(':focusable').last().focus();
			}else{
				$(this._scope).find(':focusable:eq(0)').focus();
			}
		}
	},

	remove_scope:function(){
		if(this._scope!=null){
			$(this._scope)
			.empty()
			.remove();

			this._scope=null;
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TIMER
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_timer:function(){
		if(String(this._type).toUpperCase()=='EXTEND-LOGIN-TIME'){
			var owner=this;
			var scope=$(this._scope).find('*[data-role=common-ui-modal-time]');

			this._interval.count=0;
			this._interval.id=setInterval(function(){
				owner._interval.count++;

				var d=owner._interval.max-owner._interval.count; d=(d<=0)?0:d;

				$(scope).text(StringUtil.add_zero(d, 2)+'초');

				if(d<=0) owner.remove_timer();

			}, this._interval.sec);
		};
	},

	remove_timer:function(){
		if(this._interval.id!=null){
			clearInterval(this._interval.id);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	remove:function(){
		this.remove_timer();
		this.remove_scope();
	}
});






/*************************************************************************************************
 *
 * COMMON-SLIDER-BAR
 *
 * @example
 * - http://local.samsungpop.com:7001/html/pension/invest/cost/cost_content.jsp
 * - http://local.samsungpop.com:7001/html/pension/invest/retire/container.jsp
 * - http://local.samsungpop.com:7001/html/pension/invest/financial/container.jsp
 * - http://local.samsungpop.com:7001/html/pension/invest/financial/container2.jsp
 * - http://local.samsungpop.com:7001/html/pension/invest/financial/container3.jsp
 *
 * - http://local.samsungpop.com:7001/html/finance/pension/simulation/saving.jsp?sample=Y
 * - http://local.samsungpop.com:7001/html/finance/pension/simulation/pension.jsp?sample=Y
 *
 *************************************************************************************************/
var CommonSliderBar=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._tfds=null;
		this._bg=null;
		this._area=null;
		this._tab=null;

		this._values={
			'min':0,
			'max':100,
			'init':0
		};

		this._callback;
		this._direction; // HORIZON, VERTICAL
		this._isrebuild;
		this._isusedot=0; // 소수점 사용여부
		this._isdrag=false;

		this._change;
		this._status;

		this.reinit();
	},

	reinit:function(){
		this._callback=String($(this._scope).attr('data-callback'));
		this._direction=String($(this._scope).attr('data-direction') || 'HORIZON').toUpperCase();
		this._isrebuild=(String($(this._scope).attr('data-rebuild')).toUpperCase()=='N')?false:true;
		this._isusedot=Number($(this._scope).attr('data-usedot') || 0);
		this._values.min=Number($(this._scope).attr('data-min') || 0);
		this._values.max=Number($(this._scope).attr('data-max') || 100);
		this._values.init=Number($(this._scope).attr('data-init') || 0); // 초기 셋팅값

		this.build_scope();
		this.build_bg();
		this.build_area();
		this.build_tab();
		this.build_tfd();
		this.build_event();

		//this.move(0); // 2014.04.17
		this.reset(this._values.init);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;

		// 1. event-scope
		$(this._scope).bind({
			'mousedown':function(e){
				switch(owner._direction){
					case 'HORIZON':
						var tx=(e.offsetX || (e.clientX-e.currentTarget.offsetLeft))-7;// "firefox" 에서 offsetX:undefined 케이스 발생
						owner.move(tx);
						break;

					case 'VERTICAL':
						var ty=(e.offsetY || (e.clientY-e.currentTarget.offsetTop));
						owner.move(ty);
						break;
				};

				try{owner._status('JUMPING', e);}catch(e){};
				return false;
			}
		});

		// 2. event-tab
		$(this._tab).bind({
			'mousedown':function(e){
				owner.drag('START', e);
				return false;
			}
		});

		// 3. event-tfd
		if(this._tfds!=null){
			for(var a=0, atotal=this._tfds.length; a<atotal; a++){
				var atfd=this._tfds[a];

				$(atfd)
				.data('n', a)
				.bind({
					'keydown':function(e){
						if(e.keyCode==13) $.focusNext();
					},

					'focusout':function(e){
						owner.reset($(this).val(), $(this).data('n'));
					}
				});
			};
		};
	},

	/**
	 * change-documet-event
	 *
	 * @description - document 의 이벤트를 수신
	 * @param {Object} type
	 * @param {Object} e
	 */
	change_document_event:function(type, e){
		this.drag(type, e);
		return false;
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		$(this._scope)
		.css({
			'position':'relative',
			'cursor':'pointer'
		});

		if(this._isrebuild) $(this._scope).empty();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BG
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_bg:function(){
		if(this._isrebuild){
			this._bg=$(document.createElement('span'))
			.attr({
				'data-role':'common-ui-slider-bar-bg',
				'class':'bar'
			})
			.appendTo($(this._scope));
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:AREA
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_area:function(){
		if(this._isrebuild){
			this._area=$(document.createElement('span'))
			.attr({
				'data-role':'common-ui-slider-bar-area',
				'class':'graph'
			})
			.appendTo($(this._scope));
		}else{
			this._area=$(this._scope).find('*[data-role=common-ui-slider-bar-area]');
		};
	},

	resize_area:function(ratio){
		switch(this._direction){
			case 'HORIZON':
				$(this._area).css({
					'width':(ratio*100)+'%'
				});
				break;

			case 'VERTICAL':
				$(this._area).css({
					'height':(ratio*100)+'%'
				});
				break;
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TAB
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_tab:function(){
		if(this._isrebuild){
			this._tab=$(document.createElement('span'))
			.attr({
				'data-role':'common-ui-slider-bar-tab',
				'class':'point'
			})
			.css({
				'cursor':'pointer'
			})
			.data('pos', null)
			.appendTo($(this._scope));
		}else{
			this._tab=$(this._scope)
			.find('*[data-role=common-ui-slider-bar-tab]')
			.data('pos', null);
		};
	},

	position_tab:function(pos){
		switch(this._direction){
			case 'HORIZON':
				var w=$(this._tab).width();
				$(this._tab).css({
					'left':Math.floor(pos-w/2)+'px'
				});
				break;

			case 'VERTICAL':
				var h=$(this._tab).height();
				$(this._tab).css({
					'top':Math.floor(pos-h/2)+'px'
				});
				break;
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TEXTFIELD
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_tfd:function(){
		var owner=this;
		var tname=$(this._scope).attr('data-target') || null;

		if(tname!=null){
			this._tfds=new Array();

			$('*[data-name='+$(this._scope).attr('data-target')+']').each(function(a){
				owner._tfds.push($(this));
			});
		};
	},

	change_tfd:function(ratio, n){
		if(this._tfds!=null){
			var n=n || 0;
			var d=this._values.max-this._values.min;
			var v, o;

			if(this._isusedot<=0){
				v=Math.round(Number(this._values.min+d*ratio));
				o=Math.round(Number(this._values.min+d*(1-ratio)));
			}else{
				var tens=1; for(var a=0, atotal=this._isusedot; a<atotal; a++) tens*=10;

				v=Math.floor(Number(this._values.min+d*ratio)*(tens))/tens;
				o=Math.floor(Number(this._values.min+d*(1-ratio))*(tens))/tens;
			};

			for(var a=0, atotal=this._tfds.length; a<atotal; a++){
				var atfd=$(this._tfds[a]);
				var avalue=(a==n)?v:o;
				var aisfocus=$(atfd).is(':focus');

				switch(String($(atfd).attr('data-role')).toLowerCase()){
					case 'common-input-number':
						$(atfd).val((aisfocus)?avalue:StringUtil.to_cash(avalue));
						break;

					default:
						$(atfd).val(avalue);
						break;
				};
			};
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	reset:function(value, n){
		var n=n || 0;

		var v=Number(StringUtil.to_pureNumber(value));
		v=(n!=0)?this._values.max-v:v;
		v=(v<=this._values.min)?this._values.min:v;
		v=(v>=this._values.max)?this._values.max:v;

		var d=this._values.max-this._values.min;
		var ratio=(v-this._values.min)/d;

		var tpos;
		switch(this._direction){
			case 'HORIZON':
				// axis-x
				tpos=$(this._scope).width()*ratio;
				break;

			case 'VERTICAL':
				// axis-y
				tpos=$(this._scope).height()*ratio;
				break;
		};

		// 1. change-tfd
		this.change_tfd(ratio, 0);

		// 2. change-area
		this.resize_area(ratio);

		// 3. change-tab
		this.position_tab(tpos);

		// 4. change-ratio
		try{this._change(ratio);}catch(e){};

		// 5. excute-callback
		try{window[this._callback](ratio);}catch(e){};
	},

	move:function(pos){
		var tpos=pos;
		var ratio;

		switch(this._direction){
			case 'HORIZON':
				var maxw=$(this._scope).width();
				tpos=Math.max(0, tpos);
				tpos=Math.min(maxw, tpos);
				ratio=tpos/maxw;
				break;

			case 'VERTICAL':
				var maxh=$(this._scope).height();
				tpos=Math.max(0, tpos);
				tpos=Math.min(maxh, tpos);
				ratio=tpos/maxh;
				break;
		};

		// 1. change-tab
		this.position_tab(tpos);

		// 2. change-area
		this.resize_area(ratio);

		// 3. change-tfd
		this.change_tfd(ratio);

		// 4. change-ratio
		try{this._change(ratio);}catch(e){};

		// 5. excute-callback
		try{window[this._callback](ratio);}catch(e){};
	},

	drag:function(type, e){
		var ischange=false;

		switch(String(type).toUpperCase()){
			case 'START':
				if(!this._isdrag){
					this._isdrag=true; e.preventDefault(); ischange=true;

					$(this._tab)
					.data('pos', {
						'mx':e.pageX,
						'my':e.pageY,
						'cx':$(this._tab).position().left,
						'cy':$(this._tab).position().top
					});
				};
				break;

			case 'STOP':
				if(this._isdrag) ischange=true;
				this._isdrag=false;
				break;

			case 'MOVE':
				if(this._isdrag){
					e.preventDefault(); ischange=true;

					var pos=$(this._tab).data('pos');

					switch(this._direction){
						case 'HORIZON':
							var tx=pos.cx+(((e.type=='mousemove')?e.pageX:e.originalEvent.changedTouches[0].pageX)-pos.mx);
							this.move(tx);
							break;

						case 'VERTICAL':
							var ty=pos.cy+(((e.type=='mousemove')?e.pageY:e.originalEvent.changedTouches[0].pageY)-pos.my);
							this.move(ty);
							break;
					};
				};
				break;
		};

		/**
		 * 이벤트가 변경됐을 때만 호출
		 */
		if(ischange) try{this._status(type);}catch(e){};

		return false;
	}
});






/*************************************************************************************************
 *
 * COMMON-DRAG
 *
 * @example
 * - http://local.samsungpop.com:7001/html/finance/recommand/event.jsp
 *
 *************************************************************************************************/
var CommonDrag=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._target=null;
		this._parent=null;

		this._callback=null;
		this._pos={
			'sx':null,
			'sy':null
		};

		this._isfirst=true;
		this._isdrag=false;
		this._iscomplete=false;

		this.reinit();
	},

	reinit:function(){
		if(this._isfirst){
			this._isfirst=false;

			this._target=$('*[data-name='+$(this._scope).attr('data-target')+']') || null;
			this._parent=$(this._scope).parent();
			this._callback=$(this._scope).attr('data-callback') || null;
			this._pos.sx=$(this._scope).attr('data-x') || $(this._scope).position().left;
			this._pos.sy=$(this._scope).attr('data-y') || $(this._scope).position().top;

			this.build_event();
		}else{
			this._iscomplete=false;

			this.show(true);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;

		// 1. event-scope
		$(this._scope)
		.bind({
			'mousedown':function(e){
				owner.drag('START', e);
				return false;
			}
		});

		// 2. event-parent
		/**
		 * 만약 부모가 <a> 일 때, <ENTER> 처리
		 */
		if(String($(this._parent)[0].nodeName).toUpperCase()=='A'){
			$(this._parent).bind({
				'keydown':function(e){
					if(e.keyCode==13){
						if(!owner._iscomplete && owner._callback!=null){
							owner._iscomplete=true;

							owner.show(false);

							window[owner._callback]();
						};
					};
				}
			});
		};
	},

	/**
	 * change-documet-event
	 *
	 * @description - document 의 이벤트를 수신
	 * @param {Object} type
	 * @param {Object} e
	 */
	change_document_event:function(type, e){
		this.drag(type, e);
		return false;
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	collision:function(){
		if(this._target!=null && !this._iscomplete){
			if($(this._target).is(':visible') && $(this._scope).is(':visible')){
				var cpos=$(this._scope).offset();
				var tpos=$(this._target).offset();
				var tw=$(this._target).width();
				var th=$(this._target).height();

				if(
					(Math.abs(cpos.left-tpos.left)<=tw/2) &&
					(Math.abs(cpos.top-tpos.top)<=th/2)
				){
					this._iscomplete=true;

					this.show(false);

					if(this._callback!=null)	window[this._callback]();
				};
			};
			this.move(this._pos.sx, this._pos.sy);
		};
	},

	move:function(tx, ty){
		$(this._scope).css({
			'left':tx+'px',
			'top':ty+'px'
		});
	},

	drag:function(type, e){
		switch(String(type).toUpperCase()){
			case 'START':
				if(!this._isdrag){
					this._isdrag=true; e.preventDefault();

					$(this._scope)
					.data('pos', {
						'mx':e.pageX,
						'my':e.pageY,
						'cx':$(this._scope).position().left,
						'cy':$(this._scope).position().top
					});
				};
				break;

			case 'STOP':
				this._isdrag=false;

				this.collision();
				break;

			case 'MOVE':
				if(this._isdrag && !this._iscomplete){
					e.preventDefault();

					var pos=$(this._scope).data('pos');
					var tx=pos.cx+(((e.type=='mousemove')?e.pageX:e.originalEvent.changedTouches[0].pageX)-pos.mx);
					var ty=pos.cy+(((e.type=='mousemove')?e.pageY:e.originalEvent.changedTouches[0].pageY)-pos.my);

					this.move(tx, ty);
				};
				break;
		};
		return false;
	},

	show:function(bool){
		if(bool) $(this._scope).show(); else $(this._scope).hide();
	}
});






/*************************************************************************************************
 *
 * UI-CHART-BAR
 *
 * @example
 * - http://local.samsungpop.com:7001/html/finance/fund/goods/details.jsp
 * - http://localhost:7001/html/finance/fund/compare/type_compare2.jsp
 * - http://localhost:7001/html/finance/fund/compare/type_compare3.jsp
 *
 *************************************************************************************************/
var CommonChartBar=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._layer=null;

		this._margin=null;
		this._interval={
			'id':null,
			'sec':1000
		};

		this._islayer;
		this._istransition=false;

		this.reinit();
	},

	reinit:function(){
		var owner=this;

		// 1. margin
		if(this._margin==null){
			this._margin=Number($(this._scope).css('padding-right').replace(/[^0-9]/g, '') || 0);

			$(this._scope).css({'padding-right':'0px'});
		};

		// 2. transition
		if(this._interval.id==null){
			this._interval.id=setTimeout(function(){
				owner.transition();
			}, this._interval.sec);
		}else{
			clearInterval(this._interval.id);
			this.transition();
		};

		// 3. layer
		this._islayer=(String($(this._scope).attr('data-layer')).toUpperCase()=='Y')?true:false;

		this.build_events();
		this.build_layer();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_events:function(){
		if(this._layer==null && this._islayer){
			var owner=this;

			$(this._scope).bind({
				'mouseover':function(e){
					owner.show_layer(true);
				},

				'mouseout':function(e){
					owner.show_layer(false);
				}
			});
		}
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LAYER
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_layer:function(){
		if(this._islayer){
			if(this._layer!=null){
				$(this._layer).remove(); this._layer=null;
			};

			var title=(!ValidationUtil.is_null($(this._scope).attr('data-title')))?$(this._scope).attr('data-title'):'';

			this._layer=$(document.createElement('div'))
			.attr({
				'class':'details'
			})
			.append($(document.createElement('span'))
				.attr({
					'class':'arrow'
				})
				.css({
					'left':'45px'
				})
			)
			.append(title)
			/*
			.append($(document.createElement('a'))
				.attr({
					'href':'_common.nothing();',
					'class':'close5'
				})
				.text('레이어닫기')
			)*/
			.hide();

			$(this._layer).insertAfter($(this._scope));
		};
	},

	show_layer:function(bool){
		if(this._layer!=null){
			if(bool && !this._istransition){
				var tx=$(this._scope).width()/2-52;

				$(this._layer)
				.css({
					'left':tx+'px'
				})
				.show();
			}else{
				$(this._layer).hide();
			};
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TRANSITION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	transition:function(){
		var owner=this;
		var w=$(this._scope).parent().width();
		var ratio=Number($(this._scope).attr('data-value') || 0);
		var tw=Math.round(w*(ratio/100))-this._margin;

		this._istransition=true; this.show_layer(false);

		$(this._scope)
		.stop()
		.css({
			'width':'0px',
			'padding-right':((tw<=0)?0:this._margin)+'px'
		})
		.animate({
			'width':tw+'px'
		}, {
			'duration':600,
			'easing':'expoEaseOut',
			'complete':function(){
				owner._istransition=false;
			}
		});
	}
});





/*************************************************************************************************
 *
 * UI-COMMON-SLIDE-BOX
 *
 *************************************************************************************************/
var CommonSlideBox=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._container=null;
		this._contents={
			'scope':null,
			'items':null
		};
		this._items=null;
		this._navigation={
			'scope':null,
			'anchors':null,
			'controller':null
		};

		this._counts={
			'max':null,
			'current':-1
		};

		this._interval={
			'id':null,
			'sec':3000
		};

		this._callback;
		this._iscontrol=false;
		this._isautoplay=false;

		this._isfirst=true;
		this._istransition=false;
		this._ispause=false;
		this._isover=false;

		this.reinit();
	},

	reinit:function(){
		this._callback=$(this._scope).attr('data-callback');
		this._iscontrol=(String($(this._scope).attr('data-control')).toUpperCase()=='Y')?true:false;
		this._isautoplay=(String($(this._scope).attr('data-autoplay')).toUpperCase()=='Y')?true:false;

		this.build_event();
		this.build_container();
		this.build_content();
		this.build_navigation(); this.focus_navigation(0);

		this.change(0, 1);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		if(this._isfirst){
			var owner=this; this._isfirst=false;

			// 1. event-touch
			$(this._scope).touchSwipe(function(direction){
				owner.swipe((String(direction).toUpperCase()=='LEFT')?1:-1);
			});

			// 2. event-mouse
			$(this._scope).bind({
				'mouseover':function(e){
					owner._isover=true;
				},

				'mouseout':function(e){
					owner._isover=false;
				}
			});

			$(this._scope).find('*[data-role=common-ui-slide-box-prev]').bind({
				'click':function(e){
					owner.navigate(-1);
				}
			});

			$(this._scope).find('*[data-role=common-ui-slide-box-next]').bind({
				'click':function(e){
					owner.navigate(1);
				}
			});
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CONTAINER
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_container:function(){
		this._container=$(this._scope).find('*[data-role=common-ui-slide-box-container]');
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CONTENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_content:function(){
		var owner=this;

		this._counts.max=$(this._container).find('>ul>li').length;

		this._contents.scope=$(this._container).find('>ul').css({
			'position':'relative',
			'width':'200%'
		});

		this._contents.items=new Array();

		$(this._contents.scope).find('>li').each(function(a){
			$(this).css({
				'position':'absolute',
				'width':'50%',
				'display':(a==0)?'block':'none',
				'overflow':'hidden'
			});

			owner._contents.items.push($(this));
		});
	},

	/**
	 * replace-content
	 *
	 * @description - 애니메이션전에 자리 이동
	 *
	 * @param	{Number} n0 - 변경 전 번호
	 * @param	{Number} n1 - 변경 후 번호
	 * @param	{Number} dir - 방향
	 * @return	void
	 */
	replace_content:function(n0, n1, dir){
		$(this._contents.scope)
		.stop()
		.css({
			'left':((dir>0)?0:-100)+'%'
		});

		var items=new Array();
		if(dir>0){
			// [변경후, 변경전], 진행방향 [<<]
			items.push(this._contents.items[n0]);
			items.push(this._contents.items[n1]);
		}else{
			// [변경전, 변경후], 진행방향 [>>]
			items.push(this._contents.items[n1]);
			items.push(this._contents.items[n0]);
		};

		for(var a=0, atotal=2; a<atotal; a++){
			$(items[a]).css({
				'left':(a*50)+'%'
			}).show();
		};
	},

	/**
	 * transition-content
	 */
	transition_content:function(dir){
		var owner=this;

		$(this._contents.scope).animate({
			'left':((dir>0)?-100:0)+'%'
		}, 480, function(){
			owner.complete();
		});
	},

	/**
	 * complete-content
	 */
	complete_content:function(){
		var n=this._counts.current;

		for(var a=0, atotal=this._contents.items.length; a<atotal; a++){
			var aitem=this._contents.items[a];

			if(n==a) $(aitem).show(); else $(aitem).hide();
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:NAVIGATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_navigation:function(){
		var owner=this;

		if($('*[data-name='+$(this._scope).attr('data-navigation')+']').length>0){
			// 1. scope
			this._navigation.scope=$('*[data-name='+$(this._scope).attr('data-navigation')+']').empty();

			// 2. controller
			if(this._counts.max>1 && this._iscontrol){
				if($('html').attr('lang')=='ko'){
					this._navigation.controller=$(document.createElement('a'))
					.attr({
						'href':'javascript:void(0)',
						'class':'pause'
					})
					.html('배너이미지 자동흐름 일시정지') // 2014-10-31 adc_KWCAG2.0_메인_공통_로그인_ver1.0.pptx 8p
					.bind({
						'click':function(e){
							owner._ispause=!$(this).hasClass('play');

							$(this).attr('class', (!owner._ispause)?'pause':'play');
							$(this).html( (!owner._ispause)?'배너이미지 자동흐름 일시정지':'배너이미지 자동흐름 시작'); // 2014-10-31 adc_KWCAG2.0_메인_공통_로그인_ver1.0.pptx 8p
						}
					})
					.appendTo($(this._navigation.scope));
				}else if($('html').attr('lang')=='en'){ //영문 롤링베너 alt값 변경
					this._navigation.controller=$(document.createElement('a'))
					.attr({
						'href':'javascript:void(0)',
						'class':'pause'
					})
					.html('banner image rolling pause') // 2014-10-31 adc_KWCAG2.0_메인_공통_로그인_ver1.0.pptx 8p
					.bind({
						'click':function(e){
							owner._ispause=!$(this).hasClass('play');

							$(this).attr('class', (!owner._ispause)?'pause':'play');
							$(this).html( (!owner._ispause)?'banner image rolling pause':'banner image rolling start'); // 2014-10-31 adc_KWCAG2.0_메인_공통_로그인_ver1.0.pptx 8p
						}
					})
					.appendTo($(this._navigation.scope));
				}
			};

			// 3. anchors
			this._navigation.anchors=new Array();

			if(this._counts.max>1){
				for(var a=0, atotal=this._counts.max; a<atotal; a++){
					this._navigation.anchors.push(
						$(document.createElement('a'))
						.data('n', a)
						.attr({
							'data-role':'common-ui-slide-box-anchor',
							'href':'javascript:void(0);'
						})
						.bind({
							'click':function(e){
								owner.change($(this).data('n'), 1);
							}
						})
						.text(a+1)
						.appendTo($(this._navigation.scope))
					);
				};
			};
		};
	},

	focus_navigation:function(n){
		if(this._navigation.scope!=null){
			$(this._navigation.scope).find('a[data-role=common-ui-slide-box-anchor]').each(function(a){
				if(a==n) $(this).addClass('on'); else $(this).removeClass('on');
			});
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	swipe:function(dir){
		this.navigate(dir);
	},

	navigate:function(dir){
		if(this._counts.max>1){
			var max=this._counts.max;
			var c=this._counts.current; c+=dir;

			c=(c<0)?max-1:c;
			c=(c>max-1)?0:c;

			this.change(c, dir);
		};
	},

	change:function(n, dir){
		clearInterval(this._interval.id);

		if(!this._istransition && this._counts.current!=n){
			this._istransition=true;

			this.replace_content(this._counts.current, n, dir);
			this.transition_content(dir);
			this.focus_navigation(n);

			this._counts.current=n;

			try{window[this._callback](n);}catch(e){};
		}else{
			this.auto();
		};
	},

	complete:function(){
		this._istransition=false;

		this.complete_content();
		this.auto();
	},

	auto:function(){
		if(this._isautoplay && this._counts.max>1){
			var owner=this;

			clearInterval(this._interval.id);

			this._interval.id=setTimeout(function(){
				if(!owner._isover && !owner._ispause){
					owner.navigate(1);
				}else{
					owner.auto();
				};
			}, this._interval.sec);
		};
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-TREE-NAVIGATION
 *
 * @example
 * - /html/common/popup/popup_research.jsp
 * - /html/mypop/mypop/tab_contents.jsp
 * - /html/mypop/mypop/tab_contents2.jsp
 *
 *************************************************************************************************/
var CommonTreeNavigation=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;

		this._callback=null;

		this.reinit();
	},

	reinit:function(){
		this._callback=$(this._scope).attr('data-callback') || null;

		this.init_list();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LIST
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_list:function(){
		var owner=this;

		// 1. depth-0
		$(this._scope).find('dt').each(function(a){
			$(this).find('a').each(function(b){
				$(this)
				.data('n', a)
				.bind({
					'click':function(e){
						var n=$(this).data('n');
						var list=$(owner._scope).find('dd').eq(n);

						if($(list).is(':visible')){
							$(this).parent().attr('class', 'off');
							$(list).hide();
						}else{
							$(this).parent().attr('class', 'on');
							$(list).show();
						};
					}
				});
			});
		});

		// 2. depth-1
		$(this._scope).find('dd').each(function(a){
			/**
			 * 타이틀 클래스가 "on" 일 때만 열림
			 */
			if($(owner._scope).find('dt').eq(a).hasClass('on')){
				$(this).show();
			}else{
				$(this).hide();
			};

			$(this).find('>ul>li>a').each(function(b){
				$(this)
				.data('index', a+'-'+b)
				.bind({
					'click':function(e){
						owner.focus($(this).data('index'));
					}
				});
			});
		});
	},

	focus_list:function(index){
		var owner=this;
		var indexs=index.split('-');

		// 1. depth-0
		$(this._scope).find('dt').each(function(a){
			if(Number(indexs[0])==a){
				$(this).attr('class', 'on');
				$(this).parent().find('dd').eq(a).show();
			}else{
				$(this).attr('class', 'off');
			};
		});

		// 2. depth-1
		$(this._scope).find('dd>ul>li>a').each(function(b){
			if(String($(this).data('index'))==String(index)){
				$(this).parent().attr('class', 'on');
				owner.execute($(this).attr('data-value'));
			}else{
				$(this).parent().attr('class', 'off');
			};
		});
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	focus:function(index){
		this.focus_list(index);
	},

	execute:function(value){
		if(this._callback!=null) window[this._callback](value);
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-HEADER
 *
 *************************************************************************************************/
var CommonHeader=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(){
		this._scope=null;
		this._util=null;
		this._gnb=null;
		this._megamenu=null;
		this._bookmark=null;
		this._bookmarklayer=null;  //2016.12.07 추가
		this._top3=null;
		this._quick=null;
		this._smarts=null;
		this._search=null;
		this._location=null;
		this._share=null;

		this.reinit();
	},

	reinit:function(){
		this.init_scope();

		if(!window._common._iscrop){
			this.build_util();
			this.build_gnb();
			this.build_megamenu();
			this.build_bookmark();
			this.build_bookmarklayer();  //2016.12.07 추가
			//this.build_top3();
			this.build_search();

			/**
			 * WTS 일 때 로케이션, 공유버튼 영역 삭제
			 */
			if(_common._iswts){
				$(this._scope).css({
					'margin-bottom':'-3px'
				}).find('div[data-role=common-ui-header-bottom]').hide();
			};
			
			//var tradingLi =$('#header .header-top .family .banking'); //As-is banking
			var tradingLi =$('.familyArea>ul>li').eq(2); //TO-BE banking
			//alert(top.getMediaType());
			if((top.getMediaType() == 'BANKING/KF') || (top.getMediaType() == 'BANKING/EF')){
				$(tradingLi).hide();
				$('.familyArea>ul>li').eq(4).hide();
			}else{
				$(tradingLi).show();
			}

			this.show(true);
		}else{
			this.show(false);
		};
	},

	complete:function(){
		if(!_common._iswts){
			this.build_location(); // common.js -> method:complete() 에서 실행 시작 (2014.05.20)
			this.build_share();
		};

		$(this._scope).find('*[data-role=common-ui-header-quick-smart]').show();

//		this.build_quick();
//		this.build_smarts();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_scope:function(){
		this._scope=$('*[data-role=common-ui-header]');
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:UTIL
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_util:function(){ // AS-IS  상단오른쪽
		var scope=$(this._scope).find('*[data-role=common-ui-header-util]');

		this._util=new CommonHeaderUTIL(scope);
	},

	resize_util:function(){
		if(this._util!=null) this._util.resize();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:GNB
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_gnb:function(){ 
		var owner=this;
		var scope=$(this._scope).find('*[data-role=common-ui-header-gnb]');

		this._gnb=new CommonHeaderGNB(scope);
		this._gnb._change=Delegate.create(owner, owner.change);
	},

	collision_gnb:function(e){
//		if(this._gnb!=null) this._gnb.collision(e);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:MEGAMENU
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_megamenu:function(){
		var owner=this;
		var scope=$(this._scope).find('#nav');

		this._megamenu=new CommonHeaderMegaMenu(scope);
		this._megamenu._change=Delegate.create(owner, owner.change);
	},

	resize_megamenu:function(){
		if(this._megamenu!=null) this._megamenu.resize();
	},
	// 02.04 추가 
	collision_megamenu:function(e){
//		if(this._megamenu!=null) this._megamenu.collision(e);
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BOOKMARK
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_bookmark:function(){
		var owner=this;
		var scope=$(this._scope).find('*[data-role=common-ui-header-bookmark]');

		this._bookmark=new CommonHeaderBookmark(scope);
		this._bookmark._change=Delegate.create(owner, owner.change);
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BOOKMARKLAYER   2016.12.07 추가
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_bookmarklayer:function(){
		var owner=this;
		var scope=$(this._scope).find('*[data-role=common-ui-header-bookmark2]');

		this._bookmarklayer=new CommonHeaderBookmark(scope, 'bookmark2');
		this._bookmarklayer._change=Delegate.create(owner, owner.change);
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TOP3
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_top3:function(){
		var owner=this;
		var scope=$(this._scope).find('*[data-role=common-ui-header-top3]');

		this._top3=new CommonHeaderTop3(scope);
		this._top3._change=Delegate.create(owner, owner.change);
	},
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:QUICK
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_quick:function(){
		var scope=$(this._scope).find('*[data-role=common-ui-header-quick]');

		this._quick=new CommonHeaderQuick(scope);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SMARTS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_smarts:function(){
		var owner=this;
		var scope=$(this._scope).find('*[data-role=common-ui-header-smart]');

		this._smarts=new CommonHeaderSMART(scope);
		this._smarts._change=Delegate.create(owner, owner.change);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SEARCH
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_search:function(){
		var owner=this;
		var scope=$(this._scope).find('*[data-role=common-ui-header-search]');

		this._search=new CommonHeaderSearch(scope);
		this._search._change=Delegate.create(owner, owner.change);
	},

	collision_search:function(e){
		if(this._search!=null) this._search.collision(e);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LOCATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * method:_common.complete() 에서 실행 시작 (2014.05.20)
	 * interval 체크 삭제 적용
	 */
	build_location:function(){
		if(this._location==null){
			var owner=this;
			var scope=$(this._scope).find('*[data-role=common-ui-header-location]');

			this._location=new CommonHeaderLocation(scope);
			this._location._change=Delegate.create(owner, owner.change);
		};
	},

	collision_location:function(e){
		if(this._location!=null) this._location.collision(e);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SHARE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_share:function(){
		if(this._share==null){
			var scope=$(this._scope).find('*[data-role=common-ui-header-share]');

			this._share=new CommonHeaderShare(scope);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	collision:function(e){
		this.collision_gnb(e);
		this.collision_megamenu(e);
		this.collision_search(e);
		this.collision_location(e);
	},

	resize:function(){
		this.resize_megamenu();
		this.resize_util();
	},

	change:function(type){
		switch(String(type).toUpperCase()){
			case 'GNB':
				//this._top3.close();
				this._search.close();
				this._megamenu.close();
				this._bookmark.close();
				this._bookmarklayer.close(); //2016.12.07 추가
//				this._smarts.close();
				if(this._location!=null) this._location.close();
				break;

			case 'MEGAMENU':
				//this._top3.close();
				this._gnb.close(false);
				this._megamenu.open();
				this._bookmark.close();
				this._bookmarklayer.close(); //2016.12.07 추가
//				this._smarts.close();
				if(this._location!=null) this._location.close();
				break;
			
			case 'TOP3':
				//this._top3.open();
				this._gnb.close(false);
				this._megamenu.close();
				this._bookmark.close();
				this._bookmarklayer.close(); //2016.12.07 추가
				if(this._location!=null) this._location.close();
				break;
				
			case 'BOOKMARK':
				//this._top3.close();
				this._gnb.close(false);
				this._megamenu.close();
				this._bookmark.open();
				this._bookmarklayer.close(); //2016.12.07 추가
//				this._smarts.close();
				if(this._location!=null) this._location.close();
				break;

			//2016.12.07 추가
			case 'BOOKMARKLAYER':
				//this._top3.close();
				this._gnb.close(false);
				this._megamenu.close();
				this._bookmark.close();
				this._bookmarklayer.open();
//				this._smarts.close();
				if(this._location!=null) this._location.close();
				break;

			case 'SEARCH':
				//this._top3.close();
				this._gnb.close(false);
				this._megamenu.close();
				this._bookmark.close();
				this._bookmarklayer.close(); //2016.12.07 추가
//				this._smarts.close();
				if(this._location!=null) this._location.close();
				break;

			case 'SMART':
				this._gnb.close(false);
				this._megamenu.close();
				this._bookmark.close();
				this._bookmarklayer.close(); //2016.12.07 추가
				if(this._location!=null) this._location.close();
				break;

			case 'LOCATION':
				//this._top3.close();
				this._gnb.close(false);
				this._megamenu.close();
				this._bookmark.close();
				this._bookmarklayer.close(); //2016.12.07 추가
				this._smarts.close();
				break;
		};
	},

	show:function(bool){
		if(bool) $(this._scope).show(); else $(this._scope).hide();
	}
});


/*************************************************************************************************
*
* UI-COMMON-HEADER-TOP3 
* 2016-04-05 create
*************************************************************************************************/
var CommonHeaderTop3=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		
		this._infos=null;
		this._isopen=false;
			
		this._change;
		this.reinit();
	},

	reinit:function(){
		/**
		 * TOP 이 존재할 때만 실행
		 */
		try{
			if(top._common._type=='INDEX'){
				this.build_event();
				this.build_menus();
			};
		}catch(e){
			_common.trace('>>> EXECUTE:[COMMON] HEADER-TOP3', e);
		};
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;
		var contentsArea = $(this._scope).find('.groupWrap');
		$(this._scope).find('.igOpen').on('click', function(){
			try{owner._change('TOP3');}catch(e){};
			
		});
		
		$(this._scope).find('.igClose').on('click', function(e){
			e.stopPropagation();
			$(contentsArea).hide();
			$(".interestGroup .igOpen").focus(); //웹접근성오류 0-9 수정
		});
	},
	
	build_menus:function(){
		var popularInfo = window.popularInfo || {};
		var top3Data = popularInfo;
		if(!top3Data.MENU){
			logger.debug('popularInfo undefind');
		}
		var container = $(this._scope).find('ul');
	    var nowIdx = 0;
	    var dlPopularMenuTop3 = $(this._scope).find('dl:eq(0)');
	    var dlPopularSearchTop3 =$(this._scope).find('dl:eq(1)');
		$(container).html('');
		$(container).css({
			'position':'absolute',
			'width':'140px'
			
		});
		
		$(top3Data.MENU).each(function(){
			$(container).append('<li><a href="'+this.url+'"><var>'+this.rank+'</var>'+this.text+'</a></li>');
			});
		
		$(container).find('li').css({
			'position':'absolute',
			'top':'19px'
		});
		
		$(container).find('li:eq(0)').css({
			'top':'-1px'
		}).addClass('on');
		
		setInterval(function(){
			var _speed = 2000;
			
			$('.interestGroup').find('li').eq(nowIdx).animate({'top' : '-23px'}, _speed,function() {
			});
			
			nowIdx++;
			if(nowIdx==3){
				nowIdx =0;
			}
			
			$('.interestGroup').find('li').eq(nowIdx).css({'top': '19px'}).stop().animate({'top' : '0px'}, _speed,function() {
			});
			
		}, 6000);
		
		
		$(top3Data.MENU).each(function(_idx){
			$(dlPopularMenuTop3).append('<dd><a href="'+this.url+'"><var>'+this.rank+'</var>'+this.text+'</a></dd>');
		});
		
		$(top3Data.SEARCH).each(function(_idx){
			$(dlPopularSearchTop3).append('<dd><a href="'+this.url+'"><var>'+this.rank+'</var>'+this.text+'</a></dd>');
		});
	},
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 마우스 클릭 영역 체크
	 */
	collision:function(e){
		var bool=false;
		var pos={'left':e.pageX, 'top':e.pageY};

		if(this._isopen){
			// 1. collision-tfd
			var arect=this.get_rectange($(this._scope).find('.groupWrap'));
			var abool=(
				(pos.left>=arect.ax && pos.left<=arect.ax+arect.w) &&
				(pos.top>=arect.ay && pos.top<=arect.ay+arect.h)
			)?true:false;

			// 2. collision-container
			var brect=this.get_rectange(this._container);
			var bbool=(
				(pos.left>=brect.ax && pos.left<=brect.ax+brect.w) &&
				(pos.top>=brect.ay && pos.top<=brect.ay+brect.h)
			)?true:false;

			if(!abool && !bbool) this.close();
		};
	},
	close:function(){
		$(this._scope).find('.groupWrap').hide();
	},
	open:function(){
		$(this._scope).find('.groupWrap').show();
	}
});



/*************************************************************************************************
 *
 * UI-COMMON-HEADER-UTIL
 *
 *************************************************************************************************/
var CommonHeaderUTIL=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;

		this._interval={
			'id':null,
			'sec':1000,
			'max':0,
			'count':0
		};

		this._isnotice=false;

		this.reinit();
	},

	reinit:function(){
		/**
		 * 세션 유지 시간
		 */
		if(typeof(window.isLogin)!='undefined' && window.isLogin()){
			this._interval.max=Number(window.getSessionTimeout());
		};

		try{
			this.build_scope(); this.resize_scope();
			this.build_clock();
		}catch(e){
			_common.trace('>>> EXECUTE:[COMMON] HEADER-UTIL', e);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		var owner=this;
		var shtml='';
		var html = $('html').attr('lang');
		var popurl="";
		switch(String(window.location.hostname)){
			case 'elocal.samsungpop.com':
			popurl="local.samsungpop.com:7001";
			break;

			case 'deve.samsungpop.com':
			popurl="devk.samsungpop.com";
			break;

			case 'teste.samsungpop.com':
			popurl="testk.samsungpop.com";
			break;

			case 'local.samsungpop.com':
			popurl="elocal.samsungpop.com:7001";
			break;

			case 'devk.samsungpop.com':
			popurl="deve.samsungpop.com";
			break;

			case 'testk.samsungpop.com':
			popurl="teste.samsungpop.com";
			break;
	    };

		if(html == 'ko'){
			if(typeof(window.isLogin)=='undefined' || !window.isLogin()) {
				shtml+='<ul class="loginArea">';
				shtml+='	<li><a href="javascript:window.openMenuFromUtil(\'LOGIN-CERTMODE\');" class="login">로그인</a></li>';
				shtml+='</ul>';
			} else {
				var infos=top.getUserSession();
				var name=infos.name;
				var level=infos.status.level.replace("(", "").replace(")", "");
				var grade=infos.status.grade;
				var persCorpCd =infos.persCorpCd;
				var membership_grade=infos.membership.grade;
				var msg=$.trim(String(level)+String(grade));
				var isSmartYn = infos.isSmartYn;
				if(persCorpCd == undefined){
					persCorpCd =infos.status.persCorpCd;
				}
				shtml+='<p>';
				shtml+='	<span data-role="common-ui-header-util-clock">--:--</span> <a href="javascript:window.openMenuFromUtil(\'EXTEND-LOGIN-TIME\');">연장</a>';
				shtml+='</p>';
				shtml+='<ul class="loginArea">';
				shtml+='	<li class="member_info">';
				//스마트 고객용 아이콘
				if(isSmartYn == "Y"){
					shtml +='<a id="btn_smartlayerpopup" href="javascript:_common.nothing();" title="스마트고객 팝업 이동" onClick="$.util.openSmartCustomerLayer(\'1\');"></a>';
					$.util.getSmartCustomerLayer();
				}
				/*
				if (level != "") {
					shtml+='		<span class="grade">' + level + '</span>';
				}
				*/
				logger.debug('infos infos infos :' , infos);
				if(persCorpCd == "IN"){
					if(membership_grade.indexOf("SNI") > -1){
						shtml +='<span class="grade level5"><a href="javascript:openMenu(\'M1454329584864\',\'/ux/kor/customer/guide/workproductguide/classesTab2.do\');">SNI Honors</a></span>';
					}else if(membership_grade.indexOf("Premium") > -1){
						shtml +='<span class="grade level4"><a href="javascript:openMenu(\'M1454329584864\',\'/ux/kor/customer/guide/workproductguide/classesTab2.do\');">Honors Premium</a></span>';
					}else if(membership_grade.indexOf("Honors") > -1){
						shtml +='<span class="grade level3"><a href="javascript:openMenu(\'M1454329584864\',\'/ux/kor/customer/guide/workproductguide/classesTab2.do\');">Honors</a></span>';
					}else if(membership_grade.indexOf("우대") > -1){
						shtml +='<span class="grade level2"><a href="javascript:openMenu(\'M1454329584864\',\'/ux/kor/customer/guide/workproductguide/classesTab2.do\');">우대</a></span>';
					}else{
						shtml +='<span class="grade level1"><a href="javascript:openMenu(\'M1454329584864\',\'/ux/kor/customer/guide/workproductguide/classesTab2.do\');">일반</a></span>';
					}
				}
				shtml+='		<span class="info"><a href="javascript:window.openMenuFromUtil(\'MODIFY\');">' + infos.name + '</a><em>' + (grade == '' ? grade : '[' + grade+ ']') + '</em></span></li>';
				shtml+='	<li><a href="javascript:window.openMenuFromUtil(\'LOGOUT\');" class="logout">로그아웃</a></li>';
				shtml+='</ul>';

				//로그인 후 쿠키값 셋팅 (로그인전 최초고객/기존고객 구분)
				$.cookie("bfCustomer", "Y", {expires: 365, path:"/"});
			}
			shtml+='<ul class="etcArea">';
			shtml+='	<li><a href="javascript:window.openMenu(\'M1231757398796\');">인증센터</a></li>';
			shtml+='	<li><a href="javascript:window.openMenu(\'M1401710120030\');">투자상담</a></li>';
			shtml+='	<li><a href="https://www.samsungsecurities.co.kr" target="_blank" class="company" title="삼성증권 회사소개 홈페이지로 이동">회사소개</a></li>';
			shtml+='</ul>';
		} else if(html == 'en'){
			if(typeof(window.isLogin)=='undefined' || !window.isLogin()){
				shtml+=	'<ul class="login">\n';
				shtml+=	'	<li><a href="javascript:window.openMenuFromUtil(\'LOGIN\');"><img src="/images/eng/common/header/util_login_id.png" alt="Login"></a></li>\n';
				shtml+=	'	<li><a href="javascript:window.openMenuFromUtil(\'REGISTRY-ID\');"><img src="/images/eng/common/header/util_id.png" alt="ID Registration"></a></li>\n';
				shtml+=	'	<li id="testa" style="display:none"><a href="javascript:top.location.replace(\'http://'+popurl+'\')"  >국문</a></li>\n';

			}else{
				var infos=top.getUserSession();
				var name=infos.name;
				var level=infos.status.level;
				var grade=infos.status.grade;
				var msg=$.trim(String(level)+String(grade));
				shtml+=	'<p><span data-role="common-ui-header-util-clock">--:--</span> <a href="javascript:window.openMenuFromUtil(\'EXTEND-LOGIN-TIME\');"><img src="/images/eng/common/header/util_extend.png" alt="Extension"></a></p>\n';
				shtml+=	'<ul class="login">\n';
				shtml+=	'	<li class="member-info"><b><span data-role="common-ui-header-util-name">'+infos.name+'</span></b>'+msg+'</li>\n';
				shtml+=	'	<li><a href="javascript:window.openMenu(\'M1231759869406\');"><img src="/images/eng/common/header/util_modify.png" alt="Modify"></a></li>\n';
				shtml+=	'	<li><a href="javascript:window.openMenuFromUtil(\'LOGOUT\');"><img src="/images/eng/common/header/util_logout.png" alt="Logout"></a></li> \n';
				shtml+=	'	<li id="testa" style="display:none"><a href="/eng/sso.do?cmd=link&hostUrl='+popurl+'">국문</a></li>\n';
			};

			shtml+=	'</ul>\n';
			shtml+=	'<ul class="etc">\n';
			shtml+=	'	<li><a href="javascript:window.openMenu(\'M1231759993890\');" title="POP HTS Download"><img src="/images/eng/common/header/util_pophts.png" alt="POP HTS web"></a></li>\n';
			/*shtml+=	'	<li><a href="javascript:window.openMenu(\'M1231759960656\');"><img src="/images/eng/common/header/util_faq.png" alt="FAQ"></a></li>\n';*/
			shtml+=	'	<li><a href="https://www.samsungsecurities.com" target="_blank" title="go to English site"><img src="/images/eng/common/header/util_about.png" alt="About Us"></a></li>\n';
			shtml+=	'	<li><a href="http://www.samsungpop.com/" target="_blank" title="go to Samsungpop site"><img src="/images/eng/common/header/util_korea.png" alt="Korean"></a></li>\n';
			shtml+=	'</ul>\n';
		}

		$(this._scope).empty().html(shtml);
	},

	resize_scope:function(){
		if(typeof(window.isLogin)!='undefined' && window.isLogin() && typeof(top.getUserSession)!='undefined'){
			var scope=$(this._scope).find('span[data-role=common-ui-header-util-name]');
			var infos=top.getUserSession();
			var name=infos.name;

			if(
				$(this._scope).innerWidth()>=400 &&
				$(window).width()<1200
			){
				$(scope).empty().text(String(name).slice(0, 3)+'..');
			}else{
				$(scope).empty().text(name+'님');
			};
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CLOCK
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_clock:function(){
		if(this._interval.id!=null) clearInterval(this._interval.id);

		var owner=this;

		if(typeof(window.isLogin)!='undefined' && window.isLogin()){
			this._isnotice=false;
			this._interval.count=0;
			this._interval.id=setInterval(function(){
				owner.change_clock();
			}, this._interval.sec);
		};
	},

	change_clock:function(){
		var max=this._interval.max;
		var c=++this._interval.count;
		var d=max-c;

		var mtime=String(Math.floor(d/60));
		var stime=String(d%60);
		var tmsg=StringUtil.add_zero(mtime, 2)+':'+StringUtil.add_zero(stime, 2)+' ';

		$(this._scope).find('*[data-role=common-ui-header-util-clock]')
		.text(tmsg);

		if(d<=0){
			if(this._interval.id!=null) clearInterval(this._interval.id);

			window.openLogout('isAutoMode=Y');
		}else if(d<=60){
			if(!this._isnotice){
				this._isnotice=true;

//				window.openModal('EXTEND-LOGIN-TIME');
				_common.showDetailLayerPopup("/common/popup_changeClock.pop", "changeClock");
			};
		};
		/** 세션쿠키 변경 체크 2014-11-10 Chokwangyo*/
		try {
			if (c % 5 == 0) { // 5초에 한번 체크로 변경
				checkSessionId();
			}
		} catch (e) {}

		/** Weblogic 이슈로 인한 Request용 2014-12-17 Chokwangyo*/
		/*
		try {
			if (c % 30 == 0) { // 30초에 한번 더미 호출
				$.get("/sscommon/jsp/liveCheck.jsp");
			}
		} catch (e) {}
		*/

	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	resize:function(){
		this.resize_scope();
	},

	extension:function(){
		this.build_clock();
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-HEADER-GNB
 *************************************************************************************************/
var CommonHeaderGNB=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._menu=null;

		this._infos=null;

		this._isopen=false;
		this._isenablecollision=false;

		this._change;

		this.reinit();
	},

	reinit:function(){
		/**
		 * TOP 이 존재할 때만 실행
		 */
		try{
			if(top._common._type=='INDEX'){

				this.build_event();
			};

		}catch(e){
			_common.trace('>>> EXECUTE:[COMMON] HEADER-GNB', e);
		};
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;
		$(this._scope).find('ul[data-role=common-ui-header-gnb-open]>li>a').bind({
			'keydown':function(e){
				var scope=$(this).parent();
				var child=$(scope).find('div[data-role=common-ui-header-gnb-container]');

				switch(String(e.keyCode)){
				/**
				 * <TAB>
				 */
				case '9':
					break;

				case '13':

					if(!$(child).is(':visible')){
							$(child).show();
							owner.open(false);
					}else{
							$(child).hide();
//							owner.close(true);
//							_common.open_menu(code);
					};

					return false;
					break;
					};
			}
		});
		
		
		
		$(this._scope).find('ul[data-role=common-ui-header-gnb-open]>li>a').bind({
			'click':function(e){
				if(ValidationUtil.is_mobile()){
					
					
					if($(this).parent().hasClass('on')){
						$(this).parent().removeClass('on');
						$(this).next().hide();
						owner.close(false);
					}else{
						
						$('div.gnb_container2:visible').hide();
						$('div.gnb_container2').parent().removeClass('on');
						$(this).parent().addClass('on');
						$(this).next().show();
						owner.open(false);
					}
					
					
					
					
					return false;
				};
			}
//			'mouseleave':function(e){
//				if(!ValidationUtil.is_mobile()){
//					$(this).find('div[data-role=common-ui-header-gnb-container]').hide();
//					owner.close(false);
//					return false;
//				};
//			}
			
		});
		
		$(this._scope).find('ul[data-role=common-ui-header-gnb-open]>li>a').bind({
			
			'mouseenter':function(e){
				if(!ValidationUtil.is_mobile()){
					clearTimeout(_common._gnbDelay);
					
					var _delayTime = _common._isie ? 150 : 400; // ie 시간 분기
					var $gnbEtarget = $(e.target);
					if($('div.gnb_container2:visible').length > 0){
						
						$('div.gnb_container2:visible').hide();
						$('div.gnb_container2').parent().removeClass('on');
						$gnbEtarget.parent().addClass('on');
						$gnbEtarget.next().show();
						owner.open(false);
						
					}else{
						
						$('div.gnb_container2:visible').hide();
						$('div.gnb_container2').parent().removeClass('on');
						_common._gnbDelay = setTimeout(function(){
							$gnbEtarget.parent().addClass('on');
							$gnbEtarget.next().show();
							owner.open(false);
						}, _delayTime);
						
					}
					
					
					return false;
				};
//			},
//			'mouseleave':function(e){
//				if(!ValidationUtil.is_mobile()){
//					$(this).find('div[data-role=common-ui-header-gnb-container]').hide();
//					owner.close(false);
//					return false;
//				};
			}
			
		});	
		/* 19-02-15 : gnb 언더라인 오버 오류 관련 */
		/*$(this._scope).find('div.gnb_container2').bind({
			'mouseleave':function(e){
				if(!ValidationUtil.is_mobile()){
					clearTimeout(_common._gnbDelay);
					$(this).find('div[data-role=common-ui-header-gnb-container]').hide();
					owner.close(false);
					return false;
				};
			}
		});*/
		
		$('div[data-role=common-ui-header-gnb]').bind({
			'mouseleave':function(e){
				if(!ValidationUtil.is_mobile()){
					clearTimeout(_common._gnbDelay);
					$(this).find('div[data-role=common-ui-header-gnb-container]').hide();
					owner.close(false);
					return false;
				};
			}
		});

	},

	
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:MENUS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * build-menu
	 *
	 * @description - 메뉴생성
	 * @return	void
	 */
	build_menus:function(strMenuCode){
		try{
			if(this._infos==null){
				var owner=this;
				var MENULENGTH = 8;
				var GRID_VOLUME = 5;
				var gridTabMinus = 0; //tab 메뉴의 갯수만큼 총메뉴의 갯수에서 빼준다.
				this._menu=$(this._scope).find('li:visible > div[data-role=common-ui-header-gnb-container] > .inner');
				$(this._menu).html(""); // TODO: header.jsp 마크업과 함께 삭제
				this._infos=top.getMenuAll();
//				if(location.href.indexOf('html')!=-1){
//					this._infos=temp_getMenuAll;
//				}
				
//				
				var rows = null;
				
				/**
				 * 뱅킹일때 5개 금융상품 자산관리 퇴직연금 인터넷뱅킹 고객센터
				 */
				if(top._common._type=='INDEX'){
					if(top.getMediaType()=='BANKING/KF'){
						MENULENGTH = 6;
					};
				};
				for(var pa=0; pa<MENULENGTH; pa++){
					
					for(var a=0, atotal=this._infos[pa].child.length; a<atotal; a++){
						//대메뉴 금융상품일때, 하위 메뉴 4개씩 노출
						if(this._infos[pa].code == "M1231748547656" || this._infos[pa].code == "M1471841843568" || this._infos[pa].code == "M1264676757625" ){
							GRID_VOLUME = 4;
						}
						else {
							GRID_VOLUME = 5;
						}
						var ainfo=this._infos[pa].child[a];
						if (ainfo.tab) {gridTabMinus++; continue;} // 탭인경우 패스
						if(String(ainfo.title).indexOf('${')==-1 && String(ainfo.title).indexOf('은퇴자산관리')==-1 && String(ainfo.title).indexOf('수요예측')==-1){
							// 1. depth-0
							if(a%GRID_VOLUME-gridTabMinus==0){
								rows =$(document.createElement('div'))
								.addClass('row')
								.appendTo($(this._menu).eq(pa));	
							}
							
							var adepth=$(document.createElement('dl'))
							.attr('id', 'dl_megamenu_' + ainfo.code)
							.data('menucode', ainfo.code)
							.append('<dt><a href="javascript:window.openMenu(\''+ainfo.code+'\');" class="depth">'+$.trim(ainfo.title).replace('\\n', '<br/>')+'</a></dt>')
							.appendTo(rows);
	
	
							// 2. depth-1
							if(!ValidationUtil.is_null(ainfo.child) && ainfo.child.length>0){
								for(var b=0, btotal=ainfo.child.length; b<btotal; b++){
									var binfo=ainfo.child[b];
									if (binfo.tab) {continue;} // 탭인경우 패스
									var bhaschild=(!ValidationUtil.is_null(binfo.child) && binfo.child.length>0 && owner.notChildeTab(binfo.child))? true:false;
									var block= typeof binfo.lock != "undefined" ? binfo.lock : false;
									var bnew = typeof binfo.fresh != "undefined" ? binfo.fresh : false;
									var lockIcon = '';
									var plusIcon = '';
									var newIcon = '';	
										if(block){
											lockIcon = '<em>로그인</em>';
										}
										
										if(bhaschild){
											plusIcon = '<span>하위메뉴</span>';
										}
										
										if(bnew){
											newIcon = '<var>new</var>';
										}
									var bdepth=$(document.createElement('dd'))
									.addClass('sub')
									.data('menucode', binfo.code)
									.append('<a href="javascript:void(0);" class="depth">'+$.trim(binfo.title).replace('\\n', '<br/>')+' '+lockIcon+' '+newIcon+' '+plusIcon+'</a>')
									.appendTo($(adepth));
	
	
	
									// 3. depth-2
									if(bhaschild){
										var cdepth=$(document.createElement('ul'))
										.hide()
										.appendTo($(bdepth));
	
										for(var c=0, ctotal=binfo.child.length; c<ctotal; c++){
											var cinfo=binfo.child[c];
											if (cinfo.tab) {continue;} // 탭인경우 패스
											var clock= typeof cinfo.lock != "undefined" ? cinfo.lock : false;
											var cnew = typeof cinfo.lock != "undefined" ? cinfo.fresh : false;
											var clockIcon = '';
											var cnewIcon = '';
												if(clock){
													clockIcon = '<em>로그인</em>';
												}
												if(cnew){
													cnewIcon = '<var>new</var>';
												}
											$(document.createElement('li'))
											
											.append('<a href="javascript:window.openMenu(\''+cinfo.code+'\');"><small class="arrow">'+$.trim(cinfo.title).replace('\\n', '<br/>')+' '+clockIcon+' '+cnewIcon+' '+'</small></a>')
											.bind({
												'click':function(e){
													owner.close(false);
												}
											})
											.appendTo($(cdepth));
										};
	
									};
	
									if(bhaschild){
										$(bdepth)
										.addClass('sub')
										.find('>a').bind({
											'click':function(e){
												if($(this).parent().hasClass('on')){ // class ==> change element Open
													window.openMenu($(this).parent().data('menucode'));
													owner.close(false);
												}else{
													owner.focus($(this).parent());
												};
												return false;
											}
										});
									}else{
										$(bdepth).find('>a').bind({
											'click':function(e){
												window.openMenu($(this).parent().data('menucode'));
												owner.close(false);
												return false;
											}
										});
									};
								};
	
							}; // 2. depth-1 end
	
						}; //2. depth-0 end
					};
					if(this._infos[pa].code != "M1454292882789"){
						if((this._infos[pa].child.length-gridTabMinus)%GRID_VOLUME!=0){
							var emptyDl = GRID_VOLUME-(this._infos[pa].child.length-gridTabMinus)%GRID_VOLUME;
							for(var a=0, atotal=emptyDl; a<atotal; a++){
								rows.append('<dl></dl>');
							}
							
						}
					}
					
				}; //depth-1 new
				
				/***
				 * 자산관리 > smart Advisor topFrame 변경
				 */
				var smartAdvisorMenu =$('.familyArea>ul>li:eq(1)>.gnb_container2>.inner a');
					  smartAdvisorMenu.eq(0).parent().parent().remove();
					  smartAdvisorMenu.each(function(){
						if($(this).parent().data('menucode')!=undefined){
							$(this).attr('href','javascript:'+getMenuInfo($(this).parent().data('menucode')).url);
						}else{
							if($(this).attr('href').indexOf('openMenu')==-1){
								
								$(this).attr('href','javascript:'+getMenuInfo($(this).parent().parent().data('menucode')).url);
							}
						}
						
					});

				/**
				 * 메뉴닫기 추가
				 */	
				$(this._menu).append('<button type="button" name="" id="" value="" title="고객센터 레이어팝업 닫기" class="gnbMenuClosed"></button>');
				
			};
			var that = this;
			$(this._menu).find('.gnbMenuClosed').unbind('click').bind('click',function(e){
				e.preventDefault();
				that.close(false);
			});
		}catch(e){
			logger.error(e);

		};
	},
	
	
	notChildeTab:function(_childeNodes){
		var childeTab = false;
		
		for(var i=0, childTotal=_childeNodes.length; i<childTotal; i++){
			if(_childeNodes[i].tab==null || _childeNodes[i].tab==""){
				childeTab = true;
				break;
			}
		}
		return childeTab;
	},
	
	focus_menu:function(scope){

		$(this._menu).find('dd.sub').each(function(a){
			var ascope=$(this);
			
			if($(ascope).is($(scope))&& !($(this).find('>ul').is(':visible'))){
				$(this).find('span').addClass('dn');
				$(this).find('>ul').show();
			}else{
				$(this).find('span').removeClass('dn');
				$(this).find('>ul').hide();
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	collision:function(e){
		// 2014-10-28 adc_KWCAG2.0_메인_공통_로그인_ver1.0.pptx 4p 시작
		var pos={'left':e.pageX, 'top':e.pageY};
		
		if(this._isopen){
			var arect=this.get_rectange($('div.gnb_container2:visible')); //TODO 즐겨찾기와 충돌!!!! inner 와 버튼영역을 잡을건지? 확인
			var abool=(
				(pos.left>=arect.ax && pos.left<=arect.ax+arect.w) &&
				(pos.top>=arect.ay && pos.top<=arect.ay+arect.h)
			)?true:false;
			
			var brect=this.get_rectange($('#nav')); //메뉴선택영역
			var bbool=(
				(pos.left>=brect.ax && pos.left<=brect.ax+brect.w) &&
				(pos.top>=brect.ay && pos.top<=brect.ay+brect.h)
			)?true:false;
			
			if(!abool && !bbool) this.close(false);
		};
		// 2014-10-28 adc_KWCAG2.0_메인_공통_로그인_ver1.0.pptx 4p 끝
	},

	open:function(isfocus){
		this._isopen=true;
		this._isenablecollision=false;

		try{this._change('GNB');}catch(e){};

		this.build_menus();
		this.show(true, isfocus);
	},

	close:function(isfocus){
		this._isopen=false;

		this.show(false, isfocus);
	},
	focus:function(scope){
		this.focus_menu(scope);
	},
	show:function(bool, isfocus){
		
		if(bool){
			$(this._menu).show();
			if(isfocus) $(this._menu).find('a:first').focus();

			$(this._scope).find('a[data-role=common-ui-header-gnb-open]').hide();
			$(this._scope).find('a[data-role=common-ui-header-gnb-close]').show();
			$('body').css('overflow','auto'); // wts autoScroll
		}else{
			$('div.gnb_container2:visible').hide();
			$('div.gnb_container2').parent().removeClass('on');
			$(this._menu).hide(); 
			$(this._menu).parent().hide(); 
			this.focus_menu(false);

			$(this._scope).find('a[data-role=common-ui-header-gnb-open]').show();
			$(this._scope).find('a[data-role=common-ui-header-gnb-close]').hide();
			if(isfocus) $(this._scope).find('a[data-role=common-ui-header-gnb-open]').focus();
			$('body').css('overflow','initial'); // wts autoScrolli
		};
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-HEADER-MEGA-MENU
 *
 *************************************************************************************************/
var CommonHeaderMegaMenu=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._vscope= $(this._scope).find('div[data-role=common-ui-header-megamenu-container]');
		this._menu=null;

		
		this._infos=null;
		this._isopen=false;
			
		this._change;
		this.reinit();
	},

	reinit:function(){
		/**
		 * TOP 이 존재할 때만 실행
		 */
		try{
			if(top._common._type=='INDEX'){
				this.build_event();
			};
		}catch(e){
			_common.trace('>>> EXECUTE:[COMMON] HEADER-MEGAMENU', e);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;
		// 1. 닫기
		$(this._scope).find('a[data-role=common-ui-header-megamenu-close]').bind({
			'click':function(e){
				owner.close();
			}
		});

		// 2. 북마크
		$(this._scope).find('a[data-role=common-ui-header-megamenu-bookmark]').bind({
			'click':function(e){
				try{
					owner._change('BOOKMARK');
				}catch(e){};
			}
		});

		 //2016.12.07 추가
		// 2. 북마크 - 작은 레이어
		$(this._scope).find('a[data-role=common-ui-header-megamenu-bookmark2]').bind({
			'click':function(e){
				try{
					owner._change('BOOKMARKLAYER');
				}catch(e){};
			}
		});
		
		// 3. 오픈
		$(this._scope).find('a[data-role=common-ui-header-megamenu-open]').bind({
			'click':function(e){
				owner._change('MEGAMENU');
			}
		});
	},
	// cdi 확인해볼것 0104
	// 2014-11-20 ChoKwangyo : GNB 오류 수정 
	build_top_event:function(){
		var owner=this;

		$('.header-top > .family > li >a').on('click', function(){
			var strMenuCode = $(this).attr('id');
			var $gnbContainer2 = $('.gnb-container2');
			$gnbContainer2Dl = $gnbContainer2.find('dl');
			$gnbContainer2.show();
			$('.gnb-scrap').hide();
			owner.open(strMenuCode);
			$gnbContainer2Dl.removeClass('active');
			$("#dl_" + strMenuCode).addClass('active');
			$("#dl_" + strMenuCode).find('dt > a').focus(); /*1217 즐겨찾기 전체보기 메뉴 포커스 추가*/
		});
	},



	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:MENU
	// loofParam-prefix: a.b.c.d (1~4depth)
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_menu:function(strMenuCode){
		try{
			if(this._infos==null){
				var owner=this;
				var GRID_VOLUME = 4;
				var gridTabMinus = 0; //tab 메뉴의 갯수만큼 총메뉴의 갯수에서 빼준다.
				this._menu=$(this._vscope).find('.inner').eq(0);
				$(this._menu).html(""); // TODO: header.jsp 마크업과 함께 삭제
				
				this._infos=top.getMenuAll();
				var rows = null;
				for(var a=0, atotal=this._infos.length; a<atotal; a++){
					var ainfo=this._infos[a];
					if (ainfo.tab) {gridTabMinus++; continue;} // 탭이거나 은퇴자산,${기타메뉴 등일 경우 패스 
					if(String(ainfo.title).indexOf('${')==-1 && String(ainfo.title).indexOf('은퇴자산관리')==-1){ // 
						// 1. depth-0
						if(a%GRID_VOLUME-gridTabMinus==0){
							rows =$(document.createElement('div'))
							.addClass('row')
							.appendTo($(this._menu));	
						}
						
						var adepth=$(document.createElement('dl'))
						.attr('id', 'dl_megamenu_' + ainfo.code)
						.data('menucode', ainfo.code)
						.append('<dt><a href="javascript:window.openMenu(\''+ainfo.code+'\');" class="depth">'+$.trim(ainfo.title).replace('\\n', '<br/>')+'</a></dt>')
						.appendTo(rows);


						// 2. depth-1
						if(!ValidationUtil.is_null(ainfo.child) && ainfo.child.length>0){
							for(var b=0, btotal=ainfo.child.length; b<btotal; b++){
								var binfo=ainfo.child[b];
								var bhaschild=(!ValidationUtil.is_null(binfo.child) && binfo.child.length>0 && owner.notChildeTab(binfo.child))? true:false;

								if (binfo.tab) {continue;}	// 탭인경우 패스
								var block= typeof binfo.lock != "undefined" ? binfo.lock : false;
								var bnew = typeof binfo.fresh != "undefined" ? binfo.fresh : false;
								var lockIcon = '';
								var plusIcon = '';
								var newIcon = '';
								
									// 2depth 부터 자물쇠 표시									
									if(block){
										lockIcon = '<em>로그인</em>';
									}
									
									if(bhaschild){
										plusIcon = '<span>하위메뉴</span>';
									}
									
									if(bnew){
										newIcon = '<var>new</var>';
									}
								var bdepth=$(document.createElement('dd'))
								.addClass('sub')
								.data('menucode', binfo.code)
								.append('<a href="javascript:void(0);" class="depth">'+$.trim(binfo.title).replace('\\n', '<br/>')+' '+lockIcon+' '+newIcon+' '+plusIcon+'</a>')
								.appendTo($(adepth));


								// 3. depth-2
								if(bhaschild){
									var cdepth=$(document.createElement('ul'))
									.hide()
									.appendTo($(bdepth));

									for(var c=0, ctotal=binfo.child.length; c<ctotal; c++){
										var cinfo=binfo.child[c];
										if (cinfo.tab) {continue;}	// 탭인경우 패스
										var chaschild=(!ValidationUtil.is_null(cinfo.child) && cinfo.child.length>0 && owner.notChildeTab(cinfo.child))? true:false;
										var clock= typeof cinfo.lock != "undefined" ? cinfo.lock : false;
										var cnew = typeof cinfo.fresh != "undefined" ? cinfo.fresh : false;
										var lockIcon = '';
										var plusIcon = '';
										var cnewIcon = '';
										if(clock){
											lockIcon = '<em>로그인</em>';
										}

										if(chaschild){
											plusIcon = '<span>하위메뉴</span>';
										}
										
										if(cnew){
											cnewIcon = '<var>new</var>';
										}
										var ddepth=$(document.createElement('li'))
										.attr({
											'data-role':'common-ui-header-megamenu-last-menu'
										})
										.data('menucode', cinfo.code)
										.append('<a href="javascript:void(0);" class="depth"><small class="arrow">'+$.trim(cinfo.title).replace('\\n', '<br/>')+' '+lockIcon+' '+cnewIcon+' '+plusIcon+'</small></a>')
										.appendTo($(cdepth));
										
										/*
										 * 4depth
										 */
										if(chaschild){
											var edepth=$(document.createElement('ul'))
											.hide()
											.appendTo($(ddepth));
											
											for(var d=0, dtotal=cinfo.child.length; d<dtotal; d++){
												var dinfo=cinfo.child[d];
												if (dinfo.tab) {continue;}	// 탭인경우 패스
												var dlock= typeof dinfo.lock != "undefined" ? dinfo.lock : false;
												var dnew = typeof dinfo.lock != "undefined" ? dinfo.fresh : false;
												var dlockIcon = "";
												var dnewIcon = '';
												if(dlock){
													dlockIcon = '<em>로그인</em>';
												}
												
												if(dnew){
													dnewIcon = '<var>new</var>';
												}
												
												$(document.createElement('li'))
												.append('<a href="javascript:window.openMenu(\''+dinfo.code+'\');"><small class="arrow">'+$.trim(dinfo.title).replace('\\n', '<br/>') +' '+dnewIcon+'</small></a>')
												.bind({
												'click':function(e){
													owner.close(false);
												}
												})
												.appendTo($(edepth));
											}
											
										}
										if(chaschild){
											$(ddepth)
											.find('>a').bind({
												'click':function(e){
													    // tag a.small.span
														owner.focus($(this).parent());
													return false;
												}
											});
										}else{
											$(ddepth).find('>a').bind({
												'click':function(e){
													window.openMenu($(this).parent().data('menucode'));
													owner.close(false);
													return false;
												}
											});
										}
										
										
										
									};

								};
								if(bhaschild){
									$(bdepth)
									.addClass('sub')
									.find('>a').bind({
										'click':function(e){
												owner.focus($(this).parent());
											return false;
										}
									});
								}else{
									$(bdepth).find('>a').bind({
										'click':function(e){
											window.openMenu($(this).parent().data('menucode'));
											return false;
										}
									});
								}
									
							};

						}; // 2. depth-1 end

					}else{
						gridTabMinus++;
					}; //2. depth-0 end
				};
				var dlCount = rows.find('dl').length;
				if(dlCount%GRID_VOLUME!=0){
					var emptyDl = GRID_VOLUME - dlCount;
					for(var a=0, atotal=emptyDl; a<atotal; a++){
						rows.append('<dl></dl>');
					}
					
				}
				
				/***
				 * 자산관리 > smart Advisor topFrame 변경
				 * 자산관리 : top frame 변경  신규 자산관리 하위메뉴 로 인한 2차 코드 : 3차에 변경
				 */
				var smartAdvisorMenu =$('.gnb_container .row dt:eq(1)').parent().find('a');
					smartAdvisorMenu.each(function(){
						if($(this).parent().data('menucode')!=undefined){
							$(this).attr('href','javascript:'+getMenuInfo($(this).parent().data('menucode')).url);
						}else{
							if($(this).attr('href').indexOf('openMenu')==-1){
								
								$(this).attr('href','javascript:'+getMenuInfo($(this).parent().parent().data('menucode')).url);
							}
						}
						
					});
				
				
				
			};
		}catch(e){
			logger.debug(e);

		};
	},
	
	notChildeTab:function(_childeNodes){
		var childeTab = false;
		
		for(var i=0, childTotal=_childeNodes.length; i<childTotal; i++){
			if(_childeNodes[i].tab==null || _childeNodes[i].tab==""){
				childeTab = true;
				break;
			}
		}
		return childeTab;
	},
	
	focus_menu:function(scope){
		
		
			$(this._menu).find('dd.sub').each(function(a){
				var ascope=$(this);
				
				if($(ascope).is($(scope))&& !($(this).find('>ul').is(':visible'))){
					$(this).find('>a>span').addClass('dn');
					$(this).find('>ul').show();
				}else{
					$(this).find('span').removeClass('dn');
					$(this).find('ul').hide();
				};
			});
		
		
	},
	
	focus_menu_tail:function(scope){
		
		$(scope).siblings().find('>ul').each(function(a){
			$(this).hide();
		});
		
		if(!($(scope).find('>ul').is(':visible'))){
			$(scope).find('span').addClass('dn');
			$(scope).find('>ul').show();
		}else{
			$(scope).find('span').removeClass('dn');
			$(scope).find('ul').hide();
		}
			
			
	},
	
	

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//02.04 추가
	collision:function(e){
		// 2014-10-28 adc_KWCAG2.0_메인_공통_로그인_ver1.0.pptx 4p 시작
		var pos={'left':e.pageX, 'top':e.pageY};
		
		if(this._isopen){
			var arect=this.get_rectange($('div.gnb_container')); //TODO 즐겨찾기와 충돌!!!! inner 와 버튼영역을 잡을건지? 확인
			var abool=(
				(pos.left>=arect.ax && pos.left<=arect.ax+arect.w) &&
				(pos.top>=arect.ay && pos.top<=arect.ay+arect.h)
			)?true:false;
			
			var brect=this.get_rectange($('#nav')); //메뉴선택영역
			var bbool=(
				(pos.left>=brect.ax && pos.left<=brect.ax+brect.w) &&
				(pos.top>=brect.ay && pos.top<=brect.ay+brect.h)
			)?true:false;
			
			if(!abool && !bbool) this.close(false);
		};
		// 2014-10-28 adc_KWCAG2.0_메인_공통_로그인_ver1.0.pptx 4p 끝
	},
	
	open:function(strMenuCode){
		this._isopen=true;
		typeof strMenuCode == "undefined" ? this.build_menu() : this.build_menu(strMenuCode);
		
		this.show(true);
	},

	close:function(){
		this._isopen=false;

		this.show(false);

	},

	focus:function(scope){
		if(!$(scope).is('li')){
			this.focus_menu(scope);
		}else{
			this.focus_menu_tail(scope);
		}
		
	},

	resize:function(){
//		this.resize_menu();
	},

	show:function(bool){
		if(bool){
			$(this._scope).find('a[data-role=common-ui-header-megamenu-open]').hide();
			$(this._scope).find('a[data-role=common-ui-header-megamenu-close]').show();
			$(this._vscope).show();
			$(this._vscope).find('*:focusable:first').focus();
			$('body').css('overflow','auto'); // wts autoScrolli
		}else{
			$(this._scope).find('a[data-role=common-ui-header-megamenu-open]').show();
			$(this._scope).find('a[data-role=common-ui-header-megamenu-close]').hide();
			$(this._vscope).hide();
			$(this._vscope).find('.inner ul').hide();
			$(this._vscope).find('.dn').removeClass('dn');
			$('body').css('overflow','initial'); // wts autoScrolli
			this.clear_search();
		};
	},

	clear_search:function(){
		$('.search_result').find('strong').html('0 개');
		$('#inpMenuSearch').val('');
		$("#menuPlaceHoler").show();
		$('.search_result').find('dd').find('ul').html('<li>메뉴가 없습니다.</li>');
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-HEADER-BOOKMARK
 *
 *************************************************************************************************/
var CommonHeaderBookmark=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope, gubun){
		this._scope=scope;
		this._gubun=gubun||'';

		this._list={
			'scope':null,
			'infos':null,
			'max':null,
			'current':null
		};

		this._btns={
			'prev':null,
			'next':null
		};

		this._isopen=false;

		this._change;

		this.reinit();
	},

	reinit:function(){
		/**
		 * TOP 이 존재할 때만 실행
		 */
		try{
			if(top._common._type=='INDEX'){
				this.init_list();
				this.build_event();
			};
		}catch(e){
			_common.trace('>>> EXECUTE:[COMMON] HEADER-BOOKMARK', e);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;

		// 1. event-close
		$(this._scope).find('a[data-role=common-ui-header-bookmark-close]').bind({
			'click':function(e){
				owner.close();
			}
		});

		// 2. event-open-GNB
		$(this._scope).find('a[data-role=common-ui-header-megamenu-open]').bind({
			'click':function(e){
				try{
					owner._change('MEGAMENU');
				}catch(e){};
			}
		});

		// 3. event-prev
		this._btns.prev=$(this._scope).find('a[data-role=common-ui-header-bookmark-prev]').bind({
			'click':function(e){
				owner.navigate(-1);
			}
		});

		// 4. event-next
		this._btns.next=$(this._scope).find('a[data-role=common-ui-header-bookmark-next]').bind({
			'click':function(e){
				owner.navigate(1);
			}
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:INFOS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	load_infos:function(type, menucode){
		var owner=this;

		switch(String(type).toUpperCase()){
			case 'LIST':
				window._common.loading_area_ui($(this._scope), true);

				$.util.executeBookmark('LIST', window.getMenuCode(), function(data){
					owner.reset(data);
					owner.change(0);

					window._common.loading_area_ui($(owner._scope), false);
				});
				break;

			case 'DELETE':
				$.util.executeBookmark('DELETE', menucode, function(isexist){
					owner.load_infos('LIST');
				});
				break;
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LIST
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_list:function(){
		this._list.scope=$('*[data-role=common-ui-header-bookmark-container]');
	},

	reinit_list:function(){
		// 1. count
		$(this._scope).find('*[data-role=common-ui-header-bookmark-count]')
		.text(this._list.max)
		.parent()
		.css('display', (this._list.max>0)?'block':'none');

		// 2. navigate
		if(this._list.max>12 && ! this._gubun.contains('bookmark2')){
			$(this._btns.prev).show();
			$(this._btns.next).show();
		}else{
			$(this._btns.prev).hide();
			$(this._btns.next).hide();
		};
	},

	build_list:function(n){
		var owner=this;

		if(typeof(window.isLogin)!='undefined' && window.isLogin()){
			if(this._list.max>0){
				var count=n*12;
				var atotal=((count+6)<this._list.max)?2:1;
				var btotal=6;

				// bookmark2 일 경우 분기
				if(this._gubun.contains('bookmark2')){
					atotal = 1;
					btotal = this._list.max;
				}

				for(var a=0; a<atotal; a++){
					var acontainer=$(document.createElement('ul'))
					.css({
						'width':'49%'
					}).appendTo($(this._list.scope));
					$('.interestGroup_list ul').css('width','100%'); //2016.12.07 추가
					$('.interestGroup_list .btn_area').show(); //2016.12.07 추가
					$('.interestGroup_list .close6').removeClass('type2'); //2016.12.07 추가

					for(var b=0; b<btotal; b++){
						var binfo=this._list.infos.list[count];

						if(!ValidationUtil.is_null(binfo)){
							var bmenu=window.getMenuInfo(binfo.BkmrCd).menu;

							var bparents='';//'Home';
							for(var c=0, ctotal=bmenu.parents.length; c<ctotal; c++){
								var ctitle=bmenu.parents[c].title; bparents+=((bparents!='')?' &gt; ':'')+String($.trim(ctitle)).replace('\\n', ' ');
							};

							$(document.createElement('li'))
							.data('code', bmenu.code)
							.append('<b>'+StringUtil.add_zero(count+1, 2)+'</b>')
							.append('<p><a href="javascript:window.openMenu(\''+bmenu.code+'\');"><strong>'+String($.trim(bmenu.title)).replace('\\n', ' ')+'&nbsp;&nbsp;</strong></a><span>'+bparents+'</span></p>')

							.append('<a href="javascript:void(0);" class="delete" data-role="common-ui-header-bookmark-delete">삭제</a>')
							.appendTo($(acontainer));
						};
						count++;
					};
				};

				$(this._list.scope).find('a[data-role=common-ui-header-bookmark-delete]').each(function(d){
					$(this).bind({
						'click':function(e){
							owner.load_infos('DELETE', $(this).parent().data('code'));
						}
					});
				});
			}else{
				if($('html').attr('lang')=='ko')
				{
					$(this._list.scope).append('<p class="blank2 favN"><strong>등록된 즐겨 찾기가 없습니다. </strong><span>화면 상단의 <img src="/images/common/header/bg_scrap2.png" alt="즐겨찾기 아이콘"> 을 클릭하면<br>즐겨찾기에 추가할 수 있습니다.</span></p>');
					$('.interestGroup_list .btn_area').hide(); //2016.12.07 추가
					$('.interestGroup_list .close6').addClass('type2'); //2016.12.07 추가
				}
				else if($('html').attr('lang')=='en')
				{
					$(this._list.scope).append('<p class="blank2 favN"><em>Favorites</em> are not registered</p>');
					$('.interestGroup_list .btn_area').hide(); //2016.12.07 추가
					$('.interestGroup_list .close6').addClass('type2'); //2016.12.07 추가
				}
			};
		}else{
			if($('html').attr('lang')=='ko')
			{
				//$(this._list.scope).append('<p class="blank2 loginN"><span>자주 사용하는 메뉴를 <em>즐겨찾기</em>로 등록하여<br>쉽고 빠르게 이용하세요.<br><br></span><a href="javascript:window.openMenuFromUtil(\'LOGIN\');">[로그인]</a> 후 이용 하실 수 있습니다.</p>');
				$(this._list.scope).append('<p class="blank2 loginN"><span>자주 사용하는 메뉴를 <em>즐겨찾기</em>로 등록하여<br>쉽고 빠르게 이용하세요.<br><br></span><a href="javascript:moveBookLogin()">[로그인]</a> 후 이용 하실 수 있습니다.</p>');
				$('.interestGroup_list .btn_area').hide(); //2016.12.07 추가
				$('.interestGroup_list .close6').addClass('type2'); //2016.12.07 추가
			}
			else if($('html').attr('lang')=='en')
			{
				$(this._list.scope).append('<p class="blank2 loginN">Register <em>favorite menus.</em><br>It is quick and convenient.<br/><br/>[Login] to use it</p>');
				$('.interestGroup_list .btn_area').hide(); //2016.12.07 추가
				$('.interestGroup_list .close6').addClass('type2'); //2016.12.07 추가
			}
		};
	},

	remove_list:function(){
		$(this._list.scope).empty();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	reset:function(data){
		this._list.infos=new Object();
		this._list.infos=data;
		this._list.max=Number(data.totalCount);
		this._list.current=-1;

		this.reinit_list();
	},

	open:function(){
		this.show(true);
		this.remove_list();

		if(typeof(window.isLogin)!='undefined' && window.isLogin()){
			var owner=this;
			setTimeout(function(){
				owner.load_infos('LIST');
			}, 0);
		}else{
			this.reset({'totalCount':0});
			this.change(0);
		};
	},

	close:function(){
		this.show(false);

	},

	navigate:function(dir){
		var max=this._list.max;
		var c=this._list.current; c+=dir;

		c=(c<=0)?0:c;
		c=(c>=max-1)?max-1:c;

		this.change(c);
	},

	change:function(n){
		if(this._list.current!=n){
			this._list.current=n;

			this.remove_list();
			this.build_list(n);

			$(this._scope).find('*:focusable:first').focus();
		};
	},

	show:function(bool){
		if(bool) $(this._scope).show(); else $(this._scope).hide();
	}
});


function moveBookLogin(){
	if("$INDEX" == window.getMenuCode()){
		top.mainBookMarerOpen = true;
		window.openMenuFromUtil('LOGIN');
	}else{
		top.mainBookMarerOpen = false;
		window.openMenuFromUtil('LOGIN');
	}
}



/*************************************************************************************************
 *
 * UI-COMMON-HEADER-SMART
 *
 *************************************************************************************************/
var CommonHeaderQuick=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;

		this.reinit();
	},

	reinit:function(){
		try{
			/**
			 * 로그인 전에는 로그인으로 바로 뜅기게 설정
			 */
			if(typeof(window.isLogin)!='undefined' && !window.isLogin()){
				// 2014-11-11, 전응석 차장님 요청
//				$(this._scope).find('>li>a').each(function(a){
//					$(this).attr('href', 'javascript:window.openLogin();');
//				});
			};

			/**
			 * 뱅킹일 때는 "주식매매" 삭제
			 */
			if(top._common._type=='INDEX'){
				if(top.getMediaType()=='BANKING/KF'){
					$(this._scope).find('>li>a:first').hide();
				};
			};
		}catch(e){};
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-HEADER-SMART
 *
 *************************************************************************************************/
var CommonHeaderSMART=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._contents={
			'normal':null,
			'all':null
		};

		this._btns={
			'prev':null,
			'next':null,
			'open':null,
			'close':null
		};

		this._infos=null;

		this._istransition=false;

		this._change;

		this.reinit();
	},

	reinit:function(){
		/**
		 * TOP 이 존재할 때만 실행
		 */
		try{
			if(top._common._type=='INDEX'){
				this._infos=window.getMenuSmart();

				this.build_contents();
				this.focus_content();
				this.build_event();
				this.toggle_event();
			};
		}catch(e){
			_common.trace('>>> EXECUTE:[COMMON] HEADER-SMART', e);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;

		// 1. 이전
		this._btns.prev=$(this._scope).parent().find('a[data-role=common-ui-header-smart-prev]').bind({
			'click':function(e){
				owner.close();
				owner.transition(-1);
			}
		});

		// 2. 다음
		this._btns.next=$(this._scope).parent().find('a[data-role=common-ui-header-smart-next]').bind({
			'click':function(e){
				owner.close();
				owner.transition(1);
			}
		});

		// 3. 전체(열기)
		this._btns.open=$(this._scope).parent().find('a[data-role=common-ui-header-smart-open-contents-all]').bind({
			'click':function(e){
				try{owner._change('SMART');}catch(e){};
				owner.open();
			}
		});

		// 4. 전체(닫기)
		this._btns.close=$(this._scope).parent().find('a[data-role=common-ui-header-smart-close-contents-all]').bind({
			'click':function(e){
				owner.close(); $(owner._btns.open).focus();
			}
		});
	},

	toggle_event:function(){
		var sct=$(this._scope)[0].scrollTop;
		var sch=$(this._scope)[0].scrollHeight;

		// 1. prev
		var abool=(sct>0)?true:false;
		$(this._btns.prev).css({
			'opacity':(abool)?1:.5,
			'pointer-events':(abool)?'auto':'none'
		});

		// 2. next
		var bbool=(Number(sct+28)<sch)?true:false;
		$(this._btns.next).css({
			'opacity':(bbool)?1:.5,
			'pointer-events':(bbool)?'auto':'none'
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CONTENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_contents:function(){
		this._contents.normal=$(this._scope).find('*[data-role=common-ui-header-smart-contents]');
		this._contents.all=$(this._scope).parent().find('*[data-role=common-ui-header-smart-contents-all]');

		var owner=this;
		var acontainer=$(this._contents.normal).empty();
		var bcontainer=$(this._contents.all).find('>ul').empty();

		for(var a=0, atotal=this._infos.length; a<atotal; a++){
			var ainfo=this._infos[a];
			var acode=ainfo.MenuCd; // ainfo.code;
			var amenu=window.getMenuItem(acode); // xcms-items-array 에서 해당 메뉴에 대한 정보 취득

			if(amenu!=null){
				var amsg=String(amenu.title).replace('\\n', '');

				// 1. 일반
				$(document.createElement('li'))
				.html('<a href="javascript:window.openMenu(\''+acode+'\');" data-code="'+acode+'">'+amsg+'</a>')
				.bind({
					'focusin':function(e){
						owner.close();
					}
				})
				.appendTo($(acontainer));

				// 2. 전체
				$(document.createElement('li'))
				.html('<a href="javascript:void(0)" onclick="window.openMenu(\''+acode+'\'); $(\'a[data-role=common-ui-header-smart-close-contents-all]\').trigger(\'click\')">'+amsg+'</a>')
				.appendTo($(bcontainer));
			};
		};
	},

	show_content:function(bool){
		if(bool){
			var owner=this;

			$(this._contents.all).find('>ul>li').each(function(a){
				var ty=$(owner._contents.normal).find('>li').eq(a).position().top;

				if(ty>=0 && ty<24){
					$(this).hide();
				}else{
					$(this).show();
				};
			});

			$(this._btns.open).hide();
			$(this._btns.close).show();
			$(this._contents.all).show();
			$(this._contents.all).find('>ul>li a:focusable:first').focus();
		}else{
			$(this._btns.open).show();
			$(this._btns.close).hide();
			$(this._contents.all).hide();
		};
	},

	focus_content:function(){
		try{
			// 스마트메뉴 해당 메뉴 펼침
			var _menuCode = window.getMenuCode();

			/**
			 * 2014-11-27
			 * 최초 홈페이지에서 WTS 넘어올 경우 menuCode 가 $WTS(common.top.js, open_wts()함수 참조)로 되어있음
			 * url로 화면 구분 처리함
			 * 차후 메뉴가 변경되거나 추가되면 아래 switch 수정 필요!!!
			 * 같이 변경해야 하는 파일 : /wts/js/common/common.wts.js, open_menu() switch 수정 필요
			 * why? WTS 모드에서는 페이지 전환이 없기 때문에 open_menu() 추가 수정해야 함.
			 */
			if(_menuCode == '$WTS') {

				// 최초 홈페이지에서 WTS 넘어올 경우 처리
			    var returnUrl = location.search.substr(1);
				var rParams = null;

				returnUrl = returnUrl.split("&");

				for(var i = 0; i < returnUrl.length; i++) {
					var item = returnUrl[i].split("=");
					if(item.length > 1){
						rParams = {};
						rParams[item[0]] = decodeURIComponent(item[1]);
					}
				}

				if(rParams != null) {
					switch(rParams['screenid']) {
						case '0517':				// 관심종목
							$(this._contents.normal).find('a[data-code=M1273213902781]').focus().blur();
							break;
						case '0000':				// 주식종합
							$(this._contents.normal).find('a[data-code=M1273205502784]').focus().blur();
							break;
						case '6120':				// 주식현재가
							$(this._contents.normal).find('a[data-code=M1273213856640]').focus().blur();
							break;
						case '1401':				// 종합차트
							$(this._contents.normal).find('a[data-code=M1303710474343]').focus().blur();
							break;
					}
				}
			} else {
				$(this._contents.normal).find('a[data-code='+window.getMenuCode()+']').focus().blur();
			}

		}catch(e){};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TRANSITION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	transition:function(dir){
		if(!this._istransition){
			this._istransition=true;

			var owner=this;
			var sct=$(this._scope).scrollTop();
			var ty=sct+dir*28;

			$(this._scope)
			.stop()
			.animate({
				'scrollTop':ty
			}, 360, function(){
				owner._istransition=false;

				owner.toggle_event();
			});
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	focus:function(){
		this.focus_content();
	},

	open:function(){
		this.show_content(true);
	},

	close:function(){
		this.show_content(false);
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-HEADER-SEARCH
 *
 *************************************************************************************************/
var CommonHeaderSearch=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;
		this._tfd=null;
		this._btn=null;
		this._container=null;

		this._isopen=false;

		this._change;

		this.reinit();
	},

	reinit:function(){
		this.build_asset();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_asset:function(){
		var owner=this;

		// 1. INPUT-TEXTFILE
		this._tfd=$(this._scope).find('input[data-role=common-ui-header-search-input]').bind({
			'focusin':function(e){
				owner.open();
			},

			'keydown':function(e){
				if(e.shiftKey && e.keyCode==9){
					owner.close();
				};
			}
		});

		// 2. BUTTON-SUBMIT
		this._btn=$(this._scope).find('a[data-role=common-ui-header-search-btn]').bind({
			'keyup':function(e){
				if(!e.shiftKey && e.keyCode==9){
					owner.close();
				};
			},

			'keydown':function(e){
				if(e.shiftKey && e.keyCode==9){
					owner.open();
				};
			}
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:FRAME
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_frame:function(){
		if(this._container==null){
			var owner=this;

			this._container=$(this._scope).find('div[data-role=common-ui-header-search-container]');

			var search_chk="";

			if(_common._iseng){
				search_chk="_en";
			}else{
				search_chk="";
			}

			try{
				$(this._container).find('>iframe')
				.bind({
					'load':function(e){
						var cwindow=$(this)[0].contentWindow;

						// 1. value
						cwindow._tfd=owner._tfd;
						cwindow._btn=owner._btn;

						// 2. method
						cwindow._showSearch=function(bool){owner.show(bool);};
						cwindow._resizeSearch=function(w){owner.resize_frame(w);};

						// 3. execute-initialize
						cwindow.initSearchPage();
					}
				})
				.attr('src', '/sscommon/jsp/search'+search_chk+'/search_header_ux.jsp');
			}catch(e){
				_common.trace('>>> EXECUTE:[COMMON] HEADER-SEARCH-BUILD-FRAME', e);
			};
		};
	},

	active_frame:function(bool){
		if(this._container!=null){
			try{
					$(this._container).find('>iframe')[0].contentWindow.activatePage(bool);
			}catch(e){
				this.show(false);
			};
		}else{
			this.show(false);
		};
	},

	resize_frame:function(w){
		/**
		 * 164 : input-width
		 */
		//var tx=-172;//164-w; tx=Math.max(tx, -172);
		var tw=Math.max(Number(w), 335);

		$(this._container)
		.css({
			//'left':tx+'px',
			'width':tw+'px'
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 마우스 클릭 영역 체크
	 */
	collision:function(e){
		var bool=false;
		var pos={'left':e.pageX, 'top':e.pageY};

		if(this._isopen){
			// 1. collision-tfd
			var arect=this.get_rectange(this._tfd);
			var abool=(
				(pos.left>=arect.ax && pos.left<=arect.ax+arect.w) &&
				(pos.top>=arect.ay && pos.top<=arect.ay+arect.h)
			)?true:false;

			// 2. collision-container
			var brect=this.get_rectange(this._container);
			var bbool=(
				(pos.left>=brect.ax && pos.left<=brect.ax+brect.w) &&
				(pos.top>=brect.ay && pos.top<=brect.ay+brect.h)
			)?true:false;

			if(!abool && !bbool) this.close();
		};
	},

	open:function(){
		this.build_frame();
		this.active_frame(true);
		this.show(true);

		try{this._change('SEARCH');}catch(e){};
	},

	close:function(){
		this.show(false);
		this.active_frame(false);
	},

	show:function(bool){
		if(bool) $(this._container).show(); else $(this._container).hide(); this._isopen=bool;
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-HEADER-LOCATION
 *
 *************************************************************************************************/
var CommonHeaderLocation=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;

		 // 2014-10-10 UI-COMMON-HEADER-LOCATION
		this._menu=null;
		this._infos=null;
		this._widths={
			'h':36
		};
		this._isopen=false;
		this._isenablecollision=false;
		this._token = 0;
		// 2014-10-10 UI-COMMON-HEADER-LOCATION

		this._change;

		this.reinit();
	},

	reinit:function(){
		/**
		 * TOP 이 존재할 때만 실행
		 */
		try{
			if(top._common._type=='INDEX'){
				this.build_scope();
			};
		}catch(e){
			_common.trace('>>> EXECUTE:[COMMON] HEADER-LOCATION', e);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		try{
			var owner=this;
			var code=_common.get_menucode();

			if(code!='$INDEX'){
				var info=window.getMenuInfo(code, null).menu;
				var menus=new Array();
				/**
				 * ${기타메뉴} 케이스일 때 해당 하는 메뉴 이외에는 찾지 않는다.
				 */
				if(info.parents!=null && info.parents.length>0){
					if(String(info.parents[0].title).indexOf('${')==-1){
						menus=info.parents.concat();
					};
				};
				menus.push(info);
				
				for(var a=0, atotal=menus.length; a<atotal; a++){
					var ainfo=menus[a];
					if (ainfo.tab) {
						owner.build_tabParent(ainfo.code);
						continue;
					} //  같은 depth의 tab이 없는 메뉴를 찾아서 타이틀로 등록
					$(document.createElement('li'))
					.append($(document.createElement('a'))
						.attr({
							'data-role':'common-ui-header-location-title',
							'data-menu-code':ainfo.code,
							'href':'javascript:void(0);'
						})
						.html(String(ainfo.title).replace('\\n', ' '))
						.data('n', a)
						.bind({
							'click':function(e){
								owner.toggle($(this).data('n'));
							}
						})
					)
					.append($(document.createElement('div'))
						.data('menucode', ainfo.code)
						.attr({
							'class':'sublist',
							'data-role':'common-ui-header-location-layer'
						})
						.css({
							'left':((a==0)?0:-11)+'px'
						})
						.append($(document.createElement('ul')))
						.hide()
					)
					.appendTo($(this._scope));
				};
			};
		}catch(e){};
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TAB - Parent - Layer 
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * tab 메뉴 일경우 탭이 아닌 같은 depth 의 노드가 parent 메뉴가 되어야 함. 
	 */
	build_tabParent:function(infoCode){
		
		var siblingMenu = getMenuInfo(infoCode).menu.parents[getMenuInfo(infoCode).menu.parents.length-1];
		var ainfo =null;
		var owner = this;
		var aTabIdx = getMenuInfo(infoCode).menu.parents.length;
		
		for(var a=0, atotal=siblingMenu.child.length; a<atotal; a++){
			// tab 아닌 메뉴 저장 only one
			if (!siblingMenu.child[a].tab) {
				ainfo = siblingMenu.child[a];
			}
			//자신의 순번까지 검색
			if(infoCode ==siblingMenu.child[a].code ){
				//console.log('코드로 검색 first Tab=='+siblingMenu.child[a].title);
				break;
			}
		}
		$(document.createElement('li'))
		.append($(document.createElement('a'))
			.attr({
				'data-role':'common-ui-header-location-title',
				'data-menu-code':ainfo.code,
				'href':'javascript:void(0);'
			})
			.text(String(ainfo.title).replace('\\n', ' '))
			.data('n', aTabIdx)
			.bind({
				'click':function(e){
					owner.toggle($(this).data('n'));
				}
			})
		)
		.append($(document.createElement('div'))
			.data('menucode', ainfo.code)
			.attr({
				'class':'sublist',
				'data-role':'common-ui-header-location-layer'
			})
			.css({
				'left':((a==0)?0:-11)+'px'
			})
			.append($(document.createElement('ul')))
			.hide()
		)
		.appendTo($(this._scope));
		
	},
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LAYER
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_layer:function(scope){
		var code=$(scope).data('menucode');
		var infos=top.getMenuLocation(code);
		var container=$(scope).find('>ul');
		var pf = String(navigator.platform).toLowerCase();
		var ua = navigator.userAgent;
		var isMobile = false;

		if(ua.match(/iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i)!=null ||
		   ua.match(/LG|SAMSUNG|Samsung/)!=null){
				isMobile=true;
				//userAgent로 모바일 필수 추가 체크
				window.extraMobileCheck();
			}

		for(var a=0, atotal=infos.length; a<atotal; a++){
			var ainfo=infos[a];
			
			if (ainfo.tab) {continue;} // 탭인경우 패스
			/**
			 * top.getMenuLocatio 에서 이미 처리 (중복처리)
			 */
			if(String(ainfo.icon).toUpperCase()!='S' && String(ainfo.title).indexOf('${')==-1){
				/* // 2014-10-10 UI-COMMON-HEADER-LOCATION
				$(document.createElement('li'))
				.html('<a href="javascript:window.openMenu(\''+ainfo.code+'\');"><span>'+String(ainfo.title).replace('\\n', '')+'</span></a>')
				.appendTo($(container));
				*/

				//$(container).append(this.build_menu_child(ainfo, a, (a==0)?true:false, (a==atotal-1)?true:false)); // 2014-10-10 UI-COMMON-HEADER-LOCATION
				// OS에 따른 분기 2014113 (os에 따른 조회전용/공동인증가능 login페이지에 따른 분기)
				if( (pf.indexOf('macintel')!=-1 || pf.indexOf('linux i686')!=-1 || pf.indexOf('linux armv7l')!=-1 || pf.indexOf('linux')!=-1) && !isMobile ){
					//linux, mac
					if(ainfo.code != 'M1231762522406'){
						$(container).append(this.build_menu_child(ainfo, a, (a==0)?true:false, (a==atotal-1)?true:false)); // 2014-10-10 UI-COMMON-HEADER-LOCATION
					}
				}else{
					//window
					if(ainfo.code != 'M1414575979892'){
						$(container).append(this.build_menu_child(ainfo, a, (a==0)?true:false, (a==atotal-1)?true:false)); // 2014-10-10 UI-COMMON-HEADER-LOCATION
					}
				}
				
				//자산관리
				if(ainfo.title=="자산관리"){
					$(container).find('li[data-code='+ainfo.code+']').data('advisor',true);
				}
			};
		};
		/*
		$(document.createElement('div'))
		.addClass('prf_wrap_over_l')
		.html('<iframe src="/blank.html" width="150%" height="100%" frameborder="0"></iframe>')
		.appendTo($(scope));
		*/
	},

	/**
	 * build-menu-child
	 *
	 * @description - 하위메뉴생성
	 * @param	{Object} info
	 * @param	{Number} index - 순서
	 * @param	{Boolean} isfirst - 처음 요소 여부
	 * @param	{Boolean} islast - 마지막 요소 여부
	 * @return	{DOM} <li>
	 */
	build_menu_child:function(info, index, isfirst, islast){
		var owner=this;
		var lock= typeof info.lock != "undefined" ? info.lock : false;
		var lockIcon = "";
			if(lock && info.depth>2){ //3depth 부터 자물쇠
				lockIcon = '<em>로그인</em>';
			}
		var scope=$(document.createElement('li'))
		.data('index', index)
		.data('info', info)
		.data('ishaschild', false)
		.attr({
			'data-code':info.code
		})
		.bind({
//			'mouseenter':function(e){
//				if(!ValidationUtil.is_mobile()){
//					owner.focus_menu(true, $(this));
//					return false;
//				};
//			},
//
//			'mouseleave':function(e){
//				if(!ValidationUtil.is_mobile()){
//					owner.focus_menu(false, $(this));
//				};
//			}
		});

		var title=$(document.createElement('a'))
		.attr({
			'data-role':'common-ui-header-gnb-menu',
			'href':'javascript:_common.nothing();'
		})
		.css({
			//'color':tcolor, // 임시용
			'width':(this._widths.w-35)+'px'
		})
		.html('<span>'+String(info.title).replace('\\n', ' ')+'</span>'+lockIcon)
		.bind({
			'mousedown':function(e){
				var scope=$(this).parent();
				var child=$(scope).find('>ul');
				var code=$(scope).data('info').code;
				var isSmart = $(scope).data('advisor');
				var ishaschild=$(scope).data('ishaschild');
				var ismobile=ValidationUtil.is_mobile();
				/* // 2014-11-13 Mobile 오류
				if(ismobile && ishaschild){
					if(!$(child).is(':visible')){
						owner.focus_menu(true, $(scope));
					}else{
						owner.close(false);
						_common.open_menu(code);
					};
				}else{
					owner.close(false);
					_common.open_menu(code);
				}; */

				// 2014-11-13 Mobile 오류 시작
				if(ishaschild){
					if(!$(child).is(':visible')){
						owner.focus_menu(true, $(scope));
					}else{
						owner.close(true);
						_common.open_menu(code);
						/***
						 * 자산관리 > smart Advisor topFrame 변경
						 * 자산관리 : top frame 변경  신규 자산관리 하위메뉴 로 인한 2차 코드 : 3차에 변경
						 */
						 /*
						if(isSmart){
							var convertUrl = getMenuInfo(code).url.replace('top.location.href=', '').replace(/'/g, '');
							top.location.href = convertUrl;
						}else{
							_common.open_menu(code);
						}	*/
					};
				}else{
					owner.close(true);
					_common.open_menu(code);
					/***
					 * 자산관리 > smart Advisor topFrame 변경
					 */
					 /*
					if(isSmart){
						var convertUrl = getMenuInfo(code).url.replace('top.location.href=', '').replace(/'/g, '');
						top.location.href = convertUrl;
					}else{
						_common.open_menu(code);
					}	*/
				//	_common.open_menu(code);
				};
				return false;
				// 2014-11-13 Mobile 오류 끝
			},

			'keydown':function(e){
				var scope=$(this).parent();
				var child=$(scope).find('>ul');
				var code=$(scope).data('info').code;
				var ishaschild=$(scope).data('ishaschild');

				switch(String(e.keyCode)){
					/**
					 * <TAB>
					 */
					case '9':
						break;

					case '13':
						if(ishaschild){
							if(!$(child).is(':visible')){
								owner.focus_menu(true, $(scope));
							}else{
								owner.close(true);
								_common.open_menu(code);
							};
						}else{
							owner.close(true);
							_common.open_menu(code);
						};
						return false;
						break;
				};
			},
			'mouseenter':function(e){
                if(!ValidationUtil.is_mobile()){
                    clearTimeout(owner._token);
                    owner.focus_menu(true, $(scope));
                    return false;
                };
            },

            'mouseleave':function(e){
                if(!ValidationUtil.is_mobile()){
                    owner._token = setTimeout(function(){
                        //common-ui-header-location-layer
                        var divLayer = $('div[data-role=common-ui-header-location-layer]').find('>ul>li.on');
                        divLayer.find('>a').removeClass('focus');
                        divLayer.attr('class','off');
                     }, 50);
                 //   owner.focus_menu(false, $(scope)); //  사용않함
                };
            }
		})
		.appendTo($(scope));

		if(info.child.length>0 && info.depth<=4){
			$(scope).find('>a').addClass('arrow');

			var container=$(document.createElement('ul'))
			.css({
				'display':'none',
				'position':'absolute',
				'background-color':'#fff',
				'left':(this._widths.w)+'px',
				'z-index':'9999' // 2014-10-08 GNB iframe
			})
			.appendTo(
				$(scope)
				.data('ishaschild', true)
			);
			/*
			// 2014-10-08 GNB iframe 시작
			//alert(gnbNum);

			var gnbFrame= $(document.createElement('div'))
			.addClass('gnb_frame')
			.css({
				'display':'none',
				'position':'absolute',
				'left':(this._widths.w)+'px',
				'width':'160px',
				'z-index':'1'
			})
			.html('<iframe src="/blank.html" width="100%" height="100%" frameborder="0"></iframe>')
			.appendTo($(scope));
			// 2014-10-08 GNB iframe 끝
			*/

			for(var a=0, atotal=info.child.length; a<atotal; a++){
				var ainfo=info.child[a];
				if (ainfo.tab) {continue;} // 탭인경우 패스
				/**
				 * 스마트 메뉴는 안그려줌
				 * xcms.manager.js > get_infos_child_depth()에서 실행
				 * 여기선 한번 더 체크
				 */
				if(String(ainfo.icon).toUpperCase()!='S'){
					$(container).append(this.build_menu_child(ainfo, a, (a==0)?true:false, (a==atotal-1)?true:false));
				};
			};
		};

		return scope;
	},

	/**
	 * focus-menu
	 *
	 * @description -  메뉴 포커스 변경
	 * @param	{Boolean} bool
	 * @param	{DOM} scope - <li>
	 * @return	void
	 */
	focus_menu:function(bool, scope){
		var clist=$(scope).find('>ul');
		var frame=$(scope).find('>.gnb_frame');
		var width = $(scope).outerWidth();
		var height = $(scope).outerHeight();
		var clistWidth = $(clist).outerWidth();
		var clistHeight = $(clist).outerHeight();
		var mHeight = $(scope).parent().outerHeight();

		var momLi = $(scope).parent().find('>li').length;
		var clistLi = $(clist).find('>li').length;
		var sNum = $(scope).index();




		if(sNum == 0){
			var cty=0;
		}else{
			if(momLi/2 < clistLi){
				var cty=-height;
			}else{
				var cty=0;
			}
		}



		if(bool == true){
			 // 2014-11-13 Mobile 오류 시작
			$(clist).css({
				'top':cty+'px',
				'left':width-2+'px'
			});
//			if(!ValidationUtil.is_mobile()){
//				$(clist).show();
//				$(scope).find('>a').addClass('focus');
//			} else {
                $('.on>a').removeClass('focus');
				$('li.off li').removeClass('on');
				$(scope).siblings().find('>a').removeClass('focus');
				$('.sublist .arrow').removeClass('focus');
				$(scope).attr('class','on').siblings('li').attr('class','off');
				$('.on>a').addClass('focus');
//			}
			 // 2014-11-13 Mobile 오류 끝
		}else{
		    //

		    setTimeout(function(){
            	//common-ui-header-location-layer
            	var divLayer = $('div[data-role=common-ui-header-location-layer]').find('>ul>li.on');
            	divLayer.find('>a').removeClass('focus');
            	divLayer.attr('class','off');
             }, 500);

//			$(clist).hide();
//			$(frame).hide();
//			$(scope).find('>a').removeClass('focus');
		}
	},

	resize_layer:function(scope){
		if(ValidationUtil.is_null($(scope).data('isapply-resize'))){
			$(scope)
			.data('isapply-resize', true)
			.css({
				'width':'1000px'
			});

			var maxw=100;

			$(scope).find('>ul>li>a>span').each(function(a){
				maxw=Math.max(Number($(this).innerWidth())+45, maxw);
			});

			$(scope).css({
				'width':Math.round(maxw)+'px'
			});
		};
	},

	toggle_layer:function(n){
		var owner=this;

		$('.sublist li').attr('class','off'); // 2014-11-13 Mobile 오류
		$('.sublist .arrow').removeClass('focus'); // 2014-11-13 Mobile 오류
		
		// 1. title
		$(this._scope).find('*[data-role=common-ui-header-location-title]').each(function(a){
			if(a==n) $(this).addClass('focus'); else $(this).removeClass('focus');
			
		});

		// 2. layer
		$(this._scope).find('*[data-role=common-ui-header-location-layer]').each(function(b){
			if(n==b){
				if(!$(this).is(':visible')){
					/**
					 * 열렸을 때만 생성
					 */
					if(ValidationUtil.is_null($(this).data('isapply'))){
						$(this).data('isapply', true);

						owner.build_layer($(this));
					};

					$(this).show(); owner.resize_layer($(this));

					try{owner._change('LOCATION');}catch(e){};
				}else{
					$(this).hide();
				};
			}else{
				$(this).hide();
			}
		});
	},

	close_layer:function(){
		$(this._scope).find('*[data-role=common-ui-header-location-layer]').each(function(a){
			$(this).hide();
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	collision:function(e){
		var pos={'left':e.pageX, 'top':e.pageY};
		var layer=$(this._scope).find('*[data-role=common-ui-header-location-layer]:visible');

		if($(layer).length>0){
			var arect=this.get_rectange(layer);

			if(
				(pos.left>=arect.ax && pos.left<=arect.ax+arect.w) &&
				(pos.top>=arect.ay && pos.top<=arect.ay+arect.h)
			){
				// 선택 영역안에서 클릭
			}else{
				$(layer).hide();
			};
		};
	},

	toggle:function(n){
		this.toggle_layer(n);
	},

	close:function(){
		this.close_layer();
	}
});







/*************************************************************************************************
 *
 * UI-COMMON-HEADER-SHARE
 *
 *************************************************************************************************/
var CommonHeaderShare=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;

		if(typeof(window.isLogin)!='undefined' && window.isLogin()){
			this.load_infos('EXIST');
		}else{
			this.reinit(false);
		};
	},

	reinit:function(isexist){
		/**
		 * TOP 이 존재할 때만 실행
		 */
		try{
			if(top._common._type=='INDEX'){
				this.build_scope();
				this.focus_scope(isexist);
			};
		}catch(e){
			_common.trace('>>> EXECUTE:[COMMON] HEADER-SHARE', e);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:INFOS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	load_infos:function(type){
		var owner=this;

		switch(String(type).toUpperCase()){
			case 'EXIST':
				$.util.executeBookmark('EXIST', window.getMenuCode(), function(isexist){
					owner.reinit(isexist);
				});
				break;

			case 'INSERT':
				window.openLoading();

				$.util.executeBookmark('INSERT', window.getMenuCode(), function(isexist){
					owner.focus_scope(isexist); window.closeLoading();
				});
				break;

			case 'DELETE':
				window.openLoading();

				$.util.executeBookmark('DELETE', window.getMenuCode(), function(isexist){
					owner.focus_scope(isexist); window.closeLoading();
				});
				break;
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		var owner=this;

		$(this._scope).find('>a:first')
		.bind({
			'click':function(e){
				if(typeof(window.isLogin)!='undefined' && window.isLogin()){
					if($(this).hasClass('focus')){
						owner.load_infos('DELETE');
					}else{
						owner.load_infos('INSERT');
					};
				}else{
					if( top.getMediaType() == 'EF' ){
						alert('It is available after login.');
					}else{
						alert('로그인 후 이용 가능 합니다.');
					}
				};
			}
		});
	},

	focus_scope:function(isexist){
		var scope=$(this._scope).find('>a:first');

		if(isexist) $(scope).addClass('focus'); else $(scope).removeClass('focus');
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-FOOTER
 *
 *************************************************************************************************/
var CommonFooter=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(){
		this._scope=null;

		this._floating=null;

		this.reinit();
	},

	reinit:function(){
		this.build_scope();

		if(!window._common._iscrop){
			this.show(true);
			this.build_floating();
		}else{
			this.show(false);
		};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		this._scope=$('*[data-role=common-ui-footer]');
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:FLOATING
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_floating:function(){
		var scope=$(this._scope).find('*[data-role=common-ui-footer-floating]');

		this._floating=new CommonFooterFloating(scope);
	},

	scroll_floating:function(e, isreset){
		if(this._floating!=null) this._floating.move(isreset);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	scroll:function(e, isreset){
		this.scroll_floating(e, isreset);
	},

	show:function(bool){
		if(bool) $(this._scope).show(); else $(this._scope).hide();
	}
});






/*************************************************************************************************
 *
 * UI-COMMON-FOOTER-FLOATING
 *
 *************************************************************************************************/
var CommonFooterFloating=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;

		this._interval={
			'id':null,
			'sec':500
		};

		this.reinit();
	},

	reinit:function(){
		this.build_event();
		this.move();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;

		$(this._scope).find('a:last').bind({
			'click':function(e){
				$(owner._scope).hide();
			}
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	move:function(isreset){
		var owner=this;

		if(isreset){
			$(this._scope).stop().css('bottom', '0px');
		}else{
			$(this._scope).stop();
		};

		if(this._interval.id!=null) clearTimeout(this._interval.id);

		this._interval.id=setTimeout(function(){
			var bscope=$('html, body')[0];
			var d=bscope.scrollHeight-bscope.clientHeight;
			var sct=$(window).scrollTop();
			var zv=owner.get_zoom_ratio();
			var miny=40;
			var ty=d-sct;

			ty-=205;
			ty=(ty<=miny)?miny:ty; ty/=zv;

			$(owner._scope).stop().animate({
				'bottom':ty+'px'
			}, 360);
		}, this._interval.sec);
	}
});

/*************************************************************************************************
*
* UI-COMMON-MORE-BOTTON (더보기/닫기)
*
*************************************************************************************************/
var CommonMoreBotton=CommonUI.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		this._scope=scope;

		this.reinit();
	},

	reinit:function(){
		this.build_scope();
		this.build_event();
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		this._scope=$('.unellipsis');
	},
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;
		
		
		$(this._scope).each(function(_index){
			var thatIdx = _index;
			if($(this).hasClass('close')){

			$(this).on('click', function(){
				$(owner._scope).eq(thatIdx-1).next().hide();
				$(owner._scope).eq(thatIdx-1).show();
				$(owner._scope).eq(thatIdx-1).focus();
			});
			 
			}else{
				$(this).next().hide();
				$(this).on('click', function(){
					$(this).next().show();
					$(this).hide();
					$(owner._scope).eq(thatIdx+1).focus();
				});
			}
		});
		
	}

});


/*************************************************************************************************
*
* UI-COMMON-PlACEHOLDER-LABEL (placeHolder : label , input)
* hide => .addClass("hidden");
* show => .removeClass("hidden");
*************************************************************************************************/
var CommonPlaceholderLabel=CommonUI.extend({
	

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){
		
		this._scope=scope;

		this.reinit();
	},

	reinit:function(){
		this.build_scope();
		this.build_event();
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_scope:function(){
		this._scope=$('.placeHolder_input'); // 공통 CSS (placeHolder_input 사용중)

	},
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_event:function(){
		var owner=this;
//			$(owner._scope).find('label').on({
//				"click focusin":function(){	$(this).hide();	},
//				"focusout":function(){	ValidationUtil.is_null($(this).val()) ? $(this).show():'';		}	
//			});
			//value 있을경우 label 제거
			$(owner._scope).find('input').each(function(a){
				ValidationUtil.is_null($(this).val().trim()) ? '':$(this).prev("label").addClass("hidden");
				$(this).removeAttr('title'); //접근성
				//$(this).attr('title',$(this).prev("label").text());
			});
		
			$(owner._scope).find('input').on({
				"click focusin":function(){	$(this).prev("label").addClass("hidden");	},
				"change":function(){	ValidationUtil.is_null($(this).val().trim()) ? '':$(this).prev("label").addClass("hidden"); },
				"focusout":function(){	ValidationUtil.is_null($(this).val().trim()) ? $(this).prev("label").removeClass("hidden"):''; }
			});
		
	}

});



/*************************************************************************************************
*
* CommonMobileKeyPad
* 계좌 비밀번호 PC일경우, Pad일 경우로 나뉨
* 기본 클래스 = placeHolder_input pw_box , Pad일 경우 멀티 클래스 = placeHolder_input pw_box access_code
* Pad일 경우(JS처리)
* access_code를 사용할경우 , input width가 변경(-40px), 가상키패드 생성됨
*slip클래스와 access_code를 사용할경우 , input width가 변경(-30px), 가상키패드 생성됨
*************************************************************************************************/
var CommonMobileKeyPad=CommonUI.extend({


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(scope){

		this._scope=scope;
        this.divsionPadding = 45;
        if($(this._scope).hasClass('slip')){
            this.divsionPadding = 35;
        }
		this.reinit();
	},

	reinit:function(){
        if($(this._scope).find('button.btnKeyPad').length==0){
               this.build_key_pad();
        }
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SCOPE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_key_pad:function(){
	    var inputElemnt = $(this._scope).find('input').eq(0);
	    inputElemnt = inputElemnt.width((inputElemnt.width()-this.divsionPadding));
        inputElemnt.after('<button type="button" class="btnKeyPad">가상키패드</button>');
	}


});


/*************************************************************************
* SSP (samsungpop) : util 통합대상
* modalPopup UI : 포지셔닝
* @cssClass use : .modalPop sampop (show/hide) > mbg (background Layer: black) > popSection (business layer)
*
*
* sample : SSP.modalView.centerBox($('#modalPopInfo'),$('.creatAccount'));
*************************************************************************/

var SSP = SSP || {};

	(function($){
		'use strict';
		var modalView = {
			_scope : null
		};
		var mv = modalView;

		mv.init = function(){
			//닫기 버튼
			$('#modalClose', '.modalClose').click(function(){
				$(".modalPop").hide();
				if($('.modalPop:visible').length < 1){
					$("body").css({'overflow': 'auto'});
				   }
			});
		};

		// 레이어 닫힘처리
		mv.boxClose = function(_tempObj){

			var $closeTarget = $(_tempObj).data("modalViewFocusItem");

		    $(_tempObj).hide();
			// 랜딩페이지를 iframeLayer 로 전환 사용 할경우 wrap 이 없음.
			if($('.modalPop:visible').parent('body').length > 0){
			   $("body").css({'overflow': 'auto'});
			}
			// modalPop == 팝업
			if($('.modalPop:visible').length < 1){
			$("body").css({'overflow': 'auto'});
			}

			if($closeTarget == undefined || $closeTarget == ''){
				logger.debug('######################### SSP.modalView.boxClose : 포커스 미지정  ############################');
			}else if(typeof $closeTarget.focus != "function"){
				logger.debug('######################### showDetailLayerClose : 포커스 (정상적인 타게팅 필요)  ############################');
			}else{
				logger.debug('######################### SSP.modalView.boxClose : 포커스 타게팅  ############################');
				logger.debug($closeTarget);
				$closeTarget.focus();
			}
		}
		// centerBox 팝업박스 중앙 정렬
		mv.centerBox = function(_tempObj,_this){

			$(_tempObj).data("modalViewFocusItem",_this).end();
			var $closeTarget = $(_tempObj).data("modalViewFocusItem");
			if($closeTarget == undefined || $closeTarget == ''){
				logger.debug('######################### SSP.modalView.centerBox 접근성 위반 : 포커스 미지정 ( _this 정보 필요 ) ############################');
			}else{
				logger.debug('######################### SSP.modalView.centerBox : 포커스 타게팅  ############################');
				logger.debug($closeTarget);
			}

			$(_tempObj).show();
			if($(_tempObj).hasClass('modalPop')){
				$(_tempObj).css({'height' : $(window).outerHeight()+$(window).scrollTop(),'overflow-y': 'hidden'});
			}else{
				$(_tempObj).find('.modalPop:eq(0)').css({'height' : $(window).outerHeight()+$(window).scrollTop(),'overflow-y': 'hidden'});
			}
			$("body").css({'overflow': 'hidden'});
			var popSection = $(_tempObj).find('.popSection');//$('.modalPop:visible').find('.popSection');
			var fixBox = $(document.createElement('div')).css({
						'width':'100%'
						,'height':$(window).height()
						,'left':0
						,'top':0
						,'position':'fixed'
						,'overflow-y':'auto'
			}).addClass('fixBox');

			/**
			 * showDetailLayerPopup  이후 사용할경우 z-index 문제
			 */
			var showDetailLayerZindex =  $('.resizeDummy').parent().css('zIndex')
			$(_tempObj).css('zIndex',showDetailLayerZindex);

			popSection.css({
				'position':'absolute',
				'left':'50%',
				'margin-left': $(popSection).outerWidth() / -2
			//	'top': $(window).scrollTop()
			});
			/**
			* fixBox 분기
			**/
			if($(_tempObj).find('.fixBox').length > 0){
				$(_tempObj).find('.fixBox').css({
						'width':'100%'
						,'height':$(window).height()
						,'left':0
						,'top':0
						,'position':'fixed'
						,'overflow-y':'auto'
			   })
			}else{
				popSection.wrap(fixBox);
			}
			$('body').css('overflow','hidden');

			$(_tempObj).find('.closeBtn').off('click').on('click',function(){
				$(_tempObj).css({'height' : '','overflow': 'auto'});
				$("body").css({'overflow': 'auto'});
				$(_tempObj).hide();

				if($closeTarget == undefined){
					logger.debug('######################### SSP.modalView  .closeBtn : 포커스 미지정  ############################');
				}else{
					logger.debug('######################### SSP.modalView  .closeBtn : 포커스 타게팅  ############################');
					logger.debug($closeTarget);
					$closeTarget.focus();
				}

			});

			//포커스		// 2016.06.13 gp.lee 날짜 input 에는 포커스 이동 안하도록 수정
			if( $(_tempObj).find('input').not('input:hidden').eq(0).length
				&& $(_tempObj).find('input').not('input:hidden').not('input[data-role=common-input-month-date]').eq(0).length
				&& $(_tempObj).find('input').not('input:hidden').not('input[data-role=common-input-date]').eq(0).length ){
				//$(_tempObj).find('input').not('input:hidden').eq(0).focus();
				$(_tempObj).find('.popSection').attr('tabindex',0).focus();
			}else{
				$(_tempObj).find('.popSection').attr('tabindex',0).focus();
			}

		};

		mv.init();
		SSP.modalView = mv;
}($));


/*************************************************************************
* modalPopup UI : 포지셔닝   ( CP 용)
* @cssClass use : .modalPop sampop (show/hide) > mbg (background Layer: black) > popSection (business layer)
*
*
* sample : SSP.modalView.centerBox($('#modalPopInfo'),$('.creatAccount'));
*************************************************************************/

var SSP = SSP || {};

	(function($){
		'use strict';
		var modalViewCP = {
				_scope : null
		};
		var mv = modalViewCP;

		mv.init = function(){
			//닫기 버튼
			$('#modalClose', '.modalClose').click(function(){
				$(".modalPop").hide();
				$('iframe[data-role="resize-content-cp"]').attr('src','https://www.samsungpop.com/ux/kor/pop/bridge.content.cp.pop?#CLOSE_DIM'); //테스트 코드 :CDI
			//	parent._common.openLayer_cp();

			});

			//  이벤트 바인딩

		};

		// centerBox 팝업박스 중앙 정렬
		mv.centerBox = function(_tempObj,_tempfocus){
			$(_tempObj).show();
		//	parent._common.openLayer_cp();
			$('iframe[data-role="resize-content-cp"]').attr('src','https://www.samsungpop.com/ux/kor/pop/bridge.content.cp.pop?#OPEN_DIM'); //테스트 코드 :CDI
//			$(_tempObj).css({'height' : $(window).outerHeight()+$(window).scrollTop(),'overflow-y': 'auto'});
//			$("body").css({'overflow': 'hidden'});
			var thatFocus = _tempfocus;
			var popSection = $('.modalPop:visible').find('.popSection');

			/**
			 * showDetailLayerPopup  이후 사용할경우 z-index 문제
			 */
			var showDetailLayerZindex =  $('.resizeDummy').parent().css('zIndex')
			$(_tempObj).css('zIndex',showDetailLayerZindex);

			popSection.css({
				'position':'absolute',
				'left':'50%',
				'margin-left': $(popSection).outerWidth() / -2,
				'top': $(window).scrollTop()
			});


			$(_tempObj).find('.closeBtn').off('click').on('click',function(){
				$(_tempObj).hide();

                var resizeFrame = $('iframe[data-role="resize-content-cp"]')
                var nowDomain =  resizeFrame.attr('src').split('#')[0]
                var closeText = "#CLOSE_DIM";
                     resizeFrame.attr('src',nowDomain+closeText);

				if(thatFocus!=undefined){
					$(thatFocus).focus();
				}
			});

			//포커스		// 2016.06.13 gp.lee 날짜 input 에는 포커스 이동 안하도록 수정
			if( $(_tempObj).find('input').not('input:hidden').eq(0).length
				&& $(_tempObj).find('input').not('input:hidden').not('input[data-role=common-input-month-date]').eq(0).length
				&& $(_tempObj).find('input').not('input:hidden').not('input[data-role=common-input-date]').eq(0).length ){

				$(_tempObj).find('input').not('input:hidden').eq(0).focus();
			}else{
				$(_tempObj).find('.closeBtn').focus();
			}

		};

		mv.init();
		SSP.modalViewCP = mv;
}($));



//
(function($){
		'use strict';
		var changeView = {
				_scope : null
		};
		var cv = changeView;
		
		cv.init = function(){
			//닫기 버튼
			$('#modalClose').click(function(){
				cv.changeFrameShow();
			});
			
			//  이벤트 바인딩
		
		};
		
		// centerBox 팝업박스 중앙 정렬
		cv.centerBox = function(_tempObj,_tempfocus){
			
			this.changeFrameHeid();
			
			$(_tempObj).show();
//			$(_tempObj).css({'height' : $(window).outerHeight()+$(window).scrollTop(),'overflow-y': 'auto'});
//			$("body").css({'overflow': 'hidden'});
			var thatFocus = _tempfocus;
			var popSection = $('.modalPop:visible').find('.popSection');
			
			/**
			 * showDetailLayerPopup  이후 사용할경우 z-index 문제
			 */
			
			var showDetailLayerZindex =  $('.resizeDummy').parent().css('zIndex')
			$(_tempObj).css('zIndex',showDetailLayerZindex);
			
			popSection.css({
				'position':'absolute',
				'left':'50%',
				'margin-left': $(popSection).outerWidth() / -2,
				'top': $(window).scrollTop()
			});
			
			
			$(_tempObj).find('.closeBtn').off('click').on('click',function(e){
				$(_tempObj).hide();
				cv.changeFrameShow();
				if(thatFocus!=undefined){
					$(thatFocus).focus();
				}
			});
			
			
			var hookFn = $(_tempObj).find('.closeBtn').attr('onclick');
			$(_tempObj).find('.closeBtn').attr('onclick',hookFn +'SSP.changeView.changeFrameShow();');
			
			//포커스		// 2016.06.13 gp.lee 날짜 input 에는 포커스 이동 안하도록 수정
			if( $(_tempObj).find('input').not('input:hidden').eq(0).length
				&& $(_tempObj).find('input').not('input:hidden').not('input[data-role=common-input-month-date]').eq(0).length
				&& $(_tempObj).find('input').not('input:hidden').not('input[data-role=common-input-date]').eq(0).length ){

				$(_tempObj).find('input').not('input:hidden').eq(0).focus();
			}else{
				$(_tempObj).find('.closeBtn').focus();
			}

		};
		
		/**
		 * _common.showDetailLayerIFrameLoad chage
		 */
		cv.changeFrameHeid = function(){
			var iframeDummy = $(".iframeLayer");
			if(iframeDummy.length >0){
				iframeDummy.hide();
				
				$("body").css({"overflow": "auto"});
			}
		};
		
		cv.changeFrameShow = function(){
			var iframeDummy = $(".iframeLayer");
			
			if(iframeDummy.length >0){
				$(iframeDummy).show();
				
				_common.showDetailLayerIFrameLoad($(iframeDummy).first().attr('id'));
				$("body").css({"overflow-y": "hidden"});
				$(window).scrollTop($(iframeDummy).first().offset().top);
			}
			
		};
		
		cv.init();
		SSP.changeView = cv;

		var addFindFile = {
                addFile: '[data-role=ADD_FILE]',
                removeFile: '[data-role=REMOVE_FILE]'
            };
        addFindFile.init = function(max){
            $(this.addFile).on({
               click: function(){
                  var parent = $(this).parents('fieldset.upload'),
                      idx = parent.find('.addFileBox:visible').length;

                  if ( idx >= max ) return ;

                  parent.find('.addFileBox').eq(idx).removeClass('hide');
               }
           });

           $(this.removeFile).on({
              click: function(){
                var parent = $(this).parents('fieldset.upload'),
                    addFileBox = parent.find('.addFileBox:visible'),
                    idx = addFileBox.length - 1,
                    target = addFileBox.eq( idx );

                if ( idx <= 0 ) return ;
                target.addClass('hide');
              }
           });

			// 최종 웹접근성 오류 69-9,80-9,80-21 조치
           $('.btnAddFile').mouseover(function(){
				$(this).next().find('.file_name').addClass('focus');
			});
			$('.btnAddFile').mouseleave(function(){
				$(this).next().find('.file_name').removeClass('focus');
			});

        };

        SSP.addFindFile = addFindFile;
}($));	