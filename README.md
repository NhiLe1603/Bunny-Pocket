# 🐰 Bunny Pocket

Sổ chi tiêu riêng của Nhi: đen, hồng pastel và một chú thỏ nhỏ. Chạy độc lập trên GitHub Pages; không cần Claude, ChatGPT, máy công ty, API key, server hoặc cơ sở dữ liệu online.

## Đưa app lên GitHub cá nhân

1. Giải nén gói này trên máy cá nhân.
2. Tạo repository mới trên tài khoản GitHub cá nhân, ví dụ `bunny-pocket`.
3. Upload **nội dung bên trong thư mục bunny-pocket** vào repository. Ở cấp đầu tiên phải thấy `docs`, `tests`, `package.json` và `README.md`. Không upload nguyên file ZIP. Không đưa backup JSON/CSV cá nhân lên repository.
4. Mở **Settings → Pages → Build and deployment**.
5. Chọn **Deploy from a branch**, branch **main**, folder **/docs**, rồi **Save**.
6. Chờ GitHub triển khai. Đường link chính xác sẽ hiện trong trang Pages; bấm **Visit site**.
7. Mở link đó trong Safari trên iPhone. Đợi nhãn **Sẵn sàng offline** xuất hiện. Bấm Chia sẻ → **Thêm vào Màn hình chính**; bật **Open as Web App / Mở dưới dạng ứng dụng web** nếu có tuỳ chọn này.
8. Mở app bằng icon thỏ. Thử thêm một khoản nhỏ, đóng/mở lại app, rồi bật chế độ máy bay để kiểm tra dùng offline trước khi nhập nhiều dữ liệu.

Nếu GitHub không cho bật Pages với repository private theo gói tài khoản đang dùng, có thể dùng repository public chứa **chỉ mã nguồn**. Dữ liệu bạn nhập không tự được gửi lên repository. Website không có đăng nhập; mỗi thiết bị giữ dữ liệu riêng. Bất kỳ ai có link cũng mở được giao diện nhưng không nhận dữ liệu nằm trên iPhone của bạn.

Nguồn hướng dẫn chính thức: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Apple: thêm website thành app](https://support.apple.com/en-eg/guide/iphone/iphea86e5236/ios).

## Dùng hằng ngày

- **Lịch:** chọn ngày, bấm +, nhập mô tả và số tiền. Hỗ trợ `165700`, `165k`, `165.7k`, `165,7k`, `165.700`, `165,700`. Nút `+000` nhân số hiện tại với 1.000; ví dụ nhập `165` rồi bấm sẽ thành `165000`.
- **Ai trả** là người thực sự thanh toán. **Cách chia** là người phải chịu chi phí. Hai thông tin này được tính riêng.
- **Tuỳ chỉnh** luôn nhập phần của người thứ hai (mặc định Quyên). Ví dụ tổng 155k, Quyên chịu 58k, Nhi trả → Quyên nợ Nhi 58k. Nếu Quyên trả toàn bộ → Nhi nợ Quyên 97k.
- **Tiền lẻ:** app dùng số nguyên đồng. Khoản lẻ khi chia đôi được cộng 1đ vào phần người thứ nhất, đảm bảo hai phần cộng đúng tổng.
- **Tự nhớ:** gõ chính xác mô tả đã dùng (không phân biệt hoa/thường) để điền lại danh mục, kiểu chia và số tiền tuỳ chỉnh lần trước. Không tự thay người trả; hãy kiểm tra các trường trước khi lưu.
- **Sửa/xoá:** nằm trên từng khoản ở lịch. Khoản đã chốt bị khoá; hãy hoàn tác kỳ chốt trước khi sửa.

## Chốt tiền qua nhiều tháng

Mặc định mục **Chia tiền → Tất cả các tháng** cộng toàn bộ khoản **chưa chốt** bất kể tháng. Bạn không cần chốt vào ngày cuối tháng.

1. Xem số tiền “Quyên cần trả Nhi” hoặc chiều ngược lại.
2. Bấm **Sao chép tổng kết** và dán gửi qua Zalo/Messenger. Nếu trình duyệt chặn clipboard, app mở nội dung để bạn sao chép thủ công.
3. Sau khi thực sự đã trả đủ, bấm **Ghi nhận đã thanh toán**.
4. Các khoản trong phạm vi đang xem được đánh dấu đã chốt. Chốt toàn bộ thì số dư về 0, khoản mới sẽ bắt đầu cộng lại. Tổng chi lịch sử vẫn giữ nguyên.
5. Có thể **Hoàn tác** bất kỳ kỳ nào nếu chốt nhầm. Chỉ các khoản trong kỳ đó được mở lại.

Có thể lọc **Một tháng** hoặc **Nhiều tháng liên tiếp** (từ tháng–đến tháng). Chốt trong phạm vi lọc chỉ đóng các khoản thuộc phạm vi đó; nợ ngoài phạm vi vẫn tồn tại. Muốn đóng toàn bộ nợ, chọn **Tất cả các tháng**.

Đây là chốt **trả đủ** cho một nhóm khoản; chưa hỗ trợ nhận trả một phần. Khi tổng hai chiều nợ bù trừ về 0 nhưng còn khoản chưa chốt, nút **Chốt các khoản đã cân bằng** sẽ đóng kỳ mà không cần chuyển tiền.

Nếu bạn chuyển từ Excel sang, nhập số dư còn nợ ở **Cài đặt → Nợ từ trước khi dùng app** và chọn đúng chiều nợ. Không nhập lại cả số dư và các khoản lịch sử đã tạo ra số dư đó. Bản này để dữ liệu trống; không tự nhập số tiền từ ba ảnh chụp vì ảnh chưa thể hiện toàn bộ dữ liệu và năm của từng khoản.

## Thẻ & chi cố định

- Quản lý riêng, không cộng vào nợ chia tiền.
- Trong Cài đặt, tạo phân loại và mẫu: tên thẻ/hạng mục, số tiền dự kiến, ngày đến hạn mỗi tháng.
- Tại **Thẻ & chi cố định**, chọn tháng rồi bấm **Tạo từ mẫu**. Bấm nhiều lần không tạo trùng. Nếu ngày 31 nhưng tháng ngắn hơn, dùng ngày cuối tháng.
- Sửa số tiền thực tế theo sao kê. Có thể thêm khoản riêng lẻ, ghi nhận đã trả và chỉnh ngày trả.
- Sửa hoặc xoá mẫu không làm thay đổi khoản của tháng đã tạo. Mẫu được áp dụng khi bạn chủ động tạo cho tháng cần dùng, không âm thầm tạo nhiều tháng.
- App chỉ ghi nhận số bạn nhập; không kết nối ngân hàng, tự tính lãi/phí/hạn mức hoặc gửi thông báo nhắc hạn.

## Dữ liệu & backup

Dữ liệu lưu trong **localStorage của trình duyệt/app trên thiết bị đang dùng**. Không tự gửi lên GitHub, Claude, ChatGPT, ngân hàng hoặc server. Không có analytics hay tài nguyên/font bên ngoài.

- **Tải backup JSON:** lưu đầy đủ cài đặt, khoản chi, số dư ban đầu, lịch sử chốt, mẫu định kỳ và khoản cố định. Lưu trong Files/iCloud cá nhân sau mỗi lần chốt hoặc định kỳ.
- **Khôi phục:** kiểm tra file trước khi ghi; khôi phục thay thế toàn bộ dữ liệu hiện tại, không gộp. Nên backup hiện tại trước khi khôi phục.
- **CSV:** xuất toàn bộ dữ liệu chi tiêu hoặc chi cố định; mở được bằng Excel. CSV không thay thế backup JSON.
- Đổi điện thoại, xoá dữ liệu Safari/app, chuyển trình duyệt, xoá/cài lại app hoặc đổi địa chỉ website có thể làm bạn không còn truy cập dữ liệu cũ. Hãy backup trước.
- Dùng nhất quán icon app trên màn hình chính. Không giả định dữ liệu luôn chia sẻ giữa Safari và app đã cài, hoặc giữa điện thoại và laptop.
- Dữ liệu không được mã hoá bởi app; người sử dụng được thiết bị/trình duyệt có thể xem. Bảo vệ điện thoại bằng khoá thiết bị.
- Nếu dữ liệu lưu bị lỗi, app không ghi đè bản gốc. Vào Cài đặt để tải bản dữ liệu gốc hoặc khôi phục file backup hợp lệ.

## Chạy thử trên máy cá nhân

Không mở `index.html` trực tiếp bằng `file://`, vì module JavaScript và service worker cần web server.

```sh
python3 -m http.server 8000 --directory docs
```

Mở `http://localhost:8000`. Để cài trên iPhone, dùng link HTTPS từ GitHub Pages.

## Kiểm tra mã nguồn

Không cần cài thư viện hoặc build để triển khai. Node.js chỉ cần nếu muốn chạy kiểm tra:

```sh
npm test
```

Các kiểm tra gồm chia lẻ, chia riêng/tuỳ chỉnh, cả hai chiều người trả, nợ ban đầu, nhiều tháng, chốt/hoàn tác, chống chốt trùng, backup hợp lệ/lỗi, mẫu định kỳ, CSV và bộ nhớ offline theo đường dẫn project của GitHub Pages.

Đã thử luồng nhập tuỳ chỉnh, lưu, chốt về 0, tạo mẫu định kỳ và ghi nhận thanh toán trong trình duyệt. Cài đặt thực tế trên Safari/iPhone và tải lại offline cần kiểm tra sau khi bạn triển khai HTTPS; môi trường xem trước dùng HTTP nên không thể xác nhận trực tiếp phần này trên iPhone.

## Cập nhật app sau này

Giữ nguyên repository/đường link để giữ cùng vùng lưu dữ liệu. Backup trước khi cập nhật. Sửa các file trong `docs`; nếu thay đổi bộ file offline, tăng phiên bản `CACHE` trong `docs/sw.js`. Đợi GitHub triển khai, mở app khi có mạng rồi mở lại để nhận bản mới. Không bao giờ đưa file backup JSON/CSV vào `docs` hoặc repo public.

`docs` là toàn bộ app. `tests` chứa kiểm tra tính tiền/offline. Không có tài khoản, API key hoặc dữ liệu chi tiêu thật trong gói này.
