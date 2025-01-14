VẤN ĐỀ REVALIDATE BY TAG:
chỉ tác dụng với các api call từ ssr mà có gắn tag tương ứng -> có hiệu ứng realtime
Đúng vậy! router.refresh() chỉ có hiệu quả khi dữ liệu được lấy thông qua cơ chế SSR (hoặc những API được gọi từ phía server khi render). Nếu bạn đang gọi API trực tiếp trong useEffect (hoặc từ phía client), router.refresh() sẽ không ảnh hưởng đến dữ liệu được tải bởi các lệnh fetch này. Để cập nhật dữ liệu trong trường hợp này, bạn sẽ cần gọi lại API trong useEffect hoặc sử dụng phương thức khác để lấy dữ liệu mới từ phía client.

VẤN ĐỀ PHÂN QUYỀN:
singer khi bị ban thì ko thể đăng và cập nhật được bài hát chứ vẫn có thể xóa bài hát và xem bình thường
bài hát khi bị ban thì ko xuất hiện trong danh sách bài hát nhưng vẫn đang có thể nghe trong playlist nếu thêm từ trước và vẫn có thể xem trong danh sách tim

VẤN ĐỀ XÓA VÀ CÁC PHẦN LIÊN QUAN SAU KHI XÓA:
nếu như xóa singer mà song gọi singerId thì phải xử lý ở fe vì be gọi ra là null nếu gọi populate còn ko thì sẽ là id cũ nhưng id đó ko tồn tại
