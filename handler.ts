import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { verify } from 'jsonwebtoken';

//拡張リクエストの型定義
interface NextApiRequestExtended extends NextApiRequest {
    userid: number | null;
    username: string | null;
};

export default nextConnect<NextApiRequest, NextApiResponse>(
    {
        //errorを受けた処理
        onError(error, req, res) {
            res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
        },

        onNoMatch(req, res) {
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    }
).use(
    (req, res, next) => {
        //拡張リクエスト部分の初期化
        req.userid = null;
        req.username = null;


        //リクエストヘッダからauthorizationの値を取得する        
        //const {authorization} = req.headers;
        const authorization = req.headers['authorization'];

        //authorizationキーがない場合
        if (!authorization) {
            //エラー処理のミドルウェアのパターンはサポートしてない
            //処理はonErrorにエラーを投げるなどが必要
            //throw new Error('oh no!');
            res.end('error no more');

            return;
        }

        verify(authorization!,
            '704d410c-e2c7-4de8-af06-06994e445d8e',//本来はsecretは別ファイル管理する
            function (err, decoded) {
                if (!err && decoded) {
                    //JWTの値を拡張リクエストへセット
                    req.userid = decoded.id;
                    req.username = decoded.name;

                    //JWTが正しいので次の処理へ
                    next();

                } else {
                    res.status(401).json(
                        { message: 'you are not authenticated.' }
                    );
                    return;
                }
            }
        );

    }
);