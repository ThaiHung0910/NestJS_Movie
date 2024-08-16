const isNotEmpty = (value: any): boolean => {
    value = String(value);
    return value && value.trim().length > 0;
};

const isValidAccount = (account: string): boolean => {
    const accountRegex = /^[a-zA-Z0-9]*$/
    return accountRegex.test(account)
}

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^.+@.+$/;
    return emailRegex.test(email);
};



const isValidText = (text: string): boolean => {
    const textRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    return textRegex.test(text);
};

const isValidNumber = (number: string): boolean => {
    const numberRegex = /^\d+$/
    return numberRegex.test(number)
}

const isValidBoolean = (value: string): boolean => {
    const regex = /^(true|false)$/i
    return regex.test(value)
}


const isValidImage = (value: string): boolean => {
    const regex = /^.*\.(jpg|jpeg|png|gif|bmp)$/
    return regex.test(value)
}

const isValidURL = (url: string): boolean => {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
};

const checkGroupCode = (value: string): boolean => {
    let validGroupCodes = Array.from({ length: 16 }, (_, i) => `GP${i.toString().padStart(2, '0')}`);
    let checkValidCode = validGroupCodes.includes(value.toUpperCase())
    return checkValidCode
}


const validationUser = (data: any): string | null => {
    const { taiKhoan, email, matKhau, hoTen, soDt } = data;

    if (!isNotEmpty(taiKhoan) || !isNotEmpty(matKhau) || !isNotEmpty(email) || !isNotEmpty(hoTen) || !isNotEmpty(soDt)) {
        return "Dữ liệu không được để trống";
    }

    if (!isValidAccount) {
        return "Tài khoản không được chứa ký tự đặc biệt"
    }

    if (!isValidEmail(email)) {
        return "Email không hợp lệ";
    }

    if (!isValidText(hoTen)) {
        return "Họ tên chỉ nhập chữ";
    }

    if (!isValidNumber(soDt)) {
        return "Số điện thoại chỉ nhập số";
    }
    return null;
};

const validationMovie = (data: any): string | null => {
    let { tenPhim, hinhAnh, trailer, moTa, maNhom, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu } = data

    if (!isNotEmpty(tenPhim) || !isNotEmpty(hinhAnh) || !isNotEmpty(trailer) || !isNotEmpty(moTa) || !isNotEmpty(maNhom) || !isNotEmpty(ngayKhoiChieu) || !isNotEmpty(danhGia) || !isNotEmpty(hot) || !isNotEmpty(dangChieu) || !isNotEmpty(sapChieu)) {
        return "Dữ liệu không được để trống";
    }


    if (!isValidNumber(danhGia)) {
        return "Đánh giá chỉ nhập số";
    }

    if (!isValidImage(hinhAnh)) {
        return "Hình ảnh không đúng định dạng";
    }

    if (!isValidURL(trailer)) {
        return "Trailer không đúng định dạng";
    }

    if (!checkGroupCode(maNhom)) {
        return "Mã nhóm không hợp lệ"
    }

    if (!isValidBoolean(hot) || !isValidBoolean(dangChieu) || !isValidBoolean(sapChieu)) {
        return "Không đúng định dạng boolean";
    }


    return null;
}

const validationImage = (data: any): string | null => {
    const { tenHinh, duongDan, moTa } = data;

    if (!isNotEmpty(tenHinh) || !isNotEmpty(duongDan) || !isNotEmpty(moTa)) {
        return "Dữ liệu không được để trống";
    }

    if (!isValidURL(duongDan)) {
        return "Đường dẫn không đúng định dạng";
    }

    return null;
};




export { isNotEmpty, isValidNumber, validationUser, validationMovie, validationImage, checkGroupCode };
