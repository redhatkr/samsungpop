/*************************************************************************************************
 *
 * INPORTS
 *
 *************************************************************************************************/
(function(){
	var domain;

	switch(String(_common._type).toUpperCase()){
		case 'CP_CONTENT':
			domain='https://www.samsungpop.com';
			break;

	default:
		domain = '';
		break;
	};

	var imports=[
		{'url':'/ux/js/ui/ui.core.all.js', 'cashbuster':true},
		{'url':'/ux/js/ui/ui.common.custom_front.js', 'cashbuster':true}
	];

	for(var a=0, atotal=imports.length; a<atotal; a++){
		document.write('<script src="'+domain+imports[a].url+((imports[a].cashbuster)?'?cb='+window._CACHE_BUSTER:'')+'" charset="utf-8"></'+'script>');
	};
})();


/*************************************************************************************************
 *
 * UI-MANAGER
 *
 *************************************************************************************************/
var UIManager=Class.extend({
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(){
		this._header=null;
		this._footer=null;

		this._rectangles={'w':null, 'h':null};
		this._counts={'select':0};

		this.init_body();
		this.init_header();
		this.init_footer();
		this.init_event();
		this.init_inputAutoFocus(); // 2014-10-22 인풋 포커스 자동 이동

		/**
		 * WTS에서는 실행 금지
		 */
		if(!_common._iswts) this.reinit();
	},

	/**
	 * reinit-ui
	 *
	 * @description - DOM 객체 UI 설정
	 * @param	{String} type
	 * @return	void
	 */
	reinit:function(type){
		var arr=String(type).split(',');

		for(var a in arr){
			var atype=String($.trim(arr[a]));

			switch(String(atype).toUpperCase()){
				case 'RADIO':
					this.init_radio();
					break;

				case 'CHECKBOX':
					this.init_check();
					break;

				case 'TEXT':
					this.init_input();
					break;

				case 'FILE':
					this.init_file();
					break;

				case 'SELECT':
					this.init_select();
					break;

				case 'TABLE':
					this.init_table();
					this.resize_table();
					break;

				case 'FRAME':
					this.resize_frame();
					break;

				case 'CHART':
					this.init_chart();
					break;

				case 'TIP':
					this.init_tip();
					break;

				default:
					this.init_alink();
					this.init_table(); 
					this.resize_table();
					this.init_list();
					this.init_input();
					this.init_radio();
					this.init_check();
					this.init_file();
					this.init_select();
					this.init_form();
					this.init_calendar();
					this.init_tip();
					this.init_share();
					this.init_tab();
					this.init_sliderbar();
					this.init_drag();
					this.init_chart();
					this.init_slidebox();
					this.init_treenavigation();
					this.init_ie_css3(); // 2014-11-07 IE7 ~ IE8 CSS3 대응
					this.init_moreBtn();
					this.init_placeholderLabel();
					this.init_moobileKeyPad();
					break;
			};
		};

		this.reinit_event();
	},

	/**
	 * reinit-ui-form-elemenet-by-name
	 *
	 * @description - <input name="이름" /> 개별 reinit
	 * @param	{String} name
	 * @return	void
	 */
	reinit_name:function(name){
		var owner=this;

		$('*[name='+name+']').each(function(a){
			var ascope=$(this);

			switch(String(ascope[0].nodeName).toUpperCase()){
				case 'INPUT':
					switch(String(ascope[0].type).toUpperCase()){
						case 'RADIO':
							owner.build_radio($(this));
							break;

						case 'CHECKBOX':
							owner.build_check($(this));
							break;

						case 'TEXT':
							owner.build_input($(this));
							break;

						case 'FILE':
							owner.build_file($(this));
							break;
					};
					break;

				case 'SELECT':
					owner.build_select($(this));
					break;
			}
		});
	},

	/**
	 * reinit-UI-form-elemenet-by-id
	 *
	 * @description - <input id="아이디" /> 개별 reinit
	 * @param	{String} id
	 * @return	void
	 */
	reinit_id:function(id){
		var owner=this;

		$('*[id='+id+']').each(function(a){
			var ascope=$(this);

			switch(String(ascope[0].nodeName).toUpperCase()){
				case 'INPUT':
					switch(String(ascope[0].type).toUpperCase()){
						case 'RADIO':
							owner.build_radio($(this));
							break;

						case 'CHECKBOX':
							owner.build_check($(this));
							break;

						case 'TEXT':
							owner.build_input($(this));
							break;
					};
					break;

				case 'SELECT':
					owner.build_select($(this));
					break;

				case 'TABLE':
					owner.build_table($(this));
					break;
			}
		});
	},

	/**
	 * resize-UI
	 */
	resize:function(e){
		this.resize_table(e);
		this.resize_header(e);
		this.resize_lock_area(e);
	},

	/**
	 * scroll-UI
	 */
	scroll:function(e, isreset){
		this.scroll_footer(e, isreset);
	},

	/**
	 * complete-UI
	 */
	complete:function(){
		this.complete_header();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:EVENT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_event:function(){
		var owner=this;

		$(document).bind({
			'mousedown':function(e){
				//owner.position_transkey(e);
				owner.collision_select(e);
				owner.collision_header(e);
			},

			'mousemove touchmove':function(e){
				owner.event_sliderbar('MOVE', e);
				owner.event_drag('MOVE', e);
			},

			'mouseup mouseleave touchend':function(e){
				owner.event_sliderbar('STOP', e);
				owner.event_drag('STOP', e);
			},

			'click':function(e){
				owner.focus_radio();
				owner.focus_check();
			},

			'keyup':function(e){
				if(e.keyCode===9){
					setTimeout(function(){
						owner.focus_select(e);
						owner.focus_radio();
						owner.focus_check();
					}, 0);
				};
			}
		});

		/**
		 * IE7에서 창 변경과 상관없이 resize 발생
		 * 창이 변했을 때만 이벤트 발생 토록 수정
		 */
		this._rectangles.w=$(window).width();
		this._rectangles.h=$(window).height();

		$(window).bind({
			'resize':function(e){
				// 1. resize-ui-element
				
				var w=$(this).width();
				var h=$(this).height();

				if(owner._rectangles.w!=w || owner._rectangles.h!=h){
					owner._rectangles.w=w;
					owner._rectangles.h=h;
					
					owner.close_transkey();
					owner.resize(e);
					owner.scroll(e, true);
					$('.resizeDummy').css('height' ,$(window).outerHeight()); // iframe
				};

				// 2. resize-page
				if(typeof(window.resizePage)!='undefined') window.resizePage();
			},

			'scroll':function(e){
				owner.scroll(e, false);
			}
		});
	},

	reinit_event:function(){
		$(document).trigger('click');
		$(window).resize();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:BODY
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_body:function(){
		var browser=ValidationUtil.get_browser_type();
		var platform=ValidationUtil.get_platform_type();

		$('body').addClass(platform);
		$('body').addClass(browser);
		$('#nav,#container').attr('tabIndex', '0');
	},

	// 2014-10-14 inputStringNumber + // 2014-10-22 인풋 포커스 자동 이동
	init_inputAutoFocus:function(){	
		$('input[data-role="common-input-auto-focus"]').bind('input keyup paste', function(e){
			
			var inputVal=$(this).val().length;
			var maxLength=Number($(this).attr('maxlength'));
			if($(this).hasClass('full')){
				$(this).bind({
					'keyup':function(e){
						 if(!(e.keyCode === 8)) {
							var value = $(this).val();
							end = value.substring(0,maxLength-1);
							$(this).val(end);
						} else {
							$(this).removeClass('full');
							$(this).attr('maxlength',maxLength - 1);
						}	
					}
				});				
			} else{
				if($(this).val().length == maxLength){
					$(this).next('input').focus();
					$(this).addClass('full');
					$(this).attr('maxlength',maxLength + 1);
				}
			}
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:A-LINK
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_alink:function(){
		$(document).find('a').each(function(a){
			if($(this).attr('href')=='#' || $(this).attr('href')=='#none'){
				$(this).attr('href', 'javascript:_common.nothing();');
			};

			/**
			 * ie7 에서 '#' 처리는 현재페이지주소+'#' 로 치환되는 케이스가 있다.
			 */
			if(String($(this).attr('href'))==window.location.href+'#'){
				$(this).attr('href', 'javascript:_common.nothing();');
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TABLE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_table:function(){
		var owner=this;

		$('table').each(function(a){
			owner.build_table($(this), a);
		});
	},

	build_table:function(scope, index){
		// 0. caption
		new CommonTable($(scope), 'T'+index);

		// 1. save-original-width
		/**
		 * method:resize_table() 에서 사용하기 위해 미리 지정
		 */
		if(String($(scope).attr('style')).toLowerCase().indexOf('width:')!=-1){
			$(scope).attr('data-width', $(scope).width());
		};

		// 2. manager
		/**
		 * 중복 처리
		 * (예. data-role="common-table-scroll-sync common-table-toggle")
		 */
		var adname=String($(scope).attr('data-role')).toLowerCase();

		// 2-1. manager-toggle
		if(adname.indexOf('common-table-toggle')!=-1){
			if(ValidationUtil.is_null($(scope).data('manager-toggle'))){
				$(scope).data('manager-toggle', new CommonToggleTable($(scope)));
			}else{
				$(scope).data('manager-toggle').reinit();
			};
		};

		// 2-2. manager-scroll-sync
		if(adname.indexOf('common-table-scroll-sync')!=-1){
			if(ValidationUtil.is_null($(scope).data('manager-scroll-sync'))){
				$(scope).data('manager-scroll-sync', new CommonScrollSyncTable($(scope)));
			}else{
				$(scope).data('manager-scroll-sync').reinit();
			};
		};

		// 2-3. manager-button-sync
		if(adname.indexOf('common-table-btn-sync')!=-1){
			if(ValidationUtil.is_null($(scope).data('manager-btn-sync'))){
				$(scope).data('manager-btn-sync', new CommonButtonSyncTable($(scope)));
			}else{
				$(scope).data('manager-btn-sync').reinit();
			};
		};

		// 2-4. manager-sort-all (one table)
		if(adname.indexOf('common-table-sort-0')!=-1){
			if(ValidationUtil.is_null($(scope).data('manager-sort'))){
				$(scope).data('manager-sort', new CommonSortTable($(scope), true));
			}else{
				$(scope).data('manager-sort').reinit();
			};
		};

		// 2-5. manager-sort-separation (two table)
		if(adname.indexOf('common-table-sort-1')!=-1){
			if(ValidationUtil.is_null($(scope).data('manager-sort'))){
				$(scope).data('manager-sort', new CommonSortTable($(scope), false));
			}else{
				$(scope).data('manager-sort').reinit();
			};
		};
		
		// 2-5-1. manager-sort-separation (two table)  - UX 개편 확장 
		if(adname.indexOf('common-table-sort-2')!=-1){
			if(ValidationUtil.is_null($(scope).data('manager-sort'))){
				$(scope).data('manager-sort', new CommonSortTable($(scope), false));
			}else{
				$(scope).data('manager-sort').reinit();
			};
		};
		
		// 2-6. manager-paging
		if(adname.indexOf('common-table-paging')!=-1){
			if(ValidationUtil.is_null($(scope).data('manager-paging'))){
				$(scope).data('manager-paging', new CommonPagingTable($(scope), false));
			}else{
				$(scope).data('manager-paging').reinit();
			};
		};
	},

	resize_table:function(){
		/**
		 * thead, tbody, tfoot 이 분리되어 있는 경우
		 * tbody 에 분리되는 thead 의 가로 길이 추가
		 * 스크롤 테이블은 최소높이 3줄 최대높이 10줄 3~9까지는 가변 적용
		 */
		var btype=ValidationUtil.get_browser_type();
		var d=(String(btype).indexOf('msie')=='msie7' || String(btype).indexOf('msie')=='msie8')?2:0;

		$('table').each(function(a){
			try{
				if($(this).is(':visible') && String($(this).attr('data-direction')).toUpperCase()!='VERTICAL'){
					if(
						($(this).find('>thead').hasClass('blind') || $(this).find('>thead>tr').hasClass('blind')) &&
						!$(this).find('>tbody>tr').hasClass('tfoot')
					){
						/**
						 * 1. 타이틀 가로 길이에 맞춰 길이 조정
						 */
						var ascope=$(this).parent()[0].previousElementSibling || $(this).parent()[0].previousSibling;
						var aw=Number($(ascope).find('table>tbody').outerWidth(true) || $(ascope).outerWidth(true))+d;
						
						/**
						 * scrollTable01 일경우 table style width 설정않함
						 */
						if(!$(ascope).parent().hasClass('scrollTable01')){
							$(this).css({
								'width':aw+'px'
							});
						}
						
						/**
						 *  스크롤 높이 .scrollBody  : 사용않할경우 data-tableResize="N" 추가 
						 *  <div class="scrollBody" style="max-height:116px" data-tableResize="N">
						 */
						
						if($(this).parent('.scrollBody').length >0 
								&& !$(this).find('tbody tr td').hasClass('no_data') 
								&& $(this).find('tbody tr td').length > 1 && (String($(this).parent('.scrollBody').attr('data-tableResize')).toUpperCase()!='N')
								){
							
							var targetScrollBody = $(this);
							var rowMax = 1;
							var trLen = 0;
							var trHeight = 0;
							var dataIdx = 0;
							var checkRox = 1;
							targetScrollBody.find('tbody>tr>td:lt(30)').each(function(tIdx){
								 $(this).attr('rowspan') ? rowMax = Math.max(rowMax, $(this).attr('rowspan')):'';
							});
                            (String(btype)=='msie8')?checkRox:checkRox=rowMax;
							for(var ti = 0; ti < checkRox; ti++){
								trHeight = trHeight +  targetScrollBody.find('>tbody>tr').eq(ti).height();
							}

							trLen = targetScrollBody.find('tbody>tr').length;
							dataIdx = trLen/rowMax;
							var MAXHEIGHT = '';
							if(dataIdx < 3){
								MAXHEIGHT = trHeight * 3;
							}else if(dataIdx ==3){
								MAXHEIGHT = $(this).height();
							}else if(dataIdx >=10){
								MAXHEIGHT = trHeight * 10;

								//최대치 보다 작을경우 대체
								if($(this).height() < MAXHEIGHT && dataIdx >=10){
									MAXHEIGHT =$(this).height();
								}

							}else{
								MAXHEIGHT = '';
							}
							$(this).data('comScrTable', 'comScrTable');
							$(this).parent('.scrollBody').css({'height':MAXHEIGHT,
								'max-height':MAXHEIGHT
								});
							$(this).parent('.scrollBody').attr("tabindex","0"); // 웹접근성 오류 0-8
						}else{
							if(!ValidationUtil.is_null($(this).data('comScrTable'))){
								$(this).parent('.scrollBody').css({'height':'',
									'max-height':MAXHEIGHT
									});
							}
						}
						

						/**
						 * 2. 세로 스크롤이 생겼을 때 (data-role=common-table-scroll-sync)
						 *
						 */
						if(String($(this).attr('data-role')).indexOf('common-table-scroll-sync')!=-1){
							if($(ascope).find('>table') && !ValidationUtil.is_null($(ascope).find('>table').attr('data-width'))){
								
								/**
								 * 스크롤 영역일 때만 적용
								 * class="row"
								 * max-height!="none"
								 */
								if(StringUtil.to_pureNumber($(this).parent().css('max-height'))>0){
									var ow=Number($(ascope).find('>table').attr('data-width'));
									var mh=StringUtil.to_pureNumber($(this).parent().css('max-height'));
									var ah=$(this).outerHeight(true);
									var isvscroll=(mh<ah)?true:false;
									var vd=(isvscroll)?17:0;

									$(ascope).find('>table').css({
										'width':(ow+vd)+'px',
										'padding-right':vd+'px',
										'scrollLeft':0
									});

									/**
									 * IE7 일 때만 margin-right 적용 (2014.06.11)
									 */
									if(ValidationUtil.get_browser_type()=='msie7'){
										$(ascope).find('>table').css({
											'margin-right':vd+'px'
										});
									};

									/**
									 * data-target 이 존재할 때, 처리 추가
									 */
									if($('*[data-name='+$(this).attr('data-target')+']').length>0){
										// 결함번호 58164 : 투자자클럽(AIC)>전체회원 리스트 더보기 시 가로 사이즈 확장 오류 시작
										var momDiv = $('*[data-name='+$(this).attr('data-target')+']');
										var childTable = $('*[data-name='+$(this).attr('data-target')+']').find('>table');
										// 2014-09-16 결함번호 57407 시작
										if(ValidationUtil.get_browser_type()=='msie9'){
											if(momDiv.width() < childTable.width()){
												childTable.css({
													'width':(ow)+'px',
													'padding-right':vd+'px',
													'scrollLeft':0
												});
											} else {
												childTable.css({
													'width':(ow+vd)+'px',
													'padding-right':vd+'px',
													'scrollLeft':0
												});
											}
										// 결함번호 58164 : 투자자클럽(AIC)>전체회원 리스트 더보기 시 가로 사이즈 확장 오류 끝
										} else {
											childTable.css({
												'width':(ow+vd)+'px',
												'padding-right':vd+'px',
												'scrollLeft':0
											});
										}
										// 2014-09-16 결함번호 57407 끝
									};
								};
							};
						};

						// 2014-10-21 테이블 tr갯수에 따른 클래스 추가 시작
						if(String($(this).parent().attr('class')).indexOf('tbl-scroll')!=-1){							
							var trn = $(this).find('>tbody>tr').length;
							var tc = $(this).parent().attr('class');							
							var state = $(this).parent().hasClass('exception');
							var trs = tc.split(' ');													
							var trsc = trs[1].split('-');
							var trsn = trsc[1];							
							//2014.11.10 예외 테이블 조건분기, 클래스 exception 추가 
							if(!state){
								if(trn > trsn){
									$(this).parent().addClass('over');	
								}else{
									$(this).parent().removeClass('over');
								}																
							}else{
								if(trn > trsn*2){
									$(this).parent().addClass('over');
								}else{
									$(this).parent().removeClass('over');
								}
							}
							
							/*if(trn > trsn){
								$(this).parent().addClass('over');
							} else{
								$(this).parent().removeClass('over'); // 2014-10-27 2014-10-21 테이블 tr갯수에 따른 클래스 추가 수정
							}*/
						};
						// 2014-10-21 테이블 tr갯수에 따른 클래스 추가 끝


					};
				};
			}catch(e){};
		});
	},

	resize_frame:function(){			
		$('data-role="common-ui-roll"').find('>li>iframe').each(function(a){	
			var cwindow=$(this).contentWindow;
			var cbody=cwindow.document.body;
			var cbodyH = cbody.outerHeight();
			$(this).attr('height',cbodyH);
			$(this).parent('li').css('height',cbodyH);
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:LIST
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_list:function(){
		$('ul').each(function(a){
			/**
			 * 중복 처리
			 */
			var adname=String($(this).attr('data-role')).toLowerCase();

			if(adname.indexOf('common-list-slide')!=-1){
				if(ValidationUtil.is_null($(this).data('manager'))){
					$(this).data('manager', new CommonSlideList($(this)));
				}else{
					$(this).data('manager').reinit();
				};
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:INPUT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_input:function(){
		var owner=this;

		$('input[data-role^=common-input-]').each(function(a){
			owner.build_input($(this));
		});
	},

	build_input:function(scope){
		if(ValidationUtil.is_null($(scope).data('manager')) && !$(scope).attr('readonly')){
			var type=$(scope).attr('data-role');

			switch(String(type).toLowerCase()){
				// 1-1. date-format
				case 'common-input-date':
					$(scope).data('manager', new InputDate($(scope), '-', (String($(scope).attr('data-type')).toUpperCase()=='SENSITIVE')?true:false));
					break;

				// 1-2. month-data-format
				case 'common-input-month-date':
					$(scope).data('manager', new InputMonthDate($(scope), '-', (String($(scope).attr('data-type')).toUpperCase()=='SENSITIVE')?true:false));
					break;

				// 2. string-number-format
				case 'common-input-string-number':
					$(scope).data('manager', new InputStringNumber($(scope)));
					break;

				// 3. pure-number-format
				case 'common-input-pure-number':
					$(scope).data('manager', new InputPureNumber($(scope)));
					break;

				// 4. number-format
				case 'common-input-number':
					$(scope).data('manager', new InputNumber($(scope)));
					break;

				// 5. number-format
				case 'common-input-sign-number':
					$(scope).data('manager', new InputSignNumber($(scope)));
					break;
					
				// 6. string-number-format + Ctrl V
				case 'common-input-string-number-ctrlv':
					$(scope).data('manager', new InputStringNumberCtrlV($(scope)));
					break;
					
				// 7. pure-number-format + point(.)
				case 'common-input-ratio-number':
					$(scope).data('manager', new InputRatioNumber($(scope)));
					break;

                // 8. minus-number-format
                case 'common-input-minus-number':
                    $(scope).data('manager', new InputMinusNumber($(scope)));
                    break;
                    
                // 9. minus-number-format    
                case 'common-input-eng':
                    $(scope).data('manager', new InputENG($(scope)));
                    break;                    

			};
		};
	},

	init_file:function(){
		var owner=this;

		$('input[type=file]').each(function(a){
			owner.build_file($(this));
		});
	},

	build_file:function(scope){
	    if(ValidationUtil.is_null($(scope).data('manager'))){
	        $(scope).data('manager','manager');
	        $(document.createElement('span'))
                .attr('class', 'file_name')
                .prependTo($(scope).parent());
            $(scope).attr('onchange','javascript:window.addFileName(this);');
	    }

	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:RADIO
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_radio:function(){
		var owner=this;

		$('input[type=radio]').each(function(a){
			owner.build_radio($(this));
		});
	},

	build_radio:function(scope){
		if(ValidationUtil.is_null($(scope).data('manager'))){
			$(scope).data('manager', new CommonRadio($(scope)));
		}else{
		$(scope).data('manager').reset();
		};
	},

	focus_radio:function(){
		try{
			$('input[type=radio]').each(function(a){
				if(!ValidationUtil.is_null($(this).data('manager'))){
					$(this).data('manager').reset();
				};
			});
		} catch (e){
			//ignore
		}
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CHECKBOX
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_check:function(){
		var owner=this;

		$('input[type=checkbox]').each(function(a){
			owner.build_check($(this));
		});
	},

	build_check:function(scope){
		if(ValidationUtil.is_null($(scope).data('manager'))){
			$(scope).data('manager', new CommonCheck($(scope)));
		}else{
			$(scope).data('manager').reset();
		};
	},

	focus_check:function(){
		try{
			$('input[type=checkbox]').each(function(a){
				if(!ValidationUtil.is_null($(this).data('manager'))){
					$(this).data('manager').reset();
				};
			});
		} catch(e){
			//ignore
		}
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SELECT
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_select:function(){
		var owner=this;

		$('select').each(function(a){
			owner.build_select($(this));
		});
	},

	build_select:function(scope){
		if(ValidationUtil.is_null($(scope).data('manager'))){
			if(String($(scope).attr('multiple'))!='multiple'){
				if(String($(scope).attr('data-restrict')).toUpperCase()!='Y'){
					this._counts.select++;

					$(scope).data('manager', new CommonSelect($(scope), this._counts.select));
				};
			};
		}else{
			try{
				$(scope).data('manager').reinit();
			}catch(e){
				_common.trace(e);
			};
		};
	},

	collision_select:function(e){
		var pos={'left':e.pageX, 'top':e.pageY};

		$('select').each(function(a){
			if(!ValidationUtil.is_null($(this).data('manager'))){
				var manager=$(this).data('manager');

				if(!manager.is_collision(manager.get_scope(), pos)){
					if(manager._isopen) manager.show(false);
				};
			};
		});
	},

	focus_select:function(e){
		$('select').each(function(a){
			if(!ValidationUtil.is_null($(this).data('manager'))){
				var manager=$(this).data('manager');

				if(!manager.is_focus()){
					manager.show(false);
				};
			};
		});
	},

	resize_select:function(){
		$('select').each(function(a){
			if(!ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager').resize();
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:FORM
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_form:function(){
		$('form').each(function(a){
			if(ValidationUtil.is_null($(this).attr('onsubmit'))){
				$(this).attr('onsubmit', 'return false;');
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PAGING
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	build_paging:function(properties){
		var scope=properties.target;
		var props={
			'count':{
				'total':properties.total,
				'step':properties.step
			},
			'page':{
				'step':10,
				'current':properties.page
			}
		};
		var callback=properties.callback;

		return new CommonPaging(scope, props, callback);
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CALENDAR
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_calendar:function(){
		var owner=this;

		// 1. 기간설정
		$('*[data-role=common-ui-calendar-period]').each(function(a){
			if(ValidationUtil.is_null($(this).data('manager'))){
				var manager=new CommonPeriodCalendar($(this));
				manager._focus=Delegate.create(owner, owner.focus_calendar); // 다른 달력 닫기

				$(this).data('manager', manager);
			};
		});

		// 2. 당일설정
		$('*[data-role=common-ui-calendar-single]').each(function(a){
			if(ValidationUtil.is_null($(this).data('manager'))){
				var manager=new CommonSingleCalendar($(this));
				manager._focus=Delegate.create(owner, owner.focus_calendar); // 다른 달력 닫기

				$(this).data('manager', manager);
			};
		});

		// 3. 기간설정(follow)
		$('*[data-role=common-ui-calendar-follow-period]').each(function(a){
			if(ValidationUtil.is_null($(this).data('manager'))){
				var manager=new CommonPeriodFollowCalendar($(this));
				manager._focus=Delegate.create(owner, owner.focus_calendar); // 다른 달력 닫기

				$(this).data('manager', manager);
			};
		});
	},

	/**
	 * change-focus-calendar from Delegate-event
	 *
	 * @param {Object} calendar
	 */
	focus_calendar:function(calendar){
		$('*[data-role=common-ui-calendar-period], *[data-role=common-ui-calendar-single], *[data-role=common-ui-calendar-follow-period]').each(function(a){
			if(!ValidationUtil.is_null($(this).data('manager'))){
				var manager=$(this).data('manager');

				if(calendar!=manager && manager._isopen){
					manager.show(false);
				};
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TIP
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_tip:function(){
		var owner=this;

		// 1. exist-exit-button
		$('*[data-role=common-ui-tip]').each(function(a){
			if(ValidationUtil.is_null($(this).data('isapply'))){
				var scope=$(this);
				var nodename=String($(this)[0].nodeName).toLowerCase();
				var content=$(scope).find('>'+nodename); //$(scope).find('>div'); // div, span 적용추가
				var ishasindex=(Number($(scope).css('z-index'))>0)?true:false;
				var ishelp=$(this).find('a:first').hasClass('help');

				// 1. flag-apply
				$(this)
				.data('isapply', true)
				.data('ishasindex', ishasindex);

				// 2. event-open
				$(this).find('a:first').bind({
					'click':function(e){
						// 열릴때 수행하는 펑션	: ky.cho 20161029 동일과장이 안해줘서 추가함
						if (typeof scope.data("openCallback") == "function") {
							scope.data("openCallback")();
						}
						// 결함번호 58335 : 물음표 버튼 토글 처리 시작
//						if($(this).attr('class') == 'help on'){
						if($(this).hasClass('on')){
							if(!$(scope).data('ishasindex')) $(scope).css('z-index', 0);
							$(content).hide();
							if(ishelp) $(this).removeClass('on');
							$(this).attr('title', $(this).attr('title').replace('닫힘','열림'));
						} else {
							if(!$(scope).data('ishasindex')) $(scope).css('z-index', 10);
							if(ishelp) $(this).addClass('on');
							$(this).attr('title', $(this).attr('title').replace('열림','닫힘'));
							$(content).show();
						}
						// 결함번호 58335 : 물음표 버튼 토글 처리 끝

						// 다른 창 닫기
						owner.focus_tip($(scope));
					}
				});

				// 3. event-close
				$(this).find('a:last').bind({
					'click':function(e){
						if(!$(scope).data('ishasindex')) $(scope).css('z-index', 0);

						$(content).hide();
						$(scope).find('a:first').removeClass('on').focus();
						if($(this).attr('title')!=null && $(this).attr('title') != undefined){
							$(scope).find('a:first').attr('title', $(this).attr('title').replace('닫힘','열림')); // 결함번호 58335 : 물음표 버튼 토글 처리	
						}else{
							$(scope).find('a:first').attr('title', '열림'); // 결함번호 58335 : 물음표 버튼 토글 처리
						}
					}
				});

				// 4. hide-container
				if(!$(scope).data('ishasindex')) $(scope).css('z-index', 0);
				$(content).hide();

				// 5. position
				if($(this).hasClass('up')){
					var y=$(content).position().top;
					var h=$(content).outerHeight(true)+10;

					$(content).css({
						'top':(y-h)+'px'
					});
				};
			};
		});

		// 2. no-exist-exit-button
		$('*[data-role=common-ui-tip-etc]').each(function(a){
			if(ValidationUtil.is_null($(this).data('isapply'))){
				var scope=$(this);
				var content=$(scope).find('>div');
				var ishasindex=(Number($(scope).css('z-index'))>0)?true:false;
				var ishelp=$(this).find('a:first').hasClass('help');

				// 1. flag-apply
				$(this).data('isapply', true);

				// 2. event-open
				$(this).find('a').each(function(b){
					if(b==0){
						$(this).bind({
							'click':function(e){
								if(!$(content).is(':visible')){
									if(!$(scope).data('ishasindex')) $(scope).css('z-index', 10);
									$(scope).css('position', 'relative');

									if(ishelp) $(this).addClass('on');
									$(content).show();

									// 다른 창 닫기
									owner.focus_tip($(scope));
								}else{
									if(!$(scope).data('ishasindex')) $(scope).css('z-index', 0);
									$(scope).css('position', 'static');

									$(content).hide();
									$(scope).find('a:first').removeClass('on').focus();
								};
							}
						});
					}else{
						/**
						 * 레이어에 있는 <select>요소는 제외
						 * ex) http://local.samsungpop.com:7001/html/finance/fund/myFund/tab_account.jsp
						 */
						if(String($(this).attr('data-role')).indexOf('common-select')==-1){
							$(this).bind({
								'click':function(e){
									if(!$(scope).data('ishasindex')) $(scope).css('z-index', 0);
									$(scope).css('position', 'static');

									$(content).hide();
									$(scope).find('a:first').removeClass('on').focus();
								}
							});
						};
					};
				});
			};
		});
	},

	focus_tip:function(scope){
		$('*[data-role=common-ui-tip], *[data-role=common-ui-tip-etc]').each(function(a){
			if(!ValidationUtil.is_null($(this).data('isapply'))){
				if($(scope)[0]!=$(this)[0]){
					var nodename=String($(this)[0].nodeName).toLowerCase();
					var content=$(this).find('>'+nodename); //$(scope).find('>div'); // div, span 적용추가
					var ishelp=$(this).find('a:first').hasClass('help');

					if(!$(this).data('ishasindex')) $(this).css('z-index', 0);

					if($(this).attr('data-role')=='common-ui-tip-etc') $(this).css('position', 'static');

					$(this).find('a:first').removeClass('on');
					$(content).hide();
				};
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SHARE - 2016-06-15 사용하지 않음
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_share:function(){
		/*$('*[data-role=common-ui-share]').each(function(a){
			if(ValidationUtil.is_null($(this).data('isapply'))){
				var scope=$(this);

				$(scope).data('isapply', true);

				$(scope).find('>a:first').bind({
					'click':function(e){
						$(scope).find('>span').show();
						$(scope).find('>span>a:first').focus();
						$(scope).find('>a:last').show();
						$(this).hide();
					}
				});

				$(scope).find('>a:last').bind({
					'click':function(e){
						$(scope).find('>span').hide();
						$(scope).find('>a:first').show().focus();
						$(this).hide();
					}
				});

				$(scope).find('>span').bind({
					'click':function(e){
						$(scope).find('>a:last').trigger('click');
					}
				});
			};
		});*/
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TAB
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_tab:function(){
		$('*[data-role=common-ui-tab]').each(function(a){
			if(ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager', new CommonTab($(this)));
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SLIDER-BAR
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_sliderbar:function(){
		$('*[data-role=common-ui-slider-bar]').each(function(a){
			if(ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager', new CommonSliderBar($(this)));
			};
		});
	},

	event_sliderbar:function(type, e){
		$('*[data-role=common-ui-slider-bar]').each(function(a){
			if(!ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager').change_document_event(type, e);
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:DRAG
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_drag:function(){
		$('*[data-role=common-ui-drag]').each(function(a){
			if(ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager', new CommonDrag($(this)));
			};
		});
	},

	event_drag:function(type, e){
		$('*[data-role=common-ui-drag]').each(function(a){
			if(!ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager').change_document_event(type, e);
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:CHART
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_chart:function(){
		$('*[data-role=common-ui-chart-bar]').each(function(a){
			if(ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager', new CommonChartBar($(this)));
			}else{
				$(this).data('manager').reinit();
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:SLIDE-BOX
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_slidebox:function(){
		$('*[data-role=common-ui-slide-box]').each(function(a){
			if(ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager', new CommonSlideBox($(this)));
			};
		});
	},



	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TREE-NAVIGATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_treenavigation:function(){
		$('*[data-role=common-ui-tree-navigation]').each(function(a){
			if(ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager', new CommonTreeNavigation($(this)));
			};
		});
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:VIRTURL-KEYBOARD
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * TRANS-KEY 초기 위치값 지정 (벗어났을때만지정)
	 */
	position_transkey:function(e){
		// 1. position
		/**
		 * content 사이즈에서 벗어나면 초기에 뜨는 위치 조정
		 */
		var content=$('#contents');
		var w=$(content).width();
		var pos=$(content).offset();

		$('input[data-tk-kbdtype=qwerty], input[data-tk-kbdtype=number]').each(function(a){
			try{
				var apos=$(this).offset();
				var ah=$(this).outerHeight(true);
				var aw=(String($(this).attr('data-tk-kbdtype')).toLowerCase()=='number')?249:582;

				if(apos.left+aw>pos.left+w){
					$(this).attr('data-tk-kbdxy', Number(pos.left+w-aw)+' '+Number(apos.top+ah));
				}else{
					$(this).removeAttr();
				};
			}catch(e){};
		});

		// 2. collision
		/**
		 * 마우스 클릭영역에서 벗어나면 닫는다.
		 */
		try{
			if(tk!=null && tk.now!=null){
				var mx=e.pageX;
				var my=e.pageY;
				var btype=tk.now.keyType;
				var bscope=tk.now[btype+'Div'];
				var bpos=$(bscope).offset();
				var bh=$(bscope).height();
				var bw=$(bscope).width();

				if((mx>=bpos.left && mx<=bpos.left+bw) && (my>=bpos.top && my<=bpos.top+bh)){
				}else{
					tk.close();
				};
			};
		}catch(e){};
	},

	/**
	 *  TRANS-KEY 닫기
	 */
	close_transkey:function(){
		try{
			if(tk!=null && tk.now!=null) tk.close(); //가상키보드가 호출되어 있는 경우
		}catch(e){};
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:AREA-LOCK
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * lock-area
	 *
	 * @description - 특정영역 잠금
	 * @param	{DOM} container
	 * @param	{Boolean} bool
	 * @return	void
	 */
	build_lock_area:function(container, bool){
		// 1. build-cover
		if(bool){
			/**
			 * 해당 컨테이너에 한번만 처리
			 * 이후엔 리사이즈 처리
			 */
			if(!$(container).data('islock')){
				$(container).data('islock', true);

				var w=$(container).innerWidth();
				var h=$(container).innerHeight();

				$(document.createElement('div'))
				.attr('data-role', 'common-ui-lock-cover')
				.data('target', container)
				.css({
					'position':'absolute',
					'left':'0px',
					'top':'0px',
					'width':w+'px',
					'height':h+'px',

					'z-index':999
				})
				.append($(document.createElement('div'))
					.attr('data-role', 'common-ui-lock-cover-bg')
					.css({
						'width':'100%',
						'height':'100%',
						'background-color':'#fff',
						'opacity':.5
					})
					.bind({
						'click':function(e){
							e.preventDefault();
							return false;
						}
					})
				)
				.append($(document.createElement('div'))
					.attr('data-role', 'common-ui-lock-cover-container')
					.css({
						'position':'absolute',
						'left':'50%',
						'top':'50%',
						'z-index':1
					})
				)
				.appendTo($(container));
			}else{
				this.resize_lock_area();
			};
		}else{
			$(container).find('div[data-role=common-ui-lock-cover]').remove();
			$(container).data('islock', false);
		};

		// 2. adjust-tabIndex
		$(container).find(':focusable').each(function(a){
			if(String($(this)[0].nodeName).toUpperCase()!='SELECT'){
				if(bool){
					/**
					 * tabIndex 값이 있는지 화인 (-1)만 체크
					 */
					var aindex=$(this).attr('tabIndex');

					if(aindex!=undefined){
						$(this).attr('data-tabindex', aindex);
					};

					$(this).attr('tabIndex', '-1');
				}else{
					if($(this).attr('data-tabindex')!='-1'){
						$(this).removeAttr('tabIndex');
					};
				};
			};
		});
	},

	/**
	 * resize-lock-area
	 *
	 * @description - 페이지 사이즈에 따른 잠금영역 사이즈 변경
	 */
	resize_lock_area:function(){
		$('div[data-role=common-ui-lock-cover]').each(function(a){
			var acontainer=$(this).data('target');
			var aw=$(acontainer).innerWidth();
			var ah=$(acontainer).innerHeight();

			$(this).css({
				'width':aw+'px',
				'height':ah+'px'
			});
		});
	},

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:AREA-LOCK
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * lock-area
	 *
	 * @description - 특정영역 잠금
	 * @param	{DOM} container
	 * @param	{Boolean} bool
	 * @return	void
	 */
	build_table_area:function(container, bool){
		// 1. build-cover
		if(bool){
			/**
			 * 해당 컨테이너에 한번만 처리
			 * 이후엔 리사이즈 처리
			 */
			if(!$(container).data('islock')){
				$(container).data('islock', true);

				var w=$(container).innerWidth();
				var h=$(container).innerHeight();
				var tl=$(container).offset().left;
				$(document.createElement('div'))
				.attr('data-role', 'common-ui-lock-cover')
				.data('target', container)
				.css({
					'position':'absolute',
					'left':tl+'px',
					'width':w+'px',
					'height':h+'px',

					'z-index':999
				})
				.append($(document.createElement('div'))
					.attr('data-role', 'common-ui-lock-cover-bg')
					.css({
						'width':'100%',
						'height':'100%',
						'background-color':'#fff',
						'opacity':.5
					})
					.bind({
						'click':function(e){
							e.preventDefault();
							return false;
						}
					})
				)
				.append($(document.createElement('div'))
					.attr('data-role', 'common-ui-lock-cover-container')
					.css({
						'position':'absolute',
						'left':'50%',
						'top':'50%',
						'z-index':1
					})
				)
				.appendTo($(container));
			}else{
				this.resize_lock_area();
			};
		}else{
			$(container).find('div[data-role=common-ui-lock-cover]').remove();
			$(container).data('islock', false);
		};

		// 2. adjust-tabIndex
		$(container).find(':focusable').each(function(a){
			if(String($(this)[0].nodeName).toUpperCase()!='SELECT'){
				if(bool){
					/**
					 * tabIndex 값이 있는지 화인 (-1)만 체크
					 */
					var aindex=$(this).attr('tabIndex');

					if(aindex!=undefined){
						$(this).attr('data-tabindex', aindex);
					};

					$(this).attr('tabIndex', '-1');
				}else{
					if($(this).attr('data-tabindex')!='-1'){
						$(this).removeAttr('tabIndex');
					};
				};
			};
		});
	},
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:HEADER
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_header:function(){
		this._header=new CommonHeader();
	},

	complete_header:function(){
		if(this._header!=null) this._header.complete();
	},

	collision_header:function(e){
		if(this._header!=null) this._header.collision(e);
	},

	resize_header:function(){
		if(this._header!=null) this._header.resize();
	},


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:FOOTER
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_footer:function(){
		this._footer=new CommonFooter();
	},

	scroll_footer:function(e, isreset){
		if(this._footer!=null) this._footer.scroll(e, isreset);
	},




	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 2014-11-07 IE7 ~ IE8 CSS3 대응
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_ie_css3:function(){		
		if($('body').hasClass('msie7') || $('body').hasClass('msie8')){
			$('ul').each(function(){	
				if($(this).hasClass('bank-list')){
					$(this).find('li:nth-child(5n+1)').addClass('5n_1');
				}
				if($(this).hasClass('chk-list')){
					$(this).find('li:nth-child(4n)').addClass('4n');
					$(this).find('li:nth-child(4n+1)').addClass('4n_1');
					$(this).find('li:nth-child(4n+2)').addClass('4n_2');
					$(this).find('li:nth-child(4n+3)').addClass('4n_3');
				}
								if($(this).hasClass('chart-list')){
					$(this).find('li:nth-child(3n)').addClass('3n');
				}
				// ie8에서 nth class 잘못들어가는 에러 수정 - 최웅 				
				var num = $(this).children('li').length;
				$(this).children('li').each(function(i){
					var number = i + 1;
					for(var i = 1; i < num; i++){
						$(this).addClass('nth_' + number);
					}
				});
				// 2014.11.17 bluewebd add
				$(this).find('li:last-child').addClass('last');
				$(this).find('li:nth-child(even)').addClass('even');
				$(this).find('li:nth-child(odd)').addClass('odd');
				$(this).find('li:nth-child(10n)').addClass('nth_10n');
				$(this).find('li:nth-child(12n)').addClass('nth_12n');
				
				if($(this).hasClass('tab-type3')){
					$(this).find('li:nth-child(2n+1)').addClass('2n_1');
				}
			});
			$('dl').each(function(){	
				var num = $(this).find('dd').length;
				$(this).find('dd').each(function(i){
					var number = i + 1;
					for(var i = 1; i < num; i++){
						$(this).addClass('nth_' + number);
					}
				});
			});
			$('.retire-step thead tr').each(function(){	
				var num = $(this).find('th').length;
				$(this).find('th').each(function(i){
					var number = i + 1;
					for(var i = 1; i < num; i++){
						$(this).addClass('nth_' + number);
					}
				});
			});
			$('li.step2 dd').each(function(){	
				var num = $(this).find('dl').length;
				$(this).find('dl').each(function(i){
					var number = i + 1;
					for(var i = 1; i < num; i++){
						$(this).addClass('nth_' + number);
					}
				});
			});
			$('table').each(function(){
				$(this).find('tr:nth-child(even)').addClass('even');
				$(this).find('tr:nth-child(odd)').addClass('odd');
				$(this).find('tr').each(function(){
					var num = $(this).find('td').length;
					$(this).find('td').each(function(i){
						var number = i + 1;
						for(var i = 1; i < num; i++){
							$(this).addClass('nth_' + number);
						}
					});
				});			
				
				
				if($(this).hasClass('tbl-type-black')){
					$(this).find('tr:nth-child(2n)').addClass('2n');
				}

				if($(this).hasClass('calculator')){
					var num = $(this).find('tbody').find('tr').length;
					$(this).find('tbody').find('tr').each(function(i){
						var number = i + 1;
						for(var i = 1; i < num; i++){
							$(this).addClass('nth_' + number);
						}
					});
				}
			});
		}
	},
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:TREE-NAVIGATION
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_moreBtn:function(){
			if(ValidationUtil.is_null($(this).data('manager'))){
				$(this).data('manager', new CommonMoreBotton($(this)));
			};
	},
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:COMMON-PlACEHOLDER-LABEL 
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init_placeholderLabel:function(){
			new CommonPlaceholderLabel();
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // METHOD:Mobile key-pad
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    init_moobileKeyPad:function(){
        $('div.pw_box,div.pw_box_etc').each(function(a){
            if(ValidationUtil.is_null($(this).data('manager'))&& ValidationUtil.is_mobile()){
                            $(this).data('manager', new CommonMobileKeyPad($(this)));
            };
        });
    }
});









