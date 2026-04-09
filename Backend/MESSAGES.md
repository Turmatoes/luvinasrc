# 📋 Danh sách mã lỗi & thông báo hệ thống

> **Quy ước placeholder:**
> - `{0}` → Tên hàng mục trên màn hình (画面項目名)  
> - `{1}`, `{2}` → Các tham số bổ sung (số ký tự, giá trị so sánh, v.v.)

---

## ❌ Mã lỗi (Error Codes)

| Mã lỗi | Tên check | Nội dung Tiếng Việt | Nội dung Tiếng Nhật | API | UI |
|:------:|-----------|---------------------|---------------------|:---:|:--:|
| **ER001** | Không nhập | Hãy nhập `{0}` | `{0}`を入力してください | ✅ | ✅ |
| **ER002** | Không chọn | Hãy chọn `{0}` | `{0}`を入力してください | ✅ | ✅ |
| **ER003** | Đã tồn tại | `{0}` đã tồn tại | `{0}`は既に存在しています。 | ✅ | ✅ |
| **ER004** | Không tồn tại | `{0}` không tồn tại | `{0}`は存在しいません。 | ✅ | ✅ |
| **ER005** | Sai format | Hãy nhập `{0}` định dạng `{1}` | `{0}`の`{1}`形式で入力してください | ✅ | ✅ |
| **ER006** | Vượt maxlength | `{0}` không được vượt quá `{1}` ký tự | `{0}`は`{1}`文字以内で入力してください | - | ✅ |
| **ER007** | Độ dài ngoài khoảng | `{0}` phải từ `{1}` đến `{2}` ký tự | `{0}`は`{1}`〜`{2}`桁で入力してください | - | ✅ |
| **ER008** | Không phải ký tự 1 byte | `{0}` chỉ chấp nhận ký tự 1 byte | `{0}`に半角英数を入力してください | - | ✅ |
| **ER009** | Không phải Katakana | `{0}` phải là ký tự Katakana | `{0}`をカタカナを入力してください | - | ✅ |
| **ER010** | Không phải Hiragana | `{0}` phải là ký tự Hiragana | `{0}`をひらがなを入力してください | - | ✅ |
| **ER011** | Không hợp lệ | `{0}` không hợp lệ | `{0}`は無効です | - | ✅ |
| **ER012** | Ngày hết hạn sai | Ngày hết hạn phải lớn hơn `{0}` (Ngày cấp chứng chỉ) | 失効日は「`{0}`」より求めの日付にいれてください。 | - | ✅ |
| **ER013** | User không tồn tại (thêm) | User không tồn tại | 追加するユーザが存在しません。 | ✅ | - |
| **ER014** | User không tồn tại (xóa) | User không tồn tại | 追加するユーザが存在しません。 | ✅ | - |
| **ER015** | Lỗi database | Hệ thống đang có lỗi | システムエラーが発生しました。 | ✅ | - |
| **ER016** | Sai tên đăng nhập / mật khẩu | Tên đăng nhập hoặc Mật khẩu bị sai | 「アカウント名」または「パスワード」は不正です。 | ✅ | ✅ |
| **ER017** | Mật khẩu xác nhận sai | Mật khẩu xác nhận không đúng | 「パスワード確認」が正しくありません。 | - | ✅ |
| **ER018** | Không phải số halfsize | `{0}` phải là số halfsize | `{0}`は半角数字で入力してください。 | - | ✅ |
| **ER019** | Tên đăng nhập không hợp lệ | Tên đăng nhập chỉ chấp nhận ký tự (a-Z, 0-9 và _). Ký tự đầu không phải số | 「アカウント名」は(a-Z, 0-9 と_)のみです。最初の文字は数字ではない。 | ✅ | ✅ |
| **ER020** | Không thể xóa admin | Không thể xóa user admin | 管理者ユーザを削除することはできません。 | ✅ | - |
| **ER021** | Thứ tự sắp xếp sai | Thứ tự sắp xếp phải là ASC, DESC | ソートは(ASC, DESC)でなければなりません。 | ✅ | - |
| **ER022** | Trang không tồn tại | Page not found | ページが見つかりません。 | ✅ | - |
| **ER023** | Lỗi hệ thống | Hệ thống đang có lỗi | システムエラーが発生しました。 | ✅ | ✅ |

---

## ✅ Mã thông báo thành công (Message Codes)

| Mã | Nội dung Tiếng Việt | Nội dung Tiếng Nhật |
|:--:|---------------------|---------------------|
| **MSG001** | Đăng ký User thành công | ユーザの登録が完了しました。 |
| **MSG002** | Cập nhật User thành công | ユーザの更新が完了しました。 |
| **MSG003** | Xóa User thành công | ユーザの削除が完了しました。 |
| **MSG004** | Xác nhận trước khi xóa | 削除しますか、よろしいでしょうか。 |
| **MSG005** | Không tìm thấy user | 検索条件に該当するユーザが見つかりません。 |

---

## 🔖 Ghi chú nhanh khi code

### Cấu trúc Response lỗi (API)
```json
{
  "code": "ER001",
  "message": "{0}を入力してください"
}
```

### Các lỗi thường gặp theo API endpoint

| Endpoint | Mã lỗi có thể trả về |
|----------|----------------------|
| `POST /login` | ER016, ER023 |
| `GET /employees` | ER021, ER022, ER023 |
| `POST /employees` | ER001, ER003, ER006, ER008, ER009, ER012, ER015, ER019, ER023 |
| `PUT /employees/{id}` | ER001, ER004, ER006, ER008, ER009, ER012, ER015, ER023 |
| `DELETE /employees/{id}` | ER014, ER020, ER015, ER023 |

### Kiểu xử lý validate
- **API** ✅ → Validate ở tầng Service/Controller, trả về trong response body
- **UI** ✅ → Validate ở Frontend trước khi gửi request

### Placeholder conventions
| Placeholder | Ý nghĩa |
|-------------|---------|
| `{0}` | Tên field (vd: "Tên nhân viên", "Ngày sinh") |
| `{1}` | Giá trị giới hạn 1 (vd: maxlength = 50) |
| `{2}` | Giá trị giới hạn 2 (vd: minlength = 10) |
