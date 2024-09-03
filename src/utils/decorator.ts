import { applyDecorators, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';

function Authenticated() {
    return applyDecorators(
        HttpCode(200),
        ApiBearerAuth(),
        UseGuards(AuthGuard('jwt')),
    );
}


function QueryUser() {
    return applyDecorators(
        ApiQuery({ name: 'MaNhom', required: false, example: 'GP01' }),
        ApiQuery({ name: 'tuKhoa', required: false })
    );
}



function QueryMovie() {
    return applyDecorators(
        ApiQuery({ name: 'maNhom', required: false, example: "GP01" }),
        ApiQuery({ name: 'tenPhim', required: false })
    )
}

function QueryCodeMovie() {
    return applyDecorators(
        ApiQuery({ name: "MaPhim", required: false })
    )
}

function QueryPage(number: any) {
    return applyDecorators(
        ApiQuery({ name: 'soTrang', required: false, example: '1' }),
        ApiQuery({ name: 'soPhanTuTrenTrang', required: false, example: number })
    )
}

function QueryCodeTheater() {
    return applyDecorators(
        ApiQuery({ name: 'maHeThongRap', required: false })
    )
}


export { Authenticated, QueryUser, QueryMovie, QueryCodeMovie, QueryPage, QueryCodeTheater }