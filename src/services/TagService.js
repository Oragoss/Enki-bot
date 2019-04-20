import Tags from '../models/Tags';

export default class TagService {
    static async addNewTag(data) {
        console.log('Tag Service has arrived');
        console.log(data);
        // console.log(JSON.parse(data));
        //Tags.sync({ force: true }) //Destroys and recreates the table every time. Might be useful in development
        await Tags.sync().then(() => {
            // const parsedData = JSON.parse(data);
            Tags.create({
                name: data.name,
                description: data.description,
                username: data.username,
                usage_count: data.usage_count
             });
         });
    }
}
