# CardTrack 💳

Ứng dụng PWA quản lý thẻ tín dụng & cashback — chạy offline trên iPhone.

## Tính năng

- **Chọn thẻ** — theo dõi 17 thẻ tín dụng
- **Dashboard thẻ** — progress bar cashback theo lĩnh vực, cảnh báo đạt mức tối ưu
- **Gợi ý Shop** — tìm shop → gợi ý thẻ nên dùng kèm cashback còn lại
- **Giao dịch** — lọc theo thẻ/tháng, tổng cashback ước tính
- **Thêm giao dịch** — tự chọn lĩnh vực cashback, gợi ý shop, preview CB
- **Auto-purge** — tự xóa giao dịch khi sang kỳ sao kê mới

## Cài đặt trên iPhone

1. Mở link GitHub Pages bằng **Safari**
2. Tap nút **Share** (↑) → **Add to Home Screen**
3. App xuất hiện trên Home Screen, chạy fullscreen

## Deploy lên GitHub Pages

```bash
git init
git add .
git commit -m "CardTrack v1"
git branch -M main
git remote add origin https://github.com/<username>/cardtrack.git
git push -u origin main
```

Sau đó vào **Settings → Pages → Source: main / root → Save**.

App sẽ live tại: `https://<username>.github.io/cardtrack/`

## Tech

- Vanilla HTML/CSS/JS — single file, no framework
- PWA với Service Worker — offline capable
- localStorage — dữ liệu lưu trên device
- Dark mode, safe area support cho iPhone notch/Dynamic Island
