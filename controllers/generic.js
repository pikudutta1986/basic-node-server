/*
		   FILENAME: controllers/generic.js
	         AUTHOR: Anindya Dutta
 	        SUMMARY: THIS IS A GENERAL PURPOSE CLASS TO HANDLE GENERAL REQUESTS OF CLIENTS LIKE GET APPLICATION INITIAL DATA SERVER.
            PURPOSE: TO HANDLE THE COMMON REQUESTS.
    IMPORTING FILES: operator.js | store.js | user.js
  SUBSCRIBING FILES: index.js
   LAST COMMIT DATE: July 18, 2020
*/

// OPERATOR CLASS IS USED TO GET INSTANCES OF DIFFERENT DATABASES. IT ALSO INCLUDES SOME COMMON AND GENERAL PURPOSE
// FUNCTIONS THAT CAN BE REQUIRED BY DIFFERENT CLASSES. LIKE GETTING SITE VARIABLES OR MESSAGES DATA.
const operatorClass = require ('../classes/operator');

// THIS FILE CONTAINS COMMON VARIABLES THAT WE CAN SHARE BETWEEN CLASSES. FOR EXAMPLE SITEVARIABLE, SITEMESSAGES ETC.
const store = require ('../store');

// USER CLASS CONTAINS USER RELATED ACTIVITIES LIKE GETTING USER PROFILE INFORMATION FROM USER TABLE,
// GETTING THE USER ROLE, AUTHENTICATING USER, ENCRYPTING PASSWORDS ETC.
const userClass = require ('../classes/user');

// STARTING Generic CLASS.
class Generic
{
	// PRIVATE VARIABLE TO HOLD THE INSTANCE OF OPERATOR CLASS.
	// WE WILL USE THIS CLASS TO GET INSTANCES OF DIFFERENT DATABASES TO COMMUNICATE WITH THEM.
	#operator;
	
	// PUBLIC VARIABLE TO HOLD INSTANCE OF USER CLASS. WE WILL USE IT TO GET USER RELATED PROPERTIES,
	// FOR EXAMPLE, GETTING USER PROFILE INFORMATION.
	userClass;
	
	// DEFINE CLASS INSTANCES; THIS WILL BE THE FIRST FUNCTION TO BE EXECUTED WHEN THIS CLASS LOADS.
	constructor()
	{
		this.#operator = new operatorClass(); // CREATING A NEW INSTANCE OF OPERATOR CLASS SO WE CAN USE ITS OBJECTS.
		this.userClass = new userClass(); // CREATING NEW INSTANCE OF USER CLASS SO WE CAN GET USER PROPERTIES.
	}
	
	// THIS FUNCTION WILL HANDLE GET/POST REQUESTS MADE BY USER FROM THE ANGULAR APPLICATION RUNNING ON CLIENT SIDE.
	handleRequests (app)
	{
		
		// REQUEST TO SEND ALL FORBIDDEN WORDS
		app.get ('/api/forbiddenwords', (req, res) =>
		{
			// RUN THE QUERY ON TABLE.
			this.#operator.getStaticDbInstance().getRows ("SELECT * from `forbiddenword`").then (rows =>
			{
				res.send ({success: true, rows: rows});
			},
			err =>
			{
				// THERE WAS SOME ERROR IN PERFORMING THE OPERATION, SO WE WILL SEND THE ERROR TO CLIENT.
				res.send ({success: false, message: "system failed to get table data forbiddenword" , error_code: 124});
				console.log ("error occurred, error code 114",err);
			});
		});


		// HANDLING REQUEST TO GET SITEVARIABLES AND OTHER STATIC DATA FROM DATABASE DURING THE APP INITIALIZATION.
		app.get ('/api/getAppInitialData', (req, res) =>
		{
			let data= {}; // ARRAY TO HOLD ROOM STATES DATA.

			data ["sitevariables"] = store.siteVariables; // ADDING SITE VARIABLE DATA INTO ARRAY. WE WILL SEND THIS ARRAY TO CLIENT.
			data ["sitemessages"] = store.siteMessages; // ADDING MESSAGES TO DATA ARRAY.
			data ["sitepages"] = store.sitePages; // ADDING PAGES TO DATA ARRAY.

			res.send(data); // SENDING DATA TO CLIENT.
		});


	}
}

// EXPORTING THIS CLASS SO OTHER CLASSES CAN IMPORT AND USE IT.
module.exports = Generic;
