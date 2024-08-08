/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE db_movie;
USE db_movie;
CREATE TABLE `banner` (
  `ma_banner` int NOT NULL AUTO_INCREMENT,
  `ma_phim` int DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ma_banner`),
  KEY `ma_phim` (`ma_phim`),
  CONSTRAINT `banner_ibfk_1` FOREIGN KEY (`ma_phim`) REFERENCES `phim` (`ma_phim`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cum_rap` (
  `ma_cum_rap` int NOT NULL AUTO_INCREMENT,
  `ten_cum_rap` varchar(255) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `ma_he_thong_rap` int DEFAULT NULL,
  PRIMARY KEY (`ma_cum_rap`),
  KEY `ma_he_thong_rap` (`ma_he_thong_rap`),
  CONSTRAINT `cum_rap_ibfk_1` FOREIGN KEY (`ma_he_thong_rap`) REFERENCES `he_thong_rap` (`ma_he_thong_rap`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `dat_ve` (
  `ma_ve` int NOT NULL AUTO_INCREMENT,
  `ma_nguoi_dung` int NOT NULL,
  `ma_lich_chieu` int NOT NULL,
  `ma_ghe` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_ve`,`ma_nguoi_dung`,`ma_lich_chieu`,`ma_ghe`),
  KEY `ma_nguoi_dung` (`ma_nguoi_dung`),
  KEY `ma_lich_chieu` (`ma_lich_chieu`),
  KEY `ma_ghe` (`ma_ghe`),
  CONSTRAINT `dat_ve_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`),
  CONSTRAINT `dat_ve_ibfk_2` FOREIGN KEY (`ma_lich_chieu`) REFERENCES `lich_chieu` (`ma_lich_chieu`),
  CONSTRAINT `dat_ve_ibfk_3` FOREIGN KEY (`ma_ghe`) REFERENCES `ghe` (`ma_ghe`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ghe` (
  `ma_ghe` int NOT NULL AUTO_INCREMENT,
  `ten_ghe` varchar(255) DEFAULT NULL,
  `loai_ghe` varchar(255) DEFAULT NULL,
  `ma_rap` int DEFAULT NULL,
  PRIMARY KEY (`ma_ghe`),
  KEY `ma_rap` (`ma_rap`),
  CONSTRAINT `ghe_ibfk_1` FOREIGN KEY (`ma_rap`) REFERENCES `rap_phim` (`ma_rap`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `he_thong_rap` (
  `ma_he_thong_rap` int NOT NULL AUTO_INCREMENT,
  `ten_he_thong_rap` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ma_he_thong_rap`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lich_chieu` (
  `ma_lich_chieu` int NOT NULL AUTO_INCREMENT,
  `ma_rap` int DEFAULT NULL,
  `ma_phim` int DEFAULT NULL,
  `ngay_gio_chieu` datetime DEFAULT NULL,
  `gia_ve` int DEFAULT NULL,
  PRIMARY KEY (`ma_lich_chieu`),
  KEY `ma_rap` (`ma_rap`),
  KEY `ma_phim` (`ma_phim`),
  CONSTRAINT `lich_chieu_ibfk_1` FOREIGN KEY (`ma_rap`) REFERENCES `rap_phim` (`ma_rap`),
  CONSTRAINT `lich_chieu_ibfk_2` FOREIGN KEY (`ma_phim`) REFERENCES `phim` (`ma_phim`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `nguoi_dung` (
  `ma_nguoi_dung` int NOT NULL AUTO_INCREMENT,
  `tai_khoan` varchar(255) DEFAULT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `so_dt` varchar(255) DEFAULT NULL,
  `mat_khau` varchar(255) DEFAULT NULL,
  `loai_nguoi_dung` varchar(255) DEFAULT NULL,
  `ma_nhom` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ma_nguoi_dung`),
  UNIQUE KEY `tai_khoan` (`tai_khoan`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `phim` (
  `ma_phim` int NOT NULL AUTO_INCREMENT,
  `ten_phim` varchar(255) NOT NULL,
  `trailer` varchar(255) DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  `ma_nhom` varchar(255) DEFAULT NULL,
  `ngay_khoi_chieu` date DEFAULT NULL,
  `danh_gia` int DEFAULT NULL,
  `hot` tinyint(1) DEFAULT NULL,
  `dang_chieu` tinyint(1) DEFAULT NULL,
  `sap_chieu` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ma_phim`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `rap_phim` (
  `ma_rap` int NOT NULL AUTO_INCREMENT,
  `ten_rap` varchar(255) DEFAULT NULL,
  `ma_cum_rap` int DEFAULT NULL,
  PRIMARY KEY (`ma_rap`),
  KEY `ma_cum_rap` (`ma_cum_rap`),
  CONSTRAINT `rap_phim_ibfk_1` FOREIGN KEY (`ma_cum_rap`) REFERENCES `cum_rap` (`ma_cum_rap`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `banner` (`ma_banner`, `ma_phim`, `hinh_anh`) VALUES
(1, 1, 'https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SL1183_.jpg');
INSERT INTO `banner` (`ma_banner`, `ma_phim`, `hinh_anh`) VALUES
(2, 2, 'https://www.bu.edu/cgs/files/2011/10/Inception-Banner-2.jpg');
INSERT INTO `banner` (`ma_banner`, `ma_phim`, `hinh_anh`) VALUES
(3, 3, 'https://i.pinimg.com/originals/4c/29/d6/4c29d6753e61511d6369567214af2f53.jpg');
INSERT INTO `banner` (`ma_banner`, `ma_phim`, `hinh_anh`) VALUES
(4, 4, 'https://live.staticflickr.com/2222/2452159541_23ca8f2df0_b.jpg'),
(5, 5, 'https://c8.alamy.com/comp/PXNB1J/forrest-gump-original-movie-poster-PXNB1J.jpg'),
(6, 6, 'https://c8.alamy.com/comp/PXNB40/matrix-original-movie-poster-PXNB40.jpg'),
(7, 7, 'https://fr.originalfilmart.com/cdn/shop/products/titanic_1997_quad_original_film_art_5000x.webp?v=1674239105');

INSERT INTO `cum_rap` (`ma_cum_rap`, `ten_cum_rap`, `dia_chi`, `ma_he_thong_rap`) VALUES
(1, 'CGV Aeon Tân Phú', 'Lầu 3, Aeon Mall 30 Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân Phú, Tp. Hồ Chí Minh', 1);
INSERT INTO `cum_rap` (`ma_cum_rap`, `ten_cum_rap`, `dia_chi`, `ma_he_thong_rap`) VALUES
(2, 'CGV - Aeon Bình Tân', 'Tầng 3, TTTM Aeon Mall Bình Tân, Số 1 đường số 17A, khu phố 11, Bình Trị Đông B, Bình Tân, Tp. Hồ Chí Minh', 1);
INSERT INTO `cum_rap` (`ma_cum_rap`, `ten_cum_rap`, `dia_chi`, `ma_he_thong_rap`) VALUES
(3, 'CGV Saigonres Nguyễn Xí', 'Tầng 4-5, Saigonres Plaza, 79/81 Nguyễn Xí, P. 26, Bình Thạnh, Tp. Hồ Chí Minh', 1);
INSERT INTO `cum_rap` (`ma_cum_rap`, `ten_cum_rap`, `dia_chi`, `ma_he_thong_rap`) VALUES
(4, 'CGV - Crescent Mall', 'Lầu 5, Crescent Mall, Đại lộ Nguyễn Văn Linh, Phú Mỹ Hưng, Q.7, Tp. Hồ Chí Minh', 1),
(5, 'CGV - CT Plaza', '60A Đ. Trường Sơn, Phường 2, Tân Bình, Hồ Chí Minh', 1),
(6, 'Lotte - Cộng Hòa', '20 Đ. Cộng Hòa, Phường 12, Tân Bình, Hồ Chí Minh', 2),
(7, 'Lotte - Gò Vấp', '242 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh', 2),
(8, 'Lotte - Nam Sài Gòn', 'Lotte Mart, Tầng 3 Lotte Mart NSG, 469 Đ. Nguyễn Hữu Thọ, Tân Hưng, Quận 7, Hồ Chí Minh', 2),
(9, 'Lotte - Nowzone', 'TTTM Nowzone, 235 Đ. Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1, Hồ Chí Minh', 2),
(10, 'Lotte - Thủ Đức', 'Tòa nhà Joy Citipoint, 2, QL1A, Phường Linh Trung, Thủ Đức, Hồ Chí Minh', 2),
(11, 'Galaxy Nguyễn Du', '116 Nguyễn Du, Q.1, Tp. Hồ Chí Minh', 3),
(12, 'Galaxy Huỳnh Tấn Phát', '1362 Huỳnh Tấn Phát, Phú Mỹ, Quận 7, Hồ Chí Minh', 3),
(13, 'Galaxy Kinh Dương Vương', '718bis Đ. Kinh Dương Vương, Phường 13, Quận 6, Hồ Chí Minh', 3),
(14, 'Galaxy Nguyễn Văn Quá', '119B Đ. Nguyễn Văn Quá, Đông Hưng Thuận, Quận 12, Hồ Chí Minh', 3),
(15, 'Galaxy Quang Trung', '304A Đ. Quang Trung, Phường 11, Gò Vấp, Hồ Chí Minh', 3),
(16, 'BHD Star Cineplex 3/2', 'Lầu 4, Siêu Thị Vincom 3/2, 3C Đường 3/2, Q. 10, Tp. Hồ Chí Minh', 4),
(17, 'BHD Star Cineplex - Bitexco', 'Vincom Plaza 3/2, 3C Đ. 3 Tháng 2, Phường 11, Quận 10, Hồ Chí Minh', 4),
(18, 'BHD Star Cineplex Phạm Hùng', 'Siêu Thị Satra, C6/27 Đ. Phạm Hùng, Bình Hưng, Bình Chánh, Hồ Chí Minh', 4),
(19, 'BHD Star Cineplex Lê Văn Việt', 'Vincom Plaza, Lê Văn Việt, Hiệp Phú, Quận 9, Hồ Chí Minh', 4),
(20, 'BHD Star Cineplex Quang Trung', '190 Đ. Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh', 4),
(21, 'CineStar Hai Bà Trưng', '135 Hai Bà Trưng, P. Bến Nghé, Q.1, Tp. Hồ Chí Minh', 5),
(22, 'CineStar Quốc Thanh', '271 Đ. Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, Hồ Chí Minh', 5),
(23, 'Mega GS Cao Thắng', 'Lầu 6 - 7, 19 Cao Thắng, P.2, Q.3, Tp. Hồ Chí Minh', 6),
(24, 'Mega GS Lý Chính Thắng', '212 Lý Chính Thắng, Phường 9, Quận 3, Hồ Chí Minh', 6),
(25, 'Beta Quang Trung', '645 Quang Trung, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh', 7);

INSERT INTO `dat_ve` (`ma_ve`, `ma_nguoi_dung`, `ma_lich_chieu`, `ma_ghe`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, '2024-07-24 16:20:49', '2024-07-24 16:20:49');
INSERT INTO `dat_ve` (`ma_ve`, `ma_nguoi_dung`, `ma_lich_chieu`, `ma_ghe`, `createdAt`, `updatedAt`) VALUES
(2, 2, 2, 2, '2024-07-24 16:20:49', '2024-07-24 16:20:49');
INSERT INTO `dat_ve` (`ma_ve`, `ma_nguoi_dung`, `ma_lich_chieu`, `ma_ghe`, `createdAt`, `updatedAt`) VALUES
(3, 3, 3, 3, '2024-07-24 16:20:49', '2024-07-24 16:20:49');
INSERT INTO `dat_ve` (`ma_ve`, `ma_nguoi_dung`, `ma_lich_chieu`, `ma_ghe`, `createdAt`, `updatedAt`) VALUES
(4, 4, 4, 4, '2024-07-24 16:20:49', '2024-07-24 16:20:49'),
(5, 5, 5, 5, '2024-07-24 16:20:49', '2024-07-24 16:20:49'),
(6, 6, 6, 6, '2024-07-24 16:20:49', '2024-07-24 16:20:49'),
(7, 7, 7, 7, '2024-07-24 16:20:49', '2024-07-24 16:20:49');

INSERT INTO `ghe` (`ma_ghe`, `ten_ghe`, `loai_ghe`, `ma_rap`) VALUES
(1, 'A1', 'Thường', 1);
INSERT INTO `ghe` (`ma_ghe`, `ten_ghe`, `loai_ghe`, `ma_rap`) VALUES
(2, 'B1', 'VIP', 1);
INSERT INTO `ghe` (`ma_ghe`, `ten_ghe`, `loai_ghe`, `ma_rap`) VALUES
(3, 'A2', 'Thường', 2);
INSERT INTO `ghe` (`ma_ghe`, `ten_ghe`, `loai_ghe`, `ma_rap`) VALUES
(4, 'B2', 'VIP', 2),
(5, 'A3', 'Thường', 3),
(6, 'B3', 'VIP', 3),
(7, 'A4', 'Thường', 4),
(8, 'B4', 'VIP', 4),
(9, 'A5', 'Thường', 5),
(10, 'B5', 'VIP', 5),
(11, 'A6', 'Thường', 6),
(12, 'B6', 'VIP', 6),
(13, 'A7', 'Thường', 7),
(14, 'B7', 'VIP', 7),
(15, 'A8', 'Thường', 8),
(16, 'B8', 'VIP', 8),
(17, 'A9', 'Thường', 9),
(18, 'B9', 'VIP', 9),
(19, 'A10', 'Thường', 10),
(20, 'B10', 'VIP', 10),
(21, 'A11', 'Thường', 11),
(22, 'B11', 'VIP', 11),
(23, 'A12', 'Thường', 12),
(24, 'B12', 'VIP', 12),
(25, 'A13', 'Thường', 13),
(26, 'B13', 'VIP', 13),
(27, 'A14', 'Thường', 14),
(28, 'B14', 'VIP', 14),
(29, 'A15', 'Thường', 14),
(30, 'B15', 'VIP', 14),
(31, 'A16', 'Thường', 16),
(32, 'B16', 'VIP', 16),
(33, 'A17', 'Thường', 17),
(34, 'B17', 'VIP', 17),
(35, 'A18', 'Thường', 18),
(36, 'B18', 'VIP', 18),
(37, 'A19', 'Thường', 19),
(38, 'B19', 'VIP', 19),
(39, 'A20', 'Thường', 20),
(40, 'B20', 'VIP', 20),
(41, 'A21', 'Thường', 21),
(42, 'B21', 'VIP', 21),
(43, 'A22', 'Thường', 22),
(44, 'B22', 'VIP', 22),
(45, 'A23', 'Thường', 23),
(46, 'B23', 'VIP', 23),
(47, 'A24', 'Thường', 24),
(48, 'B24', 'VIP', 24),
(49, 'A25', 'Thường', 25),
(50, 'B25', 'VIP', 25),
(51, 'A26', 'Thường', 26),
(52, 'B26', 'VIP', 26),
(53, 'A27', 'Thường', 27),
(54, 'B27', 'VIP', 27),
(55, 'A28', 'Thường', 28),
(56, 'B28', 'VIP', 28),
(57, 'A29', 'Thường', 29),
(58, 'B29', 'VIP', 29),
(59, 'A30', 'Thường', 30),
(60, 'B30', 'VIP', 30),
(61, 'A31', 'Thường', 31),
(62, 'B31', 'VIP', 31),
(63, 'A32', 'Thường', 32),
(64, 'B32', 'VIP', 32);

INSERT INTO `he_thong_rap` (`ma_he_thong_rap`, `ten_he_thong_rap`, `logo`) VALUES
(1, 'CGV Cinemas', 'https://movienew.cybersoft.edu.vn/hinhanh/cgv.png');
INSERT INTO `he_thong_rap` (`ma_he_thong_rap`, `ten_he_thong_rap`, `logo`) VALUES
(2, 'Lotte Cinema', 'https://movienew.cybersoft.edu.vn/hinhanh/lotte-cinema.png');
INSERT INTO `he_thong_rap` (`ma_he_thong_rap`, `ten_he_thong_rap`, `logo`) VALUES
(3, 'Galaxy Cinema', 'https://movienew.cybersoft.edu.vn/hinhanh/galaxy-cinema.png');
INSERT INTO `he_thong_rap` (`ma_he_thong_rap`, `ten_he_thong_rap`, `logo`) VALUES
(4, 'BHD Star Cineplex', 'https://movienew.cybersoft.edu.vn/hinhanh/bhd-star-cineplex.png'),
(5, 'CineStar', 'https://movienew.cybersoft.edu.vn/hinhanh/cinestar.png'),
(6, 'Mega GS', 'https://movienew.cybersoft.edu.vn/hinhanh/megags.png'),
(7, 'Beta Cineplex', 'https://cdn.moveek.com/storage/media/cache/square/5fffb2fcaf3c1018282624.png');

INSERT INTO `lich_chieu` (`ma_lich_chieu`, `ma_rap`, `ma_phim`, `ngay_gio_chieu`, `gia_ve`) VALUES
(1, 1, 1, '2024-09-01 10:00:00', 120000);
INSERT INTO `lich_chieu` (`ma_lich_chieu`, `ma_rap`, `ma_phim`, `ngay_gio_chieu`, `gia_ve`) VALUES
(2, 2, 2, '2024-09-01 12:00:00', 120000);
INSERT INTO `lich_chieu` (`ma_lich_chieu`, `ma_rap`, `ma_phim`, `ngay_gio_chieu`, `gia_ve`) VALUES
(3, 3, 3, '2024-09-01 14:00:00', 110000);
INSERT INTO `lich_chieu` (`ma_lich_chieu`, `ma_rap`, `ma_phim`, `ngay_gio_chieu`, `gia_ve`) VALUES
(4, 4, 4, '2024-09-01 16:00:00', 110000),
(5, 5, 5, '2024-09-01 18:00:00', 140000),
(6, 6, 6, '2024-09-01 20:00:00', 140000),
(7, 7, 7, '2024-09-01 22:00:00', 150000),
(8, 8, 8, '2024-09-03 08:00:00', 130000),
(9, 9, 9, '2024-09-03 10:00:00', 120000),
(10, 10, 1, '2024-09-03 12:00:00', 110000),
(11, 11, 2, '2024-09-03 14:00:00', 140000),
(12, 12, 3, '2024-09-03 16:00:00', 100000),
(13, 13, 4, '2024-09-03 18:00:00', 120000),
(14, 14, 5, '2024-09-03 20:00:00', 100000),
(15, 15, 6, '2024-09-03 08:00:00', 90000),
(16, 16, 7, '2024-09-03 10:00:00', 100000),
(17, 17, 8, '2024-09-03 12:00:00', 110000),
(18, 18, 9, '2024-09-03 14:00:00', 150000),
(19, 19, 10, '2024-09-05 16:00:00', 120000),
(20, 20, 11, '2024-09-05 20:00:00', 100000),
(21, 21, 1, '2024-09-05 08:00:00', 100000),
(22, 22, 2, '2024-09-05 10:00:00', 120000),
(23, 23, 3, '2024-09-05 12:00:00', 110000),
(24, 24, 4, '2024-09-05 14:00:00', 130000),
(25, 25, 5, '2024-09-05 16:00:00', 140000),
(26, 26, 6, '2024-09-05 18:00:00', 150000),
(27, 27, 7, '2024-09-05 20:00:00', 110000),
(28, 28, 8, '2024-09-07 08:00:00', 100000),
(29, 29, 9, '2024-09-07 10:00:00', 100000),
(30, 30, 10, '2024-09-07 12:00:00', 130000),
(31, 31, 11, '2024-09-07 15:00:00', 140000),
(32, 32, 1, '2024-09-07 20:00:00', 110000);

INSERT INTO `nguoi_dung` (`ma_nguoi_dung`, `tai_khoan`, `ho_ten`, `email`, `so_dt`, `mat_khau`, `loai_nguoi_dung`, `ma_nhom`, `refresh_token`) VALUES
(1, 'user1', 'User 1', 'user1@gmail.com', '0123456789', '1234', 'KhachHang', 'GP01', NULL);
INSERT INTO `nguoi_dung` (`ma_nguoi_dung`, `tai_khoan`, `ho_ten`, `email`, `so_dt`, `mat_khau`, `loai_nguoi_dung`, `ma_nhom`, `refresh_token`) VALUES
(2, 'user2', 'User 2', 'user2@gmail.com', '0123456789', '1234', 'KhachHang', 'GP01', NULL);
INSERT INTO `nguoi_dung` (`ma_nguoi_dung`, `tai_khoan`, `ho_ten`, `email`, `so_dt`, `mat_khau`, `loai_nguoi_dung`, `ma_nhom`, `refresh_token`) VALUES
(3, 'user3', 'User 3', 'user3@gmail.com', '0123456789', '1234', 'KhachHang', 'GP01', NULL);
INSERT INTO `nguoi_dung` (`ma_nguoi_dung`, `tai_khoan`, `ho_ten`, `email`, `so_dt`, `mat_khau`, `loai_nguoi_dung`, `ma_nhom`, `refresh_token`) VALUES
(4, 'user4', 'User 4', 'user4@gmail.com', '0123456789', '1234', 'KhachHang', 'GP01', NULL),
(5, 'user5', 'User 5', 'user5@gmail.com', '0123456789', '1234', 'KhachHang', 'GP01', NULL),
(6, 'user6', 'User 6', 'user6@gmail.com', '0123456789', '1234', 'KhachHang', 'GP01', NULL),
(7, 'user7', 'User 7', 'user7@gmail.com', '0123456789', '1234', 'QuanTri', 'GP02', NULL),
(8, 'user8', 'User 8', 'user8@gmail.com', '0123456789', '1234', 'KhachHang', 'GP03', NULL),
(9, 'user9', 'User 9', 'user9@gmail.com', '0123456789', '1234', 'KhachHang', 'GP04', NULL),
(10, 'user10', 'User 10', 'user10@gmail.com', '0123456789', '1234', 'KhachHang', 'GP05', NULL),
(11, 'user11', 'User 11', 'user11@gmail.com', '0123456789', '1234', 'KhachHang', 'GP06', NULL),
(12, 'user12', 'User 12', 'user12@gmail.com', '0123456789', '1234', 'KhachHang', 'GP07', NULL);

INSERT INTO `phim` (`ma_phim`, `ten_phim`, `trailer`, `hinh_anh`, `mo_ta`, `ma_nhom`, `ngay_khoi_chieu`, `danh_gia`, `hot`, `dang_chieu`, `sap_chieu`) VALUES
(1, 'Avengers: Endgame', 'https://www.youtube.com/watch?v=TcMBFSGVi1c&pp=ygUYYXZlbmdlcnMgZW5kZ2FtZSB0cmFpbGVy', 'https://i.pinimg.com/564x/0b/22/ec/0b22ec04f52dccdf28d7dbbd476f4037.jpg', 'The final showdown against Thanos.', 'GP01', '2019-04-26', 9, 1, 1, 0);
INSERT INTO `phim` (`ma_phim`, `ten_phim`, `trailer`, `hinh_anh`, `mo_ta`, `ma_nhom`, `ngay_khoi_chieu`, `danh_gia`, `hot`, `dang_chieu`, `sap_chieu`) VALUES
(2, 'Inception', 'https://www.youtube.com/watch?v=YoHD9XEInc0&pp=ygUSIGluY2VwdGlvbiB0cmFpbGVy', 'https://i.pinimg.com/564x/96/07/dd/9607ddb58b5a327d7463833da63ce6fd.jpg', 'A mind-bending thriller by Christopher Nolan.', 'GP01', '2010-07-16', 8, 1, 1, 0);
INSERT INTO `phim` (`ma_phim`, `ten_phim`, `trailer`, `hinh_anh`, `mo_ta`, `ma_nhom`, `ngay_khoi_chieu`, `danh_gia`, `hot`, `dang_chieu`, `sap_chieu`) VALUES
(3, 'Interstellar', 'https://www.youtube.com/watch?v=zSWdZVtXT7E&pp=ygUUSW50ZXJzdGVsbGFyIHRyYWlsZXI%3D', 'https://i.pinimg.com/originals/f0/0e/f4/f00ef4ef28062a3ffe32c80cfa039c86.jpg', 'A journey beyond the stars to save humanity.', 'GP01', '2014-11-07', 8, 1, 0, 1);
INSERT INTO `phim` (`ma_phim`, `ten_phim`, `trailer`, `hinh_anh`, `mo_ta`, `ma_nhom`, `ngay_khoi_chieu`, `danh_gia`, `hot`, `dang_chieu`, `sap_chieu`) VALUES
(4, 'The Dark Knight', 'https://www.youtube.com/watch?v=EXeTwQWrcwY&pp=ygUXdGhlIERhcmsgS25pZ2h0IHRyYWlsZXI%3D', 'https://i.pinimg.com/564x/ea/a2/6e/eaa26e2c3bfa234c3cdd3c4d9fabad35.jpg', 'Batman faces off against the Joker.', 'GP01', '2008-07-18', 9, 1, 1, 0),
(5, 'Forrest Gump', 'https://www.youtube.com/watch?v=bLvqoHBptjg&pp=ygUUZm9ycmVzdCBndW1wIHRyYWlsZXI%3D', 'https://i.pinimg.com/originals/30/13/00/301300685c5764e285e588fe839f829f.jpg', 'The extraordinary life of an ordinary man.', 'GP01', '1994-07-06', 9, 0, 0, 1),
(6, 'The Matrix', 'https://www.youtube.com/watch?v=vKQi3bBA1y8&pp=ygUSdGhlIG1hdHJpeCB0cmFpbGVy', 'https://i.pinimg.com/564x/18/d7/4e/18d74ef46e722828f75cca91b009f4a5.jpg', 'A hacker discovers the shocking truth about reality.', 'GP02', '1999-03-31', 8, 1, 1, 0),
(7, 'Titanic', 'https://www.youtube.com/watch?v=CHekzSiZjrY&pp=ygUPdGl0YW5pYyB0cmFpbGVy', 'https://i.pinimg.com/564x/8b/ae/2c/8bae2cd680a1e182517e9758d59814f4.jpg', 'A love story on the ill-fated ship.', 'GP03', '1997-12-19', 9, 1, 0, 1),
(8, 'The Lord of the Rings: The Return of the King', 'https://www.youtube.com/watch?v=r5X-hFf6Bwo&ab_channel=Movieclips', 'https://i.pinimg.com/564x/84/03/60/8403600e339dc57a79fb2b7e93f70f71.jpg', 'Portrays a climactic struggle against overwhelming darkness, where alliances are tested and heroes must rise to fulfill their destinies in a final, epic confrontation.', 'GP04', '2003-12-17', 8, 0, 0, 1),
(9, 'Harry Potter and the Chamber of Secrets', 'https://www.youtube.com/watch?v=jBltxS8HfQ4&ab_channel=KinoCheck.com', 'https://i.pinimg.com/564x/93/ca/77/93ca77370e8f1852f01a8c3f6138d1dd.jpg', 'Delves into a hidden threat lurking within a magical school, where secrets unravel and danger looms large.', 'GP05', '2002-12-15', 9, 1, 0, 0),
(10, 'Harry Potter and the Goblet of Fire', 'https://www.youtube.com/watch?v=3EGojp4Hh6I&pp=ygUWaGFycnkgcG90dGVyIDQgdHJhaWxlcg%3D%3D', 'https://i.pinimg.com/564x/d3/e6/0b/d3e60bca9ab2addcfbe920afbc7e56e2.jpg', 'Plunges into a thrilling competition that unexpectedly turns perilous, revealing sinister forces at play and testing friendships amidst the wizarding world\'s escalating tensions.', 'GP06', '2005-12-18', 9, 1, 0, 0),
(11, 'Spirited Away', 'https://www.youtube.com/watch?v=ByXuk9QqQkk&pp=ygUVc3Bpcml0ZWQgYXdheSB0cmFpbGVy', 'https://i.pinimg.com/564x/b9/03/d2/b903d28f3430d5488ed1ef40ee4accde.jpg', 'Explores a fantastical realm where unexpected encounters challenge visitors to confront their fears, navigate mysterious spirits, and unearth the courage to find their way back to reality.', 'GP07', '2001-07-20', 9, 1, 0, 0);

INSERT INTO `rap_phim` (`ma_rap`, `ten_rap`, `ma_cum_rap`) VALUES
(1, 'Rạp 1', 1);
INSERT INTO `rap_phim` (`ma_rap`, `ten_rap`, `ma_cum_rap`) VALUES
(2, 'Rạp 2', 2);
INSERT INTO `rap_phim` (`ma_rap`, `ten_rap`, `ma_cum_rap`) VALUES
(3, 'Rạp 3', 3);
INSERT INTO `rap_phim` (`ma_rap`, `ten_rap`, `ma_cum_rap`) VALUES
(4, 'Rạp 4', 4),
(5, 'Rạp 5', 5),
(6, 'Rạp 6', 6),
(7, 'Rạp 7', 7),
(8, 'Rạp 8', 1),
(9, 'Rạp 9', 2),
(10, 'Rạp 10', 8),
(11, 'Rạp 11', 9),
(12, 'Rạp 12', 10),
(13, 'Rạp 13', 11),
(14, 'Rạp 14', 12),
(15, 'Rạp 15', 13),
(16, 'Rạp 16', 14),
(17, 'Rạp 17', 15),
(18, 'Rạp 18', 16),
(19, 'Rạp 19', 17),
(20, 'Rạp 20', 18),
(21, 'Rạp 21', 19),
(22, 'Rạp 22', 20),
(23, 'Rạp 23', 21),
(24, 'Rạp 24', 22),
(25, 'Rạp 25', 23),
(26, 'Rạp 26', 24),
(27, 'Rạp 27', 25),
(28, 'Rạp 28', 3),
(29, 'Rạp 29', 4),
(30, 'Rạp 30', 5),
(31, 'Rạp 31', 6),
(32, 'Rạp 32', 7);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;