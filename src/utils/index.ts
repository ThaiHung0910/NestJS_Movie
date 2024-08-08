import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {

    responseSend(res: any, message: string, data: any, code: number): void {
        res.status(code).json({
            statusCode: code,
            message,
            content: data,
            dateTime: new Date(),
        });
    }


    generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    getUserIdFromAuthorization(service: any, req: any) {
        const token = req.authorization.replace('Bearer ', '');
        const decodedToken = service.decodeToken(token)
        const { data } = decodedToken
        return data.nguoiDungId
    }

    formatDateTime(dateTime: any) {
        const date = new Date(dateTime);



        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();



        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return {
            ngayChieu: `${day}/${month}/${year}`,
            gioChieu: `${hours}:${minutes}`
        };
    }
}




