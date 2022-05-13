import * as Realm from 'realm-web';
const ObjectId = Realm.BSON.ObjectID;

const rid = 'abitu-label-baexp';
const rtoken = 'gu6hNDWW05b5Ciubl5C4dsxHp8y4p0UF0ZiAG0w4GNI7zw8w2G6i1GjB2s6rWUrh';
const realm = new Realm.App(rid);

let db;

async function getDb() {
	if (db) return db;
	try {
		const credentials = Realm.Credentials.apiKey(rtoken);
		var user = await realm.logIn(credentials);
		var client = user.mongoClient('mongodb-atlas');
		db = client.db('research');
		return db;
	} catch (err) {
		return new Error('Ошибка подключения к базе данных');
	}
}

function jsonResponse(data, status) {
	const body = JSON.stringify(data, null, 2);
	const headers = { 'content-type': 'application/json; charset=utf-8' };
	return new Response(body, { headers, status });
}

export async function onRequestGet() {
	const db = await getDb();
	const abits = await db.collection('abits').aggregate([
		{ $match: { $and: [{ 'applications.1': { $exists: true } }, { priority: { $exists: false } }] } },
		{ $sample: { size: 10 } },
		{
			$lookup: {
				from: 'applications',
				localField: 'applications',
				foreignField: '_id',
				as: 'applications',
			},
		},
		{ $unwind: '$applications' },
		{
			$lookup: {
				from: 'programs',
				localField: 'applications.program',
				foreignField: '_id',
				as: 'applications.program',
			},
		},
		{
			$project: {
				applications: {
					'score.total': 1,
					stats: 1,
					_id: 1,
					program: {
						okso: 1,
						title: 1,
						spots: 1,
						'stats.applications.total': 1,
						'stats.bounds.total.iqr': 1,
					},
				},
			},
		},
		{ $unwind: '$applications.program' },
		{
			$group: {
				_id: '$_id',
				applications: { '$push': '$applications' },
			},
		},
	]);
	return jsonResponse({ status: 'ok', data: abits }, 200);
}

export async function onRequestPatch({ request }) {
	const db = await getDb();

	const abit = await request.json();
	const applications = abit.applications;

	const results = [];
	for (const application of applications) {
		const _id = new ObjectId(application._id);
		console.log(application.priority || -1);
		const update = {
			$set: {
				priority: application.priority || -1,
			},
		};
		const result = await db.collection('applications').updateOne({ _id }, update);
		results.push(result);
	}
	return jsonResponse({ status: 'ok', data: results }, 200);
}
