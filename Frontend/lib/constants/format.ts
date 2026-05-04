/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * format.ts, April 21, 2026 nxplong
 */

/**
 * Regex cho các định dạng đặc thù.
 */
export const KATAKANA_REGEX = /^[ｦ-ﾟ\s]+$/;
export const LOGIN_ID_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
export const TELEPHONE_REGEX = /^0\d{9}$/; // 10 số, bắt đầu bằng 0
export const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
export const NUMERIC_REGEX = /^[0-9]+$/;
export const DATE_FORMAT = 'yyyy/MM/dd';
