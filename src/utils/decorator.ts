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


function CommonQueryUser() {
    return applyDecorators(
        ApiQuery({ name: 'MaNhom', required: false, example: 'GP01' }),
        ApiQuery({ name: 'tuKhoa', required: false })
    );
}

function CommonQueryMovie() {
    return applyDecorators(
        ApiQuery({ name: 'maNhom', required: false, example: 'GP01' }),
        ApiQuery({ name: 'tuKhoa', required: false })
    );
}

function QueryPage(number: any) {
    return applyDecorators(
        ApiQuery({ name: 'soTrang', required: false, example: '1' }),
        ApiQuery({ name: 'soPhanTuTrenTrang', required: false, example: number })
    )
}


export { Authenticated, CommonQueryUser, CommonQueryMovie, QueryPage }