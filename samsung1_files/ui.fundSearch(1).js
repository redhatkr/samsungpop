var SSP = SSP || {};

/*************************************************************************
  *  JquerySlide Wrap SSP 
  *  slide type : Range
  *  _scope : slide 영역
  *  _output : slide 설정값 [ 기본 slide > input(DOM) ]
  *  _min : 최저값
  *  _max : 최고값
  *  _step : slide 이동값 단위
  *  _range : min (핸들 한개) / true (핸들 두개)
  *  
  *  @useSample  SSP.wrapSlider.init('#fundRateVal', '#fundRate', 0, 100, 20 , testFn);
  *  
  *************************************************************************/
 (function($){
 	'use strict';
 	var wrapSlider = {
 			_scope : null  // slide 영역
 			,_output : null // slide 설정값 display
 			,_min : 0 
 			,_max : 0
 			,_step : 1
 			,_range : true
 	};
 	
 	var wr = wrapSlider;
 	
 	wr.reInit = function(){
 		
 	};
 	
 	wr.init = function(_tempOutput, _tempScope, _tempMinValue, _tempMaxValue, _tempStep , _tempCustomFn , _tempPoint , _tempDefaultValue){
 		var defaulValue = _tempDefaultValue || _tempMinValue 
 			,defaultMin = _tempMinValue || this._min
 			,defaultMax = _tempMaxValue || this._max
 			,defaultStep = _tempStep || this.step
 			,outputTarget= _tempOutput
 			,defaultRange = _tempPoint== undefined ? this._range:false
 			,roundTarget = _tempScope
 			,selectOption = null;
 		this._scope = _tempScope;
 		
 		/**
 		 * slider type option 설정 분기
 		 */
 		if(defaultRange){
 			//twoPoint
 			selectOption = {
                range: this._range,
                min: defaultMin,
                max: defaultMax,
                values:[defaultMin,defaultMax],
                step: defaultStep,
                create: function (event, ui){
                    var _tempUi = {};
                    _tempUi.values = [_tempMinValue,_tempMaxValue];
                    $(_tempOutput).val(_tempMinValue+','+_tempMaxValue);
                    wr.hiddenText(_tempScope,_tempUi.values ,event, _tempUi);
                    $( _tempScope ).find('.ui-slider-handle').first().append('<span class="hidden">'+$(_tempScope).parent().prev().find('.title').text()+' 시작값</span>');
                    $( _tempScope ).find('.ui-slider-handle').last().append('<span class="hidden">'+$(_tempScope).parent().prev().find('.title').text()+' 마지막값</span>');
                    sliderCallbak(event ,_tempUi);
                    },
                slide: sliderCallbak,
                change: sliderCallbak
 			};
 		}else{
 			//onePoint
 			selectOption =	{
 					range: "min",
 					value: defaulValue,
 					min: defaultMin,
 					max: defaultMax,
 					create: function (){
 						var _tempUi = {};
 						_tempUi.value = defaulValue;
 						exportType (null, _tempUi);
 						},
 					slide: exportType,
 					change: exportType
 			};
 		}
 		if($( _tempScope ).hasClass('ui-slider')){
 			$( _tempScope ).slider('destroy');
 		}
 		var _slider = $( _tempScope ).slider(selectOption);
 		wr.eventBinder( outputTarget, _slider);
 		_common.reinit_ui();
 		//슬라이더 콜백함수 ( slide 프로퍼티 )
		function sliderCallbak ( event ,  ui) {
			if(ui.values[0]==ui.values[1]){
				return false;
			}
			
			if(typeof(_tempCustomFn)!='undefined'){
				_tempCustomFn(event , ui);
				
			}
			$(_tempOutput).val(ui.values);
			wr.hiddenTextChange(_tempScope,ui.values);
		};
		
		function exportType( event, ui ){
			if(typeof(_tempCustomFn)!='undefined' && _tempCustomFn!=false  && _tempCustomFn!=' '){
				
				_tempCustomFn(ui , event);
			}	
			wr.exportInput(outputTarget , ui.value);

			if(roundTarget.contains("#assetsPrice")){
				$(roundTarget).find('.ui-slider-handle').attr("title", "투자금액" + ui.value + "백만 원");
			}else if(roundTarget.contains("#assetsMonth")){
				$(roundTarget).find('.ui-slider-handle').attr("title", "매월적립금액" + ui.value + "만원");
			}else if(roundTarget.contains("#assetsPrieod")){
				$(roundTarget).find('.ui-slider-handle').attr("title", "투자기간" + ui.value + "년");
			}
		}
		
 	},
 	
 	wr.exportInput = function(_targetInput ,_inputValue){
		$(_targetInput).val(_inputValue);
	},
 	
	wr.eventBinder = function( tempOutput , tempSlider){
		if(tempOutput){
			var target = $(tempOutput);
			switch(target[0].tagName){
			case 'INPUT':
				target.on('blur', function(){
					var inputV = StringUtil.to_pureNumber($(this).val());
					tempSlider.slider( "value", inputV );
				});
				break;
			case 'SELECT':
				target.on('change', function(){
					var selectV = StringUtil.to_pureNumber($(this).val());
					tempSlider.slider( "value", selectV );
				});
				break;	
				
			default:
				// 현재 요건 input
				break;
		};
			
		}
			
		
	},
	wr.hiddenText = function(_target, _tvalues){
	    var slideTarget = _target;
	    var titleText = $(slideTarget).parent().prev().find('.title').text();
	    var guideList = $(slideTarget).find('>.guide-txt> em').toArray();

	    var startNum = _tvalues[0] == 0 ? 0:1;
	    var minV = _tvalues[0] - startNum;
	    var maxV = _tvalues[1] - startNum;

        var hiddenStart = $('<div/>');
            hiddenStart.addClass('hidden');
            hiddenStart.addClass('sliderStart');

        var hiddenEnd = $('<div/>');
            hiddenEnd.addClass('hidden');
            hiddenEnd.addClass('sliderEnd');
        var selectBox = $('<select title="'+titleText+' 슬라이더 대체 콤보박스(시작값)입니다." />');
	    var selectBox2 = $('<select title="'+titleText+' 슬라이더 대체 콤보박스(마지막값)입니다." />');
        var optionBase = '';
	    $.each(guideList, function (index, point) {
	    	if(minV == index){
	    		selectBox.append('<option value='+index+' selected="selected">'+$(point).text()+'</option>');
	    	}else{
	    		selectBox.append('<option value='+index+'>'+$(point).text()+'</option>');
	    	}
	    	
	    	if(maxV == index){
	    		selectBox2.append('<option value='+index+' selected="selected">'+$(point).text()+'</option>');
	    	}else{
	    		selectBox2.append('<option value='+index+'>'+$(point).text()+'</option>');
	    	}
         });
	    
	    selectBox.on('change', function(){
	    	var curVal = parseInt($(this).val(), 10) + 1;
            $(slideTarget).slider( "values",0,curVal);
        });
	    selectBox2.on('change', function(){
	    	var curVal = parseInt($(this).val(), 10) + 1;
            $(slideTarget).slider( "values",1,curVal);
        });
	    
        hiddenStart.append(selectBox);
        hiddenEnd.append(selectBox2);
        var inputBox = $('<input/>');
        inputBox.attr('type','hidden');
        inputBox.attr('title',titleText + '범위 슬라이더 선택 값입니다.');
        inputBox.attr('id','hi_'+slideTarget.replace('#',''));
        inputBox.val($(guideList[minV]).text()+','+$(guideList[maxV]).text());
        $(slideTarget).append(inputBox);
	    $(slideTarget).append(hiddenStart);
	    $(slideTarget).append(hiddenEnd);
	},
	wr.hiddenTextChange = function(_target, _tvalues){
	    var slideTarget = _target;
	    var guideList = $(slideTarget).find('>.guide-txt> em').toArray();
        var startNum = 1;
        var minV = _tvalues[0] - startNum;
        var maxV = _tvalues[1] - startNum;

        var sliderStart = $(slideTarget).find(".sliderStart").find(".select-box").find(".selecter").find("select").find("option");
        var sliderEnd = $(slideTarget).find(".sliderEnd").find(".select-box").find(".selecter").find("select").find("option");
        
        $.each(sliderStart, function (index, value) {
        	if($(this).val() == minV ){	
        		$(this).attr("selected",true);
        	}else{
        		$(this).attr("selected",false);
        	}
        });
        
        $.each(sliderEnd, function (index, value) {
        	if($(this).val() == maxV ){
        		$(this).attr("selected",true);
        	}else{
        		$(this).attr("selected",false);
        	}
        });
        
        $('#hi_'+slideTarget.replace('#','')).val($(guideList[minV]).text()+','+$(guideList[maxV]).text());
	};
 	
 	SSP.wrapSlider = wr;
 	
 	
 }($));
 
 
 /**
  * 
  * @param _tempUi
  */
 function testFn(_tempUi){
	 
	 
 }
 
 
 function callBackFundScale(event ,_tempUi ){
	 var startNum = _tempUi.values[0];
	 var endNum = _tempUi.values[1];
	 
	 $('.rangeShoe span').removeClass('on');
	 
	 for ( var i = startNum; i < endNum; i++) {
		 $('.rangeShoe span:eq('+i+')').addClass('on');
	 }
 }
 
 function showFund(FundCd,_this){
	 var divStr = '<div id="SHOWFUNDDIV">' ;
	 divStr += '<iframe name="layerIframe" src="/ux/kor/finance/fund/detail/view.do?FUND_CD=' + FundCd + '" title="공통펀드상세레이어" onload="fundAutoResize(this);" scrolling="no" frameborder="0"></iframe>' ;
	 divStr += '</div>' ; 
	 $("body").append(divStr) ; 
 }
 
function fundAutoResize(thisObj){
	$("#SHOWFUNDDIV").attr('height' , thisObj.contentWindow.document.body.scrollHeight + 20) ; 
}


$(function () {
	 $('.finduct_barChart .chart').each(function(_idx){
		 //drawFundChart(차트영역,날짜 ,데이터);
		 var that = this;
		 
		 drawFundChart($(that) ,testDate ,testChartData ,$(that).prev());
	 });
});


/**
 * 테스트용 데이터
 */
var testDate = ["2015-11-18", "2015-11-19", "2015-11-20", "2015-11-23", "2015-11-24", "2015-11-25", "2015-11-26", "2015-11-27", "2015-11-30", "2015-12-01" , "2016-12-01"];
var testChartData1 = [113.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8];
var testChartData2 = [-2.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0];
var testChartData3 = [-112.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5];
var testChartData = new Array(); 
		testChartData.push(testChartData1);
		testChartData.push(testChartData2);
		testChartData.push(testChartData3);

function drawFundChart($t, categories, data, $outTable) {
	 return new CHART_SPLINE($t, categories, data, {
		chart: {
			marginBottom: 19
		}
		, title: {text: "3개월 설정액추이와 수익률"}
		, xAxis: {tickInterval : 5, categories: categories}
		, yAxis: [{
//			tickAmount: 5
			title: {text: ''}
			, labels: {formatter: function() {return this.value + '%';}}
//			, tickInterval : 1
		 }, {
			gridLineWidth: 0
//			, tickInterval : 1
//			, tickAmount:5
			, title: {text: ''}
			, labels: {format: '{value} 억', style: {color: Highcharts.getOptions().colors[1]}}
			, opposite: true
		 }]
		 , plotOptions: {
			spline: {lineWidth: 1.5, marker: {enabled: false}}
			, events: {
				legendItemClick: function () {
					return false;
				}
			}
		}
		, tooltip: {
			useHTML: true
			, shared: true
			, formatter: function(){
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
					_suffix = this.series.name =="설정액" ? "억" : "%";
					tmpData.push('<tr><td style="color:'+this.series.color+';padding:0"><b>'+this.series.name+'</b></td>');
					tmpData.push('<td style="padding:0"><b> : '+this.y+_suffix+'</b></td></tr>');
				});
				tmpData.push('</table>');
				return tmpData.join('');
			}
		}
		, series: [{
			name: '수익률',
			data: data[0],
			marker: {symbol: 'circle'},
			color: '#e81a1a'  // 빨강
		 },	{
			name: '설정액',
			data: data[1],
			marker: {symbol: 'square'},
			color: '#b5d6ef' // 하늘

		 }, {
			yAxis:1,
			name: '동일유형평균',
			data: data[2],
			marker: {symbol: 'diamond'},
			color: '#ff8f1c' // 오렌지
		 }]
		, table: {
			width: 300							// 옵션
			, display: "blind"
		//	, exportTaget: $outTable  // 표로보기 버튼 특정영역에 붙일경우 
			, title: ["일자", "수익률", "설정액", "동일유형 평균"]
			, formatter: function (value) {
				return $.number(value, 2) + "%";
			}
		}
	},$outTable);
}



 