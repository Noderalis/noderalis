import FirebaseAdmin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../firebase.json';

FirebaseAdmin.initializeApp({
	credential: FirebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
	databaseURL: 'https://noderalis.firebaseio.com',
});

FirebaseAdmin.auth()
	.createUser({
		email: 'silencegrim@gmail.com',
		emailVerified: false,
		phoneNumber: '+14703185496',
		// password: Generic Password
		displayName: 'Grim',
	})
	.then((userRecord) => {
		console.log(userRecord);
		process.exit();
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});
