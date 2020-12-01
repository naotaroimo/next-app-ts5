import handler from '../../handler';
import { openDB } from '../../openDB';

export default handler.get(
   async (req, res) => {
      const db = await openDB();
      const people = await db.all('select * from person');
      res.status(200).json(people);
   }
).post(
   (req, res) => {
      //何かしらのエラーを投げる
      throw new Error('method is Not Allowed !');
   }
);