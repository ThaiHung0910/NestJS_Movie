import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    private readonly SECRET_KEY = 'SECRET_KEY';
    private readonly SECRET_KEY_REF = 'SECRET_KEY_REF';

    constructor(private readonly jwtService: JwtService) { }

    createToken(data: any): string {
        return this.jwtService.sign({ data }, { secret: this.SECRET_KEY, expiresIn: '7d' });
    }

    createTokenRef(data: any): string {
        return this.jwtService.sign({ data }, { secret: this.SECRET_KEY_REF, expiresIn: '14d' });
    }

    checkToken(token: string): any {
        return this.jwtService.verify(token, { secret: this.SECRET_KEY });
    }

    checkTokenRef(token: string): boolean {
        try {
            this.jwtService.verify(token, { secret: this.SECRET_KEY_REF });
            return true;
        } catch (err) {
            return false;
        }
    }

    decodeToken(token: string): any {
        return this.jwtService.decode(token);
    }


    verifyToken(token: string): any {
        try {
            let error = this.checkToken(token)
            if (!error) {
                return error.name
            }
            return error
        } catch (err) {
            throw new UnauthorizedException(err.name);
        }
    }
}


