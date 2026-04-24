/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * messages.ts, April 13, 2026 nxplong
 */
/**
 * Các thông báo hệ thống.
 * Mapping từ Error/Message codes sang tiếng Việt.
 */
export const MESSAGES: Record<string, string> = {
  // Mã lỗi
  ER001: '{0}を入力してください',
  ER002: '{0}を選択してください',
  ER003: '{0}は既に存在しています。',
  ER004: '{0}は存在しいません。',
  ER005: '{0}の{1}形式で入力してください',
  ER006: '{0}は{1}文字以内で入力してください',
  ER007: '{0}は{1}〜{2}桁で入力してください',
  ER008: '{0}に半角英数を入力してください',
  ER009: '{0}をカタカナを入力してください',
  ER010: '{0}をひらがなを入力してください',
  ER011: '{0}は無効です',
  ER012: '失効日は「{0}」より求めの日付にいれてください。',
  ER013: '追加するユーザが存在しません。',
  ER014: '追加するユーザが存在しません。',
  ER015: 'システムエラーが発生しました。',
  ER016: '「アカウント名」または「パスワード」は不正です。',
  ER017: '「パスワード確認」が正しくありません。',
  ER018: '{0}は半角数字で入力してください。',
  ER019: '「アカウント名」は(a-Z, 0-9 と_)のみです。最初の文字は数字ではない。',
  ER020: '管理者ユーザを削除することはできません。',
  ER021: 'ソートは(ASC, DESC)でなければなりません。',
  ER022: 'ページが見つかりません。',
  ER023: 'システムエラーが発生しました。',

  // Mã thông báo
  MSG001: 'ユーザの登録が完了しました。',
  MSG002: 'ユーザの更新が完了しました。',
  MSG003: 'ユーザの削除が完了しました。',
  MSG004: '削除しますか、よろしいでしょうか。',
  MSG005: '検索条件に該当するユーザが見つかりません。',
};

/**
 * Tên các trường dữ liệu hiển thị (Labels).
 */
export const LABELS: Record<string, string> = {
  ACCOUNT_NAME: 'アカウント名',
  GROUP: 'グループ',
  FULL_NAME: '氏名',
  KANA_NAME: 'カタカナ氏名',
  BIRTH_DATE: '生年月日',
  EMAIL: 'メールアドレス',
  TELEPHONE: '電話番号',
  PASSWORD: 'パスワード',
  PASSWORD_CONFIRM: 'パスワード（確認）',
  CERTIFICATION: '資格',
  CERT_START_DATE: '資格交付日',
  CERT_END_DATE: '失効日',
  SCORE: '点数',
};
