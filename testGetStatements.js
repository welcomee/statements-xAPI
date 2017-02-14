function view() {

	TinCan.enableDebug();
	//LRS connexion
	var lrs;

	try {
		lrs = new TinCan.LRS(
			{
				endpoint: "",
				username: "",
				password: "",
				allowFail: false
			}
		);
	}
	catch (ex) {
		console.log("Echec lors de l'initialisation du LRS : " + ex);
	}

	var mesFiltres = {
		//since: "2017-02-14T10:50:00Z", // 14 fev 10:50 - CM
		//until: "2017-02-14T10:59:00Z",
		since: "2016-10-07T13:00:00Z", // 07 oct 2016 Léonard
		until: "2016-10-07T14:00:00Z",
		ascending: true,
		limit: 25
	} ;

	function treatStatements(sr){

		var statementString = "<table><tr><td>stored time</td><td>timestamp</td><td>actor name</td><td>verb id</td><td>verb fr-FR</td><td>object id</td><td>object fr-FR</td></tr>";
		for(var i=0; i<sr.statements.length; i++) {
			statementString +=	"<tr><td>" + sr.statements[i].stored +
			"</td><td>" + sr.statements[i].timestamp +
			"</td><td>" + sr.statements[i].actor.name +
			"</td><td>" + sr.statements[i].verb.id +
			"</td><td>" + sr.statements[i].verb.display["fr-FR"] +
			"</td><td>" + sr.statements[i].target.id +
			"</td><td>" + sr.statements[i].target.definition.name["fr-FR"] + "</td></tr>";
		}
		statementString += "</table>";
		document.getElementById("numStatementsFor").innerHTML = statementString;
		document.getElementById("numStatementsLength").innerHTML = " Number of statements : " + sr.statements.length;
	}

	var appels=0;	

//************************

	function getMoreStatements(srmore){
			
			console.log("Appel number: " + appels);

			if (srmore.more!==null ) {
					if (srmore.more!==""){
						appels++;
						console.log("more statements : " + srmore.more);
						lrs.moreStatements({url: "/public"+srmore.more, callback:function(err,srmoremore){
							if (err !== null) {
								console.log("Echec lors de la récupération de statements : " + err);
								return;
							}
							addStatements(srmore,srmoremore);

						}});

					}

			}
			if (appels==0){
				treatStatements(srmore);
			}
		}

	function addStatements(sr,srmore){
		appels--;
		sr.statements=sr.statements.concat(srmore.statements);
		sr.more=srmore.more;
		document.getElementById("numStatementsLength").innerHTML = " Number of statements : " + sr.statements.length;
		getMoreStatements(sr);
	}

//**************************

	function queryLRS(err,sr) {
		if (err !== null) {
			console.log("Echec lors de la récupération de statements : " + err);
			return;
		}

		getMoreStatements(sr);
		
	}

	document.getElementById("numStatementsLength").innerHTML = "Getting statements, please wait...";
	lrs.queryStatements({params: mesFiltres, callback: function(err,sr){queryLRS(err,sr);}});
}
