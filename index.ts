import express, { Request, Response , Application } from 'express';
import {create, edit, getBlogs, remove} from "./src/Blog";
import {LoginUser, RegisterUser} from "./src/Auth";
import authenticateToken from "./src/middleware/authenticate";
import cors from 'cors';
// import dotenv from 'dotenv';

//For env File
// dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

// @ts-ignore
app.get('/blog',authenticateToken, async (req: Request, res: Response) => {
    try {
        const response = await getBlogs()
        const code = response.success ? 200 : 500
        res.status(code).json(response)
    }catch (e){
        res.json(e)
    }
});

// @ts-ignore
app.post('/blog/create',authenticateToken, async (req: Request, res: Response) => {
    try {
        const {name,description} = req.body
        const response = await create({name, description})
        const code = response.success ? 200 : 500
        res.status(code).json(response)
    }catch (e){
        res.json(e)
    }
});

// @ts-ignore
app.post('/blog/:id/edit',authenticateToken, async (req: Request, res: Response) => {
    try {
        const {name,description} = req.body
        const {id} = req.params
        const response = await edit({
            id,
            name,
            description
        })
        const code = response.success ? 200 : 500
        res.status(code).json(response)
    }catch (e){
        res.json(e)
    }
});

// @ts-ignore
app.delete('/blog/:id/delete',authenticateToken, async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const response = await remove({
            id,
        })
        const code = response.success ? 200 : 500
        res.status(code).json(response)
    }catch (e){
        res.json(e)
    }
});


app.post('/user/register', async (req: Request, res: Response) => {
    try {
        const {name,email,password} = req.body
        const response = await RegisterUser({email, name, password})
        const code = response.success ? 200 : 500
        res.status(code).json(response)
    }catch (e){
        res.json(e)
    }
});

app.post('/user/login', async (req: Request, res: Response) => {
    try {
        const {email,password} = req.body
        const response = await LoginUser({email, password})
        // @ts-ignore
        const code = response.success ? 200 : 500
        res.status(code).json(response)
    }catch (e){
        res.json(e)
    }
});

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
