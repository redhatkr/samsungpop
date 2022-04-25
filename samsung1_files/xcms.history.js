/*************************************************************************************************
 *
 * XCMS-HISTORY
 *
 * @description - window.openMenu()로 이동시에 이동메뉴에 대한 히스토리 관리
 *
 *************************************************************************************************/
var XCMSHistory=Class.extend({
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	init:function(){
		this._infos=new Array();
		this._info_last=null;

		this.reinit();
	},

	reinit:function(){
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:PARAM
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * set-info
	 *
	 * @description - 메뉴 정보 저장
	 * @param	{Object} info
	 * @return	void
	 */
	set_info:function(info){
		if(!this.is_exist(info)){
			this._infos.push(info);
		};
	},


	/**
	 * get-info
	 *
	 * @description - url를 기반으로 해당 메뉴 정보 취득, '/sscommon/jsp/trustnet_gw.jsp?url='이 없을때만 체크
	 * @param	{String} url
	 * @return	{Object}
	 */
	get_info:function(url){
		var atotal=this._infos.length;
		var output={'isfind':false, 'info':null};
		var url=$.trim(String(url));

		// 1. search (최신순으로)
		for(var a=atotal-1; a>=0; a--){
			var ainfo=this._infos[a];
			var aurl=$.trim(String(ainfo.url).replace('/sscommon/jsp/trustnet_gw.jsp?url=', ''));

			if(aurl==url){
				output={
					'isfind':true,
					'info':this._infos[a]
				};
				break;
			};
		};

		// 2. modify
		/**
		 * 검색된 결과가 없으면 가장 마지막 메뉴코드 사용
		 * 탭으로 구성된 페이지에서의 이동시가 유력
		 */
		if(!output.isfind){
			output={
				'isfind':false,
				'info':this._infos[atotal-1]
			};
		};

		return output;
	},

	/**
	 * set-info-last
	 *
	 * @description - 마지막으로 호출한 메뉴 갱신
	 * @param	{Object} info - 메뉴정보
	 * @return	void
	 */
	set_info_last:function(info){
		this._info_last=new Object();
		this._info_last=info;
	},

	/**
	 *get-last-history
	 *
	 * @description - 마지막으로 호출한 메뉴 정보 취득
	 * @return	{Object} 메뉴정보
	 */
	get_info_last:function(){
		return this._info_last;
	},

	/**
	 * 중복여부 확인
	 */
	is_exist:function(info){
		var isexist=false;

		for(var a in this._infos){
			var ainfo=this._infos[a];

			if(
				($.trim(ainfo.code)==$.trim(info.code)) &&
				($.trim(ainfo.url)==$.trim(info.url))
			){
				isexist=true;
				break;
			}
		};
		return isexist;
	},


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// METHOD:OPERATION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * push
	 *
	 * @description - 메뉴 정보 저장
	 * @param	{Object} info
	 * @return	void
	 */
	push:function(info){
		this.set_info(info);
		this.set_info_last(info);
	},

	/**
	 * search
	 *
	 * @description - 메뉴 정보 검색
	 * @param	{String} url
	 * @return	{Object}
	 */
	search:function(url){
		return this.get_info(url);
	}
});










