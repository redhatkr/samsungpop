/**
 *  Nethru Script Module
 *  Copyright 2008 nethru, All Rights Reserved.
 **/

var _n_sid = "07010100000";		/* custid */
var _n_ls = "http://wlog.samsungpop.com/wlo/Logging";		/* logging server */
var _n_uls = "http://wlog.samsungpop.com/wlo/UserLogging";	/* user logging server */
var _n_uid = "";			/* uid */
var _n_first_pcid = false;
var _n_click_logging_max = 30;
var _n_click_logging_num = 0;
var _n_click_images = new Object();

var _n_use_subcookie = false;

/* https logging */
if ( document.location.protocol == "https:" ) {
	_n_ls = "https://wlog.samsungpop.com/wlo/Logging";
	_n_uls = "https://wlog.samsungpop.com/wlo/UserLogging";
}

var _n_logging_image = new Image();				/* Common Logging Image */
var _n_user_image = new Image();					/* User Logging  */

for ( var i=0; i<_n_click_logging_max;i++) {
	_n_click_images[i] = new Image();
}

function n_getBI()
{
}

function n_getSubCV(cv,offset,escapeFlag,delim)
{
}

function n_getCV(dc, offset, escapeFlag)
{
}

function n_GetCookie(name,escapeFlag)
{
}

function n_GetSubCookie(name, cv)
{
}

function n_SetCookie(name, value)
{
}

function n_makePersistentCookie(name,length,path,domain)
{
}

function n_encodeStr(s)
{
}

function n_paramEncodeStr(s)
{
}

function n_getDomain()
{
}

function n_getReferrer()
{
}

function n_getCookieStr() 
{
	
}

/* User Attr Logging */
function n_userattr_logging()
{
}

function n_Logging_M() {
}

function n_Logging_P() {

}

/* Click Logging */
function n_click_logging(url)
{
	
}

function n_common_logging(_req, _ref, _title) {

}


/* Logging Function */
function n_logging() {

}

/* Parent Logging */
function n_parent_logging() {

}

function n_isIpType(val) {
	
}

function n_isInteger(val) {
	
}

function n_isDigit(num) {
	
}

function n_isBlank(val) {
	
}


