import {TOKEN_SECRET} from "../Auth";
import jwt from "jsonwebtoken";

interface User {
    // properties of the user object
}

interface Request {
    user: User;
    headers: {
        authorization: string;
    };
}

interface Response {
    sendStatus: (code: number) => void;
}

interface NextFunction {
    (): void;
}

interface TokenData {
    // properties of the object encoded in the token
}

const SECRET_KEY: string = TOKEN_SECRET;

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader: string = req.headers['authorization'];
    const token: string = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    // @ts-ignore
    jwt.verify(token, SECRET_KEY, (err: Error, user: TokenData) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

export default authenticateToken
