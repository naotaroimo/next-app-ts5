import handler from '../../handler';
import { openDB } from '../../openDB';

export default handler.get(
   async (req, res) => {
      const db = await openDB();
      const people = await db.all('select * from person');

      res.status(200).json(
         {
            id: req.userid,
            name: req.username,
            people
         }
      );
   }
).post(
   async (req, res) => {
      //拡張リクエストのuseridの値でid判定
      if (+req.userid !== 9999) {
         res.status(401).json(
            { message: 'sorry you are not 9999' }
         );

         return; //後続処理はしないのでreturnする
      }

      const db = openDB();
      const { lastID } = await (await db).run(
         'INSERT INTO Person (name,details,vgroupId) values(?,?,?)',
         req.body.name,
         req.body.details,
         req.body.vgroupId
      );
      res.status(201).json({ ...req.body, id: lastID });
   }
);