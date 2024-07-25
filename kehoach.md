home page: đưa ra các blog có lượt đánh giá cao 

           + chỉ xem với acount khác
           + với chủ posts có quyền chỉnh sửa quyền ứng dụng với các nội dung trên posts và comment 
login user: đăng nhập đăng kí và các thông tin các nhân 


sử lý lỗi

yêu cầu: tận dụng tối đa hệ thống code có sẵn trong bài
         cái tiến và vận dụng triệt để database



thiết kế database:

1 nội dung liên quan về blog

2 thông tin về người dùng 

3 nội dung comment ứng với mỗi blog và người dùng 



trạng thái gồm: no, user, bloger, admin


















          <a class="a edit" href="/edit/<%= post.id %>"><i class="fa-regular fa-thumbs-up"></i></a>
          <a class="a delete" href="/api/posts/delete/<%= post.id %>"><i class="fa-regular fa-comment"></i> </a>

finish fontend
admin: quản lý thành viên
       quản lý blog
       quản lý bình luận '
       lịch sử hoạt động 
       setting

bloger: quản lý bài viết của tôi 
        nhật kí hoạt động 
        setting 

user: trở thành bloger 
      nhật kí hoạt động 
      setting 


làm thêm về backend
admin: quản lý thành viên
       quản lý blog
       quản lý bình luận '
       lịch sử hoạt động 
       setting

bloger: quản lý bài viết của tôi 
        nhật kí hoạt động 
        setting 

user: trở thành bloger 
      nhật kí hoạt động 
      setting 


thanh dẫn đến  tài khoản tác giả
comment 
like dislike 
báo cáo 
xóa ẩn bình luận 
các tính năng riêng tư



bổ xung cookie session 
bổ xung login logout
làm setting cho tài khoản 
làm thông báo 



một trang cá nhân của một tác giả thì gồm 

