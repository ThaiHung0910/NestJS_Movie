CREATE DATABASE db_movie;
USE db_movie;

CREATE TABLE phim (
    ma_phim INT AUTO_INCREMENT PRIMARY KEY,
    ten_phim VARCHAR(255) NOT NULL,
    trailer VARCHAR(255),
    hinh_anh VARCHAR(255),
    mo_ta VARCHAR(255),
    ma_nhom VARCHAR(255),
    ngay_khoi_chieu DATE,
    danh_gia INT,
    hot BOOLEAN,
    dang_chieu BOOLEAN,
    sap_chieu BOOLEAN
);

CREATE TABLE banner (
    ma_banner INT AUTO_INCREMENT PRIMARY KEY,
    ma_phim INT,
    hinh_anh VARCHAR(255),
    FOREIGN KEY (ma_phim) REFERENCES phim(ma_phim)
);

CREATE TABLE he_thong_rap (
    ma_he_thong_rap INT AUTO_INCREMENT PRIMARY KEY,
    ten_he_thong_rap VARCHAR(255),
    logo VARCHAR(255)
);

CREATE TABLE cum_rap (
    ma_cum_rap INT AUTO_INCREMENT PRIMARY KEY,
    ten_cum_rap VARCHAR(255),
    dia_chi VARCHAR(255),
    ma_he_thong_rap INT,
    FOREIGN KEY (ma_he_thong_rap) REFERENCES he_thong_rap(ma_he_thong_rap)
);

CREATE TABLE rap_phim (
    ma_rap INT AUTO_INCREMENT PRIMARY KEY,
    ten_rap VARCHAR(255),
    ma_cum_rap INT,
    FOREIGN KEY (ma_cum_rap) REFERENCES cum_rap(ma_cum_rap)
);

CREATE TABLE ghe (
    ma_ghe INT AUTO_INCREMENT PRIMARY KEY,
    ten_ghe VARCHAR(255),
    loai_ghe VARCHAR(255),
    ma_rap INT,
    FOREIGN KEY (ma_rap) REFERENCES rap_phim(ma_rap)
);

CREATE TABLE lich_chieu (
    ma_lich_chieu INT AUTO_INCREMENT PRIMARY KEY,
    ma_rap INT,
    ma_phim INT,
    ngay_gio_chieu DATETIME,
    gia_ve INT,
    FOREIGN KEY (ma_rap) REFERENCES rap_phim(ma_rap),
    FOREIGN KEY (ma_phim) REFERENCES phim(ma_phim)
);

CREATE TABLE nguoi_dung (
    ma_nguoi_dung INT AUTO_INCREMENT PRIMARY KEY,
    tai_khoan VARCHAR(255) UNIQUE,
    ho_ten VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    so_dt VARCHAR(255),
    mat_khau VARCHAR(255),
    loai_nguoi_dung VARCHAR(255),
    ma_nhom VARCHAR(255),
    refresh_token VARCHAR(255)
);

CREATE TABLE dat_ve (
    ma_ve INT AUTO_INCREMENT,
    ma_nguoi_dung INT,
    ma_lich_chieu INT,
    ma_ghe INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_ve, ma_nguoi_dung, ma_lich_chieu, ma_ghe),
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung),
    FOREIGN KEY (ma_lich_chieu) REFERENCES lich_chieu(ma_lich_chieu),
    FOREIGN KEY (ma_ghe) REFERENCES ghe(ma_ghe)
);






INSERT INTO phim (ten_phim, trailer, hinh_anh, mo_ta, ma_nhom,ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu) VALUES
('Avengers: Endgame', 'https://www.youtube.com/watch?v=TcMBFSGVi1c&pp=ygUYYXZlbmdlcnMgZW5kZ2FtZSB0cmFpbGVy', 'https://i.pinimg.com/564x/0b/22/ec/0b22ec04f52dccdf28d7dbbd476f4037.jpg', 'The final showdown against Thanos.', "GP01",'2019-04-26', 9, TRUE, TRUE, FALSE),
('Inception', 'https://www.youtube.com/watch?v=YoHD9XEInc0&pp=ygUSIGluY2VwdGlvbiB0cmFpbGVy', 'https://i.pinimg.com/564x/96/07/dd/9607ddb58b5a327d7463833da63ce6fd.jpg', 'A mind-bending thriller by Christopher Nolan.', "GP01",'2010-07-16', 8, TRUE, TRUE, FALSE),
('Interstellar', 'https://www.youtube.com/watch?v=zSWdZVtXT7E&pp=ygUUSW50ZXJzdGVsbGFyIHRyYWlsZXI%3D', 'https://i.pinimg.com/originals/f0/0e/f4/f00ef4ef28062a3ffe32c80cfa039c86.jpg', 'A journey beyond the stars to save humanity.', "GP01",'2014-11-07', 8, TRUE, FALSE, TRUE),
('The Dark Knight', 'https://www.youtube.com/watch?v=EXeTwQWrcwY&pp=ygUXdGhlIERhcmsgS25pZ2h0IHRyYWlsZXI%3D', 'https://i.pinimg.com/564x/ea/a2/6e/eaa26e2c3bfa234c3cdd3c4d9fabad35.jpg', 'Batman faces off against the Joker.', "GP01",'2008-07-18', 9, TRUE, TRUE, FALSE),
('Forrest Gump', 'https://www.youtube.com/watch?v=bLvqoHBptjg&pp=ygUUZm9ycmVzdCBndW1wIHRyYWlsZXI%3D', 'https://i.pinimg.com/originals/30/13/00/301300685c5764e285e588fe839f829f.jpg', 'The extraordinary life of an ordinary man.', "GP01",'1994-07-06', 9, FALSE, FALSE, TRUE),
('The Matrix', 'https://www.youtube.com/watch?v=vKQi3bBA1y8&pp=ygUSdGhlIG1hdHJpeCB0cmFpbGVy', 'https://i.pinimg.com/564x/18/d7/4e/18d74ef46e722828f75cca91b009f4a5.jpg', 'A hacker discovers the shocking truth about reality.', "GP02",'1999-03-31', 8, TRUE, TRUE, FALSE),
('Titanic', 'https://www.youtube.com/watch?v=CHekzSiZjrY&pp=ygUPdGl0YW5pYyB0cmFpbGVy', 'https://i.pinimg.com/564x/8b/ae/2c/8bae2cd680a1e182517e9758d59814f4.jpg', 'A love story on the ill-fated ship.', "GP03",'1997-12-19', 9, TRUE, FALSE, TRUE),
('The Lord of the Rings: The Return of the King', 'https://www.youtube.com/watch?v=r5X-hFf6Bwo&ab_channel=Movieclips', 'https://i.pinimg.com/564x/84/03/60/8403600e339dc57a79fb2b7e93f70f71.jpg', "Portrays a climactic struggle against overwhelming darkness, where alliances are tested and heroes must rise to fulfill their destinies in a final, epic confrontation.", "GP04",'2003-12-17', 8, FALSE, FALSE, TRUE),
('Harry Potter and the Chamber of Secrets', 'https://www.youtube.com/watch?v=jBltxS8HfQ4&ab_channel=KinoCheck.com', 'https://i.pinimg.com/564x/93/ca/77/93ca77370e8f1852f01a8c3f6138d1dd.jpg', "Delves into a hidden threat lurking within a magical school, where secrets unravel and danger looms large.", "GP05",'2002-12-15', 9, TRUE, FALSE, FALSE),
('Harry Potter and the Goblet of Fire', 'https://www.youtube.com/watch?v=3EGojp4Hh6I&pp=ygUWaGFycnkgcG90dGVyIDQgdHJhaWxlcg%3D%3D', 'https://i.pinimg.com/564x/d3/e6/0b/d3e60bca9ab2addcfbe920afbc7e56e2.jpg', "Plunges into a thrilling competition that unexpectedly turns perilous, revealing sinister forces at play and testing friendships amidst the wizarding world's escalating tensions.", "GP06",'2005-12-18', 9, TRUE, FALSE, FALSE),
('Spirited Away', 'https://www.youtube.com/watch?v=ByXuk9QqQkk&pp=ygUVc3Bpcml0ZWQgYXdheSB0cmFpbGVy', 'https://i.pinimg.com/564x/b9/03/d2/b903d28f3430d5488ed1ef40ee4accde.jpg', 'Explores a fantastical realm where unexpected encounters challenge visitors to confront their fears, navigate mysterious spirits, and unearth the courage to find their way back to reality.', "GP07",'2001-07-20', 9, TRUE, FALSE, FALSE);

INSERT INTO banner (ma_phim, hinh_anh) VALUES
(1, 'https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SL1183_.jpg'),
(2, 'https://www.bu.edu/cgs/files/2011/10/Inception-Banner-2.jpg'),
(3, 'https://i.pinimg.com/originals/4c/29/d6/4c29d6753e61511d6369567214af2f53.jpg'),
(4, 'https://live.staticflickr.com/2222/2452159541_23ca8f2df0_b.jpg'),
(5, 'https://c8.alamy.com/comp/PXNB1J/forrest-gump-original-movie-poster-PXNB1J.jpg'),
(6, 'https://c8.alamy.com/comp/PXNB40/matrix-original-movie-poster-PXNB40.jpg'),
(7, 'https://fr.originalfilmart.com/cdn/shop/products/titanic_1997_quad_original_film_art_5000x.webp?v=1674239105');


INSERT INTO he_thong_rap (ten_he_thong_rap, logo) VALUES
('CGV Cinemas', 'https://movienew.cybersoft.edu.vn/hinhanh/cgv.png'),
('Lotte Cinema', 'https://movienew.cybersoft.edu.vn/hinhanh/lotte-cinema.png'),
('Galaxy Cinema', 'https://movienew.cybersoft.edu.vn/hinhanh/galaxy-cinema.png'),
('BHD Star Cineplex', 'https://movienew.cybersoft.edu.vn/hinhanh/bhd-star-cineplex.png'),
('CineStar', 'https://movienew.cybersoft.edu.vn/hinhanh/cinestar.png'),
('Mega GS', 'https://movienew.cybersoft.edu.vn/hinhanh/megags.png'),
('Beta Cineplex', 'https://cdn.moveek.com/storage/media/cache/square/5fffb2fcaf3c1018282624.png');


INSERT INTO cum_rap (ten_cum_rap, dia_chi, ma_he_thong_rap) VALUES
('CGV Aeon Tân Phú', 'Lầu 3, Aeon Mall 30 Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân Phú, Tp. Hồ Chí Minh', 1),
('CGV - Aeon Bình Tân', 'Tầng 3, TTTM Aeon Mall Bình Tân, Số 1 đường số 17A, khu phố 11, Bình Trị Đông B, Bình Tân, Tp. Hồ Chí Minh', 1),
('CGV Saigonres Nguyễn Xí', 'Tầng 4-5, Saigonres Plaza, 79/81 Nguyễn Xí, P. 26, Bình Thạnh, Tp. Hồ Chí Minh', 1),
('CGV - Crescent Mall', 'Lầu 5, Crescent Mall, Đại lộ Nguyễn Văn Linh, Phú Mỹ Hưng, Q.7, Tp. Hồ Chí Minh', 1),
('CGV - CT Plaza', '60A Đ. Trường Sơn, Phường 2, Tân Bình, Hồ Chí Minh', 1),
('Lotte - Cộng Hòa', '20 Đ. Cộng Hòa, Phường 12, Tân Bình, Hồ Chí Minh', 2),
('Lotte - Gò Vấp', '242 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh', 2),
('Lotte - Nam Sài Gòn', 'Lotte Mart, Tầng 3 Lotte Mart NSG, 469 Đ. Nguyễn Hữu Thọ, Tân Hưng, Quận 7, Hồ Chí Minh', 2),
('Lotte - Nowzone', 'TTTM Nowzone, 235 Đ. Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1, Hồ Chí Minh', 2),
('Lotte - Thủ Đức', 'Tòa nhà Joy Citipoint, 2, QL1A, Phường Linh Trung, Thủ Đức, Hồ Chí Minh', 2),
('Galaxy Nguyễn Du', '116 Nguyễn Du, Q.1, Tp. Hồ Chí Minh', 3),
('Galaxy Huỳnh Tấn Phát', '1362 Huỳnh Tấn Phát, Phú Mỹ, Quận 7, Hồ Chí Minh', 3),
('Galaxy Kinh Dương Vương', '718bis Đ. Kinh Dương Vương, Phường 13, Quận 6, Hồ Chí Minh', 3),
('Galaxy Nguyễn Văn Quá', '119B Đ. Nguyễn Văn Quá, Đông Hưng Thuận, Quận 12, Hồ Chí Minh', 3),
('Galaxy Quang Trung', '304A Đ. Quang Trung, Phường 11, Gò Vấp, Hồ Chí Minh', 3),
('BHD Star Cineplex 3/2', 'Lầu 4, Siêu Thị Vincom 3/2, 3C Đường 3/2, Q. 10, Tp. Hồ Chí Minh', 4),
('BHD Star Cineplex - Bitexco', 'Vincom Plaza 3/2, 3C Đ. 3 Tháng 2, Phường 11, Quận 10, Hồ Chí Minh', 4),
('BHD Star Cineplex Phạm Hùng', 'Siêu Thị Satra, C6/27 Đ. Phạm Hùng, Bình Hưng, Bình Chánh, Hồ Chí Minh', 4),
('BHD Star Cineplex Lê Văn Việt', 'Vincom Plaza, Lê Văn Việt, Hiệp Phú, Quận 9, Hồ Chí Minh', 4),
('BHD Star Cineplex Quang Trung', '190 Đ. Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh', 4),
('CineStar Hai Bà Trưng', '135 Hai Bà Trưng, P. Bến Nghé, Q.1, Tp. Hồ Chí Minh', 5),
('CineStar Quốc Thanh', '271 Đ. Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, Hồ Chí Minh', 5),
('Mega GS Cao Thắng', 'Lầu 6 - 7, 19 Cao Thắng, P.2, Q.3, Tp. Hồ Chí Minh', 6),
('Mega GS Lý Chính Thắng', '212 Lý Chính Thắng, Phường 9, Quận 3, Hồ Chí Minh', 6),
('Beta Quang Trung', '645 Quang Trung, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh', 7);



INSERT INTO rap_phim (ten_rap, ma_cum_rap) VALUES
('Rạp 1', 1),
('Rạp 2', 2),
('Rạp 3', 3),
('Rạp 4', 4),
('Rạp 5', 5),
('Rạp 6', 6),
('Rạp 7', 7),
('Rạp 8', 1),
('Rạp 9', 2),
('Rạp 10', 8),
('Rạp 11', 9),
('Rạp 12', 10),
('Rạp 13', 11),
('Rạp 14', 12),
('Rạp 15', 13),
('Rạp 16', 14),
('Rạp 17', 15),
('Rạp 18', 16),
('Rạp 19', 17),
('Rạp 20', 18),
('Rạp 21', 19),
('Rạp 22', 20),
('Rạp 23', 21),
('Rạp 24', 22),
('Rạp 25', 23),
('Rạp 26', 24),
('Rạp 27', 25),
('Rạp 28', 3),
('Rạp 29', 4),
('Rạp 30', 5),
('Rạp 31', 6),
('Rạp 32', 7);


INSERT INTO ghe (ten_ghe, loai_ghe, ma_rap) VALUES
('A1', 'Thường', 1),
('B1', 'VIP', 1),
('A2', 'Thường', 2),
('B2', 'VIP', 2),
('A3', 'Thường', 3),
('B3', 'VIP', 3),
('A4', 'Thường', 4),
('B4', 'VIP', 4),
('A5', 'Thường', 5),
('B5', 'VIP', 5),
('A6', 'Thường', 6),
('B6', 'VIP', 6),
('A7', 'Thường', 7),
('B7', 'VIP', 7),
('A8', 'Thường', 8),
('B8', 'VIP', 8),
('A9', 'Thường', 9),
('B9', 'VIP', 9),
('A10', 'Thường', 10),
('B10', 'VIP', 10),
('A11', 'Thường', 11),
('B11', 'VIP', 11),
('A12', 'Thường', 12),
('B12', 'VIP', 12),
('A13', 'Thường', 13),
('B13', 'VIP', 13),
('A14', 'Thường', 14),
('B14', 'VIP', 14),
('A15', 'Thường', 14),
('B15', 'VIP', 14),
('A16', 'Thường', 16),
('B16', 'VIP', 16),
('A17', 'Thường', 17),
('B17', 'VIP', 17),
('A18', 'Thường', 18),
('B18', 'VIP', 18),
('A19', 'Thường', 19),
('B19', 'VIP', 19),
('A20', 'Thường', 20),
('B20', 'VIP', 20),
('A21', 'Thường', 21),
('B21', 'VIP', 21),
('A22', 'Thường', 22),
('B22', 'VIP', 22),
('A23', 'Thường', 23),
('B23', 'VIP', 23),
('A24', 'Thường', 24),
('B24', 'VIP', 24),
('A25', 'Thường', 25),
('B25', 'VIP', 25),
('A26', 'Thường', 26),
('B26', 'VIP', 26),
('A27', 'Thường', 27),
('B27', 'VIP', 27),
('A28', 'Thường', 28),
('B28', 'VIP', 28),
('A29', 'Thường', 29),
('B29', 'VIP', 29),
('A30', 'Thường', 30),
('B30', 'VIP', 30),
('A31', 'Thường', 31),
('B31', 'VIP', 31),
('A32', 'Thường', 32),
('B32', 'VIP', 32);



INSERT INTO lich_chieu (ma_rap, ma_phim, ngay_gio_chieu, gia_ve) VALUES
(1, 1, '2024-09-01 10:00:00', 120000),
(2, 2, '2024-09-01 12:00:00', 120000),
(3, 3, '2024-09-01 14:00:00', 110000),
(4, 4, '2024-09-01 16:00:00', 110000),
(5, 5, '2024-09-01 18:00:00', 140000),
(6, 6, '2024-09-01 20:00:00', 140000),
(7, 7, '2024-09-01 22:00:00', 150000),
(8, 8, '2024-09-03 08:00:00', 130000),
(9, 9, '2024-09-03 10:00:00', 120000),
(10, 1, '2024-09-03 12:00:00', 110000),
(11, 2, '2024-09-03 14:00:00', 140000),
(12, 3, '2024-09-03 16:00:00', 100000),
(13, 4, '2024-09-03 18:00:00', 120000),
(14, 5, '2024-09-03 20:00:00', 100000),
(15, 6, '2024-09-03 08:00:00', 90000),
(16, 7, '2024-09-03 10:00:00', 100000),
(17, 8, '2024-09-03 12:00:00', 110000),
(18, 9, '2024-09-03 14:00:00', 150000),
(19, 10, '2024-09-05 16:00:00', 120000),
(20, 11, '2024-09-05 20:00:00', 100000),
(21, 1, '2024-09-05 08:00:00', 100000),
(22, 2, '2024-09-05 10:00:00', 120000),
(23, 3, '2024-09-05 12:00:00', 110000),
(24, 4, '2024-09-05 14:00:00', 130000),
(25, 5, '2024-09-05 16:00:00', 140000),
(26, 6, '2024-09-05 18:00:00', 150000),
(27, 7, '2024-09-05 20:00:00', 110000),
(28, 8, '2024-09-07 08:00:00', 100000),
(29, 9, '2024-09-07 10:00:00', 100000),
(30, 10, '2024-09-07 12:00:00', 130000),
(31, 11, '2024-09-07 15:00:00', 140000),
(32, 1, '2024-09-07 20:00:00', 110000);


INSERT INTO nguoi_dung (tai_khoan, ho_ten, email, so_dt, mat_khau, ma_nhom, loai_nguoi_dung) VALUES
('user1', 'User 1', 'user1@gmail.com', '0123456789', '1234', "GP01" ,'KhachHang'),
('user2', 'User 2', 'user2@gmail.com', '0123456789', '1234', "GP01" ,'KhachHang'),
('user3', 'User 3', 'user3@gmail.com', '0123456789', '1234', "GP01" ,'KhachHang'),
('user4', 'User 4', 'user4@gmail.com', '0123456789', '1234', "GP01" ,'KhachHang'),
('user5', 'User 5', 'user5@gmail.com', '0123456789', '1234', "GP01" ,'KhachHang'),
('user6', 'User 6', 'user6@gmail.com', '0123456789', '1234', "GP01" ,'KhachHang'),
('user7', 'User 7', 'user7@gmail.com', '0123456789', '1234', "GP02" ,'QuanTri'),
('user8', 'User 8', 'user8@gmail.com', '0123456789', '1234', "GP03" ,'KhachHang'),
('user9', 'User 9', 'user9@gmail.com', '0123456789', '1234', "GP04" ,'KhachHang'),
('user10', 'User 10', 'user10@gmail.com', '0123456789', '1234', "GP05" ,'KhachHang'),
('user11', 'User 11', 'user11@gmail.com', '0123456789', '1234', "GP06" ,'KhachHang'),
('user12', 'User 12', 'user12@gmail.com', '0123456789', '1234', "GP07" ,'KhachHang');


INSERT INTO dat_ve (ma_nguoi_dung, ma_lich_chieu, ma_ghe) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 7, 7);